# Build Manifest — AcessoRestrito

> Gerado por /build-prep em 2026-08-24
> Fonte: pencil — node `noL57` ("Sistema · 403 Acesso restrito"), arquivo `docs/template/dashboard.pen`
> Para implementar: `/build-page acesso-restrito`

## Identificação
- page: acesso-restrito
- página: src/pages/AcessoRestrito.vue
- seções: src/views/acesso-restrito/
- rota: `/403` (top-level, fora do `AppLayout` — mesmo padrão de `/login`, `/criar-conta`, `/recuperar-senha`, `/avaliacao-perfil`: tela de sistema, sem sidebar). Nome de rota curto e semântico (`acesso-restrito`), path como código HTTP (`/403`) — confirmado pelo usuário nesta sessão; abre espaço simétrico para um futuro `/404` a partir do node irmão `GpW1g` ("Sistema · 404 Não encontrada"), ainda fora de escopo.

## Frame raiz
- node-id: `noL57` — 1180×860, single-column (`Barra` `f3RGEu` + `Corpo` `UN5G8`)
- Screenshot: docs/pencil/acesso-restrito-overview.pdf

## Tokens

### Adicionados
Nenhum. Todo texto do frame bate com token já existente em `src/assets/index.css` — mesmo catálogo já validado nos manifestos irmãos (`login`, `criar-conta`, `recuperar-senha`, `link-enviado`, `avaliacao-perfil`).

### Reusados

| Texto do design | Medido | Token reusado |
|---|---|---|
| "Acesso restrito" (h1) | 28px/800/1.1/-0.01em | `text-page-title` — match exato (mesmo valor de "Seu perfil é moderado" em `build-manifest-avaliacao-perfil.md`) |
| Mensagem (parágrafo, width 480 fixo) | 14.72px/400/1.6 | `text-paragraph` (15px/400/1.4) — mesma aproximação já documentada em `build-manifest-avaliacao-perfil.md` para o parágrafo de pontuação, **mesmos valores exatos de origem** (14.72/400/1.6) |
| "Sair" (link) | 12.48px/700 | `text-topbar-meta` (13.44px/700/1.3) — reuso literal da mesma peça já implementada em `src/views/avaliacao-perfil/Topbar.vue` (mesmo texto, mesmo papel: ação secundária de topbar) |
| Marca "AI Invest" (símbolo + nome) | 11.52px/800 (símbolo) + 14.08px/800 (nome) | padrão inline já usado 6× no projeto: símbolo `text-eyebrow text-background` sobre `bg-foreground size-6.5 rounded-sm`, nome `text-card-title` (ver `## Componentes/Estruturas inline-only`) |

Cores: mesmo mapeamento 1:1 já confirmado no arquivo-fonte `dashboard.pen`: `$paper`→`--card`/`--background`, `$ink`→`--foreground`, `$ink-soft`→`--muted-foreground`. Nenhuma cor nova.

## Ícones
- **`PhShield`** (`@phosphor-icons/vue`) — ícone de estado no topo da coluna (node `Wg0gC`, design usa lucide `shield`, 28×28, fill `$ink`/`--foreground`). Já usado em `src/views/recuperar-senha/Formulario.vue` — mesmo padrão de resolução, sem extração de SVG. Tamanho: `size-7` (28px).
- **`PhArrowRight`** — ícone do botão primário "Voltar ao painel" (node `n4jCbV`, descendant do ref `s4Behq`, design usa lucide `arrow-right`). Já usado 4× no projeto (`avaliacao-perfil/Resultado.vue`, `carteira/Composicao.vue`, `carteiras/Lista.vue`, `painel/Carteira.vue`) — mesmo padrão `<PhArrowRight class="size-4" aria-hidden="true" />` depois do texto do botão.

Nenhuma extração de SVG necessária nesta página.

## Imagens
Nenhuma. Todos os preenchimentos são cor sólida.

## Componentes do kit reusados
- `@components/ui/button` — dois usos, ambos já com precedente **idêntico** em `src/views/avaliacao-perfil/Resultado.vue`:
  - "Voltar ao painel" → instância do node `s4Behq`/"Botao Primario", `as-child size="lg" class="rounded-sm"` + `RouterLink`, `PhArrowRight` depois do texto (mesmo padrão de "Ir para o painel")
  - "Entrar com outra conta" → instância do node `BKFYq`/"Botao Outline", `variant="outline" size="lg" class="rounded-sm"` (mesmo padrão de "Refazer avaliação")

## Componentes do projeto reusados
Nenhum componente compartilhado (`src/components/<dominio>/`) usado nesta página.

## Componentes compartilhados — specs
**Nenhum.** Batch 0 desta página fica vazio.

## Estruturas inline-only

### Marca (brand mark)
- usos_contados: 1 (nesta página) — soma 7 no projeto (AppLayout.vue, Topbar.vue de `avaliacao-perfil` só tem o nome sem símbolo — não conta nesta família —, Login, CriarConta, RecuperarSenha, LinkEnviado, esta página)
- inline_na_secao: Topbar
- motivo: "Precedente mantido em 5 outros arquivos com o símbolo completo (box + 'AI' + nome); consistência > extração tardia (mesma decisão repetida em todas as telas públicas)."
- recomendacao: inline-na-secao
- node_id: "d0ZjAe"
- tokens_usados: text-eyebrow (símbolo), text-card-title (nome)
- markup de referência (idêntico a `src/views/link-enviado/Formulario.vue:16-21`):
  ```vue
  <div class="flex items-center gap-2.5">
    <div class="bg-foreground flex size-6.5 items-center justify-center rounded-sm">
      <span class="text-eyebrow text-background" aria-hidden="true">AI</span>
    </div>
    <span class="text-card-title">AI Invest</span>
  </div>
  ```

### Barra (topbar da tela — header + Marca + Sair)
- usos_contados: 1 (esta combinação exata) — a estrutura de header (`h-14`, `border-b`, `justify-between`, `px-5`) já existe em `src/views/avaliacao-perfil/Topbar.vue`, mas lá a marca é só texto ("AI Invest" sem o símbolo box). Como o **conteúdo** difere (Marca completa vs texto solto), não é o mesmo componente — não atinge o critério de reuso cross-página (R6), fica inline.
- inline_na_secao: Topbar
- motivo: "Shell de header já tem precedente em `avaliacao-perfil/Topbar.vue`; conteúdo (Marca com símbolo) é o padrão das telas de auth. Combinação nova, 1 uso — mantida inline por R6, tomando emprestadas as duas classes já validadas em vez de inventar novas."
- recomendacao: inline-na-secao
- node_id: "f3RGEu"
- screenshot: docs/pencil/acesso-restrito-topbar.webp
- tokens_usados: text-eyebrow, text-card-title, text-topbar-meta
- classes de shell (copiar de `avaliacao-perfil/Topbar.vue`): `bg-card border-border flex h-14 w-full shrink-0 items-center justify-between gap-3 border-b px-5`

### Mensagem (ícone + título + texto + ações)
- usos_contados: 1
- inline_na_secao: Mensagem
- motivo: "Estrutura específica desta tela de erro/permissão; não repete em nenhuma outra tela do projeto."
- recomendacao: inline-na-secao
- node_id: "oP0Fj"
- screenshot: docs/pencil/acesso-restrito-mensagem.webp
- tokens_usados: text-page-title, text-paragraph
- ícone: PhShield (ver `## Ícones`)
- nota de dimensão: coluna (`oP0Fj`) tem `width: 540` fixo; o texto de apoio (`FEIyl`) tem `width: 480` fixo, mais estreito que a coluna — medida concreta do design, não arredondar para `fill_container` (R1, exceção de dimensão)

## Plano de dados

### Dados propostos
Nenhum arquivo novo nem export novo. Toda a página é conteúdo `literal`.

```yaml
dados_propostos:
  - local: src/views/acesso-restrito/Mensagem.vue
    motivo: "Título, mensagem e rótulos dos botões são literais e fixos, sem variação por usuário/contexto nesta fase mock."
  - local: src/views/acesso-restrito/Topbar.vue
    motivo: "Mesmo padrão da Marca inline — nenhum dado dinâmico."
```

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Topbar | f3RGEu | src/views/acesso-restrito/Topbar.vue | — (inline) | literal | sim | docs/pencil/acesso-restrito-topbar.webp | webp |
| 2 | Mensagem | UN5G8 | src/views/acesso-restrito/Mensagem.vue | ui/button, PhShield, PhArrowRight | literal | sim | docs/pencil/acesso-restrito-mensagem.webp | webp |

## Plano de execução (Fase 2)
1. Batch 0: **vazio** — pular direto pro batch de seções
2. Batch paralelo (máx 3): Topbar, Mensagem

## Critério de aceite por seção
- Fiel ao screenshot da seção
- Zero valor arbitrário em cor, tipografia e espaçamento; dimensão só quando vem do design (R1, R2) — `width: 480` do parágrafo é medida concreta, ok como exceção de dimensão
- Botões reusam `@components/ui/button` — `size="lg" class="rounded-sm"`, `variant="outline"` no segundo — decisão já tomada em `avaliacao-perfil/Resultado.vue`, não reabrir
- Ícone `PhShield` via `size-7`, cor herdada (`text-foreground`, default); `PhArrowRight` `size-4` depois do texto do botão primário (R10)
- Marca inline copiada de `src/views/link-enviado/Formulario.vue`, shell de header copiado de `src/views/avaliacao-perfil/Topbar.vue` — ver `## Estruturas inline-only`
- Desktop-first com `max-*` (R12) — tela compacta (1180×860), sem seções que dependam de scroll
- Tag semântica correta: `<h1>` único ("Acesso restrito"); "Voltar ao painel" como `RouterLink to="/"` (rota do painel já existe); "Entrar com outra conta" como `RouterLink to="/login"` (ação de navegação, não de estado — mock sem lógica de logout real, decisão da Fase 2 se precisar de handler); "Sair" da Topbar como `RouterLink` — decidir destino (`/` ou `/login`) na Fase 2, já que não há store de auth nesta fase (R8)

## Stubs criados
- src/pages/AcessoRestrito.vue
- src/views/acesso-restrito/ (pasta vazia)
- rota `/403` comentada em src/routers/index.ts (ativar no `/build-page`)

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
- [x] Text-styles novos existem em index.css E em TEXT_STYLES — N/A, nenhum text-style novo (todos os usados já existem, conferidos contra `build-manifest-avaliacao-perfil.md`/`build-manifest-link-enviado.md`)
- [x] Ícones extraídos — N/A, `PhShield` e `PhArrowRight` são ícones de catálogo Phosphor já usados no projeto, confirmados por `grep` em `src`
- [x] Imagens baixadas — N/A, nenhuma imagem no design
- [x] Overview capturado (PDF) — docs/pencil/acesso-restrito-overview.pdf
- [x] Cada seção do inventário tem screenshot — acesso-restrito-topbar.webp, acesso-restrito-mensagem.webp (ambas ≤ 860px de altura, WebP)
- [x] Nenhuma spec de componente compartilhado nova — Barra não atinge critério de reuso cross-página (conteúdo difere do precedente em `avaliacao-perfil/Topbar.vue`), fica inline por R6
- [x] Nenhum componente com confidence baixa — não se aplica
- [x] Kit `ui/` consultado — button (default/outline) confirmado reusável do padrão já validado em `avaliacao-perfil/Resultado.vue`
- [x] Cada seção tem fonte de dados declarada (`literal`)
- [x] Nenhum dado estático — não se aplica arquivo em `src/data/`
- [x] Stubs criados e rota registrada (comentada)
