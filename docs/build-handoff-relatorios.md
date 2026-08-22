# Build Handoff — Relatórios

> Página: `relatorios` · Data: 2026-08-21 · Manifesto: `docs/build-manifest-relatorios.md`

## Dados (Passo 1)

| Arquivo | Tipo | Status | Nota |
|---|---|---|---|
| `src/data/wallet.ts` | dado estático | estendido (`ReportArchiveGroup` + `reportArchive`, reusando `Report` existente) | camada dinâmica pendente (skill futura) |

## Components (Batch 0)

Nenhum — o manifesto não propôs nenhuma spec nova (`## Componentes compartilhados — specs` vazia). Página reusa `@components/ui/card` e `@components/ui/button` do kit, ambos já implementados.

## Seções (Batches 1-N)

| Seção | Status | Assets faltantes | Desvios do manifesto | Evolução de componente pedida | Bloqueios | Notas |
|---|---|---|---|---|---|---|
| Cabecalho | ok | — | Corrigido em ciclo de review: eyebrow usava `text-muted-foreground` em vez de `text-muted-foreground-faint` (design usa `$ink-faint`); tag raiz trocada de `<section>` para `<header>` (R13, alinhado com `carteira/Cabecalho.vue`) | — | — | Line-height do parágrafo de apoio: design pede 1.6, `text-paragraph` entrega 1.4 — mesma aproximação já aceita nos manifests de Painel/Carteira, ver "Análise" abaixo |
| Arquivo | ok | — | Padding da linha 16/14px em vez de 13/18px do design (alinhado ao padrão já usado em `painel/Movimentacoes.vue`); botão "Baixar" ganhou `text-button-xs` (token novo, ver abaixo) | Pedida e resolvida no mesmo ciclo: `@components/ui/button` sem text-style compatível com o label de 12,8px do design — resolvido com token novo `text-button-xs`, não com prop nova no componente | — | `not-last:border-b` em vez de índice do `v-for` para a borda inferior; `CARD_SURFACE` local replica padrão já usado em 4 outras views (ver Análise, M3) |

## Code review

- **BLOCKERS:** 0
- **MAJOR:** 3 encontrados, **3 corrigidos** neste ciclo:
  - M1 — `src/data/wallet.ts`: `reportArchive` quebrava `bun check` (linhas longas demais para o print width do Biome) → corrigido com `bunx biome format --write` (multi-linha)
  - M2 — `src/views/relatorios/Arquivo.vue`: botão "Baixar" com `font-semibold` empilhado sobre a tipografia do kit (R2) → corrigido com token novo `text-button-xs` em `src/assets/index.css` + `src/libs/utils.ts`
  - M3 — `CARD_SURFACE` (`'gap-0 rounded-lg border py-0 ring-0'`) duplicado literalmente em **5 arquivos** agora (`views/relatorios/Arquivo.vue` + 4 views pré-existentes) → **não corrigido nesta rodada** (ver Análise abaixo, é refactor cross-página, fora do escopo desta entrega)
- **MINOR:** 4 encontrados, **1 corrigido** (m1 — `<header>` em vez de `<section>` no Cabecalho), 3 deixados como pendência do usuário (m2 botão sem ação real, m3 shell de página duplicado, m4 `:key` por título)
- **INFO:** 6, todos positivos (R1/R8/R9/R10/R12/a11y bem aplicadas) — sem ação

## Intervenções do orquestrador (honestidade)

Além de `src/views/relatorios/` e `src/pages/Relatorios.vue`, este `/build-page` tocou:

- `src/data/wallet.ts` — extensão da camada de dados (Passo 1, esperado) + reformatação via `bunx biome format --write` pontual no arquivo (corrige M1)
- `src/assets/index.css` — **token novo `text-button-xs`** (0.8rem/600/1), não previsto no `/build-prep` original; nasceu do code review (M2), documentado retroativamente no manifesto (`## Tokens > Adicionado durante o /build-page`)
- `src/libs/utils.ts` — registro de `'button-xs'` em `TEXT_STYLES` (par obrigatório do token acima, R2)
- `src/routers/index.ts` — rota `relatorios` (Passo 0 do `/build-prep`, já existia antes deste `/build-page`)
- `src/data/navigation.ts` — item "Relatórios" `available: false` → `true`, conforme passo 5 do "Plano de execução" do manifesto

## Análise e sugestões de correção

### Causas raiz

1. **Lacuna de catálogo detectada tarde.** O `/build-prep` não sinalizou que o botão "Baixar" (12,8px) não tinha text-style compatível — só apareceu no code review do `/build-page`. Causa: a spec do manifesto tratou o botão como reuso 1:1 do kit sem medir o label contra o catálogo de `text-button*`. Resolvido nesta rodada (`text-button-xs`), mas vale registrar como lição para o próximo `/build-prep` conferir tipografia de **conteúdo de botão**, não só de texto solto.
2. **`CARD_SURFACE` como string local duplicada é padrão recorrente do repo**, não incidente desta página — já existia em 4 views antes desta entrega. Esta entrega propagou o padrão em vez de quebrá-lo (decisão consciente: extrair para `src/constants/` ou virar variant do `ui/card` são mudanças cross-página, fora do raio de uma única seção).
3. **Line-height do parágrafo (1.4 vs 1.6 do design)** é a mesma aproximação já aceita desde o manifesto da Carteira — decisão herdada, não nova.

### Backlog priorizado

| Prioridade | Item | Ação sugerida | Quem decide |
|---|---|---|---|
| P1 | `CARD_SURFACE` duplicado em 5 arquivos (`relatorios/Arquivo.vue`, `painel/Carteira.vue`, `painel/Movimentacoes.vue`, `carteira/Composicao.vue`, `carteira/Performance.vue`) | Extrair para `src/constants/surfaces.ts` **ou** virar `variant="surface"` em `@components/ui/card` — refactor cross-página, não cabe numa seção isolada | Técnico — dev decide extração vs variant |
| P2 | Botão "Baixar" sem ação real (`m2` do review) | Ligar a um handler real (download do arquivo) quando existir origem do PDF, ou `disabled` temporário até lá | Produto/negócio (fonte do arquivo) |
| P2 | Shell de página duplicado (`flex flex-col gap-8 p-8`) em `Relatorios.vue` e `Carteira.vue` (`m3`) | Mover para `AppLayout.vue` (`<main>`) quando a 3ª página confirmar o padrão | Técnico |
| P2 | `<RouterView />` fora de `<main>` em `AppLayout.vue` (achado "fora do diff" do review) | Envolver em `<main class="flex-1 overflow-y-auto">` — afeta todas as páginas, não só Relatórios | Técnico |
| P3 | `:key="report.title"` sem `id` estável (`m4`) | Adicionar `id` a `Report` quando a camada dinâmica substituir o dado estático | Técnico, baixa urgência |
| P3 | Line-height do parágrafo do Cabecalho (1.4 vs 1.6 do design) | Se a diferença incomodar ao lado do screenshot, criar `text-paragraph-relaxed` (R2, 2 lugares) | Design/técnico |

## PROMPT COPIÁVEL

```
Quero resolver as pendências do build de Relatórios (docs/build-handoff-relatorios.md):

1. CARD_SURFACE ('gap-0 rounded-lg border py-0 ring-0') está duplicado literalmente em
   src/views/relatorios/Arquivo.vue, src/views/painel/Carteira.vue,
   src/views/painel/Movimentacoes.vue, src/views/carteira/Composicao.vue e
   src/views/carteira/Performance.vue. Extrair para src/constants/surfaces.ts (export
   CARD_SURFACE) e trocar os 5 imports, OU avaliar virar variant="surface" em
   @components/ui/card se fizer mais sentido como API do componente.

2. O botão "Baixar" em src/views/relatorios/Arquivo.vue ainda não tem ação real —
   ligar a um handler de download quando a origem do PDF existir, ou marcar
   `disabled` até lá.

3. src/pages/Relatorios.vue e src/pages/Carteira.vue repetem o mesmo shell
   `flex flex-col gap-8 p-8`. Avaliar mover para src/layouts/AppLayout.vue.

4. src/layouts/AppLayout.vue:152 tem <RouterView /> dentro de um <div>, não de um
   <main> — RULES R13 pede landmark <main> envolvendo o RouterView. Afeta todas as
   páginas.
```
