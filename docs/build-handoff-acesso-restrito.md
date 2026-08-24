# Build Handoff — acesso-restrito

> Gerado por /build-page em 2026-08-24
> Manifesto: docs/build-manifest-acesso-restrito.md

## Dados (Passo 1)
Nenhum arquivo em `src/data/` — página 100% literal. Nada a criar/estender.

## Components (Batch 0)
Nenhum — Batch 0 vazio conforme manifesto.

## Seções (Batches 1-N)

| Seção | Status | Assets faltantes | Desvios do manifesto | Evolução pedida | Bloqueios |
|---|---|---|---|---|---|
| Topbar | ok | — | — | — | — |
| Mensagem | ok | — | parágrafo: `width:480` → `max-w-[480px]` (guarda de viewport, mesma medida); ações: `flex-wrap` (guarda, sem efeito no desktop); seção: `px-6 py-10` (padding não declarado no design, mesmo precedente de `avaliacao-perfil/Resultado.vue`) | — | — |

Ambas as seções voltaram `status: ok` sem bloqueios no primeiro ciclo.

## Code review

**Veredicto do agente `review`: BLOCKERS 0 · MAJOR 4 · MINOR 3**

| # | Severidade | Achado | Status |
|---|---|---|---|
| M1 | MAJOR (R13) | `AcessoRestrito.vue` sem landmark `<main>` envolvendo o conteúdo | **corrigido** — `Mensagem` agora dentro de `<main class="flex flex-1 flex-col">` |
| M2 | MAJOR | Bloco de rota comentado (`/recuperar-senha/link-enviado`) + arquivos órfãos `src/pages/LinkEnviado.vue` / `src/views/link-enviado/` | **não corrigido** — pré-existente, de uma sessão anterior, fora do escopo desta página |
| M3 | MAJOR (R6) | Marca ("AI Invest" + símbolo) duplicada pela 6ª vez inline; header shell duplicado 2×  | **não corrigido** — decisão do `/build-prep` (manifesto marca como inline, R6 avaliado e não atingiu o critério cross-página no momento do prep); reabrir no próximo `/build-prep` se aparecer uma 3ª tela de sistema |
| M4 | MAJOR (R13) | "Sair" e "Voltar ao painel" navegavam para o mesmo destino (`/`) — contraditório numa tela de acesso negado | **corrigido** — "Sair" agora aponta para `/login` |
| m1 | MINOR | `max-w-[540px]`/`max-w-[480px]` arbitrário quando `max-w-135`/`max-w-120` cobririam (R1, escala já existe) | não corrigido — cosmético, não bloqueia |
| m2 | MINOR | `<section>` sem `aria-labelledby` apontando pro `<h1>` | resolvido de facto pela correção de M1 (virou landmark único da página; padrão das telas irmãs usa `aria-labelledby`, pode ser adicionado depois) |
| m3 | MINOR | `meta.title` de rotas top-level não é lido em lugar nenhum (falta `router.afterEach`) | não corrigido — infraestrutura cross-página, fora do escopo desta seção |

INFO: `bun check` do repo inteiro sai vermelho (16 errors), mas 100% em arquivos fora deste diff (`.claude/hooks/`, `.claude/skills/figma/`, `index.html`, vault json). Isolado nos 4 arquivos desta página, `bun check` sai limpo (só 2 infos de `useVueMultiWordComponentNames`, mesmo padrão aceito em `avaliacao-perfil/Topbar.vue`).

## Intervenções do orquestrador (fora do fluxo padrão de subagente)

- Editou `src/pages/AcessoRestrito.vue` diretamente para adicionar o `<main>` (M1) — escopo de composição de página, previsto no Passo 4 do `/build-page`.
- Re-despachou `section-builder` para `Topbar.vue` com `correcao_solicitada` pontual (M4) — não editou o `.vue` diretamente.
- Editou `src/routers/index.ts` para ativar a rota `/403` (descomentar) — previsto no Passo 4.

## Análise e sugestões de correção

### Causas raiz
- **Duplicação da marca (M3):** o `/build-prep` desta página (e dos 5 anteriores) avaliou "1 uso nesta página" isoladamente em vez de somar o uso cross-página acumulado (R6, critério 6 — "soma cross-página"). A marca já passou do limiar há pelo menos 2 telas; o padrão vem se replicando por precedente ("consistência > extração") em vez de ser resolvido na raiz.
- **Rota morta (M2):** resíduo de uma sessão de `/build-prep` anterior (`link-enviado`) que não chegou a rodar `/build-page` até o fim — os arquivos existem mas a rota ficou comentada. Não é uma regressão desta página, é um estado intermediário que ficou para trás.
- **"Sair" contraditório (M4):** o padrão foi copiado de `avaliacao-perfil/Topbar.vue`, que tem o mesmo defeito (lá "Sair" também vai para `/`, mas nessa tela isso faz sentido porque não é uma tela de acesso negado). Copiar o shell sem revisar a semântica do destino é o padrão de erro.

### Backlog priorizado

| Prioridade | Item | Ação sugerida |
|---|---|---|
| P1 | Extrair `BrandMark` (`src/components/shared/brand-mark/`) | Componente novo por spec R5, migrar os 6 consumidores atuais + este. Decisão de produto/arquitetura — não é fix mecânico de subagente; melhor como `/build-prep` dedicado ou refactor manual revisado por humano. |
| P1 | Resolver `avaliacao-perfil/Topbar.vue` "Sair" (mesmo defeito de M4, não desta página) | Trocar `to="/"` por `to="/login"` lá também, por consistência — humano decide se é o mesmo destino certo para aquele fluxo (é uma tela de avaliação concluída, não de acesso negado; pode ser intencional). |
| P2 | Decidir `link-enviado`: ativar rota ou remover arquivos órfãos | Rodar `/build-page link-enviado` até o fim (falta a seção `PainelProva.vue`) OU remover `src/pages/LinkEnviado.vue` + `src/views/link-enviado/` + o comentário morto em `src/routers/index.ts`. |
| P2 | `router.afterEach` para `document.title` via `meta.title` | Infra pequena, cross-página, beneficia todas as rotas top-level (`/login`, `/403`, `/criar-conta`, ...). |
| P3 | `bun check` do repo (16 errors pré-existentes) | Fora do escopo de qualquer página — merece um commit de limpeza dedicado (`.claude/hooks/check-icons.mjs`, `.claude/skills/figma/extract-screenshots.mjs`, `index.html`, vault json). |
| P3 | `max-w-[540px]`/`max-w-[480px]` → `max-w-135`/`max-w-120` em `Mensagem.vue` | Cosmético, alinha com a escala Tailwind já em uso; sem risco. |

Separação humano vs. técnico: P1 (BrandMark, Sair de avaliacao-perfil) e P2 (link-enviado) exigem decisão de produto/escopo — não são autofix. P2 (router title) e P3 são puramente técnicos, seguros para aplicar sem revisão de negócio.

### Débito documentado (não é bug desta fase)
`Sair` e `Entrar com outra conta` navegam para `/login` sem limpar sessão (não existe store de auth ainda, R8). Quando a skill de dados dinâmicos/auth existir, esses `RouterLink` viram `<button>` com handler de logout antes do redirect — sinalizado pelo próprio `section-builder`.

---

## PROMPT COPIÁVEL

```
Pendências do build de acesso-restrito (docs/build-handoff-acesso-restrito.md):

1. [P1] Extrair src/components/shared/brand-mark/BrandMark.vue (anatomia R5) e migrar os
   6 consumidores atuais da marca inline "AI Invest" (AppLayout.vue, e as views de
   login, criar-conta, recuperar-senha, link-enviado, acesso-restrito/Topbar.vue).

2. [P1] src/views/avaliacao-perfil/Topbar.vue:12 — "Sair" aponta para "/", mesmo defeito
   do finding M4 corrigido em acesso-restrito/Topbar.vue. Avaliar se faz sentido trocar
   para "/login" também ali (contexto: avaliação de perfil concluída, não acesso negado).

3. [P2] Decidir o destino de src/pages/LinkEnviado.vue + src/views/link-enviado/: ou
   completar /build-page link-enviado (falta a seção PainelProva.vue) ou remover os
   arquivos órfãos e o bloco de rota comentado em src/routers/index.ts:64-69.

4. [P2] Adicionar router.afterEach em src/routers/index.ts pra aplicar meta.title via
   document.title nas rotas top-level (login, criar-conta, recuperar-senha, 403, ...).

5. [P3] bun check do repo falha com 16 errors pré-existentes fora do escopo de qualquer
   página (.claude/hooks/check-icons.mjs, .claude/skills/figma/extract-screenshots.mjs,
   index.html, vault json) — commit de limpeza dedicado.

6. [P3] src/views/acesso-restrito/Mensagem.vue:9,17 — trocar max-w-[540px]/max-w-[480px]
   por max-w-135/max-w-120 (mesma medida, usando a escala Tailwind em vez de arbitrário).
```
