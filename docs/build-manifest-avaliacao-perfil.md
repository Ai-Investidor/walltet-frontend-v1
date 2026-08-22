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
- `@components/ui/questionnaire` (`Questionnaire`, `QuestionnaireItem`, `QuestionnaireChoices`, `QuestionnaireChoice`) → grupo de opções (node `l184p`/`JlyYC`/`bfgWY`/`D9mH2`/`uCCqS`) — **correção pós-review** (achado M3/M1, ver `docs/build-handoff-avaliacao-perfil.md`): o Passo 7 original não varreu o kit `ui/` por inteiro e recriou a lista à mão sem interação real. `Questionnaire` com `shortcuts="numbers"` + 1 `QuestionnaireItem` (só o item desta tela — não há dado das outras 4 perguntas do fluxo) dá radio-group nativo, foco visível, e atalho de teclado 1–4 de graça — o mesmo atalho que o hint do rodapé promete. `QuestionnaireProgress`/`QuestionnairePrevious` **não** foram adotados: seu `total`/`current` internos contam os `QuestionnaireItem` montados neste form (aqui sempre 1), o que não representa o "2 de 5" do design — não há dado para os outros 4 passos, então a barra de progresso e o botão "Voltar" continuam com `ui/progress` + `ui/button` dirigidos por `assessmentProgress` (estado externo ao form). Desvio visual aceito: o indicador de escolha e o chip de atalho do kit têm estilo próprio fixo (não recebem `class` override no slot interno) — não reproduz o badge quadrado `size-6`/`text-eyebrow` do design pixel a pixel; prioridade foi a acessibilidade real sobre fidelidade total do badge.

## Componentes do projeto reusados
Nenhum. `ProfileGauge` (`@components/shared/profile-gauge`) existe mas representa o *resultado* do perfil (medidor de nível), não a UI de pergunta/resposta desta tela — não reusar aqui.

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
  - Nenhum. Design não mostra estado de seleção/hover — tela puramente estática, mesmo padrão dos outros builds deste projeto (conteúdo estático até a skill de camada dinâmica existir).

Reuso por domínio checado: `Glob src/data/` mostrou `cliente.ts` (com `ProfileAssessment` — histórico de avaliações já feitas, conceito distinto), `wallet.ts`, `navigation.ts`. Nenhum cobre "pergunta do questionário de perfil" → domínio novo (`avaliacao.ts`).

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Topbar (Barra) | byGrV | src/views/avaliacao-perfil/Topbar.vue | — | literal | sim | docs/pencil/avaliacao-perfil-barra.webp | webp |
| 2 | Pergunta (Corpo) | aYexJ | src/views/avaliacao-perfil/Pergunta.vue | ui/progress, ui/button | data:avaliacao | sim | docs/pencil/avaliacao-perfil-corpo.webp | webp |

Overview completo: docs/pencil/avaliacao-perfil-overview.pdf

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
- [x] bun check + bun run build
- [x] review

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
