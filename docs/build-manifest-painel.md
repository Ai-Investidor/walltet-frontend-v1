# Build Manifest — Painel

> Gerado por /build-prep em 2026-08-21
> Fonte: pencil — `docs/template/dashboard.pen`, node `ceXaI` ("Cliente · Painel")
> Para implementar: `/build-page painel`

## Identificação
- page: painel
- página: src/pages/Painel.vue
- seções: src/views/painel/
- rota: `/` (home)
- layout: src/layouts/AppLayout.vue (novo — reutilizável pelas próximas páginas)

## Escopo além do padrão do skill

Esta é a primeira página real do projeto — `src/layouts/`, `src/routers/`, `src/pages/`, `src/views/`, `src/data/` estavam vazios e `vue-router` nunca tinha sido montado. Este `/build-prep` também:
- criou `src/routers/index.ts` (rota `/` → `AppLayout.vue` → filho `Painel.vue`, lazy) e `src/boot/router.ts` (`app.use(router)`, registrado em `src/boot/index.ts`);
- trocou `src/App.vue` do placeholder para `<RouterView />`;
- criou o **stub** de `src/layouts/AppLayout.vue` (landmarks `<aside>`/`<header>`/`<main>` comentados). A implementação real da Sidebar/Topbar (spec abaixo) é feita no `/build-page`, por mim diretamente — não existe subagente de layout; `section-builder` cobre só `src/views/`.

## Frame raiz
- node-id: `ceXaI` — "Cliente · Painel", 1180×860
- Screenshot: docs/pencil/painel-overview.pdf

## Tokens

Todas as cores do `.pen` (hex) foram convertidas para oklch e escritas em `src/assets/index.css` nos três lugares (`:root`, `.dark`, `@theme inline`), por R1. **Decisões que afetam o app inteiro, não só o Painel** — revisar com atenção:

- `--primary`/`--primary-foreground` **redefinidos** para o verde do design (decisão confirmada com o usuário) — todo `Button` `variant="default"` do kit muda de azul para verde.
- `--background`/`--card`/`--popover`/`--foreground`/`--card-foreground`/`--popover-foreground`/`--muted`/`--muted-foreground`/`--sidebar*`/`--radius` **repintados** para a paleta do design (papel quente `#faf8f4`/ink `#14181a` em vez do branco/cinza neutro atual). Fidelidade ao design, não é troca semântica como o primary — mas é uma mudança visual global, revisar antes do `/build-page`.
- Fontes: `--font-sans` trocou de `'JetBrains Mono Variable'` (não estava sendo usada de fato — import de Inter no topo do CSS já estava morto) para **Public Sans**; `--font-heading` (novo, antes era alias do mono) para **Archivo**. Import do Google Fonts atualizado.

### Adicionados
| Token | Light | Dark | Uso |
|---|---|---|---|
| `--primary` / `--primary-foreground` | verde `oklch(0.515 0.11 156.8)` / papel | verde `oklch(0.692 0.11 159.8)` / papel escuro | Botão Primário, redefine o `default` do kit |
| `--success` | = `--primary` (mesmo verde) | = `--primary` | Semântica de valor positivo (rentabilidade, ENTROU/AUMENTOU) — token próprio para não acoplar "valor positivo" a "cor de marca" |
| `--warning` | `oklch(0.555 0.144 49.7)` | `oklch(0.704 0.128 60.1)` | Âmbar — SAIU/REDUZIU (não é erro, por isso não é `--destructive`) |
| `--muted-foreground-faint` | `oklch(0.525 0.01 248)` | `oklch(0.653 0.009 236.6)` | Segundo tom de cinza do design (`$ink-faint`, mais apagado que `muted-foreground`) — eyebrows, metadados |
| `--border-strong` | `oklch(0.206 0.007 229.3 / 22%)` | `oklch(0.95 0.01 87.5 / 28%)` | Divisores mais fortes (rodapé de card, topo de bloco) — design usa 2 intensidades de borda |
| `--data-1` … `--data-6` | ink em 88%→18% de opacidade | ink em 88%→15% | Escala monocromática para a barra de alocação por classe (design usa cinza, não cores saturadas — `chart-1..5` existentes são azuis e servem a outro propósito, do componente `ui/chart`) |
| `--radius` | `0.5rem` (era `0.625rem`) | — | `rounded-lg` passa a bater com os cards do design (8px); `rounded-md`≈6px e `rounded-sm`≈4px também colam nos valores do design (6/3px) |

### Reusados (redefinidos com os valores do design, mesmo papel semântico)
`--background`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--foreground`, `--muted`, `--muted-foreground`, `--border`, `--sidebar`, `--sidebar-foreground`, `--sidebar-primary(+foreground)`, `--sidebar-accent(+foreground)`, `--sidebar-border`.

### Não tocados (fora do escopo desta página)
`--secondary(+foreground)`, `--accent(+foreground)`, `--destructive`, `--input`, `--ring`, `--chart-1..5` (usados por `ui/chart`, não pelo Painel).

## Text-styles

### Adicionados (em `index.css` e em `TEXT_STYLES` de `src/libs/utils.ts`)
| Classe | font-size/weight/line-height | Uso | Nº de usos reais no design |
|---|---|---|---|
| `text-eyebrow` | 0.62rem/700/1.4, uppercase, ls 0.05em, font-heading | Labels em caixa alta (grupos de nav, labels de KPI, "ALOCAÇÃO POR CLASSE", "ÚLTIMO RELATÓRIO"...) | 12+ |
| `text-nav-item` | 0.88rem/500/1.4 | Itens de navegação da Sidebar | 5 (+ reuso em toda página futura) |
| `text-metric` | 2.4rem/800/1, ls -0.02em, font-heading | Valor grande do KPI | 4 |
| `text-page-title` | 1.75rem/800/1.1, ls -0.01em, font-heading | H1 da página | 1 (reusável por outras páginas) |
| `text-card-title` | 0.92rem/700/1.4, font-heading | Título de card ("Carteira Moderada Estratégica", "Movimentações do mês", nome do relatório) | 3 |

**Aproximação assumida em `text-eyebrow`:** o design tem 2-3 variações de 0.5-0.8px e peso 700 vs 800 entre eyebrows (ex.: "COMPOSIÇÃO · 4 ATIVOS" e o eyebrow da página são 10.24px/800 contra 9.92px/700 do resto). Consolidei num único estilo por serem visualmente indistinguíveis e para não fragmentar o catálogo — se o `section-builder` achar a diferença perceptível ao lado do screenshot, ajustar ou criar uma segunda variante (`text-eyebrow-strong`) é aceitável dentro do R2 ("catálogo cresce com o produto").

### Reusados (aproximados — 1 uso isolado cada, diferença sub-pixel, ver screenshot antes de fechar)
- `text-paragraph` → descrição do cabeçalho (design: 14.72px/400/1.6; utilitário: 14px/400/1.4)
- `text-label` → legendas de alocação, "Refazer avaliação", nomes de ativos nas linhas (design: 12.16–13.44px/400; utilitário: 12px/400/1.42)
- `text-caption-sm` → metadados pequenos ("Gerado em 01/09/2026 · 471 KB")

Botões (`Botao Primario/Outline/Texto` do design, 13-14px/700) **não** usam `text-button`/`text-button-sm` — o componente `Button` do kit já tem tipografia própria via `cva` (`text-xs font-medium` etc., não usa os `@utility text-*`). Ajustar o peso/tamanho do `Button` para bater com o design (se necessário) é edição do componente no `/build-page`, não um novo text-style.

## Ícones

Nenhum SVG a extrair — o design usa ícones por nome (Lucide, via node `type: "icon"`), não desenhos customizados. Mapeamento para `@phosphor-icons/vue` (nomes confirmados em `node_modules/@phosphor-icons/vue/dist/icons/`):

| Lucide (design) | Phosphor (`@phosphor-icons/vue`) | Onde |
|---|---|---|
| `menu` | `PhList` | Topbar, botão mobile (`enabled:false` no design — oculto por padrão) |
| `moon` | `PhMoon` | Topbar, toggle de tema |
| `calendar` | `PhCalendarBlank` | Topbar, seletor de competência |
| `chevron-down` | `PhCaretDown` | Topbar (competência, usuário) |
| `layout-dashboard` | `PhSquaresFour` | Nav: Painel |
| `pie-chart` | `PhChartPie` | Nav: Minha carteira |
| `file-text` | `PhFileText` | Nav: Relatórios; ícone do card "Último relatório" |
| `layers` | `PhStack` | Nav: Carteiras |
| `user` | `PhUser` | Nav: Minha conta |
| `arrow-left-right` | `PhArrowsLeftRight` | Card "Movimentações do mês" |
| `arrow-down-right` | `PhArrowDownRight` | Status ENTROU (verde) |
| `arrow-up-right` | `PhArrowUpRight` | Status SAIU (âmbar) |
| `arrow-up` | `PhArrowUp` | Status AUMENTOU (verde) |
| `arrow-down` | `PhArrowDown` | Status REDUZIU (âmbar) |
| `minus` | `PhMinus` | Status MANTER |
| `download` | `PhDownloadSimple` | Botão "Baixar PDF" |
| `arrow-right` | `PhArrowRight` | Botão "Ver carteira completa" |

## Imagens

Nenhuma — a página não usa `fill` de imagem em nenhum node.

## Componentes do kit reusados
- `@components/ui/button` — os 3 "botões" do design mapeiam para variants existentes, sem criar componente novo:
  - Botão Primário (fundo verde) → `variant="default"` (bate com `--primary` redefinido)
  - Botão Outline (borda ink) → `variant="outline"`
  - Botão Texto (só texto verde, "Ver detalhes") → `variant="link"` ou `variant="ghost"` (definir no build-page conforme o padrão visual — o design não tem sublinhado, `ghost` com `text-success` é mais próximo)
  - evolução pedida: tamanho/peso do label do `Button` (design usa 13-14px/700, kit usa `text-xs font-medium`) — avaliar ajuste da `cva` no `/build-page`.
- `@components/ui/card` — candidato natural para os 4 KPIs, o card "Carteira", o card "Movimentações" e o card "Último relatório" (todos são `bg-card rounded-lg border`).
- `@components/ui/sidebar` — kit shadcn-vue completo já instalado (`SidebarProvider`, `Sidebar`, `SidebarHeader/Content/Footer/Group/Menu*`) — base para a implementação da Sidebar no `/build-page`, em vez de markup solto.
- `@components/ui/avatar` — avatar do usuário no Topbar (iniciais "AS").
- `@components/ui/separator`, `@components/ui/tooltip`, `@components/ui/dropdown-menu` — candidatos para os dropdowns de competência/usuário e separadores da Sidebar.

## Componentes do projeto reusados
Nenhum — `src/components/shared/` e `src/components/<dominio>/` estão vazios (primeira página do projeto).

## Componentes compartilhados — specs
Nenhuma spec nova em `src/components/`. Aplicação da R6/R7: KPI, Item de Navegação e Linha de Ativo se repetem várias vezes, mas sempre **dentro da mesma seção** cada um (não em 2+ seções distintas) → viram `v-for` sobre array de `src/data/`, não componente extraído. Ver "## Layout" abaixo para a Sidebar/Topbar, que não são specs de componente e sim conteúdo do layout.

### Estruturas inline-only (v-for sobre dado, não componente)
- **KPI** — `usos_contados: 4`, todos dentro da seção `Overview` (Indicadores). `recomendacao: v-for` sobre `wallet.kpis`. node_id: `dO59A`. screenshot: `docs/pencil/painel-overview-indicadores.webp`.
- **Item de Navegação** — `usos_contados: 5`, todos dentro do `AppLayout` (Sidebar). `recomendacao: v-for` sobre `navigation.groups[].items`. node_id: `b4kv49`. screenshot: `docs/pencil/painel-sidebar.webp`.
- **Linha de Ativo** — `usos_contados: 4`, todos dentro da seção `Carteira`. `recomendacao: v-for` sobre `wallet.assets` (o "Chip" de iniciais, `tevnN`, fica inline dentro da própria linha — é parte da mesma estrutura, não um componente à parte). node_id: `pabok` (chip: `tevnN`). screenshot: `docs/pencil/painel-carteira.webp`.
- **Medidor de Perfil** — `usos_contados: 1` (só no cartão de perfil da Sidebar). `inline_na_secao: AppLayout` (é parte do layout, não de uma view da página). node_id: `alFgV`.
- **Linha de Movimentação** — `usos_contados: 4`, todas dentro da seção `Movimentacoes`. `recomendacao: v-for` sobre `wallet.movements`. node_id: dentro de `bAWvl` (`b3fS7`/`gTXge`/`a6K7BU`/`qH7oj`). screenshot: `docs/pencil/painel-movimentacoes.webp`.

## Layout — AppLayout (spec para o /build-page)

Não é uma seção de página nem um componente de `src/components/` — é o shell reutilizável (`src/layouts/AppLayout.vue`), implementado diretamente no `/build-page` (sem subagente dedicado). Fica documentado aqui no nível de detalhe de uma spec de componente porque será reusado por todas as páginas futuras.

### Sidebar
- node_id: `QDU3a` ("Sidebar Cliente")
- screenshot: `docs/pencil/painel-sidebar.webp`
- largura fixa: 248px; altura: `fill_container` (100% da tela)
- fundo: `bg-sidebar` (paper-2); borda direita: `border-r border-sidebar-border`
- Base recomendada: `@components/ui/sidebar` (`SidebarProvider` + `Sidebar` + `SidebarHeader/Content/Footer`), não markup solto — o kit já tem toda a mecânica de colapsar/expandir.
- Estrutura:
  1. **Marca** — quadrado 26×26 `bg-foreground rounded-sm` com "AI" (`text-primary-foreground`, inline — glifo de marca, não um text-style reusável) + texto "AI Invest" (inline, 14.72/800 ls-0.15 — nome de marca, uso único, não vira text-style).
  2. **Navegação** — 4 grupos (label `text-eyebrow` + `v-for` de itens). Cada item: ícone Phosphor (18px) + `text-nav-item`, com **estado ativo** derivado da rota atual (`useRoute()` comparando `route.path` com o path do item): ativo = `bg-sidebar-accent` + barra esquerda 2px `bg-sidebar-primary` + ícone/label em `text-sidebar-accent-foreground` peso 600; inativo = fundo transparente, barra transparente, `text-muted-foreground` peso 500. (Confirmado nos overrides do node `ceXaI`: o item "Painel" vem com fundo/bar/peso diferentes dos demais — é o estado ativo, não uma variante estática.)
  3. **Cartão de perfil** — `bg-card border rounded-md p-3.5`: label `text-eyebrow` "SEU PERFIL", medidor de 4 quadrados (`alFgV`, inline — 4 `<span>` 8×8 com borda, os preenchidos usam `bg-success`), texto do nível ("MODERADO", inline uppercase 10.88/800), link "Refazer avaliação" (`text-label text-success`).
- dados: `src/data/navigation.ts` (grupos+itens); nível de perfil pode ficar hardcoded no layout por ora (não veio um domínio claro de "perfil de investidor" para justificar arquivo próprio ainda — se aparecer em outra página, promover para `src/data/`).

### Topbar
- node_id: `zst25`
- screenshot: `docs/pencil/painel-topbar.webp`
- altura fixa: 60px; `bg-background border-b`
- Estrutura: botão menu mobile (`PhList`, oculto acima do breakpoint `md` — hoje `enabled:false` no design, mas existe para telas pequenas) → título da página (`text-card-title`, **dinâmico**: `route.meta.title`, não hardcoded "Painel" — é o mesmo Topbar em todas as páginas) → ações à direita: toggle de tema (`PhMoon`, botão outline quadrado 34px), seletor de competência (botão outline com `PhCalendarBlank` + "Agosto 2026" + `PhCaretDown` — estático por ora, sem dado dinâmico identificado), avatar do usuário (`@components/ui/avatar`, iniciais "AS") + `PhCaretDown`.
- dados: título vem de `route.meta.title` (já setado em `src/routers/index.ts` para a rota do Painel); competência e usuário ficam estáticos no template até existir uma fonte real (fora do escopo desta página).

## Plano de dados

### Dados propostos
```yaml
dados_propostos:
  - arquivo: src/data/navigation.ts
    acao: criar
    consumido_por: [AppLayout]
    exports:
      - navigationGroups: NavigationGroup[]
    tipos:
      - NavigationItem { label: string, icon: string (nome do componente Phosphor), to: string (rota) }
      - NavigationGroup { label: string, items: NavigationItem[] }

  - arquivo: src/data/wallet.ts
    acao: criar
    consumido_por: [Overview, Carteira, Movimentacoes]
    exports:
      - kpis: Kpi[]
      - allocation: AllocationClass[]
      - assets: Asset[]
      - movements: Movement[]
      - lastReport: Report
    tipos:
      - Kpi { label: string, value: string, note: string, tone: 'positive' | 'neutral' }
      - AllocationClass { label: string, percent: number, tone: 'data-1' | 'data-2' | 'data-3' }
      - Asset { code: string, name: string, className: string, trend: 'up' | 'down' | 'flat', trendLabel: string, weightPercent: number }
      - Movement { name: string, direction: 'in' | 'out' | 'increase' | 'decrease', label: string }
      - Report { title: string, generatedAt: string, sizeLabel: string }
```

Nenhum arquivo existente em `src/data/` para estender (pasta estava vazia).

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Overview | `t5NfID` + `H8Fws` | src/views/painel/Overview.vue | ui/card | `data:wallet` (kpis) + literal (título/texto) | não (serial, primeira seção) | docs/pencil/painel-overview-cabecalho.webp, docs/pencil/painel-overview-indicadores.webp | webp |
| 2 | Carteira | `a9Rn8` | src/views/painel/Carteira.vue | ui/card, ui/button | `data:wallet` (allocation, assets) | sim | docs/pencil/painel-carteira.webp | webp |
| 3 | Movimentacoes | `bAWvl` | src/views/painel/Movimentacoes.vue | ui/card, ui/button | `data:wallet` (movements, lastReport) | sim | docs/pencil/painel-movimentacoes.webp | webp |

Layout (Sidebar + Topbar) não entra neste inventário — é implementado em `src/layouts/AppLayout.vue`, fora do fluxo de `section-builder`.

## Plano de execução (Fase 2)
1. Sem Batch 0 (nenhum componente novo em `src/components/`).
2. Implementação do `AppLayout.vue` (Sidebar + Topbar) — feita diretamente, não por subagente.
3. Batch paralelo (máx 3): Carteira, Movimentacoes.
4. Serial: Overview (primeira seção, sem dependência de paralelismo real, mas simples o bastante para não valer isolar).
5. `bun check` + `bun run build` uma vez no fim.

## Critério de aceite por seção
- Fiel aos screenshots (`docs/pencil/painel-*.webp` e `.pdf`).
- Zero valor arbitrário em cor, tipografia e espaçamento (R1, R2) — dimensão fixa (larguras de coluna 494/366px, sidebar 248px, topbar 60px) é a exceção permitida.
- Estado ativo da Sidebar derivado da rota (`useRoute()`), não hardcoded.
- Ícone via `@phosphor-icons/vue` conforme a tabela de mapeamento acima — não inventar ícone fora da tabela.
- Desktop-first com `max-*` (R12) — o design não trouxe artboard mobile; a página deve degradar com bom senso (colunas empilham abaixo de `lg`, Sidebar vira `Sheet` abaixo de `md` usando a mecânica do `ui/sidebar`).
- Tag semântica correta: `<h1>` único (título da Overview), `<nav>` na Sidebar, `<aside>`/`<header>`/`<main>` no layout, `RouterLink` nos itens de navegação (R13).

## Stubs criados
- src/routers/index.ts (rota `/` → AppLayout → Painel)
- src/boot/router.ts (+ registrado em src/boot/index.ts)
- src/App.vue (`<RouterView />`)
- src/layouts/AppLayout.vue (stub com landmarks)
- src/pages/Painel.vue (seções comentadas)
- src/views/painel/ (vazia)

## Status

### Layout
- [x] AppLayout.vue (Sidebar + Topbar) — implementado em /build-page com `@components/ui/sidebar` (SidebarProvider/Sidebar/SidebarInset). `SIDEBAR_WIDTH` do kit ajustado de `16rem` para `15.5rem` (248px, valor do design) em `src/components/ui/sidebar/utils.ts`.

### Seções (Batches 1-N)
- [x] Overview
- [x] Carteira
- [x] Movimentacoes
- [x] bun check + bun run build
- [x] review
