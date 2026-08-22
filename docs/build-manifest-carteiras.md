# Build Manifest — Carteiras

> Gerado por /build-prep em 2026-08-21
> Fonte: pencil — `docs/template/dashboard.pen`, node `IrPsq` ("Cliente · Carteiras")
> Para implementar: `/build-page carteiras`

## Identificação
- page: carteiras
- página: src/pages/Carteiras.vue
- seções: src/views/carteiras/
- rota: `/carteiras` (filha de `AppLayout`, irmã de `carteira`/`relatorios`). Item de navegação já existe em `src/data/navigation.ts` (grupo "Descobrir", `available: false`) — o texto do grupo já bate com o eyebrow "DESCOBRIR" do Cabecalho.

## Decisão de arquitetura — botão "Ver composição" por carteira

A tela lista as 4 carteiras recomendadas (uma por perfil), mas só a **Carteira Moderada Estratégica** tem página própria hoje (`/carteira`, já implementada). As outras três (Conservadora, Arrojada, Sofisticada) não têm rota própria ainda. Decisão: `WalletCard` recebe uma prop opcional `to?: string`; quando presente, "Ver composição" é `RouterLink` para lá (só a Moderada recebe `to: '/carteira'`); quando ausente, o botão fica `disabled` — mesmo padrão já usado para as abas "Movimentações"/"Performance" em `build-manifest-carteira.md`. **Não** criar rota nem view para as outras três carteiras agora; isso é trabalho de builds futuros.

## Frame raiz
- node-id: `IrPsq` — "Cliente · Carteiras", 1180×860
- Screenshot: docs/pencil/carteiras-overview.pdf

## Tokens

Nenhum token novo e nenhum text-style novo — a tela reusa 100% do catálogo existente.

### Reusados
- Cor: `--foreground` (`$ink`), `--muted-foreground` (`$ink-soft`), `--muted-foreground-faint` (`$ink-faint`), `--success` (`$green`), `--border` (`$line`), `--border-strong` (`$line-strong`), `--card`/`--background` (`$paper`), `--data-1`/`--data-2`/`--data-3`
- Tipografia:
  - `text-eyebrow` → Eyebrow "DESCOBRIR", rótulo de perfil no card ("MODERADO" etc.) e labels dos chips de filtro (design 10.24–11.84px/700–800 vs utilitário 11px/700 — mesma faixa de aproximação já usada no Painel; ver precedente de `text-eyebrow` reusado em `AppLayout.vue` para o rótulo "Moderado" da Sidebar)
  - `text-page-title` → Titulo "Carteiras recomendadas" (design 28px/800/1.1/-0.01em — match exato)
  - `text-paragraph` → Texto de apoio do Cabecalho (design 14.72px/400/1.6 — mesmo precedente documentado em `build-manifest-carteira.md`)
  - `text-card-title` → Nome da carteira no card (design 16px/700 vs utilitário 14.72px/700 — aproximação)
  - `text-label` → Descrição do card e Meta do rodapé (design 13.44px e 12.48px/400 vs utilitário 13px/400 — aproximação)

## Ícones
- Local: nenhum SVG novo a extrair — design usa ícones por nome (Lucide), mesmo padrão do Painel/Carteira.
- Ícone usado nesta página: `arrow-right` → `PhArrowRight` (já mapeado em `build-manifest-painel.md`, botão "Ver composição" de cada card).

## Imagens
Nenhuma — a tela não usa `fill` de imagem em nenhum node.

## Componentes do kit reusados
- `@components/ui/button` — "Ver composição" em cada card (`variant="outline"`, ícone `PhArrowRight` à direita, mesmo padrão de `Composicao.vue`); quando a carteira não tem rota própria, renderizado `disabled`.

## Componentes do projeto reusados
Nenhum ainda.

## Componentes compartilhados — specs

### ProfileGauge
- destino: src/components/shared/profile-gauge/
- arquivos: ProfileGauge.vue, index.ts
- node_id: `alFgV` ("Medidor Perfil", componente `reusable: true` no Pencil)
- screenshot: docs/pencil/carteiras-component-wallet-card.webp (medidor visível no canto superior esquerdo de cada card)
- usos_contados: 5 (soma cross-página — ver `build-manifest-painel.md:119`, que já registrou 1 uso inline em `AppLayout.vue` e recomendou promover se aparecesse de novo)
- aparições:
  - AppLayout (Sidebar, rodapé "Seu perfil") — 1 instância, hoje inline (`src/layouts/AppLayout.vue:108-116`)
  - Carteiras (Grade) — 4 instâncias, uma por card
- compound: não
- envolve_primitiva: não
- precisa_cva: não
- props:
  - class: HTMLAttributes['class'] — sempre presente
  - level: 1 | 2 | 3 | 4 — obrigatório
  - tone: 'neutral' | 'success' — opcional, default 'neutral'. Card da carteira própria (Moderada) e o widget da Sidebar usam 'success'; as demais carteiras usam 'neutral'
  - label: string — opcional, sobrescreve o `aria-label` padrão
- data_slot: profile-gauge
- slots: nenhum (sem conteúdo projetado)
- tokens_usados: border-strong, success, foreground (ver nota de cor abaixo)
- depende_de: []
- exemplo_uso: |
  <ProfileGauge :level="2" tone="success" aria-label="Perfil de investidor moderado, nível 2 de 4" />
- spec_confidence: media
- spec_source: heuristica_humana
- responsivo: tamanho fixo (4 quadrados 8×8 + gap), não escala com breakpoint
- a11y: `role="img"` no elemento raiz, `aria-label` descritivo (ex.: "Perfil moderado, nível 2 de 4")
- nota: os quadrados preenchidos usam `bg-success` quando `tone="success"` e `bg-foreground` quando `tone="neutral"` (ver diffs de `fill` entre os 4 cards: Conservadora/Arrojada/Sofisticada usam `$ink`, só a Moderada usa `$green`). Ao criar o componente, **refatorar `AppLayout.vue:108-116`** para consumi-lo (mesmo visual, mesma lógica, hoje inline) — não é um `section-builder`, então esse ajuste é feito diretamente no `/build-page`, como já ocorreu com Sidebar/Topbar no Painel.

## Estruturas inline-only

### WalletCard (card de carteira recomendada)
- usos_contados: 4, mas **todas as 4 dentro da mesma seção** (Lista/Grade) — não em seções distintas
- inline_na_secao: Lista
- motivo: "Corrigido no /build-page após code review (M2): a spec original tratou 4 instâncias na mesma seção como critério de extração, mas R6 é explícito — repetição dentro da mesma seção resolve com v-for, não componente. O ❌ de exemplo da própria R6 (`transaction-row` usado só por `Statement.vue`) é este caso. Componente `src/components/wallet/wallet-card/` foi criado no Batch 0 e depois removido; markup movido pro `v-for` de `Lista.vue`."
- recomendacao: v-for
- node_id: `TdVhm` (instância "Carteira Moderada Estratégica", representativa da estrutura repetida em `Wbhjj`/`eB3CW`/`g3AXCF`)
- screenshot: docs/pencil/carteiras-component-wallet-card.webp
- tokens_usados: text-eyebrow, text-card-title, text-label, border, foreground, muted-foreground, data-1, data-2, data-3

### Chip de filtro (Filtros)
- usos_contados: 1 (5 instâncias, mas todas dentro da mesma seção → v-for, não componente — R6)
- inline_na_secao: Lista
- motivo: "Repetição dentro da mesma seção (Filtros). Sem segundo consumidor em outra seção/página."
- recomendacao: v-for
- node_id: `CoaWu` (frame pai) — filhos `nxYJF` (TODOS OS PERFIS, ativo), `tqDhx`/`MKcdZ`/`p1Zqo`/`pxW8T` (inativos)
- screenshot: docs/pencil/carteiras-filtros.webp
- tokens_usados: text-eyebrow, foreground, border, muted-foreground

## Plano de dados

### Dados propostos
```yaml
dados_propostos:
  - arquivo: src/data/wallet.ts
    acao: estender
    consumido_por: [Lista]
    exports_novos:
      - recommendedWallets: RecommendedWallet[]
    tipos_novos:
      - RecommendedWallet {
          slug: string
          profileLabel: string
          profileLevel: 1 | 2 | 3 | 4
          name: string
          description: string
          allocationPreview: AllocationClass[]
          meta: string
          isOwn: boolean
          to?: string
        }
```

Correção pós-review (M6): `allocationPreview` reusa o `AllocationClass` já existente (`label`, `percent`, `tone`) em vez de um shape próprio sem `label` — sem isso a barra de alocação não tinha como virar `aria-label` para leitor de tela.

Domínio `wallet` já existe (`src/data/wallet.ts`) — estender, não criar arquivo novo (R8). Os 4 registros, na ordem da Grade:

```ts
export const recommendedWallets: RecommendedWallet[] = [
  {
    slug: 'conservador',
    profileLabel: 'CONSERVADOR',
    profileLevel: 1,
    name: 'Carteira Conservadora Patrimonial',
    description: 'Preservação de capital com indexação à inflação e liquidez alta.',
    allocationPreview: [
      { percent: 85, tone: 'data-1' },
      { percent: 10, tone: 'data-2' },
      { percent: 5, tone: 'data-3' },
    ],
    meta: '5 ativos · Renda Fixa 85 %',
    isOwn: false,
  },
  {
    slug: 'moderado',
    profileLabel: 'MODERADO',
    profileLevel: 2,
    name: 'Carteira Moderada Estratégica',
    description: 'Núcleo em renda fixa com parcela em ações e fundos imobiliários.',
    allocationPreview: [
      { percent: 30, tone: 'data-1' },
      { percent: 50, tone: 'data-2' },
      { percent: 20, tone: 'data-3' },
    ],
    meta: '4 ativos · sua carteira',
    isOwn: true,
    to: '/carteira',
  },
  {
    slug: 'arrojado',
    profileLabel: 'ARROJADO',
    profileLevel: 3,
    name: 'Carteira Arrojada Multimercado',
    description: 'Maior exposição a renda variável e multimercado, oscilação alta.',
    allocationPreview: [
      { percent: 20, tone: 'data-1' },
      { percent: 55, tone: 'data-2' },
      { percent: 25, tone: 'data-3' },
    ],
    meta: '7 ativos · Ações BR 55 %',
    isOwn: false,
  },
  {
    slug: 'sofisticado',
    profileLabel: 'SOFISTICADO',
    profileLevel: 4,
    name: 'Carteira Sofisticada Global',
    description: 'Renda variável global, câmbio e ativos alternativos.',
    allocationPreview: [
      { percent: 10, tone: 'data-1' },
      { percent: 45, tone: 'data-2' },
      { percent: 45, tone: 'data-3' },
    ],
    meta: '9 ativos · Global 45 %',
    isOwn: false,
  },
]
```

Percentuais calculados a partir da proporção real dos segmentos da "Fita" no design (largura de cada `rectangle`), arredondados para somar 100. O registro `moderado` bate com o `allocation` já existente em `wallet.ts` (30/50/20) — mesma carteira, mesmos números; manter os dois exports (não fatorar um no outro, cada um serve um card diferente).

Ficam **literais** no template (mesmo precedente das páginas anteriores):
- Eyebrow "DESCOBRIR", Titulo "Carteiras recomendadas" e o parágrafo de apoio do Cabecalho
- Rótulo do filtro "TODOS OS PERFIS" — os outros 4 rótulos de filtro **não** duplicam string: computar a partir de `recommendedWallets.map(w => w.profileLabel)`, sem hardcodear de novo

Fica **estado local** (`ref` na view `Lista`):
- filtro de perfil selecionado (`ref<string>`, default `'TODOS OS PERFIS'`), controlando quais cards da Grade aparecem (`computed` filtrando `recommendedWallets` por `profileLabel`)

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Cabecalho | `pAzEz` | src/views/carteiras/Cabecalho.vue | — | literal | não (serial, primeira seção) | docs/pencil/carteiras-cabecalho.webp | webp |
| 2 | Lista | `CoaWu` (Filtros) + `svCY2` (Grade) | card inline (`v-for`), `ProfileGauge`, `ui/button` | `data:wallet` (recommendedWallets) + estado local (filtro ativo) | não (única seção de conteúdo, Filtros e Grade compartilham estado) | docs/pencil/carteiras-filtros.webp, docs/pencil/carteiras-grade.webp | webp |

## Plano de execução (Fase 2)
1. Batch 0 serial: `ProfileGauge` (sem dependências). Ao final do Batch 0, refatorar `src/layouts/AppLayout.vue` para usar `<ProfileGauge :level="2" tone="success" />` no lugar do markup inline atual (linhas 108-116). ~~`WalletCard`~~ removido do Batch 0 após code review (ver "Estruturas inline-only" — R6, repetição na mesma seção).
2. Serial: Cabecalho (simples, primeira seção).
3. Serial: Lista (única seção de conteúdo restante; sem ganho em paralelizar com 1 seção só).
4. `bun check` + `bun run build` uma vez no fim.
5. Ao final, com a página funcionando: atualizar `src/data/navigation.ts`, item "Carteiras" → `available: true`.

## Critério de aceite por seção
- Fiel aos screenshots (`docs/pencil/carteiras-*.webp` e `.pdf`).
- Zero valor arbitrário em cor, tipografia e espaçamento (R1, R2).
- `ProfileGauge` segue a anatomia obrigatória da R5 (pasta, `index.ts`, prop `class`, `cn(..., props.class)`, `data-slot`); card de carteira é inline em `Lista.vue` (R6).
- Botão "Ver composição" via `@components/ui/button` `variant="outline"` + `PhArrowRight`; `aria-disabled="true"` (botão focável, não `disabled` nativo) quando a carteira não tem `to` (só a Moderada tem, ver "Decisão de arquitetura").
- Filtro de perfil funcional: clicar num chip filtra a Grade por `profileLabel`; "TODOS OS PERFIS" volta a mostrar as 4.
- Percentuais da barra de alocação vêm de `allocationPreview`, não de largura fixa em pixel.
- `AppLayout.vue` refatorado para usar `ProfileGauge` (sem duplicar o markup do medidor).
- Desktop-first com `max-*` (R12).
- Tag semântica correta: `<h1>` único (Titulo do Cabecalho), `RouterLink` para o botão da carteira própria, chips de filtro como `<button type="button">` com estado `aria-pressed`.

## Stubs criados
- src/pages/Carteiras.vue (seções comentadas)
- src/views/carteiras/ (vazia)
- rota `carteiras` em src/routers/index.ts (filha de AppLayout, lazy)

## Status

### Componentes (Batch 0)
- [x] ProfileGauge
- [x] ~~WalletCard~~ removido pós-review, inline em Lista.vue (R6)

### Seções (Batches 1-N)
- [x] Cabecalho
- [x] Lista
- [ ] bun check + bun run build
- [ ] review
