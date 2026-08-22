# Build Handoff — Carteira · Movimentações

> Página: `carteira-movimentacoes` (aba "Movimentações" de `/carteira`)
> Data: 2026-08-21
> Manifesto: `docs/build-manifest-carteira-movimentacoes.md`

## Dados (Passo 1)

| Arquivo | Tipo | Status | Nota |
|---|---|---|---|
| `src/data/wallet.ts` | dado estático | estendido (`MovementDetail`, `MovementGroup`, `movementGroups`) | camada dinâmica pendente (skill futura); ver P1 abaixo sobre sobreposição com `Movement` |

## Componentes (Batch 0)

| Componente | Status | mode_efetivo | Props implementadas | Desvios da spec | Bloqueios |
|---|---|---|---|---|---|
| `AssetRow` | ok | create | `code`, `name`, `detail`, `icon`, `tone` (union literal, endurecida após review), `label`, `value`, `class` | raiz `<li>` (não previsto na spec, justificado por R13); larguras fixas em escala Tailwind (`w-37.5`/`w-19`) em vez de arbitrário | nenhum |

## Seções (Batches 1-N)

| Seção | Status | Assets faltantes | Desvios do manifesto | Evolução de componente pedida | Bloqueios |
|---|---|---|---|---|---|
| `Movimentacoes` | ok | nenhum | gap entre cards `gap-7` (28px, medido no screenshot, manifesto não fixava valor); `border-b` próprio no cabeçalho de cada grupo (necessário porque `AssetRow` só desenha `border-t` entre itens) | nenhuma | nenhum |
| Edição de `Composicao.vue` (fora do `section-builder`, feita diretamente pelo orquestrador) | ok | — | habilitado `TabsTrigger value="movimentacoes"` + `TabsContent` com `<Movimentacoes />` | — | — |

## Code review

Agente `review` rodado contra `.claude/RULES.md`. **0 BLOCKERS.** 5 MAJOR, 2 MINOR, 3 INFO.

| # | Achado | Status |
|---|---|---|
| M1 | `aria-labelledby` em `Composicao.vue` apontava para um `<h2>` que desmonta quando a aba não está ativa (regressão introduzida ao habilitar "Movimentações" — antes ficava mascarada pelo `disabled`) | **corrigido** — trocado por `aria-label="Carteira recomendada"` na `<section>`, `id` removido do `<h2>` |
| M2 | `AssetRow` extraído com 1 consumidor real; os 2 usos pré-existentes (`painel/Carteira.vue`, `carteira/Composicao.vue`) continuam com o mesmo markup duplicado à mão, agora divergindo em mecanismo (grid vs flex, um com `max-lg:`, outro sem) | **aberto** — ver backlog P1 |
| M3 | API de `AssetRow` sem `<slot />` (6 props de conteúdo) e prop `tone` tipada como `string` solto | **parcialmente corrigido** — `tone` virou união literal (`'text-success' \| 'text-warning' \| 'text-foreground' \| 'text-muted-foreground-faint'`) nos dois arquivos que a usam; a parte estrutural (compound/slot) segue aberta, amarrada a M2 |
| M4 | `MovementDetail` duplica o modelo de `Movement` já existente (mesmos campos, mesma união de `direction` + `'hold'`) — mapa direção→ícone/tom replicado em 3 lugares (`painel/Movimentacoes.vue`, `carteira/Movimentacoes.vue`, `Composicao.vue`) | **aberto** — ver backlog P1 |
| M5 | `movementGroups` guarda percentuais e deltas como string pré-formatada (`'+5,00 p.p.'`) em vez de número + formatter, diferente do padrão já usado em `Asset.weightPercent` | **aberto** — ver backlog P2 |
| MINOR | `text-paragraph-strong` em `0.88rem` vs `text-heading` em `0.875rem` — provável arredondamento do design, não erro de regra (há precedente de valores quebrados no arquivo) | aberto, nit |
| MINOR | `Movimentacoes` (conteúdo de aba inativa no load) candidata a `defineAsyncComponent` quando crescer | aberto, não urgente |

## Intervenções do orquestrador (fora do escopo `.vue` de seções/components)

- `src/assets/index.css` + `src/libs/utils.ts` — token `text-paragraph-strong` adicionado durante `/build-prep` (Passo 3, conforme o workflow manda), não durante `/build-page`.
- `src/data/wallet.ts` — camada de dados escrita diretamente pelo orquestrador (Passo 1 do `/build-page`), como o workflow prevê.
- `src/views/carteira/Composicao.vue` — editado diretamente pelo orquestrador (fora do `section-builder`, documentado no manifesto como passo explícito): habilitação da aba + fix de M1.
- `src/components/wallet/asset-row/AssetRow.vue` — prop `tone` endurecida de `string` para união literal após o review (fix de M3, parcial).
- `bun format` (rodado sem escopo por engano no Passo 5) reformatou arquivos fora deste build (`.claude/hooks/learn-index.mjs`, `.claude/skills/figma/extract-screenshots.mjs`, `.claude/skills/icon-extract/extract-icons.mjs`, `index.html`, `.claude/learn/_index.json` e `.obsidian/*`) — todos revertidos via `git checkout` antes da entrega. `git diff --stat` final mostra só os arquivos deste build + `tsconfig.tsbuildinfo` (artefato de build, regenerado pelo `vue-tsc -b`).

## Análise e sugestões de correção

**Causa raiz comum de M2/M3/M4:** o `AssetRow` foi extraído no Batch 0 porque a regra de reuso cross-página (2 usos já existentes + este novo) mandava extrair — mas a extração criou uma API nova sem migrar os consumidores antigos nem unificar o modelo de dado que já existia (`Movement`). Resultado: peça nova, dívida antiga preservada, mais uma cópia do mapa ícone/tom.

### Backlog priorizado

- **P0** — nenhum item (sem BLOCKER, item de acessibilidade real já corrigido nesta sessão).
- **P1 — técnico, decisão de arquitetura:**
  1. Migrar `painel/Carteira.vue` e `carteira/Composicao.vue` para consumir `AssetRow` em vez do markup duplicado — resolve M2 e, ao mesmo tempo, força a API do componente a virar compound/slot real (M3) porque `Composicao` formata percentual e `Movimentacoes` mostra p.p.
  2. Unificar `MovementDetail` como extensão de `Movement` (`interface MovementDetail extends Movement { code, detail, value, ... }`) em vez de campo duplicado — e mover o mapa direção→ícone/tom para um único lugar (hoje replicado em `painel/Movimentacoes.vue`, `carteira/Movimentacoes.vue` e `Composicao.vue`).
  3. Escolha de arquitetura precisa de humano: os dois pontos acima tocam páginas já entregues e revisadas (`build-manifest-painel.md` e `build-manifest-carteira.md` ambos com checklist `[x]` + `review` `[x]`) — não é decisão que um `/build-page` de uma 3ª página deveria tomar sozinho pelas outras duas.
- **P2 — modelagem de dado, menor urgência:**
  4. Trocar `value`/`detail` de string pré-formatada para número + formatter compartilhado (`formatPercent` hoje é privado em `Composicao.vue`) — vai doer mais tarde quando a camada dinâmica substituir `src/data/wallet.ts`, porque o backend não devolve `'−15,00 p.p.'` pronto.
- **P3 — nit, sem ação obrigatória:**
  5. `text-paragraph-strong`: confirmar com o design se `0.88rem` é intencional ou se deveria ser `0.875rem` (igual a `text-heading`).
  6. `defineAsyncComponent` em `Movimentacoes` quando a seção crescer (R9) — hoje o peso não justifica.

O que é decisão de negócio/copy: nenhuma pendência — todo texto desta seção é literal do design, confirmado via `content` dos nodes Pencil, sem placeholder.

## PROMPT COPIÁVEL

```
Quero resolver o backlog P1 do handoff de docs/build-handoff-carteira-movimentacoes.md:

1. Migrar src/views/painel/Carteira.vue e src/views/carteira/Composicao.vue para
   consumir @components/wallet/asset-row (AssetRow), removendo o markup de linha
   duplicado à mão nos dois arquivos. Avaliar se AssetRow precisa virar compound
   (slot para o valor à direita, já que Composicao formata percentual e
   Movimentacoes mostra p.p.) em vez de prop `value: string` solta.
2. Unificar src/data/wallet.ts: MovementDetail deve estender Movement (mesmos
   campos: name, direction, label) em vez de duplicar a interface. Conferir os
   3 consumidores (painel/Movimentacoes.vue, carteira/Movimentacoes.vue,
   Composicao.vue) e ver se dá pra unificar o mapa direção→ícone/tom num só
   lugar (hoje replicado 3x: DIRECTIONS, ITEM_DIRECTION, ASSET_STATUS).

Atenção: painel/Carteira.vue e carteira/Composicao.vue já passaram por review
e build antes (docs/build-manifest-painel.md, docs/build-manifest-carteira.md,
ambos com checklist completo) — tratar como refactor sobre código shipped, não
como implementação nova. Rodar bun check + bun run build no fim.
```
