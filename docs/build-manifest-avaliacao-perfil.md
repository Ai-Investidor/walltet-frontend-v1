# Build Manifest — AvaliacaoPerfil

> Gerado por /build-prep em 2026-08-22 04:15
> Fonte: pencil — node UGoLo (`docs/template/dashboard.pen`)
> Para implementar: `/build-page avaliacao-perfil`

## Identificação
- page: avaliacao-perfil
- página: src/pages/AvaliacaoPerfil.vue
- seções: src/views/avaliacao-perfil/
- rota: /avaliacao-perfil — **fora do `AppLayout`** (rota irmã, top-level, sem sidebar/topbar do app — tela "Público" no design)

## Frame raiz
- node-id: `UGoLo` — "Público · Avaliação de perfil", 1180×860
- A borda/sombra/`cornerRadius:8` do frame raiz é o artboard decorativo do Pencil (mesma convenção já usada em `Painel`/`Conta`), não CSS real — o conteúdo relevante são os dois filhos diretos (`byGrV` Barra, `aYexJ` Corpo), renderizados full-bleed.
- Screenshot: docs/pencil/avaliacao-perfil-overview.pdf

## Tokens

Nenhuma cor nova e nenhum text-style novo. Toda a paleta e tipografia desta tela já existem em `src/assets/index.css` desde o build do Painel.

### Cores reusadas
| Variável do design | Token do projeto | Uso nesta tela |
|---|---|---|
| `$paper` | `--card` / `--background` | fundo do frame, fundo das opções |
| `$paper-2` | `--muted` | trilho (track) da barra de progresso — mesmo valor oklch de `--sidebar`, mas semanticamente `bg-muted` aqui (não é contexto de sidebar) |
| `$ink` | `--foreground` | Marca, Pergunta, Texto das opções |
| `$ink-soft` | `--muted-foreground` | Sair, Contador, Número da tecla |
| `$ink-faint` | `--muted-foreground-faint` | Eyebrow, Dica |
| `$line` | `--border` | borda das opções, divisor da Barra e do Rodapé |
| `$line-strong` | `--border-strong` | borda da Tecla (badge numerado) |
| `$green` | `--success` (= `--primary`, mesmo verde) | preenchimento da barra de progresso |

### Text-styles reusados
| Elemento | Design (px/peso/altura) | Text-style | Observação |
|---|---|---|---|
| Marca "AI Invest" | 13.44/800/font-head | `text-card-title` (14.72/700) | aproximação — mesmo padrão já aceito para esta marca em `AppLayout.vue` (lá o design também não batia exato) |
| "Sair" | 12.48/700/font-head | `text-topbar-meta` (13.44/700/font-heading) | aproximação ~1px |
| Eyebrow "AVALIAÇÃO DE PERFIL" | 10.24/700/font-head/uppercase | `text-eyebrow` (11/700/uppercase/font-heading) | mesma aproximação 700 em faixa 10–11.5px já documentada em outros manifestos |
| Contador "Pergunta 2 de 5" | 11.52/700/font-head | `text-topbar-meta` (13.44/700/font-heading) | aproximação |
| Pergunta (H1 da tela) | 28/800/1.1/font-head | `text-page-title` | match exato |
| Número da tecla ("1".."4") | 10.88/700/font-head | `text-eyebrow` (11/700/font-heading) | quase exato — uppercase é inofensivo em dígito |
| Texto da opção ("Até 1 ano" etc.) | 14.72/400/1.5/font-body | `text-paragraph` (15/400/1.4) | aproximação |
| Dica ("Use as teclas...") | 12.48/400/font-body | `text-label` (13/400/1.42) | aproximação |

## Ícones
Nenhum. Os dois ícones do botão "Voltar" (`Icone Esq`/`Icone Dir`, lucide `download`/`arrow-right`) estão com `enabled: false` na instância usada nesta tela — botão é texto puro ("Voltar").

## Imagens
Nenhuma. Não há `fill` do tipo imagem em nenhum node da árvore.

## Componentes do kit reusados
- `@components/ui/button` variant `outline` → botão "Voltar" (node `fe3wh`, ref de "Botao Outline" `BKFYq`) — texto "Voltar", sem ícones (ambos `enabled:false` na instância)
- `@components/ui/progress` → barra de progresso (node `mK72Q`/`NFHQz`/`B6QNt`) — `bg-muted` (track) + `bg-primary` (indicator) já batem com `$paper-2`/`$green`; ajustar `class` para `h-1` se o default do kit divergir do design (track já é `h-1` no componente)
- **Grupo de opções (node `l184p`/`JlyYC`/`bfgWY`/`D9mH2`/`uCCqS`) — revertido de `ui/questionnaire` para `<fieldset>`/`<input type="radio">` nativo.** Histórico: o review (M1/M3) apontou que a v1 usava `<li>` inertes e que `@components/ui/questionnaire` existia e cobria o caso — adotamos `Questionnaire`/`QuestionnaireItem`/`QuestionnaireChoices`/`QuestionnaireChoice`. Só que `QuestionnaireChoice` tem indicador (círculo de rádio) e chip de atalho com classes fixas, não expostas via slot/prop — impossível reproduzir o badge quadrado `size-6`/`text-eyebrow` do design com o componente do kit. O usuário pediu fidelidade visual exata ao Pencil (`l184p`) depois de ver o resultado, então a escolha final foi: `<fieldset>` + `<label>` + `<input type="radio" class="sr-only">` por opção (radio-group nativo real, focável, com estado `:checked` de verdade) + `<span aria-hidden>` com o badge quadrado exato do design como indicador visual, e um `@keydown` na fieldset mapeando dígitos 1–4 pra manter o hint do rodapé verdadeiro. Resultado: acessibilidade real (radio nativo) **e** fidelidade pixel ao design — sem depender do slot fixo do `ui/questionnaire`.

## Componentes do projeto reusados
Nenhum na seção Pergunta. `ProfileGauge` (`@components/shared/profile-gauge`) representa o *resultado* do perfil (medidor de nível), não a UI de pergunta/resposta — mas é exatamente o que a seção **Resultado** (adição posterior, node `mkZ3o`) precisa. Idem `@components/shared/legal-notice` (`LegalNotice`). Ver `## Frame raiz — adição`.

## Componentes compartilhados — specs
Nenhuma spec nova. Nenhuma estrutura desta tela atinge 2 usos em seções distintas (ver `## Estruturas inline-only`).

## Estruturas inline-only

### LinhaOpcao
- usos_contados: 4 (todas dentro da mesma seção)
- inline_na_secao: Pergunta
- motivo: "4 instâncias, mas todas dentro da seção Pergunta (Opções). Não atinge o critério de 2 seções distintas (R6)."
- recomendacao: v-for a partir de array de dados (`AssessmentOption[]`)
- node_id: "JlyYC" (1ª instância — "Até 1 ano")
- screenshot: docs/pencil/avaliacao-perfil-corpo.webp
- tokens_usados: `--card`, `--border`, `--border-strong`, `--foreground`, `--muted-foreground`, `text-eyebrow`, `text-paragraph`
- estrutura: frame `bg-card border rounded-sm p-[16px_18px] gap-3.5 flex items-center` → Tecla (`size-6 border-strong rounded-sm flex items-center justify-center`, número) + Texto (label da opção)

## Plano de dados

### Dados propostos
- arquivo: src/data/avaliacao.ts
  - acao: criar
  - consumido_por: [Pergunta]
  - exports:
    - assessmentQuestion: AssessmentQuestion
    - assessmentProgress: AssessmentProgress
  - tipos:
    - `AssessmentOption { id: number, label: string }`
    - `AssessmentQuestion { prompt: string, options: AssessmentOption[] }`
    - `AssessmentProgress { currentStep: number, totalSteps: number }`
  - **correção pós-review (M4):** a versão original misturava estado de navegação (`currentStep`/`totalSteps`) dentro do dado de conteúdo da pergunta, e trazia `hint` (microcopy) no arquivo de dados — R8 quer microcopy literal no template, não em `src/data/`. Separado em dois exports; `hint` virou string literal na view (agora factualmente verdadeira, já que `Questionnaire` implementa o atalho de teclado 1–4 de fato).
  - conteúdo literal capturado do design (não do screenshot):
    ```ts
    assessmentQuestion = {
      prompt: 'Por quanto tempo pretende manter esse dinheiro investido?',
      options: [
        { id: 1, label: 'Até 1 ano' },
        { id: 2, label: 'De 1 a 3 anos' },
        { id: 3, label: 'De 3 a 5 anos' },
        { id: 4, label: 'Mais de 5 anos' },
      ],
    }
    assessmentProgress = { currentStep: 2, totalSteps: 5 }
    ```
  - Progresso da barra (`B6QNt`, 144/720 = 20%) é derivado de `assessmentProgress.currentStep`/`assessmentProgress.totalSteps` na view, não campo próprio. **Fórmula corrigida pós-review:** `((currentStep - 1) / totalSteps) * 100` — a barra representa passos *concluídos*, não o número do passo atual. `2/5 = 40%` não bate com o design (144/720 = 20%); `(2-1)/5 = 20%` bate exato. A section-builder da 1ª rodada usou `currentStep/totalSteps` (40%) e sinalizou a divergência em vez de decidir sozinha — corrigido aqui.
- local (estado-local, não vai para `src/data/`):
  - **`isComplete: boolean` em `src/pages/AvaliacaoPerfil.vue`** (adicionado depois, para o node `mkZ3o` — ver `## Frame raiz — adição`). Alterna entre `Pergunta` e `Resultado`. `Pergunta.vue` emite `answered` quando `selectedOptionId` deixa de ser `null` (via `watch`); a página ouve e vira `isComplete = true`. `Resultado.vue` emite `restart`; a página volta `isComplete = false`, o que remonta `Pergunta` (v-if) e zera `selectedOptionId` de graça, sem precisar resetar manualmente.
  - Nenhum outro estado de seleção/hover além disso — cada seção continua estática internamente.

## Frame raiz — adição (node `mkZ3o`, "Público · Avaliação · Resultado")

Adicionado numa segunda passada, a pedido do usuário: quando a pergunta é respondida, mostrar a tela de resultado do Pencil (`Node ID: mkZ3o`).

- node-id: `mkZ3o`, 1180×860 — mesma convenção de artboard decorativo (borda/sombra/radius não é CSS real). Filhos relevantes: `I8rIW` Barra (idêntica à `byGrV` já implementada — reusa `Topbar.vue` sem alteração) e `QMrN1` Corpo.
- Screenshot: docs/pencil/avaliacao-perfil-resultado-corpo.webp
- Nova seção: `src/views/avaliacao-perfil/Resultado.vue`
- Reuso por domínio: `currentAssessment = profileAssessments[0]` de `@data/cliente` já contém exatamente os dados do design (`date: '2026-08-19'`, `score: 42`, `profileLabel: 'MODERADO'`, `profileLevel: 2`) — **nenhum dado novo criado**, zero duplicação com `src/data/avaliacao.ts`. As duas frases descritivas específicas do resultado ("Pontuação X de 100. A faixa moderada vai de 26 a 50 pontos..." e "Tolera oscilação moderada...") ficaram **literais** no template — são prosa ligada à faixa "moderado" especificamente mostrada no design, não dado estruturado reutilizável (o design nunca mostra outra faixa), então criar uma tabela de faixas/perfis para isso seria inventar dado fora do que foi pedido.
- Ícones: `PhCheckCircle` (conclusão, verde) e `PhArrowRight` (botão primário) — equivalentes Phosphor do `circle-check`/`arrow-right` (lucide) do Pencil; projeto usa `@phosphor-icons/vue`, não lucide (mesma tradução já usada no resto do app, ex. `Sonner.vue`).
- Componentes reusados (nenhum novo):
  - `@components/shared/profile-gauge` (`ProfileGauge`, `level={{currentAssessment.profileLevel}}`, `tone="success"`) → node `G8dvhL`/`alFgV`, 2 de 4 segmentos verdes
  - `@components/shared/legal-notice` (`LegalNotice`, sem props) → node `Y1nK8U`/`mknb1`; copy do componente já existente bate **exato** com o texto do design, zero alteração
  - `@components/ui/button` variant `default` (as-child + `RouterLink to="/"`) → "Ir para o painel" (node `M4wgj`/`s4Behq`, ícone à direita habilitado nesta instância)
  - `@components/ui/button` variant `outline` → "Refazer avaliação" (node `j2UDPZ`/`BKFYq`), com `@click` emitindo `restart`
- Text-styles (todos reusados, nenhum novo):
  - Eyebrow "RESULTADO" → `text-eyebrow` (mesma aproximação já usada em "AVALIAÇÃO DE PERFIL" na seção Pergunta)
  - Título "Seu perfil é moderado" (h1, 28/800/1.1) → `text-page-title`, match exato — dois `<span>` de cor (`text-foreground`/`text-success`) para o trecho colorido
  - Texto "Avaliação concluída em..." (13.44/400/1.55) e Texto do card de perfil (13.44/400/1.55) → `text-table-row` (13.76/400/1.55 — line-height bate exato, size aproximação de 0.32px)
  - Parágrafo de pontuação (14.72/400/1.6) → `text-paragraph` (15/400/1.4 — mesma aproximação já usada na seção Pergunta para o texto das opções)
  - "MODERADO" no card (10.88/800/uppercase) → `text-tag` (11.52/800/uppercase) — **mesmo reuso já documentado em `docs/build-manifest-conta.md`** para o mesmo rótulo "MODERADO"
- Cores: `bg-muted`/`border-border-strong` no card de perfil (mesmo `$paper-2`/`$line-strong` de sempre), `text-success` (`$green`) no destaque do título/rótulo/ícone. Nenhuma cor nova.
- Botões: variante `default` do kit já é `bg-primary` = verde do design; classe base do kit é `rounded-none` — `rounded-sm` adicionado via `class` (mesmo padrão já usado em `src/views/carteira/Composicao.vue`) pra bater com `cornerRadius: 3` do design. Tamanho `size="lg"` (h-9/36px) calibrado pela altura ~37px dos nodes `M4wgj`/`j2UDPZ`.

Reuso por domínio checado: `Glob src/data/` mostrou `cliente.ts` (com `ProfileAssessment` — histórico de avaliações já feitas, conceito distinto), `wallet.ts`, `navigation.ts`. Nenhum cobre "pergunta do questionário de perfil" → domínio novo (`avaliacao.ts`).

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Topbar (Barra) | byGrV | src/views/avaliacao-perfil/Topbar.vue | — | literal | sim | docs/pencil/avaliacao-perfil-barra.webp | webp |
| 2 | Pergunta (Corpo) | aYexJ | src/views/avaliacao-perfil/Pergunta.vue | ui/progress, ui/button | data:avaliacao | sim | docs/pencil/avaliacao-perfil-corpo.webp | webp |
| 3 | Resultado (Corpo do node `mkZ3o`) | QMrN1 | src/views/avaliacao-perfil/Resultado.vue | profile-gauge, legal-notice, ui/button | data:cliente + literal | sim (adicionada em 2ª passada) | docs/pencil/avaliacao-perfil-resultado-corpo.webp | webp |

Overview completo: docs/pencil/avaliacao-perfil-overview.pdf (frame `UGoLo`, pergunta). Frame do resultado (`mkZ3o`) não tem overview próprio capturado — só o screenshot do Corpo (`QMrN1`), suficiente pois a Barra é idêntica à do frame da pergunta.

## Plano de execução (Fase 2)
1. Batch 0: nenhum componente compartilhado novo — pular
2. Batch paralelo (máx 3): Topbar, Pergunta (2 seções, sem dependência entre si)

## Critério de aceite por seção
- Fiel ao screenshot da seção
- Zero valor arbitrário em cor, tipografia e espaçamento; dimensão só quando vem do design (R1, R2)
- Ícone via SVG extraído — N/A nesta tela (nenhum ícone visível)
- Imagem por import de `@assets` — N/A nesta tela (nenhuma imagem)
- Desktop-first com `max-*` (R12) — largura da coluna central fixa em 720px (`max-w-[720px]`), full-bleed no restante
- Tag semântica correta, `<h1>` único (a Pergunta), sem `RouterLink` interno de navegação principal — "Sair" é link de saída da tela pública (provavelmente para `/`), "Voltar" é ação de navegação de etapa (estática nesta fase)

## Stubs criados
- src/pages/AvaliacaoPerfil.vue
- src/views/avaliacao-perfil/ (vazia)
- rota `/avaliacao-perfil` registrada em src/routers/index.ts (top-level, fora do `AppLayout`)

## Status

### Componentes (Batch 0)
- Nenhum

### Seções (Batches 1-N)
- [x] Topbar
- [x] Pergunta
- [x] Resultado (adicionada em 2ª passada, node `mkZ3o`)
- [x] bun check + bun run build
- [x] review (só cobriu Topbar/Pergunta — Resultado ainda não passou por review)

## Auditoria

- [x] Tokens de cor novos existem nos três lugares de index.css — N/A, nenhuma cor nova
- [x] Text-styles novos existem em index.css E em TEXT_STYLES — N/A, nenhum text-style novo
- [x] Ícones extraídos — N/A, nenhum ícone no design desta tela
- [x] Imagens baixadas — N/A, nenhuma imagem no design desta tela
- [x] Overview capturado (PDF): docs/pencil/avaliacao-perfil-overview.pdf
- [x] Cada seção do inventário tem screenshot (webp, ambas ≤ 1000px de altura)
- [x] Nenhuma spec de componente compartilhado — nenhuma estrutura atingiu 2 usos em seções distintas
- [x] Antes de propor componente novo, o kit `ui/` foi consultado (button, progress reusados)
- [x] Cada seção tem fonte de dados declarada: Topbar = literal, Pergunta = `data:avaliacao`
- [x] Dado estático aponta para `src/data/avaliacao.ts` (criar); reuso por domínio checado (Glob + manifestos anteriores — `cliente.ts` tem conceito distinto)
- [x] Stubs criados e rota registrada
