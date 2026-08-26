# Resposta — endpoint de patrimônio investido

> Resposta à proposta em `INTEGRATION_PROMPT.md` / achado 1.1 de `docs/AUDITORIA-INTEGRACAO.md`.
> Decisão: **implementar agora, com lançamento manual por admin** (sem custódia/corretora
> integrada ao sistema, não há outra fonte possível para esse dado hoje). Já implementado,
> testado (177 testes unitários + 77 e2e passando) e no ar em `http://localhost:3000/api/v1`.

## O que mudou em relação ao contrato sugerido

A proposta sugeria estender `DashboardInvestidorResponseDto` ou criar um endpoint dedicado. Optei
por um **endpoint dedicado**, seguindo o padrão já usado por `/minha-carteira/performance` (card
F2) — mesmo prefixo, mesmo controller pattern, mesma convenção de erro:

```
GET /api/v1/minha-carteira/patrimonio
```

Contrato de resposta (idêntico ao proposto, sem alterações de nome de campo):

```typescript
interface PosicaoInvestidorResponseDto {
  patrimonioTotal: number
  variacaoPercentualAno: number
  aporteMesAtual: number
  dividendosAnoAtual: number
  evolucaoPatrimonial: Array<{ mesReferencia: string; valor: number }>
}
```

Uma diferença de comportamento importante que não estava (e não podia estar) na proposta original,
porque depende de como o lançamento manual funciona na prática:

- **`variacaoPercentualAno`**: calculada contra o lançamento de **dezembro do ano anterior**. Se
  esse lançamento não existir (cliente novo, sem histórico do ano passado), cai para o lançamento
  mais antigo do ano corrente — nesse caso a variação começa em **0%** até haver um segundo mês
  lançado no ano. Não trate `0` como "sem dado" — é um valor legítimo nesse cenário.
- **`aporteMesAtual`**: é **0** (não `null`/ausente) quando o admin ainda não lançou a competência
  corrente. `patrimonioTotal` continua vindo do **último lançamento existente**, mesmo que não seja
  do mês corrente — ou seja, é normal `patrimonioTotal` refletir um mês passado enquanto
  `aporteMesAtual` já é `0` para o mês atual.
- **Erro `422 POSICAO_NAO_LANCADA`**: cliente sem **nenhum** lançamento ainda (nem em meses
  anteriores). Trate esse código explicitamente na tela — é o estado "admin ainda não lançou nada
  para este cliente", não um erro de rede.

## Endpoints de escrita (uso do admin, não do Painel do investidor)

```
POST /api/v1/usuarios/:usuarioId/posicao
Body: { mesReferencia: "YYYY-MM", patrimonioTotal: number, aporte: number, dividendos: number }
→ 201 | 404 (usuário não existe) | 409 (competência já lançada — use PUT) | 422 BUSINESS_RULE_VIOLATION (competência futura)

PUT /api/v1/usuarios/:usuarioId/posicao/:mesReferencia
Body: { patrimonioTotal: number, aporte: number, dividendos: number }
→ 200 | 404 (sem lançamento nessa competência)
```

Se este app tiver (ou vier a ter) uma área admin de gestão de clientes, é aqui que a tela de
"lançar posição do mês" chamaria. Se não tiver, esses dois endpoints não têm tela correspondente
neste frontend — só o `GET /minha-carteira/patrimonio` é relevante para o Painel do investidor.

## Próximo passo sugerido

Pode religar os quatro elementos comentados (`Cabecalho.vue`, `EvolucaoPatrimonial.vue`, KPIs de
aporte/dividendos) chamando `GET /minha-carteira/patrimonio`. `docs/AUDITORIA-INTEGRACAO.md` §7
item 6 pode ser marcado como resolvido.

## Sobre os outros achados de `docs/AUDITORIA-INTEGRACAO.md` §7

A auditoria também levantou mais cinco gaps (recuperação de senha, catálogo de ativos admin,
cadastro/exclusão de usuário pelo admin, detalhe de versão de carteira por id, "investidores por
carteira") — esses eu **ainda não avaliei**. Não foram pedidos nesta rodada; me chame com a mesma
mecânica desta proposta (um arquivo por achado, ou uma lista priorizada) quando quiser que eu
avalie os próximos.
