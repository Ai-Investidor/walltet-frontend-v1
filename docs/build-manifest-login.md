# Build Manifest — Login

> Gerado por /build-prep em 2026-08-22 15:02
> Fonte: pencil — node `smSg6` ("Público · Login"), arquivo `docs/template/dashboard.pen`
> Para implementar: `/build-page login`

## Identificação
- page: login
- página: src/pages/Login.vue
- seções: src/views/login/
- rota: /login (top-level, fora do `AppLayout` — mesmo padrão de `/avaliacao-perfil`: tela pública, sem sidebar)

## Frame raiz
- node-id: `smSg6` — 1180×860, 2 colunas (`Coluna Formulario` `B3UR1` + `Painel Prova` `M94C0n`)
- Screenshot: docs/pencil/login-overview.pdf

## Tokens

### Adicionados
| Token | Valor | Uso |
|---|---|---|
| `text-title-lg` | 1.5rem / 800 / 1.1 / letter-spacing -0.01em / `font-heading` | Título "Entrar" do card (node `E1b9L`, 24px/800/1.1/-0.01em — bate exato em peso/line-height/letter-spacing com `text-page-title`, mas o tamanho (24px) é 4px menor, um degrau cheio da escala, não ruído de subpixel; peso 800 descarta `text-title` (20px/300). |
| `text-section-title` | 1.15rem / 700 / 1.2 / `font-heading` | Headline do Painel Prova "Uma carteira revisada..." (node `qWtx6`, 18.4px/700/1.2) — sem equivalente a menos de 2px no catálogo (`card-title` 14.72px, `topbar-title` 16px/-0.01em, `page-title` 28px/800). |

Registrados em `src/assets/index.css` (`@utility`) e em `TEXT_STYLES` (`src/libs/utils.ts`).

### Reusados
- **Cores** — mapeamento 1:1 já confirmado em manifestos anteriores (mesmo arquivo-fonte `dashboard.pen`): `$paper`→`--background`/`--card`, `$paper-2`→`--muted`, `$ink`→`--foreground`, `$ink-soft`→`--muted-foreground`, `$ink-faint`→`--muted-foreground-faint`, `$green`→`--primary`, `$line`→`--border`, `$line-strong`→`--border-strong`, `$data-1`/`$data-2`/`$data-3`→`--data-1`/`--data-2`/`--data-3`. Nenhuma cor nova.
- `text-eyebrow` — Eyebrow "ACESSO"/"O QUE VOCÊ RECEBE" (9.92px/700/0.08em vs 11px/700/0.05em do token, 1.08px de diferença — mesma aproximação de peso 700 já aceita em manifestos anteriores para rótulos 10–11.5px); Rótulos de campo "E-MAIL"/"SENHA" (11.52px/700/0.06em, 0.52px de diferença); Rótulo "ALOCAÇÃO POR CLASSE" (9.6px/700/0.08em, 1.4px de diferença — maior desvio desta lista, conferir lado a lado com o screenshot).
- `text-topbar-meta` — Link "Criar conta" (13.44px/700/`font-heading`, bate exato); "Peso" das 3 linhas de composição, ex. "30,00 %" (13.12px/700/`font-heading`, 0.32px de diferença).
- `text-table-row` — Subtítulo do card "Use o e-mail cadastrado..." (14.08px/400/1.55 vs 13.76px/400/1.55 do token, 0.32px); link "Esqueci minha senha" (13.44px/400/1.55, 0.32px).
- `text-table-value` — Nome da carteira "Carteira Moderada Estratégica" (14.08px/700/`font-heading`, bate exato).
- `text-chart-label` — Mês "AGOSTO 2026" (10.56px/700/0.07em vs 11px/700 sem letter-spacing do token, 0.44px de diferença; token não tem tracking, aproximação a conferir no screenshot).
- `text-label` — Rodapé "AI Invest · carteiras recomendadas..." (12.48px/400/1.5 vs 13px/400/1.42, 0.52px); itens da legenda "Renda Fixa 30,00 %" etc. (12.16px/400, 0.84px); "Classe" das 3 linhas, ex. "Renda Fixa" (11.52px/400, 1.48px — maior desvio, conferir com screenshot).
- `text-paragraph-strong` — "Nome" das 3 linhas de composição, ex. "Tesouro IPCA+ 2035" (13.44px/600 vs 14.08px/600 do token, 0.64px).
- `text-card-title` + `text-eyebrow text-background` (dentro de `size-6.5 bg-foreground rounded-sm`) — marca "AI Invest" (Simbolo + Nome). **Decisão de consistência, não de proximidade de pixel**: o node `WbxRv` mede 15.68px/800 e `LjwUW` ("AI") 11.52px/800, mas a marca já existe implementada 2x no código (`src/layouts/AppLayout.vue:63` e `src/views/avaliacao-perfil/Topbar.vue:9`) usando exatamente `text-card-title`/`text-eyebrow`. Repetir esses valores mantém a marca visualmente idêntica em todas as telas; não há necessidade de token novo aqui.

## Ícones
Nenhum novo. Único ícone do frame é `shield-check` (Aviso Legal, node `PYJr6`), já coberto pelo componente existente `@components/shared/legal-notice`, que usa `PhShieldCheck`. Os 2 ícones do botão primário (`download`/`arrow-right`) estão `enabled: false` na instância `zehZt` — não aparecem neste uso.

## Imagens
Nenhuma. Nenhum node do frame tem `fill` do tipo imagem — todos os preenchimentos são cor sólida (`$paper`, `$paper-2`, `$ink`, etc.).

## Componentes do kit reusados
- `@components/ui/form` + `@components/ui/input` + `@components/ui/button` (variant `default`) — card de login (e-mail, senha, botão "Entrar"). Formulário real (não decorativo) → vee-validate + zod via `Form`/`FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormMessage`, conforme R13. Altura do campo no design é 42px — nenhum size do kit bate exato (`h-10`=40px, `h-11`=44px); `section-builder` decide entre arredondar para `h-10`/`h-11` ou height dimensional exceção (R1) se a diferença for perceptível no screenshot.
- `@components/ui/button` (variant `default`) — Botão "Entrar" (ref Pencil "Botao Primario", `$green`→`bg-primary`). Altura 44px bate com `size="lg"`? kit não tem `lg` de botão com h-9 (36px) — mesmo caso do campo, decidir em Phase 2 olhando o screenshot.

## Componentes do projeto reusados
- `@components/shared/legal-notice` (`LegalNotice`) — node `Z2tqp` "Aviso Legal". Copy do componente existente ("Carteira recomendada com base no seu perfil declarado...") já é equivalente semântico ao texto do design ("...com base no perfil declarado..." — variação mínima de artigo); reusar sem alterar o componente.

## Componentes compartilhados — specs
Nenhum novo. Nada nesta página atinge 2 usos reais **fora** do que já existe:
- A marca "AI Invest" (Simbolo + Nome) tem 1 uso nesta página. Já aparece 2x no código (`AppLayout.vue`, `Topbar.vue`) mas nenhuma delas foi registrada como spec de componente em manifesto anterior — pela regra de contagem cross-página (Passo 7), a soma não se aplica a inline não catalogado. Mantido inline (ver abaixo), replicando o padrão visual já usado nos 2 arquivos citados.
- A "linha de ativo" do Painel Prova (chip de iniciais + nome/classe + peso) tem 3 usos, mas todos dentro da **mesma seção** (`PainelProva`) → v-for, não slot (R6).
- A fita de alocação segmentada já tem precedente inline em `src/views/carteira/Composicao.vue`, `src/views/carteiras/Lista.vue` e `src/views/painel/Carteira.vue` (`<div class="flex h-2.5 overflow-hidden rounded-sm">` + segmentos `bg-data-N`) — nunca foi extraída lá, mantém-se o padrão.

## Estruturas inline-only

### Marca (brand mark)
- usos_contados: 1 (nesta página)
- inline_na_secao: Formulario
- motivo: "1 uso na página; réplica do padrão já usado (não extraído) em AppLayout.vue e Topbar.vue — ver nota de consistência em Tokens."
- recomendacao: inline-na-secao
- node_id: "p7X57Y"
- tokens_usados: text-card-title, text-eyebrow

### LinhaAtivoPreview (chip iniciais + nome/classe + peso)
- usos_contados: 3
- inline_na_secao: PainelProva
- motivo: "3 usos, mas todos dentro da mesma seção — R6 pede v-for, não slot."
- recomendacao: v-for
- node_id: "x4IUGC" (padrão; mesma estrutura em `fTq2v`, `ioz1j`)
- screenshot: docs/pencil/login-painel-prova.webp
- tokens_usados: text-paragraph-strong, text-label, text-topbar-meta, border-border-strong

### FitaAlocacao (barra segmentada + legenda)
- usos_contados: 1 (nesta página; padrão já replicado sem extração em 3 outras views do projeto)
- inline_na_secao: PainelProva
- motivo: "Precedente do projeto mantém essa estrutura inline em toda página que a usa (Composicao.vue, Lista.vue, painel/Carteira.vue); seguir o mesmo padrão aqui."
- recomendacao: inline-na-secao
- node_id: "jW5OH"
- tokens_usados: text-eyebrow, text-label, bg-data-1, bg-data-2, bg-data-3

## Plano de dados

### Dados propostos
Nenhum arquivo novo nem export novo. Reuso total:

```yaml
dados_propostos:
  - arquivo: src/data/wallet.ts
    acao: reusar (nenhuma mudança)
    consumido_por: [PainelProva]
    reuso: |
      recommendedWallets.find(w => w.slug === 'moderado') já contém exatamente
      o conteúdo do preview: name "Carteira Moderada Estratégica",
      allocationPreview [Renda Fixa 30/data-1, Ações BR 50/data-2, FII 20/data-3],
      composicao [Tesouro IPCA+ 2035, VALE3, BBDC4] com os mesmos className e
      weightPercent do design. O rótulo "AGOSTO 2026" é literal (não está no
      tipo RecommendedWallet) — direto no template.
  - local: src/views/login/Formulario.vue
    motivo: "estado local do formulário (e-mail, senha) via vee-validate + schema zod (R13); sem domínio em src/data — este projeto não tem service/store de auth ainda."
```

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Formulario | B3UR1 | src/views/login/Formulario.vue | ui/form, ui/input, ui/button | estado-local | sim | docs/pencil/login-formulario.webp | webp |
| 2 | PainelProva | M94C0n | src/views/login/PainelProva.vue | shared/legal-notice | data:wallet | sim | docs/pencil/login-painel-prova.webp | webp |

## Plano de execução (Fase 2)
1. Batch 0: nenhum componente compartilhado novo — pular
2. Batch paralelo (máx 3): Formulario, PainelProva

## Critério de aceite por seção
- Fiel ao screenshot da seção
- Zero valor arbitrário em cor, tipografia e espaçamento; dimensão só quando vem do design (R1, R2) — atenção especial à altura de campo (42px) e botão (44px), documentada acima
- Ícone via `PhShieldCheck` já embutido em `LegalNotice`, sem reimplementar (R10)
- Formulário com `vee-validate` + zod via `@components/ui/form`, `FormLabel`/`FormMessage` associados por `aria-describedby` (R13)
- Desktop-first com `max-*` (R12) — tela compacta (1180×860), sem seções que dependam de scroll
- Tag semântica correta: `<h1>` único (provavelmente "Entrar"), `<form>` real, `RouterLink` para "Criar conta"/"Esqueci minha senha" se apontarem para rotas internas (a definir no Phase 2 — hoje não há rotas de cadastro/recuperação registradas; usar `<a>`/`<button>` como placeholder se a rota não existir)

## Stubs criados
- src/pages/Login.vue
- src/views/login/ (pasta vazia)
- rota `/login` registrada em src/routers/index.ts

## Status

### Componentes (Batch 0)
Nenhum.

### Seções (Batches 1-N)
- [x] Formulario
- [x] PainelProva
- [ ] bun check + bun run build
- [ ] review

## Auditoria

- [x] Tokens de cor novos existem nos três lugares de index.css — N/A, nenhuma cor nova
- [x] Text-styles novos existem em index.css E em TEXT_STYLES de src/libs/utils.ts (`text-title-lg`, `text-section-title` — 2 `@utility text-` novos == 2 entradas novas no array)
- [x] Ícones extraídos — N/A, nenhum ícone novo (reuso de `PhShieldCheck` via `LegalNotice`)
- [x] Imagens baixadas — N/A, nenhuma imagem no design
- [x] Overview capturado — docs/pencil/login-overview.pdf
- [x] Cada seção do inventário tem screenshot — login-formulario.webp, login-painel-prova.webp (ambas ≤1000px, WebP)
- [x] Nenhuma spec de componente compartilhado — não se aplica (nenhum componente novo atingiu o critério de extração)
- [x] Nenhum componente com confidence baixa — não se aplica
- [x] Kit `ui/` consultado antes de propor componente novo (form, input, button, card conferidos)
- [x] Cada seção tem fonte de dados declarada (`estado-local` | `data:wallet`)
- [x] Dado estático aponta para `src/data/wallet.ts` já existente — reuso confirmado via leitura do arquivo, nenhuma duplicação
- [x] Stubs criados e rota registrada
