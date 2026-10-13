// Comandos da suíte E2E completa (cypress/e2e/real): front real + backend real + banco real.
//
// O backend (`carteira-sistema-backend`) precisa estar no ar, apontando para um banco de TESTE
// com os usuários abaixo já criados. Credenciais são segredo: vêm de `cy.env()` (cypress.env.json
// ou variáveis CYPRESS_*), nunca do código. A URL da API é pública: vem de `Cypress.expose()`.

import type { Perfil } from './tipos'

const CHAVES_CREDENCIAIS = {
  cliente: ['clienteEmail', 'clienteSenha'],
  admin: ['adminEmail', 'adminSenha'],
} as const

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Faz login real no backend e guarda a sessão (cookie) com `cy.session`: o login acontece
       * uma única vez por execução e os testes seguintes só restauram o cookie.
       * Depois dele é preciso um `cy.visit()` — o Cypress limpa a página a cada teste.
       */
      loginReal(perfil: Perfil): Chainable<void>
      /** `cy.request` contra a API real; `url` é relativa a `/api/v1` (ex.: `/auth/me`). */
      apiRequest<T = unknown>(
        opcoes: Partial<Cypress.RequestOptions> & { url: string },
      ): Chainable<Cypress.Response<T>>
    }
  }
}

function urlDaApi(caminho: string): string {
  return `${Cypress.expose('apiUrl')}${caminho}`
}

Cypress.Commands.add('apiRequest', ({ url, ...opcoes }) => {
  return cy.request({ ...opcoes, url: urlDaApi(url) })
})

Cypress.Commands.add('loginReal', (perfil) => {
  const [chaveEmail, chaveSenha] = CHAVES_CREDENCIAIS[perfil]

  cy.env([chaveEmail, chaveSenha]).then((credenciais) => {
    const email = credenciais[chaveEmail]
    const senha = credenciais[chaveSenha]

    if (!email || !senha) {
      throw new Error(
        `Credenciais do perfil "${perfil}" ausentes. Defina ${chaveEmail} e ${chaveSenha} em ` +
          'cypress.env.json (modelo: cypress.env.example.json) ou em CYPRESS_* no ambiente.',
      )
    }

    cy.session(
      ['real', perfil],
      () => {
        // O backend responde com o cookie HttpOnly `access_token`; o Cypress o guarda no navegador.
        cy.request({
          method: 'POST',
          url: urlDaApi('/auth/login'),
          body: { email, senha },
          // `log: false` evita expor e-mail/senha no command log.
          log: false,
        })
      },
      {
        // Sessão expirada/revogada → o Cypress repete o setup sozinho.
        validate() {
          cy.request(urlDaApi('/auth/me')).its('status').should('eq', 200)
        },
        // Mesmo id/setup/validate em todos os specs → um único login por `cypress run`.
        cacheAcrossSpecs: true,
      },
    )
  })
})
