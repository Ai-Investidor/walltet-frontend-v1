// Preparação de massa na API real para specs de `cypress/e2e/real` (carteira própria do teste).
//
// Tudo exige a sessão de ADMIN já ativa (`cy.loginReal('admin')`). A carteira é criada só para o
// teste e deve ser desativada no `after` com `desativarCarteira`: carteiras ativas do mesmo perfil
// concorrem na recomendação de `POST /suitability/avaliar` (`findFirst`), então não podem ficar.

/** Corpo de sucesso de `POST /relatorios/gerar`; em 4xx só `status` é confiável. */
export interface RelatorioGerado {
  id: string
  carteiraId: string
  mesReferencia: string
  nomeArquivo: string
  tamanhoBytes: number
}

interface DetalheComVersao {
  versaoAtual: { itens: Array<{ ativoId: string }> } | null
}

declare global {
  namespace Cypress {
    interface Chainable {
      /** Cria uma carteira MODERADO com nome único e devolve o id. */
      criarCarteiraDeTeste(): Chainable<string>
      /** `PUT /carteiras/:id` com `ativa: false`. */
      desativarCarteira(carteiraId: string): Chainable<void>
      /** Até `quantidade` ativos distintos de carteiras que já têm versão vigente (falha se faltar). */
      obterAtivosDeReferencia(quantidade: number): Chainable<string[]>
      /**
       * `POST /relatorios/gerar` que respeita o limite de 10/min por admin: se vier 429, espera o
       * `Retry-After` do servidor (ou 60 s) e repete, até 2 vezes. Devolve a resposta final, sem
       * falhar em 4xx. Existe para os specs não se atrapalharem pelo limite compartilhado.
       */
      gerarRelatorioComEspera(
        corpo: Record<string, unknown>,
      ): Chainable<Cypress.Response<RelatorioGerado>>
      /**
       * Cria a versão da competência com `pesos.length` ativos (tirados de carteiras que já têm
       * versão vigente; falha se não houver ativos suficientes), publica e devolve o id da versão.
       */
      publicarVersaoDeTeste(
        carteiraId: string,
        mesReferencia: string,
        pesos: number[],
      ): Chainable<string>
    }
  }
}

/** Competência `AAAA-MM` (UTC) deslocada `meses` do mês corrente. */
export function competenciaRelativa(meses = 0): string {
  const agora = new Date()
  return new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth() + meses, 1))
    .toISOString()
    .slice(0, 7)
}

function ativosDeReferencia(quantidade: number): Cypress.Chainable<string[]> {
  const ativoIds: string[] = []

  return cy
    .apiRequest<{ items: Array<{ id: string }> }>({ method: 'GET', url: '/carteiras?pageSize=100' })
    .then(({ body }) => {
      for (const { id } of body.items) {
        cy.apiRequest<DetalheComVersao>({ method: 'GET', url: `/carteiras/${id}` }).then(
          ({ body: detalhe }) => {
            for (const { ativoId } of detalhe.versaoAtual?.itens ?? []) {
              if (!ativoIds.includes(ativoId)) ativoIds.push(ativoId)
            }
          },
        )
      }
      return cy.then(() => {
        expect(ativoIds.length, `ativos de referência (precisa de ${quantidade})`).to.be.at.least(
          quantidade,
        )
        return ativoIds.slice(0, quantidade)
      })
    })
}

Cypress.Commands.add('obterAtivosDeReferencia', (quantidade) => ativosDeReferencia(quantidade))

Cypress.Commands.add('criarCarteiraDeTeste', () => {
  const sufixo = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

  return cy
    .apiRequest<{ id: string }>({
      method: 'POST',
      url: '/carteiras',
      body: {
        nome: `E2E Relatório ${sufixo}`,
        perfilAlvo: 'MODERADO',
        descricao: 'Massa de teste',
      },
    })
    .then(({ status, body }) => {
      expect(status).to.eq(201)
      return body.id
    })
})

Cypress.Commands.add('desativarCarteira', (carteiraId) => {
  cy.apiRequest({ method: 'PUT', url: `/carteiras/${carteiraId}`, body: { ativa: false } })
    .its('status')
    .should('be.within', 200, 204)
})

Cypress.Commands.add('publicarVersaoDeTeste', (carteiraId, mesReferencia, pesos) => {
  return ativosDeReferencia(pesos.length).then((ativoIds) => {
    return cy
      .apiRequest<{ id: string }>({
        method: 'POST',
        url: `/carteiras/${carteiraId}/versoes`,
        body: {
          mesReferencia,
          itens: ativoIds.map((ativoId, i) => ({ ativoId, pesoPercentual: pesos[i] })),
        },
      })
      .then(({ status, body }) => {
        expect(status).to.eq(201)
        cy.apiRequest({
          method: 'POST',
          url: `/carteiras/${carteiraId}/versoes/${body.id}/publicar`,
        })
          .its('status')
          .should('be.within', 200, 201)
        return body.id
      })
  })
})

function enviarGeracao(
  corpo: Record<string, unknown>,
  tentativa = 0,
): Cypress.Chainable<Cypress.Response<RelatorioGerado>> {
  return cy
    .apiRequest<RelatorioGerado>({
      method: 'POST',
      url: '/relatorios/gerar',
      body: corpo,
      failOnStatusCode: false,
    })
    .then((resposta) => {
      if (resposta.status !== 429 || tentativa >= 2) return cy.wrap(resposta, { log: false })

      // Janela do limite de geração: a espera vem do servidor, não é um atraso arbitrário.
      const segundos = Number(resposta.headers['retry-after'] ?? 60)
      return cy
        .wait((segundos + 1) * 1000, { log: false })
        .then(() => enviarGeracao(corpo, tentativa + 1))
    })
}

Cypress.Commands.add('gerarRelatorioComEspera', (corpo) => enviarGeracao(corpo))
