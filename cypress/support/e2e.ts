import './commands'

// Intercepts são limpos antes de cada teste, então o bloqueio precisa ser registrado a cada um.
// Ele vem primeiro de propósito: o Cypress avalia o intercept definido por último antes dos
// anteriores, então qualquer stub específico dos specs tem prioridade sobre este catch-all.
beforeEach(() => {
  cy.bloquearApi()
})
