# Build Handoff — CriarConta

> Data: 2026-08-22
> Manifesto: `docs/build-manifest-criar-conta.md`
> Rota: `/criar-conta` · Página: `src/pages/CriarConta.vue`

## 1. Dados (Passo 1)

| Arquivo | Tipo | Status | Nota |
|---|---|---|---|
| `src/data/wallet.ts` | dado estático | já existia (reuso total, zero mudança) | camada dinâmica pendente (skill futura) |

Nenhum arquivo de dados criado ou estendido — `recommendedWallets` (slug `moderado`) já cobria 100% do conteúdo do painel.

## 2. Components (Batch 0)

| Componente | Status | mode_efetivo | Props implementadas | Desvios da spec | Bloqueios |
|---|---|---|---|---|---|
| `SocialProofPanel` | implementado | create | `wallet: RecommendedWallet` (obrigatória), `class?: HTMLAttributes['class']` | prop `walletSlug?: string` da spec original foi trocada por `wallet: RecommendedWallet` — evita importar `@data` dentro do componente (violaria isolamento do component-builder e R8) | nenhum |

**Atualização pós-review:** `src/views/login/PainelProva.vue` foi migrado para consumir `SocialProofPanel` a pedido do usuário — ver §6.

## 3. Sections (Batches 1-N)

| Seção | Status | Assets faltantes | Desvios do manifesto | Evolução de componente pedida | Bloqueios | Notas |
|---|---|---|---|---|---|---|
| `Formulario` | ok | nenhum | constante local `CAMPO_CLASSES` (3 usos, permitido por R6) | nenhuma | nenhum | 3 campos + indicador de força mock (4 barras estáticas, sem cálculo real) |
| `PainelProva` | ok | nenhum | nenhum | nenhuma | nenhum | thin wrapper — resolve `wallet` e repassa pro `SocialProofPanel` |

## 4. Code review

**Veredicto:** MUDANÇAS NECESSÁRIAS (sem BLOCKER). 4 MAJOR, 5 MINOR, 4 INFO.

| # | Severidade | Resumo | Status |
|---|---|---|---|
| M1 | MAJOR | Extração do `SocialProofPanel` ficou pela metade — `views/login/PainelProva.vue` continua com o markup duplicado | ✅ corrigido — Login migrado para consumir `SocialProofPanel`, mesmo padrão de `criar-conta` |
| M2 | MAJOR | Dica de senha não associada por `aria-describedby` (`<p>` solto em vez de `FormDescription`) | ✅ corrigido |
| M3 | MAJOR | `md:text-table-row` morto e na direção errada (R12 é desktop-first) em `CAMPO_CLASSES` | ✅ corrigido |
| M4 | MAJOR | `bun check` acusava 2 arquivos novos (formatação/ordem de import) | ✅ corrigido (`biome check --write`) |
| m1 | MINOR | `SocialProofPanel` sem `<slot />` (desvio documentado no manifesto, precedente `LegalNotice`) | não corrigido — decisão de design já tomada |
| m2 | MINOR | Labels em caixa alta literal sob `text-eyebrow` (que já uppercase via CSS) | ✅ corrigido (Cadastro/Nome completo/E-mail/Senha) |
| m3 | MINOR | Painel direito fora de landmark (`<main>` só envolvia o Formulario) | ❌ revertido — a correção original (`<aside>` envolvendo `PainelProva`) quebrou o layout: o `<aside>` virou o item flex real e engoliu as classes de largura (`w-2/5 max-w-180 shrink-0`) que ficam no `<section>` interno do `SocialProofPanel`, encolhendo o painel e truncando texto. O `<section :aria-labelledby="titleId">` dentro do `SocialProofPanel` já é um landmark nomeado por si só (spec HTML: `section` com nome acessível = "region") — o `<aside>` era redundante *e* destrutivo. Revertido em ambas as páginas (Login e CriarConta); m3 não precisa de correção adicional. |
| m4 | MINOR | Classe de largura do painel decidida em 2 lugares (Login vs. CriarConta) | ✅ corrigido — largura agora só no default de `PainelProva.vue`/`SocialProofPanel`; nenhuma página passa `class` explícita |
| m5 | MINOR | `throw new Error` em tempo de setup se o slug sumir de `wallet.ts` | não corrigido — o `.find()` + `throw` agora existe só 1x por página (Login e CriarConta), não é mais duplicação; resolver via export tipado em `wallet.ts` fica como melhoria futura, não bloqueante |

Após as correções: `bun check` limpo nos arquivos novos, `bun run build` passa.

## 5. Intervenções do orquestrador (honestidade)

- `src/routers/index.ts` — rota `/criar-conta` registrada (já feito no `/build-prep`, confirmado aqui).
- `src/pages/CriarConta.vue` — composição das duas seções + `<aside>` envolvendo `PainelProva` (correção do review m3).
- **Pós-entrega, a pedido explícito do usuário** (não fazia parte do escopo mecânico do `/build-page` para `criar-conta`):
  - `src/views/login/PainelProva.vue` — reescrito para consumir `SocialProofPanel` (era ~90 linhas de markup duplicado; agora ~20 linhas, mesmo padrão do wrapper de `criar-conta`).
  - `src/pages/Login.vue` — `<PainelProva class="...">` virou `<aside><PainelProva /></aside>` (a classe de largura agora é o default do componente; landmark corrigido, mesma correção já aplicada em `CriarConta.vue`).
  - `bun check` + `bun run build` reconfirmados limpos após a migração; bundle da rota `/login` encolheu de 6.33 kB para 4.16 kB (código movido pro chunk compartilhado `SocialProofPanel`).

## 6. Análise e sugestões de correção

### Causa raiz

O `component-builder` extraiu `SocialProofPanel` corretamente, mas sua sandbox (`output_path` apenas) o impede de editar `src/views/login/PainelProva.vue` — e o `section-builder` de `PainelProva` (CriarConta) também só escreve seu próprio arquivo. Não existe, na Fase 2 atual, um subagente com mandato para "migrar consumidor existente para componente novo". A extração ficou pela metade na primeira entrega (§4, M1) — **resolvida logo em seguida** pelo orquestrador, a pedido do usuário: `src/views/login/PainelProva.vue` agora consome `SocialProofPanel` também.

### Backlog priorizado

**P0 — nenhum.** Build e rota funcionam; nada impede o merge.

**P1 — resolvido nesta rodada:**
- ~~Migrar `src/views/login/PainelProva.vue` para consumir `SocialProofPanel`~~ — feito.

**P2 — dívida técnica de produto (não bloqueia):**
- Avaliar se `views/login/PainelProva.vue` e `views/criar-conta/PainelProva.vue` — agora que são wrappers quase idênticos (~20 linhas cada) — ainda justificam existir, ou se as páginas devem importar `SocialProofPanel` direto. Mudança de forma, não de comportamento; não urgente.
- Indicador de força de senha é decorativo/estático — sem cálculo real, porque não há camada de auth. Fica pendente até essa camada existir.
- `wallet` resolvido via `find(slug === 'moderado')` com `throw` em runtime — trocar por acesso tipado (ex.: export dedicado em `wallet.ts`) quando/se `src/data/wallet.ts` for revisitado.
- "Agosto 2026" segue hardcoded dentro de `SocialProofPanel` (mesmo comportamento do Login original). Prop `periodLabel?: string` é uma evolução possível, não necessária agora.

## 7. Prompt copiável (retomar pendências)

Nenhuma pendência bloqueante restante. Se quiser ir além (P2, não urgente):

```
Avalie se views/login/PainelProva.vue e views/criar-conta/PainelProva.vue
(ambos wrappers finos de ~20 linhas em torno de SocialProofPanel) ainda
justificam existir, ou se Login.vue e CriarConta.vue devem importar
SocialProofPanel direto e resolver o `wallet` ali. É mudança de forma,
sem efeito visual — só rode bun check + bun run build ao final.

Ref: docs/build-handoff-criar-conta.md, item P2.
```
