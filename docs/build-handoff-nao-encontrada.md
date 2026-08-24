# Build Handoff — nao-encontrada

> Data: 2026-08-24
> Manifesto: docs/build-manifest-nao-encontrada.md

## 1. Dados (Passo 1)
Nenhum arquivo em `src/data/` — toda a página é conteúdo `literal` (confirmado no manifesto). Passo pulado.

## 2. Componentes (Batch 0)
Nenhum. `## Componentes compartilhados — specs` do manifesto está vazio; batch pulado.

## 3. Seções (Batches 1-N)

| Seção | Status | Assets faltantes | Desvios do manifesto | Evolução pedida | Bloqueios | Notas |
|---|---|---|---|---|---|---|
| Topbar | ok | — | — | — | — | Inline conforme `inline_na_secao`; "Sair" → `RouterLink to="/login"` |
| Mensagem | ok | — | — | — | — | `PhTray` confirmado no catálogo Phosphor; "Ir para o painel" → `to="/"`, "Entrar com outra conta" → `to="/login"` |

## 4. Code review

Revisão completa em `src/views/nao-encontrada/`, `src/pages/NaoEncontrada.vue`, `src/routers/index.ts`.

| Nível | Item | Status |
|---|---|---|
| BLOCKER | [B1] Rota `/404` sem catch-all — página inalcançável por URL real | **Corrigido** — adicionado `{ path: '/:pathMatch(.*)*', redirect: { name: 'nao-encontrada' } }` como última rota |
| MAJOR | [M1] `Topbar.vue` byte-idêntico a `acesso-restrito/Topbar.vue` (R6) | Aberto — decisão do usuário |
| MAJOR | [M2] `Mensagem.vue` quase-idêntico a `acesso-restrito/Mensagem.vue`, difere só em ícone/copy (R6) | Aberto — decisão do usuário |
| MAJOR | [M3] Bloco de rota `link-enviado` comentado no router (código morto, não introduzido por este build) | Aberto — fora do escopo desta página |
| MINOR | [m1] `meta.title` inerte fora do `AppLayout` (pré-existente em `/login`, `/criar-conta`, `/recuperar-senha`) | Aberto — não introduzido por este build |
| INFO | Tipografia, a11y e R1 100% conformes | — |

`bun check`: falha por motivos pré-existentes e não relacionados (index.html, arquivos do vault `.claude/learn/`) — confirmado via grep que nenhum erro/warning cita os arquivos desta página. `bun run build`: limpo, chunk `NaoEncontrada` gerado, 3.79s.

## 5. Intervenções do orquestrador

- Aplicado o fix do BLOCKER B1 diretamente (rota catch-all em `src/routers/index.ts`) — mudança de 1 linha, escopo de roteamento global, necessária para a página cumprir seu propósito funcional.
- Nenhuma outra alteração fora de `src/views/nao-encontrada/`, `src/pages/NaoEncontrada.vue` e `src/routers/index.ts`.

## 6. Análise e sugestões de correção

### Causas raiz
- **Duplicação estrutural (M1, M2):** `acesso-restrito` e `nao-encontrada` foram construídas como builds independentes a partir de manifestos separados, cada um decidindo "inline" isoladamente (R6 avaliada por página, não pelo conjunto das telas de sistema). O padrão de "ícone + h1 + parágrafo + 2 botões" já aparece em `avaliacao-perfil/Resultado.vue`, `acesso-restrito/Mensagem.vue` e agora `nao-encontrada/Mensagem.vue` — 3 ocorrências. O shell de topbar (`h-14 border-b` + marca + "Sair") aparece em `avaliacao-perfil/Topbar.vue`, `acesso-restrito/Topbar.vue` e `nao-encontrada/Topbar.vue`.
- **Rota sem fallback (B1, corrigido):** o manifesto de `acesso-restrito` já registrava `/403` como destino de redirect de guard; `/404` foi tratado com o mesmo padrão de rota nomeada simples, sem reconhecer que uma página "não encontrada" depende estruturalmente de um catch-all para ser alcançada.

### Backlog priorizado

- **P1 — Extrair `src/components/shared/error-state/` (compound: raiz + slot ícone + título + descrição + slot ações).** Migrar `acesso-restrito/Mensagem.vue`, `nao-encontrada/Mensagem.vue` e avaliar `avaliacao-perfil/Resultado.vue`. Reduz 3 pontos de edição para 1 quando o design do estado de erro mudar.
- **P1 — Extrair `src/components/shared/auth-topbar/` com prop `exitTo`/`exitLabel`.** Migrar `acesso-restrito/Topbar.vue` e `nao-encontrada/Topbar.vue` (byte-idênticos hoje — o caso mais simples de extrair). Avaliar se `avaliacao-perfil/Topbar.vue` (sem o símbolo "AI") é divergência de design intencional antes de incluir na migração — **decisão de design, não técnica**.
- **P2 — `router.afterEach` para sincronizar `document.title`** (`src/boot/router.ts`), resolve o `meta.title` inerte em todas as rotas standalone de uma vez (`/login`, `/criar-conta`, `/recuperar-senha`, `/404`).
- **P2 — Resolver o bloco comentado de `link-enviado`** em `src/routers/index.ts` — ativar a rota ou remover o código morto. Não é desta entrega; `LinkEnviado.vue` já existe no working tree.

### Separação humano vs. técnico
- **Decisão de design (humano):** se `avaliacao-perfil/Topbar.vue` deveria ganhar o símbolo "AI" para entrar na extração do P1, ou se é intencionalmente diferente.
- **Decisão de produto (humano):** destino real de "Sair" quando existir store de auth (hoje é `RouterLink to="/login"` por convenção, sem lógica de logout).
- **Técnico (Claude):** extração dos dois componentes shared (P1), sync de `document.title` (P2) — podem ser feitos sem consulta adicional.

## 7. PROMPT COPIÁVEL

```
Consolidar duplicação identificada no /build-page de nao-encontrada:

1. Criar src/components/shared/error-state/ErrorState.vue (compound: raiz + slot
   ícone + h1 título + p descrição + slot ações), seguindo R5 (pasta, index.ts,
   prop class, cn por último, data-slot). Migrar:
   - src/views/acesso-restrito/Mensagem.vue
   - src/views/nao-encontrada/Mensagem.vue
   Avaliar se src/views/avaliacao-perfil/Resultado.vue também migra.

2. Criar src/components/shared/auth-topbar/AuthTopbar.vue com props exitTo
   (default '/login') e exitLabel (default 'Sair'). Migrar:
   - src/views/acesso-restrito/Topbar.vue
   - src/views/nao-encontrada/Topbar.vue
   (byte-idênticos hoje — apagar os dois arquivos após migrar)
   Perguntar antes de incluir src/views/avaliacao-perfil/Topbar.vue (logo sem
   símbolo "AI" — pode ser intencional).

3. bun check + bun run build ao final.
```
