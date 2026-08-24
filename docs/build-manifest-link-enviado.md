# Build Manifest — LinkEnviado

> Gerado por /build-prep em 2026-08-22 17:20
> Fonte: pencil — node `QuuqQ` ("Público · Link enviado"), arquivo `docs/template/dashboard.pen`
> Para implementar: `/build-page link-enviado`

## Identificação
- page: link-enviado
- página: src/pages/LinkEnviado.vue
- seções: src/views/link-enviado/
- rota: `/recuperar-senha/link-enviado` (top-level, fora do `AppLayout` — mesmo padrão de `/recuperar-senha`, `/login` e `/criar-conta`: tela pública, sem sidebar). Nomeada e confirmada pelo usuário nesta sessão.

## Frame raiz
- node-id: `QuuqQ` — 1180×860, 2 colunas (`Coluna Formulario` `YEMx3` + `Painel Prova` `WmaCg`)
- Screenshot: docs/pencil/link-enviado-overview.pdf

## ⚠️ Contexto — esta tela é a continuação direta de `build-manifest-recuperar-senha.md`

O manifesto de `recuperar-senha` já previa esta tela e a deixou fora de escopo explicitamente:

> "**Submit mock:** este design não inclui a tela de confirmação ('Público · Link enviado', node `QuuqQ`, **fora do escopo deste build**...). Até essa tela existir, o `onSubmit` mock deve só simular sucesso sem navegar... Se o usuário quiser a tela 'Link enviado' de verdade, isso é um `/build-prep` separado com o node `QuuqQ`."

Agora que este manifesto existe, o `/build-page link-enviado` (ou um ajuste pontual em `RecuperarSenha`) deve decidir se `src/views/recuperar-senha/Formulario.vue` troca o `ref` local `enviado` por `router.push('/recuperar-senha/link-enviado')` no `onSubmit`. **Essa decisão é da Fase 2, não deste build-prep** — só registrando o gancho aqui para não se perder.

## Tokens

### Adicionados
Nenhum. Todo texto do frame bate com token já existente em `src/assets/index.css` — mesmo catálogo já validado nos manifestos irmãos (`login`, `criar-conta`, `recuperar-senha`).

### Reusados

| Texto do design | Medido | Token reusado |
|---|---|---|
| "Link enviado" (h1) | 24px/800/1.1/-0.01em | `text-page-title-sm` (exato — mesmo valor de "Recuperar senha" em `build-manifest-recuperar-senha.md`) |
| Mensagem de confirmação (parágrafo) | 14.08px/400/1.55 | `text-table-row` (exato — mesmo valor já usado para o subtítulo do card em `recuperar-senha`) |
| "Enviar de novo" (link) | 13.44px/400/1.55 | `text-table-row` (aproximado — mesmo peso/line-height; 0,32px de diferença de tamanho, dentro da tolerância já aceita nos manifestos irmãos, ex.: rodapé 12.48px→`text-label` 13px) |
| "Voltar para entrar" (label do botão) | 14.4px/700 | `text-button-sm` do próprio `@components/ui/button` — não é texto solto, é label de instância de botão primário (ver `## Componentes do kit reusados`) |
| Marca "AI Invest" | inline, mesmo padrão de sempre | `text-eyebrow`-like (símbolo 11.52px/800) + `text-card-title`-like (nome 15.68px/800) — mesmos valores já usados 5x no projeto |
| Rodapé "AI Invest · carteiras..." | 12.48px/400 | `text-label` (mesmo mapeamento de `recuperar-senha`) |
| Painel Prova (eyebrow, título, carteira, ativos, aviso legal) | — | mesmos tokens já documentados em `build-manifest-criar-conta.md` — conteúdo dentro de `SocialProofPanel`, não desta página |

Cores: mesmo mapeamento 1:1 já confirmado no arquivo-fonte `dashboard.pen` (ver `build-manifest-login.md`): `$paper`→`--card`/`--background`, `$paper-2`→`--muted`, `$ink`→`--foreground`, `$ink-soft`→`--muted-foreground`, `$ink-faint`→`--muted-foreground-faint`, `$line`→`--border`, `$line-strong`→`--border-strong`. `$green` (`#1f7a4d` / `#57b184` dark) mapeia para `--success` no ícone de confirmação (estado de sucesso) e `--primary` no link "Enviar de novo" (ação interativa) — os dois tokens têm o **mesmo valor oklch** em `:root`/`.dark`, só a semântica de uso muda. Nenhuma cor nova.

## Ícones
- **`PhCheckCircle`** (`@phosphor-icons/vue`) — ícone de confirmação no topo do card (node `oaKgJ`, design usa lucide `circle-check`, 26×26, fill `$green`/`--success`). Confirmado existente no pacote (`node_modules/@phosphor-icons/vue/dist/icons/PhCheckCircle.vue.mjs`) — importar direto, sem extração de SVG. Mesmo padrão de resolução já usado para `PhShield` em `recuperar-senha`.
- `shield-check` (dentro de `SocialProofPanel` via `LegalNotice`, node `yU6sP`) — já resolvido, reuso, nenhuma ação.

Nenhuma extração de SVG necessária nesta página.

## Imagens
Nenhuma. Todos os preenchimentos são cor sólida.

## Componentes do kit reusados
- `@components/ui/button` — "Voltar para entrar" é uma instância de botão primário (`ref` do node `s4Behq`/"Botao Primario" no Pencil), `width: fill_container`, `height: 44` → `variant="default"`, classe full-width, `h-11` (decisão de altura já tomada 2x em Login/CriarConta/RecuperarSenha, não reabrir).

## Componentes do projeto reusados
- **`@components/shared/social-proof-panel` (`SocialProofPanel`)** — já implementado. Conteúdo do node `WmaCg` é **byte-idêntico** ao já validado em `criar-conta`/`login`/`recuperar-senha` (mesma carteira `moderado`: eyebrow "O QUE VOCÊ RECEBE", título "Uma carteira revisada e um laudo assinado, todo mês", "Carteira Moderada Estratégica", "AGOSTO 2026", alocação 30/50/20, posições Tesouro IPCA+ 2035 / VALE3 / BBDC4, aviso legal). Consumo idêntico ao de `src/views/recuperar-senha/PainelProva.vue`:
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
  Ver as 3 lições registradas em `build-manifest-recuperar-senha.md` (sem wrapper de landmark extra, largura no `cn(...)` do wrapper fino, `SocialProofPanel` já implementado) — todas se aplicam aqui sem alteração.

## Componentes compartilhados — specs
**Nenhum.** Batch 0 desta página fica vazio — `SocialProofPanel` já está `implementado` (ver `build-manifest-criar-conta.md`).

## Estruturas inline-only

### Marca (brand mark)
- usos_contados: 1 (nesta página) — soma 6 no projeto (AppLayout.vue, Topbar.vue, Login, CriarConta, RecuperarSenha, esta página)
- inline_na_secao: Formulario
- motivo: "Precedente mantido em 5 outros arquivos; consistência > extração tardia (mesma decisão repetida em todas as telas de auth)."
- recomendacao: inline-na-secao
- node_id: "O550Nx"
- tokens_usados: (ver tabela de tokens acima)

### Card de confirmação (ícone + título + mensagem + divisor + CTA + link secundário)
- usos_contados: 1
- inline_na_secao: Formulario
- motivo: "Estrutura específica desta tela de confirmação; não repete em nenhuma outra tela do projeto."
- recomendacao: inline-na-secao
- node_id: "yJUdY"
- screenshot: docs/pencil/link-enviado-formulario.webp
- tokens_usados: text-page-title-sm, text-table-row, text-label
- ícone: PhCheckCircle (ver `## Ícones`)

## Plano de dados

### Dados propostos
Nenhum arquivo novo nem export novo.

```yaml
dados_propostos:
  - arquivo: src/data/wallet.ts
    acao: reusar (nenhuma mudança)
    consumido_por: [SocialProofPanel, via PainelProva.vue desta página]
    reuso: "Mesmo uso documentado em build-manifest-criar-conta.md — recommendedWallets.find(slug === 'moderado')."
  - local: src/views/link-enviado/Formulario.vue
    motivo: "Todo o conteúdo do card é literal/estático (título, mensagem, rótulos). O e-mail 'ana.silva@email.com' no design é um placeholder fixo — Fase 2 decide se vira literal (mock) ou dado dinâmico vindo de query/state da navegação a partir de RecuperarSenha; fora do escopo deste build-prep."
```

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Formulario | YEMx3 | src/views/link-enviado/Formulario.vue | ui/button, PhCheckCircle | literal | sim | docs/pencil/link-enviado-formulario.webp | webp |
| 2 | PainelProva | WmaCg | src/views/link-enviado/PainelProva.vue | SocialProofPanel (já implementado) | data:wallet (via SocialProofPanel) | sim — Batch 0 vazio, nada bloqueia | docs/pencil/link-enviado-painel-prova.webp | webp |

## Plano de execução (Fase 2)
1. Batch 0: **vazio** — pular direto pro batch de seções
2. Batch paralelo (máx 3): Formulario, PainelProva

## Critério de aceite por seção
- Fiel ao screenshot da seção
- Zero valor arbitrário em cor, tipografia e espaçamento; dimensão só quando vem do design (R1, R2)
- Botão "Voltar para entrar" reusa `@components/ui/button` variant="default", full-width, `h-11` — decisão já tomada 3x, não reabrir
- `PainelProva.vue` desta página é um wrapper fino (~15-20 linhas): resolve `wallet` + `<SocialProofPanel :wallet="wallet" />`, **sem** wrapper de landmark extra e **sem** repassar classe de largura (ver lições em `build-manifest-recuperar-senha.md`)
- Ícone via `PhCheckCircle` direto do pacote, cor `text-success` (R10)
- Desktop-first com `max-*` (R12) — tela compacta (1180×860), sem seções que dependam de scroll
- Tag semântica correta: `<h1>` único ("Link enviado"), `RouterLink` para "Voltar para entrar" apontando pra `/login` (rota já existe); "Enviar de novo" como `<button>` real (ação, não navegação) com handler mock
- Considerar (fora do escopo deste manifesto, decisão da Fase 2): atualizar `src/views/recuperar-senha/Formulario.vue` para navegar até esta rota em vez do mock local `enviado` (ver seção "Contexto" no topo)

## Stubs criados
- src/pages/LinkEnviado.vue
- src/views/link-enviado/ (pasta vazia)
- rota `/recuperar-senha/link-enviado` comentada em src/routers/index.ts (ativar no `/build-page`)

## Status

### Componentes (Batch 0)
Nenhum — `SocialProofPanel` já implementado, reuso direto.

### Seções (Batches 1-N)
- [ ] Formulario
- [ ] PainelProva
- [ ] bun check + bun run build
- [ ] review

## Auditoria

- [x] Tokens de cor novos existem nos três lugares de index.css — N/A, nenhuma cor nova
- [x] Text-styles novos existem em index.css E em TEXT_STYLES — N/A, nenhum text-style novo (todos os usados já existem, conferidos contra `build-manifest-recuperar-senha.md`/`build-manifest-login.md`)
- [x] Ícones extraídos — N/A, `PhCheckCircle` é ícone de catálogo Phosphor já no pacote instalado, confirmado por `find` em `node_modules`; `shield-check` já resolvido via `LegalNotice`
- [x] Imagens baixadas — N/A, nenhuma imagem no design
- [x] Overview capturado (PDF) — docs/pencil/link-enviado-overview.pdf
- [x] Cada seção do inventário tem screenshot — link-enviado-formulario.webp, link-enviado-painel-prova.webp (ambas ≤860px de altura, WebP)
- [x] Nenhuma spec de componente compartilhado nova — não se aplica, Batch 0 vazio
- [x] Nenhum componente com confidence baixa — não se aplica
- [x] Kit `ui/` consultado — button confirmado reusável do padrão já validado
- [x] Cada seção tem fonte de dados declarada (`literal` | `data:wallet`)
- [x] Dado estático aponta para `src/data/wallet.ts` já existente — reuso confirmado, nenhuma duplicação
- [x] Stubs criados e rota registrada (comentada)
