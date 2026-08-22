# Build Manifest — Conta

> Gerado por /build-prep em 2026-08-22 04:00
> Fonte: pencil — `docs/template/dashboard.pen`, node `psb6u` ("Cliente · Minha conta")
> Para implementar: `/build-page conta`

## Identificação
- page: conta
- página: src/pages/Conta.vue
- seções: src/views/conta/
- rota: /conta

**Nota de wiring (fora do escopo mecânico deste `/build-prep`, mas necessária no `/build-page`):** o item de navegação "Minha conta" já existe em `src/data/navigation.ts:36` com `available: false`. Depois que `Conta.vue` estiver implementada e passar no gate, o `/build-page` deve trocar para `available: true` — é o único jeito do link aparecer na Sidebar.

## Frame raiz
- node-id: `psb6u` — "Cliente · Minha conta", 1180×860 (tela completa; conteúdo relevante é o node `d0lO1q` "Conteudo", 932×800)
- Screenshot overview: `docs/pencil/conta-overview.pdf`

Sidebar (`hLGbD`, ref de `QDU3a`/"Sidebar Cliente") e Topbar (`I9XccB`, ref de `zst25`) do frame raiz **não geram seção nova** — já implementados globalmente em `src/layouts/AppLayout.vue`. Título da Topbar no design ("Minha conta") mapeia para `meta.title` da rota, já registrado no stub.

## Tokens

### Adicionados
| Token | Valor | Uso |
|---|---|---|
| `text-tag` | 0.72rem / 800 / 1.2 / letter-spacing 0.07em / uppercase / `font-heading` | Rótulo do perfil ativo ao lado do medidor ("MODERADO", node `S1q73`, 11.52px/800/0.081em — nenhum estilo do catálogo cobre peso 800 nessa faixa de tamanho; `text-eyebrow` é 700). |
| `text-tag-sm` | 0.66rem / 800 / 1.2 / letter-spacing 0.06em / uppercase / `font-heading` | Coluna "Perfil" das 3 linhas do histórico de avaliações (nodes `qyJyA`/`RJY4t`/`ua2rv`, 10.56px/800/0.06em) — variante compacta de `text-tag`, mesmo padrão já usado no par `text-metric`/`text-metric-sm`. |

Registrados em `src/assets/index.css` (`@utility`) e em `TEXT_STYLES` (`src/libs/utils.ts`) — feito neste `/build-prep`.

### Reusados (com aproximação documentada)
- `text-eyebrow` + `text-muted-foreground-faint` — Eyebrow "CONTA" do Cabecalho (10.24px/700/0.72px de tracking vs 11px/700/0.55px do token). Mesma aproximação já aceita no manifesto de `carteira-performance` para rótulos 700/800 na faixa 10–11.5px. Também cobre os 4 Rótulos do card "Dados" (NOME, E-MAIL, CLIENTE DESDE, CARTEIRA VINCULADA — todos 10.24px/700) e o rótulo "HISTÓRICO DE AVALIAÇÕES" (10.24px/**800**, mesma aproximação de peso).
- `text-page-title` + `text-foreground` — Título "Minha conta" (28px/800/1.1, bate exato).
- `text-card-title` — títulos dos cards "Dados" e "Perfil de investidor" (14.72px/700, bate exato).
- `text-table-row` — Valores do card "Dados" (13.76px/400/1.55, bate exato); texto "Avaliação de 19/08/2026 · 42 pontos" e coluna "Data" das linhas do histórico (13.44px/400/1.55 — 0.32px de diferença, mesma família tipográfica e caso de uso de "linha com dado corrido").
- `text-table-value` — Coluna "Pontos" do histórico (13.44px/700/`font-heading` vs 14.08px do token — 0.64px de diferença; peso e família batem, único ponto de atenção pro `section-builder` conferir lado a lado com o screenshot).
- `text-label` — Nota de suporte do card "Dados" ("Para alterar nome ou e-mail...", 12.8px/400 vs 13px/400 do token — 0.2px, ruído de subpixel do Pencil).
- Cor: `--foreground`/`--muted-foreground`/`--muted-foreground-faint`/`--border`/`--border-strong`/`--card`/`--background` (mapeamento 1:1 já confirmado em manifestos anteriores) + `--success` (tom verde do perfil mais recente, node `S1q73`/`qyJyA`, `$green`). Nenhuma cor nova — `$amber`/warning não é usado nesta tela.

## Ícones
Nenhum. Sem `type: icon`, `path` ou grupo vetorial dentro do conteúdo da página (`d0lO1q`) — só texto e duas instâncias de componente (`Medidor`, `Botao Outline`), ambas já implementadas no projeto.

## Imagens
Nenhuma. Sem `fill` de imagem em nenhum node do conteúdo.

## Componentes do kit reusados
- `@components/ui/button` variant `outline` — botão "Refazer avaliação" (node `G7S2F`, ref de "Botao Outline", padding 9/15, `text-tag`... não, texto do botão é 13.44px/normal — usar `text-button-sm` ou classe custom, mesmo padrão de override de padding já usado em `src/views/carteiras/Lista.vue` (`ACTION_CLASS`) em vez de criar variante nova de tamanho.

## Componentes do projeto reusados
- `@components/shared/profile-gauge` (`ProfileGauge`) — node `YivhO` (ref de "Medidor Perfil"). Mapeamento de nível: mesmo critério já usado em `AppLayout.vue` (perfil "Moderado" → `level={2}` `tone="success"`); o histórico usa o gauge só na linha atual (Nivel), as 3 linhas da tabela não têm gauge, só texto.
- `@components/ui/button` (ver acima) — não `@components/shared/legal-notice`: a "Nota" deste card é um aviso de suporte (trocar e-mail), semanticamente diferente do aviso legal de rentabilidade usado em `Carteira`/`Carteiras`.

## Componentes compartilhados — specs
Nenhum novo. Nada nesta página atinge 2 usos reais fora do que já existe (`ProfileGauge`, `Button`). As duas "cartas" (Dados, Perfil) têm formas de conteúdo diferentes entre si (par rótulo/valor vs linha data/pontos/tag) — não há estrutura repetida entre elas que justifique extração; ver `## Estruturas inline-only`.

## Estruturas inline-only

### LinhaDado (par rótulo/valor)
- usos_contados: 4 (dentro da mesma seção)
- inline_na_secao: Detalhes
- motivo: "4 pares rótulo/valor dentro do card 'Dados' (nodes `aH7GR`, `ND6yl`, `tAjfS`, `FBJ34`). Repetição dentro da mesma seção — R6 resolve com `v-for` sobre um array de `{label, value}`, não com componente novo."
- recomendacao: v-for
- node_id: "aH7GR"
- screenshot: docs/pencil/conta-detalhes.webp
- tokens_usados: text-eyebrow, text-table-row

### LinhaHistorico (data/pontos/perfil)
- usos_contados: 3 (dentro da mesma seção)
- inline_na_secao: Detalhes
- motivo: "3 linhas do histórico de avaliação (nodes `q7yfHq`, `JZuzR`, `qQ2Ho`), mesma estrutura de 3 colunas. R6 resolve com `v-for` sobre `profileAssessments`."
- recomendacao: v-for
- node_id: "q7yfHq"
- screenshot: docs/pencil/conta-detalhes.webp
- tokens_usados: text-table-row, text-table-value, text-tag-sm

## Plano de dados

Domínio novo — nada em `src/data/` cobre dados de cliente/perfil de investidor hoje (`Glob src/data/` só retorna `navigation.ts` e `wallet.ts`; nenhum manifesto anterior propôs este domínio).

### Dados propostos
```yaml
dados_propostos:
  - arquivo: src/data/cliente.ts
    acao: criar
    consumido_por: [Detalhes]
    exports:
      - clientAccount: ClientAccount
      - profileAssessments: ProfileAssessment[]
    tipos:
      - "ClientAccount { name: string, email: string, clientSince: string, linkedWalletName: string }"
      - "ProfileAssessment { date: string, score: number, profileLabel: string, profileLevel: 1 | 2 | 3 | 4 }"
```

**Atualização pós-review (build-page):** `profileLevel` foi adicionado ao contrato — mesmo padrão de `RecommendedWallet` em `src/data/wallet.ts:56-59`. A primeira versão do `/build-prep` tinha omitido o campo, o que levou a `Detalhes.vue` a reconstruir o mapeamento label→nível localmente (MAJOR do code review). Não reconstruir esse mapa na view — consumir `profileLevel` direto do dado.

- `clientSince`/`date` em ISO (`'2026-02-12'`), formatados `dd/MM/yyyy` na view — mesmo padrão de `Movement.data` em `wallet.ts`.
- **Não duplicar** a avaliação "atual" (Nivel: 19/08/2026 · 42 pontos · MODERADO) como campo separado — é o mesmo registro da 1ª posição de `profileAssessments` (`profileAssessments[0]`). A view deriva `nível atual` e `tom` (verde só no mais recente, cinza nos demais — confirmado no screenshot: `RJY4t`/`ua2rv` usam `$ink-soft`, só `qyJyA` usa `$green`) a partir do array, sem campo `tone` redundante nos dados.
- Valores de exemplo (do design): `{ name: 'Ana Paula Silva', email: 'ana.silva@email.com', clientSince: '2026-02-12', linkedWalletName: 'Moderada Estratégica' }` e histórico `[{date:'2026-08-19',score:42,profileLabel:'MODERADO'}, {date:'2026-02-14',score:38,profileLabel:'MODERADO'}, {date:'2026-02-12',score:22,profileLabel:'CONSERVADOR'}]`.
- Nota de suporte ("Para alterar nome ou e-mail, escreva para suporte@aiinvest.com.br.") e os dois textos do Cabecalho (Eyebrow "CONTA", Título "Minha conta") são `literal`, direto no template — não entram em `src/data/`.

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Cabecalho | hf9Vg | src/views/conta/Cabecalho.vue | — | literal | sim | docs/pencil/conta-cabecalho.webp | webp |
| 2 | Detalhes | j8T8S | src/views/conta/Detalhes.vue | ProfileGauge, ui/button | data:cliente | sim | docs/pencil/conta-detalhes.webp | webp |

## Plano de execução (Fase 2)
1. Batch 0: nenhum componente compartilhado novo — pular.
2. Batch paralelo (máx 3): Cabecalho, Detalhes (2 seções, independentes entre si).
3. Depois do gate: marcar `available: true` em `src/data/navigation.ts:36` (item "Minha conta").

## Critério de aceite por seção
- Fiel ao screenshot da seção
- Zero valor arbitrário em cor, tipografia e espaçamento; dimensão só quando vem do design (R1, R2)
- Repetições (`LinhaDado`, `LinhaHistorico`) resolvidas com `v-for` sobre os arrays de `src/data/cliente.ts`, não hardcoded (R6)
- `<h1>` único = título "Minha conta" (Cabecalho); títulos dos cards como `<h2>`; par rótulo/valor do card "Dados" como `<dl>`/`<dt>`/`<dd>` (R13)
- Botão "Refazer avaliação" com `<button type="button">` real (via `Button` do kit), não `<div>` clicável (R13)
- Desktop-first com `max-*` caso a seção precise de ajuste abaixo do breakpoint (R12) — grid de 2 colunas (`Dados` 494px / `Perfil` 366px) provavelmente empilha em `max-md`
- `text-tag`/`text-tag-sm` conferidos lado a lado com `docs/pencil/conta-detalhes.webp` antes do commit — são tokens novos, sem uso prévio no projeto

## Stubs criados
- src/pages/Conta.vue
- src/views/conta/ (pasta vazia)
- rota `conta` registrada em src/routers/index.ts (name: 'conta', meta.title: 'Minha conta')

## Status

### Componentes (Batch 0)
- Nenhum — pular Batch 0

### Seções (Batches 1-N)
- [x] Cabecalho
- [x] Detalhes
- [x] bun check + bun run build
- [x] review (2 MAJOR corrigidos; ver docs/build-handoff-conta.md)
