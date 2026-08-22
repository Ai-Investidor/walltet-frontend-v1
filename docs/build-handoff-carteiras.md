# Build Handoff — Carteiras

> Data: 2026-08-22
> Manifesto: `docs/build-manifest-carteiras.md`

## Dados (Passo 1)

| Arquivo | Tipo | Status | Nota |
|---|---|---|---|
| `src/data/wallet.ts` | dado estático | estendido (`recommendedWallets` + `RecommendedWallet`) | camada dinâmica pendente (skill futura). `allocationPreview` foi ajustado pós-review para reusar `AllocationClass` (com `label`) em vez de um shape sem rótulo — ver Code review M6. |

## Componentes (Batch 0)

| Componente | Status | Modo efetivo | Props implementadas | Desvios da spec | Bloqueios |
|---|---|---|---|---|---|
| `ProfileGauge` (`src/components/shared/profile-gauge/`) | ✓ implementado | create | `level`, `tone`, `label`, `class` | O builder trocou `rounded-sm` → `rounded-full` por leitura visual do screenshot; revertido para `rounded-sm` no code review (M5) — a extração não deve alterar o visual do call site já existente (Sidebar). | nenhum |
| ~~`WalletCard`~~ (`src/components/wallet/wallet-card/`) | **removido pós-review** | create → deletado | — | Criado no Batch 0, depois excluído: as 4 instâncias estavam todas dentro da mesma seção (Lista/Grade), não em seções distintas — R6 manda `v-for`, não extração. Markup movido para `Lista.vue`. Manifesto atualizado (movido para "Estruturas inline-only"). | nenhum |

## Seções (Batches 1-N)

| Seção | Status | Assets faltantes | Desvios do manifesto | Evolução de componente pedida | Bloqueios | Notas |
|---|---|---|---|---|---|---|
| `Cabecalho` | ✓ ok | nenhum | nenhum | — | nenhum | Agente foi interrompido por limite de sessão antes de retornar o YAML final, mas o arquivo já estava completo e correto (verificado manualmente contra o precedente `views/relatorios/Cabecalho.vue`). |
| `Lista` | ✓ ok (reescrita pós-review) | nenhum | Grid de `bg-border`+`gap-px` trocado por `gap-4` com borda por card (corrige M1: 2 células vazias visíveis com 4 cards em `grid-cols-3`); `WalletCard` inlinado via `v-for` (M2); heading do card `h3`→`h2` (M4); botão "Ver composição" indisponível usa `aria-disabled="true"` + `title` em vez de `disabled` nativo (m1); barra de alocação ganhou `role="img"` + `aria-label` computado a partir de `label`/`percent` (M6) | — | nenhum | — |

## Code review

**Veredicto do agente:** MUDANÇAS NECESSÁRIAS · 0 BLOCKERS · 6 MAJOR · 3 MINOR · 3 INFO.

| # | Severidade | Resumo | Status |
|---|---|---|---|
| M1 | MAJOR | Grid `bg-border`+`gap-px` deixa células vazias visíveis com 4 cards em 3 colunas | ✓ corrigido |
| M2 | MAJOR | `WalletCard` extraído com 1 único consumidor real (4 instâncias na mesma seção) — viola R6 | ✓ corrigido (inlinado) |
| M3 | MAJOR | `WalletCard` sem `<slot />` (R5) — condicional a M2 | ✓ resolvido (componente removido) |
| M4 | MAJOR | Pulo de heading `h1`→`h3` no card, sem `h2` da seção | ✓ corrigido |
| M5 | MAJOR | Extração do gauge mudou `rounded-sm`→`rounded-full` sem sinalizar (regressão visual na Sidebar já entregue) | ✓ corrigido |
| M6 | MAJOR | `tone` (cor) na camada de dado sem `label`; barra de alocação virou `aria-hidden` por falta de rótulo | ✓ corrigido |
| m1 | MINOR | Botão `disabled` nativo remove foco por teclado; contradiz a copy do Cabeçalho | ✓ corrigido junto com a reescrita de Lista.vue |
| m2 | MINOR | Troca de filtro sem `aria-live` avisando leitores de tela | não corrigido — ver pendências |
| m3 | MINOR | Tipos `ProfileLevel`/alocação duplicados entre dado e componente | parcialmente resolvido (alocação agora usa `AllocationClass` único; `profileLevel: 1\|2\|3\|4` em `RecommendedWallet` continua um literal solto, não importa de `ProfileGauge`) |

## Intervenções do orquestrador (fora do escopo `.vue` de seção/componente)

- `src/layouts/AppLayout.vue` — substituído o medidor de perfil inline (linhas 108-116) por `<ProfileGauge>`, conforme planejado no manifesto (Passo Batch 0).
- `src/routers/index.ts` — rota `carteiras` (já registrada no `/build-prep`, confirmada aqui).
- `src/data/navigation.ts` — item "Carteiras" → `available: true`, conforme Plano de execução do manifesto.
- `bun format` rodou no repo inteiro (padrão do projeto) e tocou 8 arquivos fora do escopo desta página (`.claude/hooks/`, `.claude/learn/.obsidian/*`, `.claude/skills/*`, `index.html`) — **revertidos** com `git checkout --` para manter o diff desta entrega restrito à página `carteiras`.

## Análise e sugestões de correção

### Causas raiz

1. **Critério de reuso do `/build-prep` mal aplicado a componentes repetidos numa única seção.** A regra 4 do Passo 7 do `build-prep.md` exige "uso real em ≥ 2 **seções distintas**"; o manifesto original contou 4 instâncias do card, todas na mesma seção (Grade), como se fossem 2+ consumidores. R6 do RULES.md já tem esse exato contra-exemplo (`transaction-row`). Vale registrar essa distinção no vault (`/dream` ou `/learn`) para não se repetir no próximo `/build-page`.
2. **Extração de componente sem congelar o visual do call site original.** O `component-builder` do `ProfileGauge` teve autonomia para "corrigir" a forma (quadrado→círculo) com base só no screenshot da nova página, sem cruzar com o comportamento já implementado em `AppLayout.vue`. Regra prática: ao extrair algo que já existe inline em outro lugar, o novo componente herda o visual do call site existente por padrão; mudança de desenho é uma decisão separada, não um efeito colateral da extração.
3. **Dado estático carregando decisão de apresentação sem o dado de domínio que a justifica.** `allocationPreview` nasceu só com `percent`+`tone` (cor), sem `label` (categoria) — sintoma de derivar a spec do widget renderizado (a barra colorida) em vez do dado que ele representa.

### Backlog priorizado

- **P1** — `m2`: adicionar `aria-live="polite"` na `<ul>` (ou num contador ao lado dos chips) para anunciar quantas carteiras aparecem após o filtro. Baixo esforço, mesma área de código já tocada.
- **P2** — `m3`: se `profileLevel` crescer em mais lugares, importar `ProfileLevel` de `@components/shared/profile-gauge` em vez do literal `1 | 2 | 3 | 4` solto em `RecommendedWallet`.
- **P2** — Decisão de negócio: confirmar se as 3 carteiras sem `to` (Conservadora, Arrojada, Sofisticada) devem realmente ficar com "Ver composição" inacessível indefinidamente, ou se entram na fila de próximos `/build-prep`+`/build-page` (cada uma como página própria, como `/carteira` hoje).
- **P2** — Os rótulos de categoria de alocação (`Renda Fixa`, `Ações BR`, `FII`, `Multimercado`, `Renda Variável Global`, `Alternativos`) foram **inferidos** a partir da descrição/meta de cada carteira, não extraídos de uma legenda no design (o Pencil não tinha rótulo de categoria nos segmentos da barra, só cor). Se houver taxonomia oficial de classes de ativo, revisar esses 4 conjuntos em `src/data/wallet.ts`.
- **P0** — nenhum. Build e typecheck limpos, sem BLOCKER de review, sem HTTP real, sem TODO não declarado.

## PROMPT COPIÁVEL

```
Pendências da página /carteiras (docs/build-manifest-carteiras.md):

1. [P1] src/views/carteiras/Lista.vue — adicionar aria-live="polite" na <ul> da Grade
   (ou num contador ao lado do grupo de filtros) pra anunciar quantas carteiras
   aparecem depois de trocar o filtro de perfil.

2. [P2] src/data/wallet.ts — RecommendedWallet.profileLevel usa o literal `1 | 2 | 3 | 4`
   solto; considerar importar `ProfileLevel` de @components/shared/profile-gauge
   pra não duplicar a união em dois lugares.

3. [P2 — decisão de negócio] Confirmar se as carteiras Conservadora, Arrojada e
   Sofisticada (sem rota própria, botão "Ver composição" com aria-disabled) entram
   na fila de próximos /build-prep + /build-page, cada uma como página própria
   (mesmo padrão de /carteira hoje).

4. [P2 — revisão de conteúdo] Os rótulos de classe de ativo na barra de alocação de
   cada carteira recomendada (src/data/wallet.ts, campo allocationPreview) foram
   inferidos a partir da descrição/meta de cada carteira — não vieram de uma legenda
   no design Pencil (que só tinha cor, sem rótulo). Revisar se batem com a
   taxonomia oficial de classes de ativo do produto.
```
