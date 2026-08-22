# Build Handoff — conta

> Data: 2026-08-22
> Manifesto: `docs/build-manifest-conta.md`
> Rota: `/conta` (nome `conta`, `meta.title: 'Minha conta'`)

## Dados (Passo 1)

| Arquivo | Tipo | Status | Nota |
|---|---|---|---|
| `src/data/cliente.ts` | dado estático | criado | camada dinâmica pendente (skill futura) |

`ClientAccount` e `ProfileAssessment` (com `profileLevel`, adicionado pós-review — ver "Intervenções" abaixo).

## Components (Batch 0)

Nenhum. O manifesto não propôs componente shared novo — `ProfileGauge` e `Button` (kit) já existiam.

## Sections (Batches 1-N)

| Seção | Status | Assets faltantes | Desvios do manifesto | Evolução de componente pedida | Bloqueios | Notas |
|---|---|---|---|---|---|---|
| Cabecalho | ok | — | — | — | — | Sem `<script setup>` (100% template literal). Eyebrow em sentence case no template — `text-eyebrow` já força uppercase via CSS. Sem parágrafo de apoio (screenshot não tem; não foi inventado). |
| Detalhes | ok (2 rodadas) | — | Rodada 2 (correção M2) adicionou uma linha de cabeçalho de coluna (DATA / PONTOS / PERFIL) na tabela de histórico que **não existe** no screenshot do design (`docs/pencil/conta-detalhes.webp`) — decisão consciente de a11y (R13), ver "Análise" abaixo. | — | — | Rodada 1: nível do medidor calculado por mapa local (virou M1 do review, corrigido). Botão "Refazer avaliação" está `disabled` (sem rota de destino nesta fase). |

## Code review

Rodado 1x, antes da rodada 2 de correção da seção `Detalhes`.

| Nível | Qtd | Status |
|---|---|---|
| BLOCKER | 0 | — |
| MAJOR | 2 | **Ambos corrigidos** (M1: `profileLevel` movido pro dado; M2: histórico virou `@components/ui/table`) |
| MINOR | 4 | m2 e m3 corrigidos na mesma rodada; m1 e m4 seguem abertos (ver Backlog) |
| INFO | 5 | Sem ação — tokens, `formatDate`, `<dl>` e build confirmados corretos |

Review completo (texto do agente) não foi re-executado após a correção — as duas rodadas de `section-builder` reportaram os itens como resolvidos e `bun check`/`bun run build` seguem limpos para os arquivos tocados.

## Intervenções do orquestrador (fora de `.vue` de seção/componente)

1. `src/data/cliente.ts` — adicionado o campo `profileLevel: 1 | 2 | 3 | 4` em `ProfileAssessment` (mesmo padrão de `RecommendedWallet` em `src/data/wallet.ts:56-59`), motivado pelo MAJOR M1 do review. Editado diretamente pelo orquestrador (regra do Passo 5: erro/ajuste de tipo em `src/data/` é o orquestrador quem corrige, sem reabrir Batch 0/sections por isso).
2. `docs/build-manifest-conta.md` — atualizado retroativamente com o campo `profileLevel` no contrato e uma nota "Atualização pós-review", para o manifesto continuar sendo fonte de verdade fiel ao código.
3. `src/data/navigation.ts:36` — `available: false` → `true` no item "Minha conta", conforme item 3 do "Plano de execução" do manifesto (wiring pós-gate).
4. `src/pages/Conta.vue` — stub do `/build-prep` completado com o shell `flex flex-col gap-8 p-8` (mesmo padrão de `Carteiras.vue`/`Relatorios.vue`/`Painel.vue`), que o stub original não incluía.

## Análise e sugestões de correção

### Causas raiz

- **`profileLevel` ausente no `/build-prep` original (M1).** O manifesto propôs `ProfileAssessment` sem olhar o domínio irmão `RecommendedWallet` (`wallet.ts`), que já resolve exatamente esse mapeamento. Causa: o Passo 8 do `/build-prep` ("Reuso por domínio") checou arquivos por nome de domínio (`Glob src/data/`) mas não cruzou campos de domínios *diferentes* que descrevem o mesmo conceito (nível de perfil de investidor). Padrão a vigiar em builds futuros que tocam "perfil de investidor".
- **Tabela vs lista (M2) é decisão de granularidade que o `/build-prep` deixou para a seção.** O manifesto documentou a estrutura como "3 colunas" mas não decidiu a tag semântica — ficou a critério do `section-builder`, que inicialmente escolheu `<ul>`+grid. Corrigido no review.
- **Desvio visual do cabeçalho de coluna (M2, rodada 2):** o design (`docs/pencil/conta-detalhes.webp`) não tem uma linha "DATA / PONTOS / PERFIL" visível — só o rótulo "HISTÓRICO DE AVALIAÇÕES" acima das 3 linhas. A correção de a11y (R13, `TableHead scope="col"`) introduziu uma linha extra que se afasta do pixel-perfect. Trade-off documentado, não um erro.

### Backlog priorizado

- **P1 — técnico.** `gaugeLabel(profileLabel, profileLevel)` está duplicada em `src/views/conta/Detalhes.vue` e `src/views/carteiras/Lista.vue:32-34` (MINOR m1 do review, não corrigido — fora do sandbox do `section-builder`, que só escreve em `output_path`). Ação sugerida: mover para `src/components/shared/profile-gauge/index.ts` e importar nos dois lugares. Precisa de um `component-builder` em modo `update` ou edição direta — decisão do usuário sobre qual via tomar.
- **P2 — decisão de humano (visual vs a11y).** Confirmar se a linha de cabeçalho da tabela de histórico (DATA/PONTOS/PERFIL, ausente no design) fica como está (a11y correta, pequeno desvio visual) ou se deve virar `TableHeader` com `sr-only` (fiel ao pixel, mesma a11y). Ver nota da seção `Detalhes` na tabela acima.
- **P2 — técnico, não bloqueante.** Repo inteiro tem 16 erros de `bun check` pré-existentes (fora deste diff: `index.html` com `<!DOCTYPE>`, JSON em `.claude/`). Não é dívida introduzida por este build, mas o gate R14 "check limpo" não está satisfeito no repositório como um todo — vale um cleanup à parte, fora do escopo desta página.
- **P3 — negócio.** Botão "Refazer avaliação" está `disabled` porque não existe rota/fluxo de reavaliação nesta fase. Quando o fluxo existir, trocar por `<RouterLink>`/`@click` real.
- **P3 — negócio.** Dado de `src/data/cliente.ts` é mockado para uma única cliente (Ana Paula Silva) — mesma limitação estrutural de todo o app nesta fase (sem service/store).

## PROMPT COPIÁVEL

```
Pendências da página /conta (docs/build-handoff-conta.md):

1. [P1] Duplicação de gaugeLabel() entre src/views/conta/Detalhes.vue e
   src/views/carteiras/Lista.vue:32-34. Mover a função para
   src/components/shared/profile-gauge/index.ts e importar nos dois
   lugares (component-builder modo update ou edição direta).

2. [P2] Decidir: a tabela de histórico em Detalhes.vue ganhou uma linha
   de cabeçalho de coluna (DATA/PONTOS/PERFIL) que não existe no design
   (docs/pencil/conta-detalhes.webp). Manter (a11y correta) ou trocar
   TableHeader por versão sr-only (fiel ao pixel)?

3. [P3] Botão "Refazer avaliação" em Detalhes.vue está disabled — falta
   rota/fluxo real de reavaliação de perfil.

4. [P2] bun check tem 16 erros pré-existentes fora deste diff
   (index.html, JSON em .claude/) — considerar um cleanup à parte.
```
