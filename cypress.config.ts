import { readFileSync } from 'node:fs'
import { parseEnv } from 'node:util'
import { defineConfig } from 'cypress'

// Fonte única da URL do backend nos E2E: o mesmo `.env.e2e` que o Vite usa (`--mode e2e`) para o
// front. Assim front e testes sempre falam com o mesmo backend. Mesma regra de `src/config/env.ts`:
// `VITE_API_BASE_URL` guarda só host+porta, o prefixo `/api/v1` entra aqui.
const { VITE_API_BASE_URL = '' } = parseEnv(readFileSync('.env.e2e', 'utf8'))
const hostDaApi = VITE_API_BASE_URL.trim()
  .replace(/\/+$/, '')
  .replace(/\/api\/v1$/i, '')
const apiUrl = `${hostDaApi}/api/v1`

export default defineConfig({
  projectId: '51bhfd',
  // Electron é o default do Cypress, mas está deprecado como browser de teste (vai ser removido).
  defaultBrowser: 'chrome',
  // Valores públicos, lidos com `Cypress.expose()`. Segredos (credenciais) NÃO entram aqui: ficam
  // em `cypress.env.json` / `CYPRESS_*` e são lidos com `cy.env()`. Sobrescreva com `--expose`.
  expose: { apiUrl },
  e2e: {
    // Porta fixa: o script `dev:e2e` sobe o Vite com `--strictPort`, então nunca muda.
    baseUrl: 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    // Em `cypress run` repete spec flaky 2x; no `open` não repete, pra a falha aparecer na hora.
    retries: { runMode: 2, openMode: 0 },
  },
})
