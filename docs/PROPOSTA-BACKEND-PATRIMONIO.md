# Proposta de endpoint — patrimônio investido do cliente (R$)

> Cole este arquivo numa sessão do Claude Code aberta no repositório
> `carteira-sistema-backend` para discutir com o time/agente responsável pelo backend se este
> endpoint faz sentido e como priorizá-lo. Gerado em 2026-08-25 a partir da integração do
> frontend `wallet-app-v1` com a API já existente — não é uma implementação pronta, é um pedido de
> avaliação.

## Contexto

O frontend (`wallet-app-v1`) tem uma tela de Painel do investidor com quatro elementos que
dependem de um dado que **hoje não existe em nenhum DTO do backend**: o patrimônio investido do
cliente em reais.

O backend (`carteira-sistema-backend`) modela muito bem a carteira **recomendada** — composição
em %, rentabilidade em % vs. CDI/Ibovespa, movimentações de peso entre competências — mas não
modela quanto o cliente de fato tem investido. Os dois domínios são conceitualmente distintos:
"qual é a carteira ideal para o meu perfil e como ela performou" (já coberto) vs. "quanto dinheiro
eu tenho aplicado e como ele evoluiu" (não coberto).

Os quatro elementos de UI parados nisso, hoje comentados no código do frontend enquanto esta
proposta não é resolvida:

1. **Patrimônio total** — valor absoluto em R$ e variação % no ano (card de destaque no topo do
   Painel).
2. **Evolução patrimonial** — série mensal (12 meses) do patrimônio em R$, para um gráfico de
   barras.
3. **Aporte do mês** — quanto o cliente aportou na competência atual (KPI).
4. **Dividendos no ano** — total de proventos recebidos no ano corrente (KPI).

## Pergunta central

Existe (ou está nos planos) uma fonte desses dados? Pode ser:

- um módulo de custódia/posição própria do backend (ainda não implementado);
- integração com um sistema de custódia externo (corretora, banco custodiante);
- ou este dado simplesmente não está no escopo do produto ainda, e o frontend deveria remover essa
  parte da UI de vez (não só comentar).

Peço para o time de backend avaliar se faz sentido adicionar isso agora ou se é matéria de uma
fase futura — o frontend fica com essa seção comentada até haver uma resposta.

## Sugestão de contrato (se a resposta for "sim, vamos implementar")

Um novo campo em `DashboardInvestidorResponseDto` (ou um endpoint dedicado, se o cálculo for mais
pesado que o resto do dashboard) nos moldes de:

```typescript
interface PosicaoInvestidorResponseDto {
  patrimonioTotal: number // valor atual em R$
  variacaoPercentualAno: number // variação % desde jan do ano corrente
  aporteMesAtual: number // total aportado na competência em curso, em R$
  dividendosAnoAtual: number // total de proventos recebidos no ano corrente, em R$
  evolucaoPatrimonial: Array<{
    mesReferencia: string // "YYYY-MM", mesmo formato usado no resto da API
    valor: number // patrimônio em R$ ao fim daquele mês
  }> // últimos 12 meses, mais recente por último
}
```

Segue as mesmas convenções do resto da API descritas em `INTEGRATION_PROMPT.md` deste frontend:
valores monetários como `number` já arredondado, `mesReferencia` em `"YYYY-MM"`, envelope de erro
padrão em caso de falha.

## O que o frontend já tem pronto para consumir isso

`docs/AUDITORIA-INTEGRACAO.md` (achado 1.1) documenta os quatro pontos de UI parados nisso e o
código correspondente já está comentado (não deletado) em `src/views/painel/Cabecalho.vue` e
`src/views/painel/EvolucaoPatrimonial.vue`, e os KPIs de aporte/dividendos em `src/data/wallet.ts`.
Assim que houver uma resposta — endpoint novo ou decisão de não implementar — é só me avisar para
eu religar (ou remover de vez) essa parte da tela.
