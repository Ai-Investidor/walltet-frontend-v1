# Build Manifest — NaoEncontrada

> Gerado por /build-prep em 2026-08-24
> Fonte: pencil — node `GpW1g` ("Sistema · 404 Não encontrada"), arquivo `docs/template/dashboard.pen`
> Para implementar: `/build-page nao-encontrada`

## Identificação
- page: nao-encontrada
- página: src/pages/NaoEncontrada.vue
- seções: src/views/nao-encontrada/
- rota: `/404` (top-level, fora do `AppLayout` — mesmo padrão de `/403` `acesso-restrito`, confirmado pelo usuário nesta sessão; é o par simétrico já previsto em `build-manifest-acesso-restrito.md`)

## Frame raiz
- node-id: `GpW1g` — 1180×860, single-column (`Barra` `KSjgG` + `Corpo` `xUMlk`)
- Screenshot: docs/pencil/nao-encontrada-overview.pdf

## Tokens

### Adicionados
Nenhum. Estrutura e valores tipográficos idênticos aos já validados em `build-manifest-acesso-restrito.md`.

### Reusados

| Texto do design | Medido | Token reusado |
|---|---|---|
| "Página não encontrada" (h1) | 28px/800/1.1/-0.01em | `text-page-title` — match exato |
| Texto de apoio (parágrafo, width 480 fixo) | 14.72px/400/1.6 | `text-paragraph` (15px/400/1.4) — mesma aproximação já documentada em `build-manifest-acesso-restrito.md` e `build-manifest-avaliacao-perfil.md`, mesmos valores exatos de origem |
| "Sair" (link) | 12.48px/700 | `text-topbar-meta` (13.44px/700/1.3) — reuso literal, mesmo papel de ação secundária de topbar |
| Marca "AI Invest" (símbolo + nome) | 11.52px/800 (símbolo) + 14.08px/800 (nome) | padrão inline já usado 7× no projeto: símbolo `text-eyebrow text-background` sobre `bg-foreground size-6.5 rounded-sm`, nome `text-card-title` |

Cores: mesmo mapeamento 1:1 do arquivo-fonte `dashboard.pen`: `$paper`→`--card`/`--background`, `$ink`→`--foreground`, `$ink-soft`→`--muted-foreground`, `$line`/`$line-strong`→`--border`. Nenhuma cor nova.

## Ícones
- **`PhTray`** (`@phosphor-icons/vue`) — ícone de estado no topo da coluna (node `NcCwn`, design usa lucide `inbox`, 28×28, fill `$ink`/`--foreground`). Lucide não tem correspondência 1:1 de nome no catálogo Phosphor; `PhTray` é o equivalente visual mais próximo (bandeja/caixa de entrada), confirmado disponível em `node_modules/@phosphor-icons/vue`. Tamanho: `size-7` (28px).
- **`PhArrowRight`** — ícone do botão primário "Ir para o painel" (node `n4jCbV`, descendant do ref `s4Behq`, design usa lucide `arrow-right`). Já usado 5× no projeto (inclusive `acesso-restrito/Mensagem.vue`) — mesmo padrão `<PhArrowRight class="size-4" aria-hidden="true" />` depois do texto do botão.

Nenhuma extração de SVG necessária nesta página — ambos são ícones de catálogo Phosphor.

## Imagens
Nenhuma. Todos os preenchimentos são cor sólida.

## Componentes do kit reusados
- `@components/ui/button` — dois usos, mesmo precedente de `acesso-restrito/Mensagem.vue`:
  - "Ir para o painel" → instância do node `s4Behq`/"Botao Primario", `as-child size="lg" class="rounded-sm"` + `RouterLink`, `PhArrowRight` depois do texto
  - "Entrar com outra conta" → instância do node `BKFYq`/"Botao Outline", `variant="outline" size="lg" class="rounded-sm"`

## Componentes do projeto reusados
Nenhum componente compartilhado (`src/components/<dominio>/`) usado nesta página.

## Componentes compartilhados — specs
**Nenhum.** Batch 0 desta página fica vazio.

## Estruturas inline-only

### Marca (brand mark)
- usos_contados: 1 (nesta página) — soma 8 no projeto contando `AcessoRestrito.vue`
- inline_na_secao: Topbar
- motivo: "Precedente mantido em todas as telas públicas/sistema com o símbolo completo (box + 'AI' + nome); consistência > extração tardia (mesma decisão repetida em `acesso-restrito`)."
- recomendacao: inline-na-secao
- node_id: "qp8mY"
- tokens_usados: text-eyebrow (símbolo), text-card-title (nome)
- markup de referência (idêntico a `src/views/acesso-restrito/Topbar.vue`):
  ```vue
  <div class="flex items-center gap-2.5">
    <div class="bg-foreground flex size-6.5 items-center justify-center rounded-sm">
      <span class="text-eyebrow text-background" aria-hidden="true">AI</span>
    </div>
    <span class="text-card-title">AI Invest</span>
  </div>
  ```

### Barra (topbar da tela — header + Marca + Sair)
- usos_contados: 1 (esta combinação exata, estrutura idêntica ao shell já usado em `acesso-restrito/Topbar.vue`)
- inline_na_secao: Topbar
- motivo: "Mesma estrutura de `acesso-restrito/Topbar.vue` (header h-14, border-b, justify-between, marca completa, link 'Sair'). Copiar diretamente desse arquivo em vez de reabrir a decisão de extração — ainda não atinge 2 usos com conteúdo idêntico em contextos suficientemente distintos para virar componente compartilhado (R6)."
- recomendacao: inline-na-secao
- node_id: "KSjgG"
- screenshot: docs/pencil/nao-encontrada-topbar.webp
- tokens_usados: text-eyebrow, text-card-title, text-topbar-meta
- classes de shell (copiar de `acesso-restrito/Topbar.vue`): `bg-card border-border flex h-14 w-full shrink-0 items-center justify-between gap-3 border-b px-5`

### Mensagem (ícone + título + texto + ações)
- usos_contados: 1
- inline_na_secao: Mensagem
- motivo: "Estrutura específica desta tela de erro; mesmo esqueleto de `acesso-restrito/Mensagem.vue` (ícone + h1 + parágrafo + duas ações), mas conteúdo e ícone diferentes — não soma como reuso cross-página de componente (R6), fica inline copiando o padrão estrutural."
- recomendacao: inline-na-secao
- node_id: "xUMlk"
- screenshot: docs/pencil/nao-encontrada-mensagem.webp
- tokens_usados: text-page-title, text-paragraph
- ícone: PhTray (ver `## Ícones`)
- nota de dimensão: coluna (`VvwTp`) tem `width: 540` fixo; o texto de apoio (`UmVqk`) tem `width: 480` fixo, mais estreito que a coluna — medida concreta do design, não arredondar para `fill_container` (R1, exceção de dimensão)

## Plano de dados

### Dados propostos
Nenhum arquivo novo nem export novo. Toda a página é conteúdo `literal`.

```yaml
dados_propostos:
  - local: src/views/nao-encontrada/Mensagem.vue
    motivo: "Título, texto de apoio e rótulos dos botões são literais e fixos, sem variação por usuário/contexto nesta fase mock."
  - local: src/views/nao-encontrada/Topbar.vue
    motivo: "Mesmo padrão da Marca inline — nenhum dado dinâmico."
```

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Topbar | KSjgG | src/views/nao-encontrada/Topbar.vue | — (inline) | literal | sim | docs/pencil/nao-encontrada-topbar.webp | webp |
| 2 | Mensagem | xUMlk | src/views/nao-encontrada/Mensagem.vue | ui/button, PhTray, PhArrowRight | literal | sim | docs/pencil/nao-encontrada-mensagem.webp | webp |

## Plano de execução (Fase 2)
1. Batch 0: **vazio** — pular direto pro batch de seções
2. Batch paralelo (máx 3): Topbar, Mensagem

## Critério de aceite por seção
- Fiel ao screenshot da seção
- Zero valor arbitrário em cor, tipografia e espaçamento; dimensão só quando vem do design (R1, R2) — `width: 480` do parágrafo é medida concreta, ok como exceção de dimensão
- Botões reusam `@components/ui/button` — `size="lg" class="rounded-sm"`, `variant="outline"` no segundo — decisão já tomada em `avaliacao-perfil/Resultado.vue` e repetida em `acesso-restrito/Mensagem.vue`, não reabrir
- Ícone `PhTray` via `size-7`, cor herdada (`text-foreground`, default); `PhArrowRight` `size-4` depois do texto do botão primário (R10)
- Marca e shell de header copiados de `src/views/acesso-restrito/Topbar.vue` — ver `## Estruturas inline-only`
- Desktop-first com `max-*` (R12) — tela compacta (1180×860), sem seções que dependam de scroll
- Tag semântica correta: `<h1>` único ("Página não encontrada"); "Ir para o painel" como `RouterLink to="/"`; "Entrar com outra conta" como `RouterLink to="/login"`; "Sair" da Topbar como `RouterLink` — decidir destino (`/` ou `/login`) na Fase 2, já que não há store de auth nesta fase (R8) — mesma decisão pendente já registrada em `build-manifest-acesso-restrito.md`

## Stubs criados
- src/pages/NaoEncontrada.vue
- src/views/nao-encontrada/ (pasta vazia)
- rota `/404` comentada em src/routers/index.ts (ativar no `/build-page`)

## Status

### Componentes (Batch 0)
Nenhum.

### Seções (Batches 1-N)
- [x] Topbar
- [x] Mensagem
- [x] bun check + bun run build
- [x] review

## Auditoria

- [x] Tokens de cor novos existem nos três lugares de index.css — N/A, nenhuma cor nova
- [x] Text-styles novos existem em index.css E em TEXT_STYLES — N/A, nenhum text-style novo (confirmados via grep: `text-page-title`, `text-paragraph`, `text-topbar-meta`, `text-eyebrow`, `text-card-title` já em `src/assets/index.css` e em `TEXT_STYLES` de `src/libs/utils.ts`)
- [x] Ícones extraídos — N/A, `PhTray` e `PhArrowRight` são ícones de catálogo Phosphor, confirmados via `find node_modules/@phosphor-icons`
- [x] Imagens baixadas — N/A, nenhuma imagem no design
- [x] Overview capturado (PDF) — docs/pencil/nao-encontrada-overview.pdf
- [x] Cada seção do inventário tem screenshot — nao-encontrada-topbar.webp, nao-encontrada-mensagem.webp (ambas ≤ 860px de altura, WebP)
- [x] Nenhuma spec de componente compartilhado nova — Barra e Mensagem não atingem critério de reuso cross-página (conteúdo difere do precedente em `acesso-restrito`), ficam inline por R6
- [x] Nenhum componente com confidence baixa — não se aplica
- [x] Kit `ui/` consultado — button (default/outline) confirmado reusável do padrão já validado em `acesso-restrito/Mensagem.vue`
- [x] Cada seção tem fonte de dados declarada (`literal`)
- [x] Nenhum dado estático — não se aplica arquivo em `src/data/`
- [x] Stubs criados e rota registrada (comentada)
