// Comandos da suíte E2E completa (cypress/e2e/real): front real + backend real + banco real.
//
// O backend (`carteira-sistema-backend`) precisa estar no ar, apontando para um banco de TESTE
// com os usuários abaixo já criados. Credenciais são segredo: vêm de `cy.env()` (cypress.env.json
// ou variáveis CYPRESS_*), nunca do código. A URL da API é pública: vem de `Cypress.expose()`.

import type { PerfilReal } from './tipos'

const CHAVES_CREDENCIAIS = {
  cliente: ['clienteEmail', 'clienteSenha'],
  cliente2: ['cliente2Email', 'cliente2Senha'],
  admin: ['adminEmail', 'adminSenha'],
} as const

/** Resultado de `avaliarSuitability`. */
export interface ResultadoAvaliacao {
  id: string
  usuarioId: string
  pontuacaoTotal: number
  perfilResultante: string
  carteiraRecomendada: { id: string; nome: string; perfilAlvo: string } | null
  /** Soma dos pesos calculada no teste, independente do servidor. */
  somaEsperada: number
}

/** Conta criada só para um teste (auto-cadastro); nunca reaproveitada entre execuções. */
export interface UsuarioDescartavel {
  id: string
  email: string
  senha: string
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Faz login real no backend e guarda a sessão (cookie) com `cy.session`: o login acontece
       * uma única vez por execução e os testes seguintes só restauram o cookie.
       * Depois dele é preciso um `cy.visit()` — o Cypress limpa a página a cada teste.
       */
      loginReal(perfil: PerfilReal): Chainable<void>
      /**
       * Cria um cliente novo via `POST /auth/register` (e-mail único por chamada). Use para testes
       * que alteram ou revogam acesso, em vez de mexer nas contas fixas de `cypress.env.json`.
       */
      criarUsuarioDescartavel(): Chainable<UsuarioDescartavel>
      /** `POST /auth/login` direto (sem `cy.session`): grava o cookie no jar do teste atual. */
      loginComo(
        conta: Pick<UsuarioDescartavel, 'email' | 'senha'>,
      ): Chainable<Cypress.Response<unknown>>
      /**
       * Responde o questionário escolhendo sempre a opção de maior (`'maior'`) ou menor
       * (`'menor'`) peso e envia `POST /suitability/avaliar` para `conta` (a sessão atual é a do
       * chamador). O servidor vincula a carteira recomendada junto com a avaliação.
       */
      avaliarSuitability(
        conta: Pick<UsuarioDescartavel, 'id'>,
        escolha: 'maior' | 'menor',
      ): Chainable<ResultadoAvaliacao>
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

Cypress.Commands.add('criarUsuarioDescartavel', () => {
  const sufixo = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  // Atende a política de senha: 8+ caracteres, número e símbolo.
  const conta = { email: `e2e.${sufixo}@exemplo.com`, senha: 'Senha@12345' }

  return cy
    .request<{ id: string }>({
      method: 'POST',
      url: urlDaApi('/auth/register'),
      body: { nome: `E2E ${sufixo}`, ...conta },
      log: false,
    })
    .then(({ body }) => ({ id: body.id, ...conta }))
})

Cypress.Commands.add('loginComo', ({ email, senha }) => {
  return cy.request({
    method: 'POST',
    url: urlDaApi('/auth/login'),
    body: { email, senha },
    log: false,
  })
})

Cypress.Commands.add('avaliarSuitability', (conta, escolha) => {
  return cy
    .request<Array<{ id: string; opcoes: Array<{ id: string; peso: number }> }>>(
      urlDaApi('/suitability/perguntas'),
    )
    .then(({ body: perguntas }) => {
      const escolhidas = perguntas.map((pergunta) => {
        const porPeso = [...pergunta.opcoes].sort((a, b) => a.peso - b.peso)
        const opcao = escolha === 'maior' ? porPeso[porPeso.length - 1] : porPeso[0]
        return { perguntaId: pergunta.id, opcaoId: opcao.id, peso: opcao.peso }
      })
      const somaEsperada = escolhidas.reduce((total, e) => total + e.peso, 0)

      return cy
        .request<Omit<ResultadoAvaliacao, 'somaEsperada'>>({
          method: 'POST',
          url: urlDaApi('/suitability/avaliar'),
          body: {
            usuarioId: conta.id,
            respostas: escolhidas.map(({ perguntaId, opcaoId }) => ({ perguntaId, opcaoId })),
          },
        })
        .then(({ body }) => ({ ...body, somaEsperada }))
    })
})
