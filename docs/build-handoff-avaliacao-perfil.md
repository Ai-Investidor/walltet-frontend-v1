# Build Handoff — avaliacao-perfil

> Data: 2026-08-22
> Manifesto: docs/build-manifest-avaliacao-perfil.md
> Rota: /avaliacao-perfil (top-level, fora do `AppLayout`)

## 1. Dados (Passo 1)

| Arquivo | Tipo | Status | Nota |
|---|---|---|---|
| src/data/avaliacao.ts | dado estático | criado, depois **reestruturado pós-review** | camada dinâmica pendente (skill futura). Exporta `assessmentQuestion` (conteúdo) e `assessmentProgress` (posição no fluxo) separados — ver §6 M4 |

## 2. Components (Batch 0)

Nenhum componente shared novo foi proposto ou criado nesta página — pulado por design (manifesto não listou nenhuma spec com `status: proposto`).

## 3. Sections (Batches 1-N)

| Seção | Status | Assets faltantes | Desvios do manifesto | Evolução de componente pedida | Bloqueios | Notas |
|---|---|---|---|---|---|---|
| Topbar | ok | — | hover no link "Sair" (não previsto no design, affordância mínima só com tokens) | — | — | landmark `<header>` na própria view; destino de "Sair" assumido como `RouterLink to="/"` (não há design pra isso) |
| Pergunta (v1) | ok | — | h1 com `max-w-[420px]` (medido do screenshot, não estava no manifesto); Button "Voltar" com `size="sm"` (medido do screenshot) | — | — | rodada substituída pela correção abaixo |
| Pergunta (v2, pós-review) | ok | — | adicionado `@submit.prevent` no `Questionnaire` (obrigatório — sem isso Enter recarrega a SPA); `QuestionnaireItem` com `aria-labelledby` apontando pro `<h1>` externo | — | — | adotou `@components/ui/questionnaire` pra resolver M1/M3 do review |
| Pergunta (v3, correção pontual) | ok | — | fórmula da barra de progresso corrigida | — | — | `((currentStep - 1) / totalSteps) * 100` — ver §6 |
| Pergunta (v4, correção direta do usuário) | ok | — | revertido `ui/questionnaire` → `<fieldset>`/`<input type="radio">` nativo com badge quadrado custom | — | — | usuário apontou (via `Node ID: l184p`) que o indicador circular do kit não batia com o design (badge quadrado numerado, sem "radio"); reescrito à mão mantendo radio-group nativo real + `@keydown` pros atalhos 1–4, mas com controle total do CSS |
| Pergunta (v5, feature nova) | ok | — | adicionado `watch(selectedOptionId)` que emite `answered` quando uma opção é escolhida | — | — | dispara a transição pro Resultado — torna "a resposta avança sozinha" (hint do rodapé) literalmente verdadeiro |
| Resultado (nova, node `mkZ3o`) | ok | — | nenhum desvio do que foi levantado do design | — | — | escrita direto pelo orquestrador (fora do fluxo `/build-page`, a pedido do usuário) — não passou por `section-builder` nem por code review |
| AvaliacaoPerfil.vue (page, atualizada) | ok | — | adicionado `ref isComplete` + `v-if`/`v-else` entre Pergunta/Resultado | — | — | escrita direto pelo orquestrador (é o stub da página, dono do Passo 4) |

## 4. Code review

**Veredicto:** MUDANÇAS NECESSÁRIAS → aplicadas. 0 BLOCKERS.

| Achado | Severidade | Status |
|---|---|---|
| M1 — opções sem interação real, inacessíveis por teclado | MAJOR | **corrigido** (adotado `ui/questionnaire`) |
| M2 — página sem landmark `<main>` | MAJOR | **corrigido** |
| M3 — `ui/questionnaire` (kit) existia e foi ignorado | MAJOR | **corrigido** (adotado) |
| M4 — `avaliacao.ts` misturava estado de navegação com conteúdo | MAJOR | **corrigido** (split em `assessmentQuestion`/`assessmentProgress`) |
| MINOR — `Progress` sem `aria-label`/`aria-valuetext` | MINOR | **aberto** |
| MINOR — `hint` estava no arquivo de dados, não no template | MINOR | **corrigido** (resolvido junto do M4) |
| MINOR — `id: number` do badge acumula identidade + atalho visual | MINOR | **aberto** |
| MINOR — botão "Voltar" focável e inerte (sem `@click`) | MINOR | **aberto** (intencional nesta fase, estático) |
| MINOR — rota `/avaliacao-perfil` órfã (nada aponta pra ela) | MINOR | **aberto** — ver §7 |
| MINOR — `meta.title` da rota não tem efeito (rota fora do `AppLayout`) | MINOR | **aberto** |
| INFO — R1/R2 impecáveis, zero valor arbitrário | INFO | ok |
| INFO — bug adicional achado durante o fix: Enter recarregava a SPA | — | **corrigido** junto do M3 |
| INFO — bug adicional achado durante o fix: fórmula de progresso dava 40% em vez de 20% | — | **corrigido** (correção pontual v3) |

## 5. Intervenções do orquestrador (honestidade)

Fora do escopo estrito "1 seção = 1 subagente":
- `src/pages/AvaliacaoPerfil.vue` — orquestrador editou diretamente (é o stub da página, dono do Passo 4, não de um section-builder): composição inicial + depois adição do `<main>` (M2).
- `src/data/avaliacao.ts` — orquestrador escreveu e depois reescreveu diretamente (Passo 1 é do orquestrador, não de subagente).
- `src/routers/index.ts` — rota `/avaliacao-perfil` registrada como entrada top-level (irmã do array de rotas do `AppLayout`), já no `/build-prep`. Nenhuma mudança adicional nesta fase.
- `docs/build-manifest-avaliacao-perfil.md` — atualizado a cada retorno de subagente (single-writer, conforme contrato) e nas 3 correções pós-review.

## 6. Análise e sugestões de correção

### Causas raiz

1. **`/build-prep` não varreu o kit `ui/` por inteiro antes de escrever a spec de "Estruturas inline-only".** O Passo 7 do prep listou `ui/button` e `ui/progress` como reusados, mas não achou `ui/questionnaire` — um compound bem mais específico e não óbvio pelo nome genérico "opções de resposta". Causa técnica: a varredura foi guiada por semelhança de nome/função óbvia, não por um `Glob src/components/ui/*` exaustivo comparado contra a estrutura do design nó a nó.
2. **Rota pública fora de `AppLayout` é um caso novo no projeto** — todas as páginas anteriores nasceram dentro do layout autenticado, que já fornece `<main>` via `SidebarInset`. Ninguém tinha testado ainda "página sem layout compartilhado" e o gap (dono do landmark) só apareceu na review.
3. **Mistura de estado de navegação com conteúdo em `src/data/`** é um padrão fácil de escorregar quando o design mostra só 1 frame de um fluxo maior (aqui, 1 de 5 perguntas) — o dado "que passo é esse" e o dado "qual é a pergunta" parecem a mesma entidade quando só se vê 1 frame.

### Backlog priorizado

**P0 (bloqueia usabilidade real, mas já corrigido nesta rodada):** nenhum restante.

**P1 (técnico, recomendado antes de considerar a tela 100% fechada):**
- [ ] `Resultado.vue` foi escrito direto pelo orquestrador (fora do fluxo padrão `section-builder` → review), a pedido do usuário, para implementar a transição pós-resposta (node `mkZ3o`). `bun check`/`bun run build` passam, mas **não recebeu o passe de code review** que Topbar/Pergunta receberam — rodar `/code-review` nele antes de considerar a feature fechada.

**P1 (decisão de produto/negócio, não técnica):**
- [ ] Ligar o botão "Refazer avaliação" do rodapé da sidebar (`src/layouts/AppLayout.vue:129-131`) a `RouterLink to="/avaliacao-perfil"` — hoje é um `<button>` sem `@click`, e a rota nova fica órfã (nada no app aponta pra ela). Decisão do humano: é essa mesma a entrada, ou existe outro fluxo de disparo (ex.: onboarding)?
- [ ] Destino de "Sair" no Topbar foi assumido como `RouterLink to="/"` — confirmar se é isso mesmo ou se deveria ser um logout real (aguarda camada de auth).
- ~~Decidir se "a resposta avança sozinha" entra nesta fase~~ — **resolvido**: `Pergunta.vue` agora emite `answered` ao escolher qualquer opção, e a página mostra `Resultado.vue` na hora. Só existe conteúdo real para 1 de 5 perguntas (o design não fornece as outras 4), então o "avanço" aqui é direto pergunta→resultado, não pergunta→próxima pergunta. Ajustar quando as outras 4 perguntas existirem em algum design.

**P2 (técnico, baixo risco, pode esperar):**
- [ ] `Progress` sem `aria-label`/`aria-valuetext` (MINOR do review, não corrigido nesta rodada).
- [ ] `AssessmentOption.id: number` faz dupla função (chave de identidade + atalho numérico exibido) — separar em `id: string` + atalho derivado de posição, se a ordem das opções puder mudar no futuro.
- [ ] `meta.title` da rota não produz efeito (nada seta `document.title` fora do `AppLayout`) — só importa se o título da aba for requisito.
- [ ] Sugestão do review: registrar em `.claude/learn/` (via `/dream` ou skill de aprendizado) os dois padrões que escaparam do `/build-prep` — (a) varrer `ui/` por completo antes de declarar "sem match", (b) toda rota fora de `AppLayout` precisa doar seu próprio `<main>`.

## 7. PROMPT COPIÁVEL

```
Preciso resolver as pendências do build de /avaliacao-perfil:

1. src/layouts/AppLayout.vue:129-131 — o botão "Refazer avaliação" no rodapé
   da sidebar é um <button> sem ação. Trocar por <RouterLink to="/avaliacao-perfil">
   mantendo as mesmas classes, OU me diga se o disparo dessa tela deveria vir
   de outro lugar.

2. src/views/avaliacao-perfil/Topbar.vue — o link "Sair" está assumido como
   RouterLink to="/". Confirmar se é esse o destino ou se deveria ser um
   logout real (fica pendente até existir camada de auth).

3. src/views/avaliacao-perfil/Pergunta.vue — o <Progress> não tem
   aria-label/aria-valuetext associando "Pergunta 2 de 5" ao progressbar.
   Adicionar aria-label="Progresso da avaliação" e
   :aria-valuetext="`Pergunta ${assessmentProgress.currentStep} de ${assessmentProgress.totalSteps}`".

4. src/data/avaliacao.ts — AssessmentOption.id é number e serve tanto de
   identidade quanto de atalho numérico exibido. Se a ordem das opções puder
   mudar no futuro, separar id (string) de número de atalho (derivado da
   posição no array).

5. Rodar /code-review em src/views/avaliacao-perfil/Resultado.vue — essa seção
   (tela de resultado, node mkZ3o) foi escrita direto por mim fora do fluxo
   /build-page normal e ainda não passou pelo agente de review que as outras
   duas seções já passaram.

Contexto: docs/build-manifest-avaliacao-perfil.md e
docs/build-handoff-avaliacao-perfil.md têm o histórico completo.
```
