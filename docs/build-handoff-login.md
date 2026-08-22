# Build Handoff — Login

> Página: `login` · Gerado por `/build-page` em 2026-08-22T18:20Z
> Manifesto: `docs/build-manifest-login.md`

## Dados (Passo 1)

| arquivo | tipo | status | nota |
|---|---|---|---|
| `src/data/wallet.ts` | dado estático | pulado (reuso puro) | `recommendedWallets` já continha o slug `moderado` idêntico ao design; nenhum export novo. Camada dinâmica pendente (skill futura). |

## Components (Batch 0)

Nenhum. O manifesto não propôs nenhum componente compartilhado novo (marca, linha de ativo e fita de alocação ficaram inline por decisão do `/build-prep`, documentada no manifesto).

## Sections (Batches 1-N)

| seção | status | assets_faltantes | desvios_do_manifesto | componentes_evolucao_pedida | bloqueios | notas |
|---|---|---|---|---|---|---|
| Formulario | ok | — | Token do botão "Entrar" (`text-table-value`, não mapeado no manifesto); placeholders/inputs em `text-table-row`; gap da marca 10px (paridade com `AppLayout.vue`); raios em `rounded-sm`; alturas `h-10.5`/`h-11` (42px/44px exatos na escala Tailwind — ver nota abaixo) | nenhuma | nenhum | `onSubmit` navega para `painel` sem auth real (mock, comentado no código); "Esqueci minha senha"/"Criar conta" apontam para rotas ainda não registradas (`/recuperar-senha`, `/criar-conta`) |
| PainelProva | ok | — | `text-chart-label` → `text-eyebrow` (tracking/uppercase mais fiéis ao design); `wallet.composicao` cortado de 4 para 3 itens (`slice(0,3)`, comentado — design mostra preview, não a composição completa) | nenhuma | nenhum | Divisores internos usam `border-border-strong` nos 2 estruturais e `border-border` entre linhas de ativo, seguindo precedente de `carteira/Composicao.vue`; padding do painel estimado por proporção do screenshot (ver dúvida abaixo) |

**Nota técnica do subagente da Formulario, repassada ao `/build-prep`:** as alturas 42px/44px do design não precisavam de arredondamento pro kit nem de exceção dimensional (R1) — `h-10.5` e `h-11` já são utilitários exatos na escala numérica do Tailwind v4 (múltiplos de 0.25rem). Vale ajustar o reflexo do `/build-prep` de sempre propor arredondar-ou-arbitrário sem checar a escala primeiro.

**Dúvida em aberto (PainelProva):** padding `px-9 py-10` foi estimado por proporção do screenshot assumindo a coluna do Formulario com 720px. Se a proporção real das colunas mudar, revisar.

## Code review

Rodado após a implementação (`review` agent), escopo: `src/pages/Login.vue`, `src/views/login/*.vue`, `src/assets/index.css`, `src/libs/utils.ts`, `src/routers/index.ts`.

**Veredicto original:** 0 BLOCKERS, 5 MAJOR, 6 MINOR, 4 INFO.

### Corrigidos nesta sessão

| id | achado | correção aplicada |
|---|---|---|
| M1 | `src/pages/Login.vue` sem landmark `<main>` (rota fora do `AppLayout`) | Formulario envolvido em `<main class="flex flex-1 flex-col">`; PainelProva permanece `<section>` irmã |
| M2 | "Esqueci minha senha"/"Criar conta" eram `<button type="button">` sem `@click` (controles mortos) | Trocados por `<RouterLink to="/recuperar-senha">` / `<RouterLink to="/criar-conta">` — rotas ainda não existem, ver pendência P1 abaixo |
| M3 | Shell `flex min-h-screen` sem colapso mobile; painel de 460px fixo espremia o formulário abaixo de 768px | `max-md:flex-col` no shell + `max-md:w-full` no PainelProva |
| M5 | `text-title-lg` tinha CSS de `text-page-title` (menor) mas nome sugeria variante de `text-title` (família tipográfica errada) | Renomeado para `text-page-title-sm` em `index.css`, `TEXT_STYLES` e no único uso (`Formulario.vue`) |
| minor | `PainelProva` usava `aria-label="O que você recebe"` (nomeando pelo eyebrow, não pelo `<h2>` real) | Trocado para `aria-labelledby="painel-prova-titulo"` + `id` no `<h2>`, replicando padrão de `painel/Carteira.vue` |
| minor | `<section>` do Formulario sem nome acessível | `aria-labelledby="login-titulo"` + `id` no `<h1>` |
| minor | Fallback silencioso `?? recommendedWallets[0]` contradizia o comentário "carteira do perfil moderado" | Trocado por `find` + `if (!moderado) throw` — falha alto em vez de trocar de carteira em silêncio (evita `noNonNullAssertion` do Biome) |
| minor | `onSubmit()` sem nota do porquê não faz auth real | Comentário `// Mock: sem auth real nesta fase...` adicionado |
| minor | `gap-1.75` (7px, passo de escala inédito no repo) em 3 lugares | Trocado para `gap-2` (8px) nos 3 |
| — (IDE) | `max-w-[420px]` arbitrário em 2 lugares (Biome/IDE sinalizou canonical class) | Trocado para `max-w-105` (420px exatos na escala numérica) |

### Deixados em aberto (decisão do usuário)

| id | achado | por que não foi resolvido agora |
|---|---|---|
| M4 | `PainelProva.vue` duplica `CARD_SURFACE`/`ALLOCATION_TONE`/formatação de percentual/fita de alocação/linha de ativo já presentes em `views/painel/Carteira.vue`, `views/carteira/Composicao.vue` e `views/carteiras/Lista.vue` (4ª/5ª/6ª cópia do mesmo padrão) | Decisão explícita do usuário: extrair `@components/wallet/allocation-bar` e `@components/wallet/asset-row` é uma mudança arquitetural que mexe em padrão repetido 3x no repo — fica de fora desta sessão, ver backlog P1 |
| minor | Assimetria: `Formulario.vue` não declara `class?: HTMLAttributes['class']` nem usa `cn`, enquanto `PainelProva.vue` faz as duas coisas; `Login.vue` passa `class="flex-1"` pros dois via fallthrough puro do Vue | Funciona hoje (sem conflito de classe); baixo risco, mas requer decidir se `src/views/` deveria seguir a mesma anatomia de `src/components/` — não é regra explícita da R5, então fica pro usuário confirmar o padrão desejado |

## Correção pós-entrega — shell da página (`src/pages/Login.vue`)

Depois do handoff inicial, o usuário reportou 3 rodadas de problema visual no shell (fora do escopo dos `section-builder`s, que entregaram corretamente o conteúdo de cada coluna):

1. **Sintoma:** conteúdo pinado no topo-esquerda com vazio enorme embaixo, painel direito parecendo pequeno demais. **Causa:** `min-h-screen` sem `justify-center` na coluna do formulário + `PainelProva` com largura fixa (460px) que encolhe proporcionalmente em telas largas.
2. **Tentativa 1 (rejeitada):** troquei a largura fixa por proporcional (`w-2/5`) e adicionei `max-w-400 mx-auto`. Resolveu a proporção, mas ainda não era fiel ao node.
3. **Tentativa 2 (rejeitada pelo usuário — "criou um card, diferente do Pencil"):** reinterpretei o frame raiz `smSg6` (que tem borda + sombra + `cornerRadius` no Pencil) como se fosse chrome real da página, e construí um card centralizado com backdrop (`--desk`, token novo, removido depois) sobre um fundo separado. **Erro:** essa leitura não tinha base nos filhos reais do node — `smSg6` só tem 2 filhos (`B3UR1` fill_container, `M94C0n` 460px fixo), e a borda/sombra do frame raiz é a moldura que o Pencil desenha em qualquer artboard de tela cheia só pra ficar legível no canvas, não uma instrução de layout.
4. **Correção final:** revertida para full-bleed puro — `<div class="flex min-h-screen max-md:flex-col">` com `<main class="flex flex-1 flex-col justify-center">` (Formulario) e `<PainelProva class="w-115 shrink-0 max-md:w-full" />` (460px fixo, como o node especifica). Sem card, sem borda, sem sombra, sem backdrop. Validado pixel-a-pixel contra `docs/pencil/login-overview.pdf` num viewport de 1180px (largura exata do frame) — bate 1:1.

**Lição para o `/build-prep`:** quando o frame raiz de uma tela no Pencil tem `stroke`/`effect` (sombra) mas os filhos diretos não referenciam essas propriedades como parte do conteúdo, checar explicitamente se é chrome de apresentação do canvas antes de decidir reproduzir ou descartar — não assumir em nenhuma direção sem essa checagem.

## Intervenções do orquestrador (fora do escopo `.vue` de seções)

- `src/assets/index.css` — 2 `@utility text-*` novos (`text-page-title-sm`, `text-section-title`), conforme manifesto; 1 renomeado (`text-title-lg` → `text-page-title-sm`) durante a correção do review.
- `src/libs/utils.ts` — `TEXT_STYLES` atualizado nos mesmos 2 pontos.
- `src/routers/index.ts` — rota `/login` registrada (lazy, top-level, fora do `AppLayout`), já feita no `/build-prep`.
- `src/pages/Login.vue` — composição do shell (flex row + `<main>` + breakpoint mobile) escrita pelo orquestrador, não por subagente — é o "shell de página" que a R7 atribui à página/layout, não às seções.

## Análise e sugestões de correção

### Causas raiz

- **Token sem mapeamento prévio** (M5, botão "Entrar" sem mapeamento no manifesto): o `/build-prep` não conferiu a instância `zehZt` (Botao Entrar) contra o componente-fonte `s4Behq` no Pencil antes de deixar a spec em aberto — o subagente da seção teve que investigar e resolveu corretamente, mas o manifesto deveria ter chegado com essa resposta pronta.
- **Rotas de auth inexistentes** (M2): design de Login referencia fluxos (recuperar senha, criar conta) que não têm página/rota no projeto ainda — natural para uma primeira página de auth, mas cria 2 `RouterLink` "pendentes".
- **Duplicação de padrão de carteira** (M4): terceira vez que o par barra-de-alocação + linha-de-ativo é copiado sem extração (já em `Carteira.vue`, `Composicao.vue`, `Lista.vue`, agora `PainelProva.vue`) — R6 pede extração no 2º uso real, e o repo já passou desse ponto há 2 páginas.

### Backlog priorizado

- **P0** — nenhum. Build e check limpos, 0 blockers, todos os majors corrigidos ou documentados com decisão explícita do usuário.
- **P1** — Criar as páginas/rotas `/recuperar-senha` e `/criar-conta` (ou apontar os `RouterLink` para os destinos reais quando definidos) — decisão de produto, não técnica.
- **P1** — Avaliar extração de `@components/wallet/allocation-bar` e `@components/wallet/asset-row` a partir das 4 ocorrências agora existentes (`Carteira.vue`, `Composicao.vue`, `Lista.vue`, `PainelProva.vue`) — decisão arquitetural, ver M4.
- **P2** — Padronizar se `src/views/` deve declarar `class?: HTMLAttributes['class']` + `cn()` como `src/components/`, ou se fallthrough puro do Vue é aceitável nas seções — decisão de convenção (candidata a virar regra explícita em `RULES.md` se confirmada).
- **P2** — Trocar `src/data/wallet.ts` por camada dinâmica quando a skill de service/store existir (vale para todas as páginas, não só Login).

### Separação humano vs. técnico

- **Decide o humano:** destino real de "Esqueci minha senha"/"Criar conta" (P1), se vale extrair os componentes de carteira agora ou esperar mais um consumidor (P1), copy/wording do formulário (já está fiel ao design), quando ligar auth real.
- **É técnico/mecânico quando decidido:** criar os componentes `allocation-bar`/`asset-row` (via `component-builder`, com specs derivadas dos 4 usos existentes), registrar novas rotas em `src/routers/index.ts`.

## PROMPT COPIÁVEL

```
Contexto: página Login (src/pages/Login.vue, src/views/login/Formulario.vue,
src/views/login/PainelProva.vue) já implementada e com bun check + bun run build
limpos. Pendências do handoff docs/build-handoff-login.md:

1. Rotas de auth ainda não existem: src/views/login/Formulario.vue tem
   <RouterLink to="/recuperar-senha"> e <RouterLink to="/criar-conta">
   apontando pra rotas não registradas em src/routers/index.ts. Criar as
   páginas (ou me dizer o destino real) e registrar as rotas.

2. Extrair @components/wallet/allocation-bar e @components/wallet/asset-row:
   o par "barra de alocação segmentada + linha de ativo com chip de iniciais"
   está duplicado em src/views/painel/Carteira.vue, src/views/carteira/Composicao.vue,
   src/views/carteiras/Lista.vue e agora src/views/login/PainelProva.vue (4 cópias).
   Extrair como componentes compartilhados em src/components/wallet/, com specs
   derivadas dos 4 usos existentes, e depois retrofitar os 4 consumidores.

3. (opcional) Revisar se src/views/ deve seguir a mesma anatomia de
   src/components/ (prop class + cn()) — hoje Formulario.vue não segue e
   PainelProva.vue segue; padronizar um dos dois.
```
