# Build Handoff — Carteira · Performance

> Página: `carteira-performance` (aba "Performance" de `/carteira`)
> Data: 2026-08-21
> Manifesto: `docs/build-manifest-carteira-performance.md`

## 1. Dados (Passo 1)

| Arquivo | Tipo | Status | Nota |
|---|---|---|---|
| `src/data/wallet.ts` | dado estático | estendido (`performanceIndicators`, `performanceHistory`, `PerformanceRow`) | camada dinâmica pendente (skill futura) |

## 2. Components (Batch 0)

| Componente | Status | Mode efetivo | Props implementadas | Desvios da spec | Bloqueios |
|---|---|---|---|---|---|
| `KpiCard` (`src/components/wallet/kpi-card/`) | ok | create → 1 fix de formatação (update) | `label`, `value`, `note`, `tone`, `size?`, `class?` | Root é `<li>` (não `<div>`): os dois consumidores previstos na spec (grid do Painel/Overview e da Performance) são `<ul>`, `<div>` filho direto de `<ul>` é inválido | nenhum |

## 3. Sections (Batches 1-N)

| Seção | Status | Assets faltantes | Desvios do manifesto | Evolução de componente pedida | Bloqueios | Notas |
|---|---|---|---|---|---|---|
| `Performance` (`src/views/carteira/Performance.vue`) | ok | nenhum | `normal-case` em cima de `text-eyebrow` (2 ocorrências) → corrigido criando `text-chart-label`; grid `max-md:grid-cols-2` → corrigido para `max-lg:grid-cols-2 max-sm:grid-cols-1`; paginação com lista de páginas hardcoded → corrigida para usar o slot `items` do kit | nenhuma | nenhum | Gráfico é SVG inline com geometria de path extraída do `.pen` (não biblioteca de gráfico); paginação é decorativa (não fatia dado real — só 12 meses cabem numa tela) |

Edição adicional fora do padrão "1 seção = 1 arquivo" (prevista no manifesto): `src/views/carteira/Composicao.vue` — removido `disabled` do `TabsTrigger value="performance"`, adicionado `<TabsContent value="performance"><Performance /></TabsContent>`.

## 4. Code review

**Veredicto original: MUDANÇAS NECESSÁRIAS — 0 BLOCKER, 7 MAJOR, 5 MINOR, 4 INFO.**

### Corrigidos nesta rodada (5 MAJOR + 1 MINOR)

| # | Achado | Correção aplicada |
|---|---|---|
| M1 | `bun check` falhava — `KpiCard.vue` com `computed()` quebrado em 2 linhas | Colapsado em 1 linha via `component-builder` (update) |
| M2 | Paginação hardcoded (`[1,2,3]` + total fixo) — páginas 4–7 inalcançáveis por clique, nenhum item fica `is-active` além da 3 | Reescrita para usar o slot `items` do `PaginationContent` do kit, com `sibling-count="0"` + `show-edges` |
| M3 | `text-eyebrow ... normal-case` empilhado (2 ocorrências: pills de período, labels do eixo X) — viola R2 | Criado token `text-chart-label` (0.6875rem/700/1.4, sem uppercase/letter-spacing) em `index.css` + `TEXT_STYLES`; ambas ocorrências trocadas |
| M6 | Grid de indicadores em 4 colunas até 768px, apertando `text-metric-sm` entre 768–1024px (sidebar ainda ancorada) | `max-md:grid-cols-2` → `max-lg:grid-cols-2 max-sm:grid-cols-1`, alinhado ao precedente de `Overview.vue` |
| M7 | Import eager de `Performance.vue`/`Movimentacoes.vue` dentro de `TabsContent` não-default (R9) | `Composicao.vue` passou a usar `defineAsyncComponent` para as duas — chunk da rota Carteira caiu de 57KB para 30,85KB (gzip 15,03KB → 9,63KB), `Performance` e `Movimentacoes` agora em chunks próprios |
| minor | `PaginationEllipsis` perdeu o ícone `PhDotsThree` ao sobrescrever o slot com só o `sr-only` em PT-BR | Orquestrador restaurou o ícone junto do `sr-only="Mais páginas"` (achado durante a verificação pós-fix, o subagente sinalizou a dúvida em vez de adivinhar) |
| minor | Labels de `performanceIndicators` em CAIXA ALTA no dado (`'MÊS'`), duplicando o `text-transform: uppercase` de `text-eyebrow` | Normalizado pra Title Case (`'Mês'`, `'No ano'`, `'% do CDI'`, `'Meses positivos'`), alinhado ao precedente de `kpis` no mesmo arquivo |

### Registrados como débito técnico, não corrigidos nesta rodada

| # | Achado | Por que ficou de fora |
|---|---|---|
| M4 | `KpiCard` extraído com um único consumidor real hoje (`Performance.vue`); `src/views/painel/Overview.vue` tem o mesmo markup inline e não foi migrado — a prop `size="default"` fica sem uso até essa migração | Toca uma página fora do escopo desta build (Painel). Migração é mecânica e de baixo risco — ver prompt copiável abaixo |
| M5 | `KpiCard` é 100% prop-driven, sem `<slot />` nem compound (`KpiCardLabel`/`KpiCardValue`/`KpiCardNote`), diferente do padrão `BalanceCard` que R5 usa como exemplo canônico | Mudança estrutural da API do componente; melhor decidida com o usuário do que aplicada por conta própria no mesmo ciclo do fix de bug |
| minor | `text-table-value` (0.88rem/700/heading/1.4) muito próximo de `text-card-title` (0.92rem/700/heading/1.4) — possível token redundante | Requer confronto visual fino com o PDF de referência; diferença é pequena e não visualmente óbvia |
| minor | Comentário ausente explicando `aspect-848/240` vs `viewBox="0 0 720 240"` (números diferentes de propósito, `preserveAspectRatio="none"` torna isso seguro mas não óbvio) | Cosmético, baixo risco de regressão |
| info | Seletor de período (3M/6M/12M/Máx) só troca o botão ativo — sem dataset alternativo, porque o design só desenhou o path do 12M | Já documentado no código e no manifesto; vira trabalho real quando existir dado de outros períodos |

## 5. Intervenções do orquestrador (fora do escopo `.vue` de seções/components)

- `src/assets/index.css` + `src/libs/utils.ts`: registro de 4 text-styles novos (`text-metric-sm`, `text-table-row`, `text-table-value` no `/build-prep`; `text-chart-label` no `/build-page`, motivado pelo review)
- `src/data/wallet.ts`: extensão com `performanceIndicators`/`performanceHistory`/`PerformanceRow` (Passo 1) + normalização de capitalização dos labels (pós-review)
- `src/views/carteira/Composicao.vue`: wiring da aba (remoção do `disabled`, `TabsContent` novo, imports) + conversão para `defineAsyncComponent` (pós-review)
- `src/views/carteira/Performance.vue`: 1 correção pontual de 3 linhas (ícone da `PaginationEllipsis`) aplicada diretamente pelo orquestrador após o `section-builder` sinalizar dúvida em vez de adivinhar — verificado contra `src/components/ui/pagination/PaginationEllipsis.vue` antes de decidir

## 6. Análise e sugestões de correção

### Causas raiz agrupadas
- **Reimplementação por cima de API existente** (M2, M4): tanto a paginação quanto o grid de KPI reinventaram algo que já existia no kit/no app em vez de descobrir primeiro. Padrão recorrente sinalizado pelo próprio review — candidato a nota no vault (`.claude/learn/`) se repetir na próxima build.
- **Ambiente sem `poppler-utils`**: nem o `component-builder` nem o `section-builder` conseguiram renderizar o PDF de referência via `Read` (erro `pdftoppm is not installed`) — só o orquestrador (este processo) conseguiu ler o PDF diretamente. Os subagentes trabalharam 100% a partir da descrição textual extraída pelo orquestrador via MCP do Pencil. O resultado bateu com o design nos pontos verificáveis (geometria do gráfico, dados da tabela, formatação de sinal), mas não houve conferência visual pixel-a-pixel por parte de quem gerou o código.

### Backlog priorizado

**P0 (nenhum)** — sem blockers, `bun check` e `bun run build` limpos.

**P1 — técnico, decisão de arquitetura:**
- Migrar `src/views/painel/Overview.vue` para consumir `KpiCard` (`size="default"`) — ativa a prop hoje morta e elimina a 3ª duplicação do mesmo markup (M4)
- Decidir se `KpiCard` vira compound (`KpiCardLabel`/`KpiCardValue`/`KpiCardNote` + `<slot />`) seguindo o padrão canônico de `BalanceCard` do R5, ou se a API 100% prop-driven atual fica como exceção documentada (M5)
- Instalar `poppler-utils` no ambiente dos subagentes (ou trocar a estratégia de referência visual pro Pencil) para que `component-builder`/`section-builder` consigam conferir o PDF diretamente em builds futuras

**P2 — cosmético, baixo risco:**
- Reconciliar `text-table-value` vs `text-card-title` (0.88rem vs 0.92rem, mesmo peso/família) — ou um comentário justificando a diferença, ou merge dos dois tokens
- Comentário de uma linha em `Performance.vue` explicando `aspect-848/240` vs `viewBox 0 0 720 240`

### O que é decisão de negócio/copy (não técnica)
- Nenhuma copy ficou como placeholder — todo texto é literal do design ou dado de `@data/wallet.ts`. Nada pendente aqui.

## 7. PROMPT COPIÁVEL

```
Contexto: acabei de rodar /build-page carteira-performance (docs/build-manifest-carteira-performance.md).
O review encontrou 7 majors, 5 já corrigidos nesta rodada. Restam 2 itens de débito técnico (P1):

1. Migrar src/views/painel/Overview.vue para usar @components/wallet/kpi-card (KpiCard),
   size="default", substituindo o <li v-for="kpi in kpis"> inline (linhas 25-44) por
   <KpiCard v-for="kpi in kpis" :key="kpi.label" :label="kpi.label" :value="kpi.value"
   :note="kpi.note" :tone="kpi.tone" /> dentro do mesmo <ul>. Ative a prop `size="default"`
   que hoje está sem nenhum consumidor real.

2. Decidir a API de src/components/wallet/kpi-card/KpiCard.vue: manter 100% prop-driven
   (como está) ou quebrar em compound (KpiCard + KpiCardLabel + KpiCardValue + KpiCardNote,
   com <slot />) seguindo o padrão canônico de BalanceCard do RULES.md R5. Se optar por
   compound, os dois consumidores (Overview.vue pós-migração + Performance.vue) precisam
   ser atualizados juntos.

Também vale registrar em .claude/learn/ (vault) o padrão "reimplementar API que já existe
em vez de descobrir primeiro" — apareceu 2x nesta build (paginação do kit reka-ui, grid de
KPI do Overview.vue).
```
