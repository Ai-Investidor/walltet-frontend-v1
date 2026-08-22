# Build Manifest — CriarConta

> Gerado por /build-prep em 2026-08-22 16:17
> Fonte: pencil — node `KID4i` ("Público · Criar conta"), arquivo `docs/template/dashboard.pen`
> Para implementar: `/build-page criar-conta`

## Identificação
- page: criar-conta
- página: src/pages/CriarConta.vue
- seções: src/views/criar-conta/
- rota: /criar-conta (top-level, fora do `AppLayout` — mesmo padrão de `/login` e `/avaliacao-perfil`: tela pública, sem sidebar). `src/views/login/Formulario.vue:97` já linka para `/criar-conta`, confirmando o path esperado.

## Frame raiz
- node-id: `KID4i` — 1180×860, 2 colunas (`Coluna Formulario` `UUSA4` + `Painel Prova` `x9ZdYh`)
- Screenshot: docs/pencil/criar-conta-overview.pdf

## Tokens

### Adicionados
Nenhum. Todo texto do frame bate com token já existente em `src/assets/index.css` (ver tabela abaixo).

### Reusados
- **Cores** — mesmo mapeamento 1:1 já confirmado em manifestos anteriores (mesmo arquivo-fonte `dashboard.pen`): `#faf8f4`→`bg-card`/`bg-background`, `#14181a`→`text-foreground`, `#666b70`→`text-muted-foreground`, `#4a5156`→cor de corpo secundária, `#f2efe8`→`bg-muted`, bordas `#14181a1f`/`38`→`border-border`/`border-border-strong`, segmentos da fita `#14181ae0`/`b3`/`8a`→`bg-data-1`/`bg-data-2`/`bg-data-3`. Nenhuma cor nova.
- **Text-styles** — todos já existem, nenhum novo `@utility` necessário:

| Texto do design | Medido | Token reusado | Confirmado em `index.css` |
|---|---|---|---|
| "Criar conta" (h1) | 24px/800/1.1/-0.01em | `text-page-title-sm` | 1.5rem/800/1.1/-0.01em — exato |
| "CADASTRO" / "O QUE VOCÊ RECEBE" / "ALOCAÇÃO POR CLASSE" / rótulos de campo | 9.6–11.52px/700/uppercase | `text-eyebrow` | 0.6875rem/700/0.05em uppercase — mesma aproximação já aceita em `build-manifest-login.md` |
| Subtítulo do card / "Já tem conta?" | 13.44–14.08px/400/1.55 | `text-table-row` | 0.86rem/400/1.55 |
| "Dica" de senha / Termos / legenda de alocação / "Classe" do ativo | 11.52–12.48px/400 | `text-label` | 0.8125rem/400/1.42 |
| "Entrar" (link rodapé) / "Peso" do ativo | 13.12–13.44px/700 | `text-topbar-meta` | 0.84rem/700/1.3 |
| "Uma carteira revisada..." (headline do painel) | 18.4px/700/1.2 | `text-section-title` | 1.15rem/700/1.2 — exato |
| Nome da carteira / "Mes" | 10.56–14.08px/700 | `text-table-value` / `text-chart-label` | 0.88rem e 0.6875rem, ambos 700 |
| Nome do ativo (Tesouro IPCA+ 2035 etc.) | 13.44px/600 | `text-paragraph-strong` | 0.88rem/600/1.4 |
| Marca "AI" / "AI Invest" | inline, mesmo padrão de `AppLayout.vue`/`Topbar.vue`/`Login/Formulario.vue` | `text-eyebrow` + `text-card-title` | reuso, sem token novo |

## Ícones
Nenhum novo. Único ícone do frame é `shield-check` (Aviso Legal, dentro de `x9ZdYh`), já coberto por `@components/shared/legal-notice` (reusa `PhShieldCheck`), igual ao Login.

## Imagens
Nenhuma. Todos os preenchimentos são cor sólida.

## Componentes do kit reusados
- `@components/ui/form` + `@components/ui/input` + `@components/ui/button` — mesmo padrão de `src/views/login/Formulario.vue`. Altura de campo (42px) e botão (44px) **já resolvidas** pelo Login: reusar exatamente `h-10.5` (input) e `h-11` (button) — decisão já tomada, não reabrir.
- Indicador de força de senha ("Forca", 4 barras) — **não** é `@components/ui/progress` (barra contínua); no design são 4 segmentos discretos (`rectangle` separados). Mesmo padrão inline já usado para a fita de alocação (`<div class="flex h-2.5 ...">` + segmentos) em `PainelProva.vue`/`Composicao.vue`/`Lista.vue`/`painel/Carteira.vue`. Implementar inline com 4 `<span>`/`<div>` e `bg-muted` no estado vazio (mock, sem cálculo real de força — projeto ainda não tem lógica de auth).

## Componentes do projeto reusados
- `@components/shared/legal-notice` (`LegalNotice`) — mesmo texto do Login, agora consumido de dentro do componente compartilhado proposto abaixo (`SocialProofPanel`), não mais direto pela view.

## Componentes compartilhados — specs
> Consumidas pelo Batch 0 do /build-page. status vira "implementado" quando o arquivo é criado.

### SocialProofPanel
- destino: src/components/shared/social-proof-panel/
- arquivos: SocialProofPanel.vue, index.ts
- node_id: "x9ZdYh" (Criar conta) — conteúdo **idêntico** ao node `M94C0n` já implementado em `src/views/login/PainelProva.vue`
- screenshot: docs/pencil/criar-conta-painel-prova.webp
- usos_contados: 2 (cross-página)
- aparições:
  - Login (`src/views/login/PainelProva.vue`, já implementado — mesmo eyebrow "O que você recebe", mesmo título, mesma carteira `moderado`, mesmo `LegalNotice`)
  - CriarConta (`x9ZdYh`, este manifesto)
- **motivo da extração**: Passo 7, regra 6 (soma cross-página) — Login já tinha 1 uso registrado como inline-only (`build-manifest-login.md`); este manifesto soma o 2º uso, e o conteúdo é byte-idêntico (mesma carteira, mesmo texto, mesmo `LegalNotice`), não apenas estruturalmente parecido.
- compound: não — componente de seção autocontido, sem partes expostas (precedente: `LegalNotice`, que também não usa `<slot />` por ser 100% autocontido)
- envolve_primitiva: não
- precisa_cva: não
- props (IMPLEMENTADO — ver desvio abaixo):
  - wallet: RecommendedWallet — **obrigatória** (spec original propunha `walletSlug?: string`; component-builder trocou por objeto tipado para não importar `@data` dentro do componente, respeitando R8/isolamento — ver nota)
  - class: HTMLAttributes['class'] — opcional
- data_slot: social-proof-panel
- slots: nenhum (autocontido — eyebrow, título, card da carteira e `LegalNotice` fixos)
- tokens_usados: text-eyebrow, text-section-title, text-table-value, text-chart-label, text-label, text-paragraph-strong, text-topbar-meta
- depende_de: [LegalNotice]
- exemplo_uso (ATUALIZADO pós-implementação — usar esta versão, não a original): |
  <script setup lang="ts">
  import { SocialProofPanel } from '@components/shared/social-proof-panel'
  import { recommendedWallets } from '@data/wallet'

  const wallet = recommendedWallets.find((item) => item.slug === 'moderado')
  if (!wallet) {
    throw new Error("src/data/wallet.ts: slug 'moderado' não encontrado em recommendedWallets")
  }
  </script>

  <template>
    <SocialProofPanel :wallet="wallet" class="w-2/5 max-w-180 shrink-0 max-md:w-full max-md:max-w-none" />
  </template>
- spec_confidence: media
- spec_source: heuristica_humana — nós não são `reusable: true` no `.pen` (cada tela desenhou o painel separadamente); a extração vem da comparação de conteúdo entre os dois manifestos, não de um component set do Pencil
- responsivo: mesma classe de largura já usada em `Login.vue` (`w-2/5 max-w-180 shrink-0 max-md:w-full`)
- a11y: `aria-labelledby` ligando a `<section>` ao `<h2>` do título via `useId()` (evita colisão de id com 2 consumidores na mesma árvore)
- status: **implementado** — src/components/shared/social-proof-panel/{SocialProofPanel.vue,index.ts}, 122 linhas

**Nota para o Batch 0 / component-builder:** ~~extrair o miolo de `src/views/login/PainelProva.vue`~~ **FEITO.** Markup portado 1:1, byte-idêntico ao Login. `src/views/login/PainelProva.vue` foi migrado logo em seguida (fora do escopo do component-builder, feito pelo orquestrador a pedido do usuário) — ambas as telas agora consomem `SocialProofPanel`. Ver `docs/build-handoff-criar-conta.md`, item M1 (resolvido).

**Dívida técnica declarada pelo component-builder:** "Agosto 2026" continua hardcoded dentro do componente (mesmo comportamento do `PainelProva.vue` original). Prop `periodLabel?: string` fica como possível evolução futura, não necessária agora.

## Estruturas inline-only

### Marca (brand mark)
- usos_contados: 1 (nesta página) — soma 4 no projeto (AppLayout.vue, Topbar.vue, Login/Formulario.vue, esta página)
- inline_na_secao: Formulario
- motivo: "Mesmo padrão já mantido inline em 3 outros arquivos por decisão explícita do manifesto do Login (consistência > extração tardia); seguir o precedente."
- recomendacao: inline-na-secao
- node_id: "wZpNL"
- tokens_usados: text-card-title, text-eyebrow

### Campo de formulário (Rótulo + Campo)
- usos_contados: 3 (Nome completo, E-mail, Senha) — todos dentro da mesma seção
- inline_na_secao: Formulario
- motivo: "R6: repetição dentro da mesma seção. Os 3 campos têm tipos e validação diferentes (text/email/password), e o campo Senha tem elementos extras (indicador de força + dica) que os outros não têm — não é uma estrutura uniforme o bastante para v-for limpo. Login já usa o mesmo padrão (FormField inline, sem v-for) para 2 campos; seguir o precedente."
- recomendacao: inline-na-secao (3x FormField, como em Login)
- node_id: "q3MkKQ" (Nome completo), "trnJy" (E-mail), "FoIn4" (Senha)
- tokens_usados: text-eyebrow, text-table-row, text-label

### Indicador de força de senha (Forca)
- usos_contados: 1
- inline_na_secao: Formulario
- motivo: "Único uso no projeto. Decorativo/mock — sem lógica real de força de senha nesta fase (sem service/store de auth)."
- recomendacao: inline-na-secao
- node_id: "wbi0N"
- screenshot: docs/pencil/criar-conta-formulario.webp
- tokens_usados: text-label (dica), bg-muted (estado vazio)

## Plano de dados

### Dados propostos
Nenhum arquivo novo nem export novo.

```yaml
dados_propostos:
  - arquivo: src/data/wallet.ts
    acao: reusar (nenhuma mudança)
    consumido_por: [SocialProofPanel]
    reuso: |
      Mesmo uso já documentado em build-manifest-login.md:
      recommendedWallets.find(w => w.slug === 'moderado') cobre 100% do
      conteúdo do painel (nome, allocationPreview, composicao). "AGOSTO 2026"
      continua literal (não está no tipo RecommendedWallet).
  - local: src/views/criar-conta/Formulario.vue
    motivo: "estado local do formulário (nome completo, e-mail, senha) via vee-validate + schema zod (R13); mesmo padrão de src/views/login/Formulario.vue. Sem domínio em src/data — projeto ainda não tem service/store de auth."
```

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Formulario | UUSA4 | src/views/criar-conta/Formulario.vue | ui/form, ui/input, ui/button | estado-local | sim | docs/pencil/criar-conta-formulario.webp | webp |
| 2 | PainelProva | x9ZdYh | src/views/criar-conta/PainelProva.vue | SocialProofPanel (novo, Batch 0) | data:wallet (via SocialProofPanel) | não — depende do Batch 0 terminar `SocialProofPanel` primeiro | docs/pencil/criar-conta-painel-prova.webp | webp |

## Plano de execução (Fase 2)
1. Batch 0 serial: `SocialProofPanel` (extrair de `PainelProva.vue` do Login + refatorar o consumidor do Login)
2. Batch paralelo (máx 3): Formulario, PainelProva (CriarConta) — PainelProva só inicia após o Batch 0 concluir

## Critério de aceite por seção
- Fiel ao screenshot da seção
- Zero valor arbitrário em cor, tipografia e espaçamento; dimensão só quando vem do design (R1, R2)
- Campo de input reusa `h-10.5`, botão reusa `h-11` — já validado no Login, não reabrir a decisão
- Componente `SocialProofPanel` com pasta, index.ts, prop `class`, `cn(..., props.class)`, `data-slot` e sem `<slot />` (autocontido, precedente `LegalNotice`) (R5)
- Ícone via `PhShieldCheck` já embutido em `LegalNotice`, sem reimplementar (R10)
- Formulário com `vee-validate` + zod via `@components/ui/form`, `FormLabel`/`FormMessage` associados por `aria-describedby` (R13)
- Desktop-first com `max-*` (R12) — tela compacta (1180×860), sem seções que dependam de scroll
- Tag semântica correta: `<h1>` único ("Criar conta"), `<form>` real, `RouterLink` para "Entrar" (rota `/login`, já existe)

## Stubs criados
- src/pages/CriarConta.vue
- src/views/criar-conta/ (pasta vazia)
- rota `/criar-conta` registrada em src/routers/index.ts

## Status

### Componentes (Batch 0)
- [x] SocialProofPanel (prop `wallet: RecommendedWallet` em vez de `walletSlug` — ver desvio na spec; refatorar `src/views/login/PainelProva.vue` para consumi-lo ficou pendente, fora do escopo desta rodada)

### Seções (Batches 1-N)
- [x] Formulario
- [x] PainelProva
- [x] bun check + bun run build
- [x] review (4 MAJOR corrigidos parcialmente — ver `docs/build-handoff-criar-conta.md`; 1 MAJOR [M1] pendente de decisão do usuário)

## Auditoria

- [x] Tokens de cor novos existem nos três lugares de index.css — N/A, nenhuma cor nova
- [x] Text-styles novos existem em index.css E em TEXT_STYLES de src/libs/utils.ts — N/A, nenhum text-style novo (todos os 9 usados já existem e foram conferidos linha a linha em `index.css`)
- [x] Ícones extraídos — N/A, nenhum ícone novo (reuso de `PhShieldCheck` via `LegalNotice`)
- [x] Imagens baixadas — N/A, nenhuma imagem no design
- [x] Overview capturado (PDF) — docs/pencil/criar-conta-overview.pdf
- [x] Cada seção do inventário tem screenshot — criar-conta-formulario.webp, criar-conta-painel-prova.webp (ambas ≤1000px de altura, WebP)
- [x] Spec de componente compartilhado (`SocialProofPanel`) tem props, data_slot, exemplo_uso e spec_confidence — media
- [x] Nenhum componente com confidence baixa — não se aplica (única spec nova é `media`)
- [x] Kit `ui/` consultado antes de propor componente novo (form, input, button, progress conferidos — `progress` descartado por não bater com o padrão de segmentos discretos do design)
- [x] Cada seção tem fonte de dados declarada (`estado-local` | `data:wallet`)
- [x] Dado estático aponta para `src/data/wallet.ts` já existente — reuso confirmado, nenhuma duplicação
- [x] Stubs criados e rota registrada
