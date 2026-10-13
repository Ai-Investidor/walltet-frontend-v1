import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: '51bhfd',
  // Electron é o default do Cypress, mas está deprecado como browser de teste (vai ser removido).
  defaultBrowser: 'chrome',
  // `Cypress.env()` foi removido no Cypress 16; nenhum teste lê segredo (a API é toda stubada).
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
