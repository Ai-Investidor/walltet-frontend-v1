# Build Manifest — RecuperarSenha

> Gerado por /build-prep em 2026-08-22 16:48
> Fonte: pencil — node `gFIHR` ("Público · Recuperar senha"), arquivo `docs/template/dashboard.pen`
> Para implementar: `/build-page recuperar-senha`

## Identificação
- page: recuperar-senha
- página: src/pages/RecuperarSenha.vue
- seções: src/views/recuperar-senha/
- rota: /recuperar-senha (top-level, fora do `AppLayout` — mesmo padrão de `/login` e `/criar-conta`: tela pública, sem sidebar). `src/views/login/Formulario.vue:94` já linka para `/recuperar-senha`, confirmando o path esperado.

## Frame raiz
- node-id: `gFIHR` — 1180×860, 2 colunas (`Coluna Formulario` `X9Tvj` + `Painel Prova` `aITon`)
- Screenshot: docs/pencil/recuperar-senha-overview.pdf

## ⚠️ Lições de builds anteriores (ler antes de implementar)

Este manifesto carrega 3 correções aprendidas nas duas páginas irmãs (`login`, `criar-conta`). Ver `.claude/learn/`:

1. **[[landmark-wrapper-breaks-flex-width]]** — `PainelProva` (e o `SocialProofPanel` que ela envolve) é o **item flex direto** do container `<div class="flex ...">` da página. **NUNCA envolver `<PainelProva />` num `<aside>` ou outro wrapper novo** — o `<section :aria-labelledby>` dentro de `SocialProofPanel` já é um landmark nomeado por si só (HTML/ARIA: `section` com nome acessível = "region"). Compor a página exatamente como `CriarConta.vue`/`Login.vue` fazem hoje: `<PainelProva />` direto, sem wrapper.
2. **[[fixed-width-panel-fullbleed]]** — não usar largura fixa em px pro painel. **Correção pós-implementação (o texto original aqui estava errado):** a classe de largura (`w-2/5 max-w-180 shrink-0 max-md:w-full max-md:max-w-none`) NÃO está dentro de `SocialProofPanel` — o componente shared não tem nenhuma classe de `w-`/`shrink-`. Quem aplica a largura é o wrapper fino de cada página (`views/{page}/PainelProva.vue`), via `cn('w-2/5 max-w-180 shrink-0 max-md:w-full max-md:max-w-none', props.class)` no próprio `<SocialProofPanel>`. **Todo wrapper novo precisa repetir essa classe** — sem ela, o painel some sem largura definida e vira flex-item solto (mesmo sintoma da lição 1, causa diferente). Ver `src/views/login/PainelProva.vue` ou `src/views/criar-conta/PainelProva.vue` como referência exata.
3. **[[duplicate-component-extraction]]** — `SocialProofPanel` **já existe e já está implementado** (`src/components/shared/social-proof-panel/`), com 2 consumidores reais (Login, CriarConta). Esta é a 3ª tela com conteúdo **byte-idêntico** no painel direito (mesma carteira `moderado`, mesmo eyebrow, mesmo título, mesmo `LegalNotice`). **NÃO recriar nada — reusar direto.** Batch 0 desta página deve ficar **vazio** (nenhuma spec nova).

## Tokens

### Adicionados
Nenhum. Todo texto do frame bate com token já existente em `src/assets/index.css` — mesmo catálogo já validado em `build-manifest-login.md` e `build-manifest-criar-conta.md`.

### Reusados

| Texto do design | Medido | Token reusado |
|---|---|---|
| "Recuperar senha" (h1) | 24px/800/1.1/-0.01em | `text-page-title-sm` (exato) |
| "ACESSO" / "E-MAIL" | 9.92–11.52px/700/uppercase | `text-eyebrow` |
| Subtítulo do card | 14.08px/400/1.55 | `text-table-row` |
| Nota de segurança | 12.8px/400/1.5 | `text-label` (mesma faixa 12–13px/400 já usada em Login/CriarConta) |
| "Voltar para entrar" | 13.44px/700, sem letter-spacing | `text-topbar-meta` (exato) |
| Rodapé "AI Invest · ..." | 12.48px/400 | `text-label` |
| Marca "AI Invest" | inline, mesmo padrão de sempre | `text-eyebrow` + `text-card-title` |
| Painel Prova (eyebrow, título, carteira, ativos) | — | mesmos tokens já documentados em `build-manifest-criar-conta.md` — conteúdo dentro de `SocialProofPanel`, não desta página |

Cores: mesmo mapeamento 1:1 já confirmado 2x (`#faf8f4`→`bg-card`, `#14181a`→`text-foreground`, `#666b70`→`text-muted-foreground`, `#f2efe8`→`bg-muted`, bordas `#14181a1f`/`38`→`border-border`/`border-border-strong`). Nenhuma cor nova.

## Ícones
- **`PhShield`** (`@phosphor-icons/vue`) — ícone da "Nota Seguranca" (node `GfcVI`, design usa lucide `shield`). **Confirmado existente no pacote** (`node_modules/@phosphor-icons/vue/dist/icons/PhShield.vue.mjs`) — importar direto, sem extração de SVG (não é ícone de marca/ilustração, é catálogo Phosphor de primeira classe, mesmo caso já resolvido pra `shield-check`→`PhShieldCheck` em `LegalNotice`).
- `shield-check` (dentro de `SocialProofPanel` via `LegalNotice`) — já resolvido, reuso.

Nenhuma extração de SVG necessária nesta página.

## Imagens
Nenhuma. Todos os preenchimentos são cor sólida.

## Componentes do kit reusados
- `@components/ui/form` + `@components/ui/input` + `@components/ui/button` — mesmo padrão de Login/CriarConta. Reusar exatamente `h-10.5` (input) e `h-11` (button) — decisão já tomada 2x, não reabrir.

## Componentes do projeto reusados
- **`@components/shared/social-proof-panel` (`SocialProofPanel`)** — já implementado. Consumo idêntico ao de `src/views/criar-conta/PainelProva.vue`:
  ```vue
  <script setup lang="ts">
  import type { HTMLAttributes } from 'vue'
  import { SocialProofPanel } from '@components/shared/social-proof-panel'
  import { recommendedWallets } from '@data/wallet'
  import { cn } from '@/libs/utils'

  const props = defineProps<{
    class?: HTMLAttributes['class']
  }>()

  const wallet = recommendedWallets.find((item) => item.slug === 'moderado')
  if (!wallet) {
    throw new Error("src/data/wallet.ts: slug 'moderado' não encontrado em recommendedWallets")
  }
  </script>

  <template>
    <SocialProofPanel
      :wallet="wallet"
      :class="cn('w-2/5 max-w-180 shrink-0 max-md:w-full max-md:max-w-none', props.class)"
    />
  </template>
  ```
  **Correção pós-implementação:** o parágrafo original deste manifesto dizia que a largura já vinha como default de dentro do `SocialProofPanel` — errado, o componente shared não tem `w-`/`shrink-` nenhum. A largura mora no `cn(...)` do próprio wrapper (`views/{page}/PainelProva.vue`), repetida em cada página que o consome. Import de `cn` de `@/libs/utils` é obrigatório aqui.

## Componentes compartilhados — specs
**Nenhum.** Batch 0 desta página fica vazio — `SocialProofPanel` já está `implementado` (ver `build-manifest-criar-conta.md`).

## Estruturas inline-only

### Marca (brand mark)
- usos_contados: 1 (nesta página) — soma 5 no projeto (AppLayout.vue, Topbar.vue, Login, CriarConta, esta página)
- inline_na_secao: Formulario
- motivo: "Precedente mantido em 4 outros arquivos; consistência > extração tardia (mesma decisão de Login e CriarConta)."
- recomendacao: inline-na-secao
- node_id: "O0mTe"
- tokens_usados: text-card-title, text-eyebrow

### Nota Seguranca (ícone + texto em box)
- usos_contados: 1
- inline_na_secao: Formulario
- motivo: "Único uso no projeto. Estrutura simples (ícone + parágrafo em box com fundo muted), não repete em nenhuma outra tela."
- recomendacao: inline-na-secao
- node_id: "zt8ze"
- screenshot: docs/pencil/recuperar-senha-formulario.webp
- tokens_usados: text-label, bg-muted, border-border-strong
- ícone: PhShield (ver `## Ícones`)

## Plano de dados

### Dados propostos
Nenhum arquivo novo nem export novo.

```yaml
dados_propostos:
  - arquivo: src/data/wallet.ts
    acao: reusar (nenhuma mudança)
    consumido_por: [SocialProofPanel, via PainelProva.vue desta página]
    reuso: "Mesmo uso documentado em build-manifest-criar-conta.md — recommendedWallets.find(slug === 'moderado')."
  - local: src/views/recuperar-senha/Formulario.vue
    motivo: "estado local do formulário (e-mail) via vee-validate + schema zod (R13); mesmo padrão de Login/CriarConta Formulario.vue."
```

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Formulario | X9Tvj | src/views/recuperar-senha/Formulario.vue | ui/form, ui/input, ui/button, PhShield | estado-local | sim | docs/pencil/recuperar-senha-formulario.webp | webp |
| 2 | PainelProva | aITon | src/views/recuperar-senha/PainelProva.vue | SocialProofPanel (já implementado) | data:wallet (via SocialProofPanel) | sim — Batch 0 vazio, nada bloqueia | docs/pencil/recuperar-senha-painel-prova.webp | webp |

## Plano de execução (Fase 2)
1. Batch 0: **vazio** — pular direto pro batch de seções
2. Batch paralelo (máx 3): Formulario, PainelProva

## Critério de aceite por seção
- Fiel ao screenshot da seção
- Zero valor arbitrário em cor, tipografia e espaçamento; dimensão só quando vem do design (R1, R2)
- Campo de input reusa `h-10.5`, botão reusa `h-11` — decisão já tomada 2x, não reabrir
- `PainelProva.vue` desta página é um wrapper fino (~15-20 linhas): resolve `wallet` + `<SocialProofPanel :wallet="wallet" />`, **sem** wrapper de landmark extra e **sem** repassar classe de largura (ver lições no topo)
- Ícone via `PhShield` direto do pacote, `aria-hidden="true"` (decorativo dentro da nota, o texto já carrega a informação) (R10)
- Formulário com `vee-validate` + zod via `@components/ui/form` — só campo `email` (obrigatório + formato) (R13)
- Desktop-first com `max-*` (R12) — tela compacta (1180×860), sem seções que dependam de scroll
- Tag semântica correta: `<h1>` único ("Recuperar senha"), `<form>` real, `RouterLink` para "Voltar para entrar" apontando pra `/login` (rota já existe)
- **Submit mock:** este design não inclui a tela de confirmação ("Público · Link enviado", node `QuuqQ`, **fora do escopo deste build** — não foi pedido). Até essa tela existir, o `onSubmit` mock deve só simular sucesso sem navegar para uma rota inexistente — usar um `ref` local de estado `enviado` (boolean) e trocar o conteúdo do card por uma mensagem de confirmação inline (mesmo texto de tom que "Enviamos um link..."), em vez de `router.push` para uma rota que não existe. Se o usuário quiser a tela "Link enviado" de verdade, isso é um `/build-prep` separado com o node `QuuqQ`.

## Stubs criados
- src/pages/RecuperarSenha.vue
- src/views/recuperar-senha/ (pasta vazia)
- rota `/recuperar-senha` registrada em src/routers/index.ts

## Status

### Componentes (Batch 0)
Nenhum — `SocialProofPanel` já implementado, reuso direto.

### Seções (Batches 1-N)
- [x] Formulario
- [x] PainelProva (corrigido pelo orquestrador — largura do painel estava faltando, ver "Lições" acima)
- [x] bun check + bun run build
- [x] review (0 blockers, 2 major — 1 corrigido, 1 registrado como backlog cross-página; 3 minor — 2 corrigidos, 1 deixado consistente com Login/CriarConta)

## Auditoria

- [x] Tokens de cor novos existem nos três lugares de index.css — N/A, nenhuma cor nova
- [x] Text-styles novos existem em index.css E em TEXT_STYLES — N/A, nenhum text-style novo (todos os 6 usados já existem, conferidos contra `build-manifest-criar-conta.md`)
- [x] Ícones extraídos — N/A, `PhShield` é ícone de catálogo Phosphor já no pacote instalado, confirmado por `find` em `node_modules`; `shield-check` já resolvido via `LegalNotice`
- [x] Imagens baixadas — N/A, nenhuma imagem no design
- [x] Overview capturado (PDF) — docs/pencil/recuperar-senha-overview.pdf
- [x] Cada seção do inventário tem screenshot — recuperar-senha-formulario.webp, recuperar-senha-painel-prova.webp (ambas ≤1000px de altura, WebP)
- [x] Nenhuma spec de componente compartilhado nova — não se aplica, Batch 0 vazio
- [x] Nenhum componente com confidence baixa — não se aplica
- [x] Kit `ui/` consultado — form, input, button confirmados reusáveis do padrão já validado
- [x] Cada seção tem fonte de dados declarada (`estado-local` | `data:wallet`)
- [x] Dado estático aponta para `src/data/wallet.ts` já existente — reuso confirmado, nenhuma duplicação
- [x] Stubs criados e rota registrada
