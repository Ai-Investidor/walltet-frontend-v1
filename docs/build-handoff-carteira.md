# Build Handoff — Carteira

> `/build-page carteira` — 2026-08-21
> Manifesto: `docs/build-manifest-carteira.md`

## Dados (Passo 1)
| arquivo | tipo | status | nota |
|---|---|---|---|
| `src/data/wallet.ts` | dado estático | estendido (`RevisionNote` + `revisionNote`) | camada dinâmica pendente (skill futura) |

## Components (Batch 0)
Nenhum — manifesto não propôs spec nova (tudo reuso do kit ou do padrão já construído no Painel).

## Sections (Batches 1-N)
| seção | status | assets_faltantes | desvios_do_manifesto | componentes_evolucao_pedida | bloqueios |
|---|---|---|---|---|---|
| Cabecalho | ok | — | eyebrow em sentence case no source (render idêntico, `text-eyebrow` aplica `uppercase`) | — | — |
| Composicao | ok | — | ver "Code review" abaixo (M1, M3) | — | — |

## Code review

Rodado (`review` agent) contra `.claude/RULES.md`. Veredicto: **mudanças necessárias**, 0 BLOCKERS.

**Corrigidos nesta sessão (pelo orquestrador, fora do escopo dos subagentes — arquivos que são domínio do `/build-page`, não das seções):**
- **M2** — `src/pages/Carteira.vue` não tinha shell (`p-8`/`gap-8`): conteúdo colava na topbar/sidebar. Corrigido pra bater com o padrão de `src/pages/Painel.vue`.
- **M4** — `revisionNote` (texto novo) dizia que Tesouro IPCA+ 2035 subiu e VALE3 caiu, mas `assets` marcava os dois como `trend: 'flat'` — contradição na mesma tela. Corrigido `assets` em `src/data/wallet.ts` pra `up`/`Aumentou` e `down`/`Reduziu`, alinhado com `movements` (que já classificava os dois corretamente) e com o texto da justificativa. **Efeito colateral:** isso muda o que `src/views/painel/Carteira.vue` também renderiza (mesma fonte de dado) — era um bug pré-existente que a nota nova só expôs, não uma mudança de design.

**Ainda abertos (não corrigidos — decisão de escopo, ver backlog abaixo):**
- M1, M3 e os 6 MINOR ficaram como estão. Rebuild + `bun run build` confirmados limpos após as correções acima.

## Análise e sugestões de correção

### Causas raiz
- **Duplicação Composicao ↔ painel/Carteira** (M1): cada `section-builder` roda isolado (por design — contexto mínimo) e não tem visão do que a página anterior já construiu; o `component-builder`/Batch 0 só existe se o manifesto propuser spec, e este não propôs porque, no momento do `/build-prep`, só havia 1 uso real em código (não estava no manifesto do Painel). Agora que existe o 2º consumidor, R6 pede a extração.
- **Tabela como grid em vez de `<table>`** (M3): o kit `ui/table` existe mas nenhum manifesto/spec apontou pra ele — falha de reconhecimento no `/build-prep`, não do `section-builder`.
- **Dado contraditório** (M4): erro do orquestrador ao escrever `revisionNote` sem cruzar com `assets` já existente — já corrigido.

### Backlog priorizado
| P | Item | Ação sugerida |
|---|---|---|
| P1 | M1 — duplicação `Composicao.vue` / `painel/Carteira.vue` | Extrair `formatPercent`/`percentFormatter` pra `@libs/format.ts`; `ALLOCATION_TONE`/`ASSET_STATUS` pra módulo compartilhado; linha de ativo → `src/components/wallet/asset-row/`; barra de alocação → `src/components/wallet/allocation-bar/` (anatomia R5). Toca as duas páginas — rodar como tarefa própria, não dentro de um `/build-page` de página nova. |
| P1 | M3 — tabela de composição semântica | Trocar o grid de `Composicao.vue` por `@components/ui/table` (`thead`/`tbody`/`tfoot`, `th scope="col"`). Mesmo dado, só marcação. |
| P2 | Cabecalho.vue duplica header de `painel/Overview.vue` | Mesma família do M1 — extrair `shared/page-header` quando mexer no P1. |
| P2 | `Cabecalho.vue` sem `<script setup lang="ts">` | Adicionar bloco vazio pra bater com R4 e aceitar prop `class` como as outras views. |
| P2 | `aria-labelledby` de `Composicao.vue` aponta pra heading dentro do `TabsContent` | Não é bug hoje (outras abas ficam `disabled`, o painel nunca desmonta) — só vira problema quando Movimentações/Performance forem habilitadas. Revisitar nesse build futuro. |
| ~~P3~~ | ~~`PhCaretUp` no card Justificativa sem comportamento de colapsar~~ | **Feito** (pós-handoff, a pedido do usuário): card vira `@components/ui/collapsible` (`Collapsible`/`CollapsibleTrigger`/`CollapsibleContent`), `default-open`, ícone alterna `PhCaretUp`↔`PhCaretDown` via `group-aria-expanded/justificativa:*` — mesmo padrão já usado em `@components/ui/accordion/AccordionTrigger.vue`. `bun run build` limpo. |
| P3 | Abas desabilitadas sem `title`/dica de "em breve" | Polish de a11y, baixo risco, baixo esforço — bom primeiro item se for mexer em `Composicao.vue` de novo. |
| P3 | `tsconfig.tsbuildinfo` versionado | Fora do escopo desta página — `git rm --cached tsconfig.tsbuildinfo` + adicionar ao `.gitignore` num commit separado. |

**Decide o humano:** copy real de "Ver movimentações"/"Baixar relatório" (hoje sem handler — UI estática, fase sem HTTP); se/quando habilitar as abas Movimentações e Performance (cada uma é seu próprio `/build-prep`+`/build-page`); prioridade do P1 (DRY) frente a novas páginas.
**É técnico, decide sozinho quando for mexer:** P2/P3 acima.

## Intervenções do orquestrador (fora do escopo `.vue` de seções/components)
- `src/pages/Carteira.vue` — criado e composto (Passo 4, domínio do orquestrador).
- `src/data/wallet.ts` — estendido com `revisionNote` (Passo 1) e corrigido `assets[0,1].trend/trendLabel` (fix pós-review, M4).
- `src/routers/index.ts` — rota `carteira` já registrada no `/build-prep`; sem mudança nesta fase.
- `src/data/navigation.ts` — `Minha carteira.available` `false` → `true` (item concluído do plano de execução do manifesto).
- `src/views/carteira/Composicao.vue` — 1 fix mecânico de formatação (`bunx biome check --write --unsafe`, ordenação de classes Tailwind) após o `section-builder` retornar; nenhuma mudança de conteúdo/lógica.

## PROMPT COPIÁVEL

```
Contexto: página /carteira (docs/build-manifest-carteira.md) entregue e funcionando
(bun check + bun run build limpos). Review encontrou 2 MAJOR de duplicação/semântica
não corrigidos nesta rodada — quero resolver agora:

1. Extrair pra shared, com anatomia R5 (pasta + index.ts + prop class + data-slot):
   - src/components/wallet/asset-row/ — linha de ativo (chip + nome/classe + trend + peso),
     hoje duplicada em src/views/painel/Carteira.vue e src/views/carteira/Composicao.vue
   - src/components/wallet/allocation-bar/ — barra de alocação + legenda, mesma duplicação
   - src/libs/format.ts (ou @utils) — formatPercent/percentFormatter, hoje 2 instâncias
     idênticas de Intl.NumberFormat
   - ALLOCATION_TONE / ASSET_STATUS — mover pra módulo compartilhado junto dos dois acima
   Depois de extrair, atualizar os dois consumidores (painel/Carteira.vue e
   carteira/Composicao.vue) pra importar do shared, sem duplicar o mapa/markup.

2. src/views/carteira/Composicao.vue: trocar o grid da tabela de composição por
   @components/ui/table (thead/tbody/tfoot, th scope="col"), mantendo os mesmos dados
   de @data/wallet (assets) e o mesmo resultado visual.

3. src/views/carteira/Cabecalho.vue: adicionar <script setup lang="ts"></script> vazio
   (R4) e aceitar prop class opcional, no padrão das outras views da página.

Rodar bun check + bun run build no final e reportar.
```
