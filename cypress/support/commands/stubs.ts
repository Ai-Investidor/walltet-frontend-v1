// Comandos da suíte com API stubada (cypress/e2e/stubbed).
//
// Princípio: os testes dessa suíte NÃO dependem do backend. Toda chamada a `/api/v1/**` é
// interceptada pelo Cypress; o que não tiver stub explícito responde 501 (ver `bloquearApi`,
// chamado no beforeEach de cada spec stubado). Assim a suíte roda igual em qualquer máquina, sem
// `carteira-sistema-backend` no ar e sem banco.

import type { Perfil } from './tipos'

interface Credenciais {
  email: string
  senha: string
}

// Glob casa com a URL completa, qualquer host/porta — não depende do `VITE_API_BASE_URL` do .env.
const API = '**/api/v1'

const FIXTURE_ME: Record<Perfil, string> = {
  cliente: 'auth/me-cliente.json',
  admin: 'auth/me-admin.json',
}

const NAO_AUTENTICADO = {
  statusCode: 401,
  body: { error: { code: 'UNAUTHORIZED', message: 'Sessão inválida ou expirada.' } },
}

declare global {
  namespace Cypress {
    interface Chainable {
      /** Responde 501 a qualquer rota da API sem stub — garante que nada vaza pro backend real. */
      bloquearApi(): Chainable<void>
      /** `GET /auth/me` devolve o usuário do perfil informado (sessão já ativa). */
      stubSessao(perfil: Perfil): Chainable<void>
      /** `GET /auth/me` devolve 401 (visitante). */
      stubSemSessao(): Chainable<void>
      /**
       * Simula o ciclo de login: `/auth/me` é 401 até o `POST /auth/login` receber as credenciais
       * certas; depois disso passa a devolver o cliente logado. Credencial errada → 401.
       */
      stubLogin(credenciais: Credenciais): Chainable<void>
    }
  }
}

Cypress.Commands.add('bloquearApi', () => {
  cy.intercept(`${API}/**`, (req) => {
    req.reply({
      statusCode: 501,
      body: { error: { code: 'NOT_STUBBED', message: `Sem stub: ${req.method} ${req.url}` } },
    })
  }).as('apiSemStub')
})

Cypress.Commands.add('stubSessao', (perfil) => {
  cy.intercept('GET', `${API}/auth/me`, { fixture: FIXTURE_ME[perfil] }).as('me')
})

Cypress.Commands.add('stubSemSessao', () => {
  cy.intercept('GET', `${API}/auth/me`, NAO_AUTENTICADO).as('me')
})

Cypress.Commands.add('stubLogin', ({ email, senha }) => {
  // Estado do "servidor" falso; o comando roda no beforeEach, então cada teste começa deslogado.
  let sessaoAtiva = false

  cy.intercept('GET', `${API}/auth/me`, (req) => {
    req.reply(sessaoAtiva ? { fixture: FIXTURE_ME.cliente } : NAO_AUTENTICADO)
  }).as('me')

  cy.intercept('POST', `${API}/auth/login`, (req) => {
    if (req.body.email === email && req.body.senha === senha) {
      sessaoAtiva = true
      req.reply({ fixture: 'auth/login-cliente.json' })
      return
    }

    req.reply({
      statusCode: 401,
      body: { error: { code: 'INVALID_CREDENTIALS', message: 'E-mail ou senha inválidos.' } },
    })
  }).as('login')
})
