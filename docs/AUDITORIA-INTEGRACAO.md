# Auditoria de correspondência — frontend × backend (`carteira-sistema-backend`)

> Gerado em 2026-08-25, a partir da leitura de `INTEGRATION_PROMPT.md` (seções 1–5) contra
> `src/data/*.ts`, `src/routers/index.ts`, `src/config/env.ts`, `src/boot/axios.ts` e todas as
> views de `src/views/**` e páginas de `src/pages/**` deste repositório. Nenhum código foi
> alterado para produzir este documento — é o entregável da Tarefa 1 do prompt de integração,
> ponto de partida para a Tarefa 2 (implementação).
>
> Formato por item: `arquivo:campo` → o que diverge → sugestão ou pergunta em aberto.

## Sumário

1. [Achados transversais](#1-achados-transversais) — padrões que se repetem em várias telas
2. [`src/data/wallet.ts`](#2-srcdatawalletts)
3. [`src/data/cliente.ts`](#3-srcdataclientets)
4. [`src/data/admin.ts`](#4-srcdataadminadmints)
5. [`src/data/avaliacao.ts`](#5-srcdataavaliacaots)
6. [`src/data/navigation.ts`](#6-srcdatanavigationts) e layouts
7. [Fluxos sem endpoint algum no backend](#7-fluxos-sem-endpoint-algum-no-backend)
8. [Configuração do cliente HTTP](#8-configuração-do-cliente-http)

---

## 1. Achados transversais

Padrões que aparecem em múltiplos arquivos — documentados uma vez aqui, referenciados como
"ver §1.N" nas seções por arquivo.

### 1.1 — Não existe "patrimônio em R$" no backend

`totalWealth`, `wealthEvolution` (`src/data/wallet.ts`), os KPIs "Aporte do mês" e "Dividendos no
ano" (`kpis`) e todo o gráfico "Evolução patrimonial" (`EvolucaoPatrimonial.vue`) assumem que o
backend expõe o patrimônio investido do cliente em R$, mês a mês. **Ele não expõe.** O domínio do
backend é só a carteira recomendada (composição em %) e a performance dela em % vs. CDI/Ibovespa
— não há conceito de aporte, saldo em reais ou dividendos em nenhum DTO do catálogo (seção 3/4 do
prompt). Não há como derivar isso de `MinhaCarteiraPerformanceResponseDto` nem de
`DashboardInvestidorResponseDto`.

→ **Pergunta em aberto**: ou esse dado vem de um sistema de custódia externo ainda não
documentado, ou essas telas precisam ser cortadas/redesenhadas para a Tarefa 2. Sugiro perguntar
antes de remover UI — não inventar valores.

### 1.2 — `mesReferencia` (`"YYYY-MM"`) vs. rótulo pt-BR já formatado

Todo campo de competência em `src/data/*.ts` já vem como rótulo final em português:
`'Agosto 2026'`, `'Ago/26'`, `'Set/25'`, `'2026-09'` (este último em `profitabilityDraft`, o único
que já está no formato certo, por coincidência). O backend sempre devolve `mesReferencia` como
`"YYYY-MM"` puro (§1 do prompt). Nenhum desses rótulos existe pronto na API.

→ Precisa de duas funções de formatação central (ex.: `src/utils/competencia.ts`):
`formatCompetenciaLonga('2026-08') → 'Agosto 2026'` e `formatCompetenciaCurta('2026-08') →
'Ago/26'`. Usadas por: `walletDetail`, `walletVersions`, `walletProfitability`, `walletReports`,
`performanceHistory`, `painel/Cabecalho`, `carteira/Cabecalho`, `carteira/Composicao`,
`admin/carteira/*`.

### 1.3 — `PerfilInvestidor` (string) vs. `profileLevel` (1–4 numérico)

Já identificado no prompt (§6.1). Confirmado em **todos** os arquivos que usam nível numérico:
`wallet.ts:RecommendedWallet.profileLevel`, `cliente.ts:ProfileAssessment.profileLevel`,
`admin.ts:AdminWallet.profileLevel`, `admin.ts:AdminUser.profileLevel`,
`components/shared/profile-gauge/index.ts:ProfileLevel`. Nenhum é campo real da API — todos
precisam de uma função `perfilParaNivel(perfil: PerfilInvestidor): 1 | 2 | 3 | 4` (mapa fixo
`CONSERVADOR→1, MODERADO→2, ARROJADO→3, SOFISTICADO→4`), centralizada uma vez só.

### 1.4 — Campos puramente visuais sem contrapartida no backend (esperado, listar a derivação)

| Campo estático | Deriva de | Como |
|---|---|---|
| `Kpi.tone` (`'positive'\|'neutral'`) | sinal do valor (`rentabilidadeMes >= 0`) | função local, não vem da API |
| `AllocationClass.tone` / `AdminAllocationClass.tone` (`'data-1'..'data-4'`) | índice/posição na lista de classes | atribuído por ordem ao montar a lista, ciclando as 3–4 cores disponíveis |
| `Asset.trend` / `AdminWalletAsset.movement` (`'up'\|'down'\|'flat'` etc.) | `StatusMovimentacao` do backend | mapa 1:1: `ENTROU→in/'up'`, `SAIU→out/'down'`, `AUMENTOU→increase`, `REDUZIU→decrease`, `MANTER→hold/'flat'` (nomes variam por arquivo, mapeamento é o mesmo enum de origem) |
| `WealthEvolutionPoint.heightPercent` | maior valor da série (normalização 0–100%) | só se a Tarefa 2 mantiver esse gráfico — ver §1.1 |
| `WealthEvolutionPoint.isCurrent` | último item da série | `index === array.length - 1` |
| `Movement.label` / `MovementDetail.label` (`'Entrou'`, `'SAIU'` etc.) | `StatusMovimentacao` | rótulo de exibição do mesmo enum, já com capitalização diferente por tela — checar com design se isso é intencional ou inconsistência a unificar |
| `RecommendedWallet.meta` (`'4 ativos · sua carteira'`) | `itens.length` da versão + comparação com a carteira vinculada do usuário logado | string montada no frontend |
| `AdminWallet.assetCount` / `investors` | `itens.length` da versão vigente / contagem de usuários com essa `carteiraVinculada` | **`investors` não tem endpoint que devolva "quantos investidores usam esta carteira X"** — nem em `AdminDashboardResponseDto` (que só tem `distribuicaoPerfis` por perfil, não por carteira) nem em `GET /carteiras`. Ver achado 4.1. |
| `SuitabilityEntry.description` (texto composto "Avaliação concluída · 42 pontos · MODERADO") | `pontuacaoTotal` + `perfilResultante` do histórico | string montada a partir de `GET /usuarios/:id/historico-suitability` — mas ver achado 4.5, o formato desse endpoint não está no contrato (seção 3) |

### 1.5 — Nenhuma tela hoje chama `POST /auth/login`, guarda sessão ou protege rota

`src/routers/index.ts` não tem `beforeEach`, `meta.requiresAuth` ou qualquer guarda. `/admin/*` é
navegável sem autenticação nenhuma, e os formulários de login/cadastro (`Login/Formulario.vue`,
`CriarConta/Formulario.vue`) são mocks que só fazem `router.push` sem chamar a API (comentário
explícito: "Mock: sem auth real nesta fase"). `AcessoRestrito.vue` (rota `/403`) existe como
página mas nada redireciona para ela. `AppTopbar`/`AppLayout`/`AdminLayout` cravam `initials="AS"`
/ `"RD"` e um `ProfileGauge :level="2"` fixos — não lêem usuário nenhum.

→ Não é uma divergência de campo, é a Tarefa 2 inteira: a Tarefa 2 precisa **criar** a store de
sessão, o guard de rota (redirecionar não-autenticado para `/login`, redirecionar `perfil !==
'admin'` de `/admin/*` para `/403`), e plugar `AppTopbar`/sidebar footer no usuário real de
`GET /auth/me`.

### 1.6 — Paginação e séries fictícias vs. `PaginatedResult<T>` real

- `carteira/Performance.vue`: paginação com `TOTAL_PAGES = 8` fixo, sem relação com nenhum dado —
  comentário do próprio arquivo confirma ("O histórico estático cabe em uma tela... só reflete a
  página selecionada"). O backend pagina de verdade (`?page=&pageSize=`) e devolve `total` real.
- `carteira/Performance.vue`: o gráfico "Evolução acumulada" é um `<path>` SVG com geometria
  absoluta cravada nas constantes `CHART_CARTEIRA_PATH` / `CHART_CDI_PATH` / `CHART_IBOVESPA_PATH`
  (comentário: "Valores exatos do design — não aproximar nem regenerar"). Isso não é dado, é
  desenho. Para plugar em `HistoricoPerformanceResponseDto.serie` de verdade, o path SVG precisa
  ser **calculado** a partir dos pontos reais (normalização min/max por série), substituindo essas
  constantes — não é um simples troca de import.
- O mesmo vale para `walletProfitability`/`performanceHistory`: hoje 12 linhas fixas; a paginação
  real da tabela deve vir de `GET /carteiras/:id/historico-performance?periodoMeses=` (que já
  devolve a série pronta, sem paginação — é uma janela de 1 a 60 meses, não paginada) ou de
  `GET /minha-carteira/performance` para a tela de cliente (que só devolve
  `historicoUltimosMeses`, sem Ibovespa — ver achado 3.1).

---

## 2. `src/data/wallet.ts`

| Campo | Divergência | Sugestão |
|---|---|---|
| `Kpi[]` (`kpis`, `performanceIndicators`) | Mistura métricas reais (`rentabilidadeMes`, `rentabilidadeAcumuladaAno`, `percentualCdi`) com métricas inexistentes no backend: "Ativos na carteira" (deriva de `itens.length`, ok), **"Aporte do mês" e "Dividendos no ano" não têm fonte** (ver §1.1) | Separar os 4 primeiros KPIs (deriváveis) dos 2 últimos (sem fonte); reportar os 2 últimos como achado, não implementar com dado inventado |
| `totalWealth: WealthSummary` | Sem fonte no backend inteiro (ver §1.1) | idem |
| `wealthEvolution: WealthEvolutionPoint[]` | Sem fonte (ver §1.1) — mesmo se fosse substituído por `historicoUltimosMeses`, esse campo é rentabilidade em %, não patrimônio em R$ | idem — não é o mesmo dado com nome diferente, é um dado que não existe |
| `Asset.trend` / `trendLabel` | Vem de `StatusMovimentacao` (`CarteiraItemDetalheDto.statusMovimentacao`), mas o enum do backend tem **5** valores (`MANTER\|ENTROU\|SAIU\|AUMENTOU\|REDUZIU`) contra os **3** de `Asset['trend']` (`'up'\|'down'\|'flat'`) — `AUMENTOU`/`REDUZIU` não têm mapeamento 1:1 direto para `up/down` sem perder a distinção "entrou vs. aumentou" | Ou o tipo `Asset['trend']` cresce para os 5 valores (mais fiel, alinhado com `MovementDetail['direction']` que já tem `in\|out\|increase\|decrease\|hold`), ou fica explícito no mapeamento que `up` cobre `ENTROU`+`AUMENTOU` e `down` cobre `SAIU`+`REDUZIU`. `painel/Carteira.vue` e `carteira/Composicao.vue` já usam o tipo de 3 valores — decidir antes de tocar nos componentes |
| `Asset.weightPercent` | Bate com `CarteiraItemDetalheDto.pesoPercentual` | ok, sem transformação além do nome |
| `Asset.className` | Bate com `CarteiraItemDetalheDto.classeAtivo`, mas esse campo é **opcional** (`classeAtivo?: string`) no backend — a UI hoje sempre renderiza `asset.className` sem checar `null`/`undefined` | Tratar ausência (`classeAtivo` pode faltar) em vez de assumir string sempre presente |
| `RecommendedWallet.slug` | Backend não tem `slug` — carteiras são identificadas por `id` (string/uuid). `Carteiras/Lista.vue` usa `slug` só como `:key`, não em rota, então é inofensivo trocar por `id` | Trocar `slug` por `id` ao mapear `CarteiraResponseDto` |
| `RecommendedWallet.isOwn` | Deriva de comparar `carteira.id` com `AuthMeResponseDto.carteiraVinculada.id` (ou `null` se usuário não tem carteira vinculada ainda — ver achado 3.2) | função local, não vem pronto |
| `RecommendedWallet.composicao` | Vem de `CarteiraDetalheDto.versaoAtual.itens`, mas **é `null` quando a carteira não tem versão publicada** (`versaoAtual: CarteiraVersaoDetalheDto \| null`) — a tela `Carteiras/Lista.vue` sempre assume um array pronto ao abrir o drawer de composição | Tratar o caso "carteira sem versão publicada ainda" na UI (estado vazio), não assumir `composicao` sempre populado |
| `RecommendedWallet.meta` | String montada (ver §1.4) | função local |
| `Movement[]` (`movements`) | Painel usa uma lista simples de movimentações com `direction` de 4 valores (sem `hold`); isso é o mesmo dado de `MovimentacoesResponseDto.movimentacoes`, mas achatado — o backend separa em 4 arrays (`entradas`/`saidas`/`alteracoes`/`mantidos`), cada um com **campos diferentes** (`entradas` tem `pesoAtual`, `saidas` tem `pesoAnterior`, `alteracoes` tem os dois) | Função de mapeamento explícita que achata os 4 arrays em uma lista `Movement[]` para o Painel — ela também alimenta `movementGroups` (ver linha abaixo), então convém ser uma função só reaproveitada nas duas telas |
| `MovementGroup[]` (`movementGroups`) | Estrutura já espelha bem os 4 grupos de `MovimentacoesResponseDto.movimentacoes` (`entradas→in`, `saidas→out`, `alteracoes→reweight`, `mantidos→hold`) — a melhor correspondência do arquivo inteiro | Mapeamento direto, só ajustando nomes de campo (`pesoAtual`→`value`, etc.) e formatação (`20,00 %` etc.) |
| `MovementDetail.value` (ex. `'−15,00 p.p.'`) | Backend não formata pontos percentuais prontos — dá só os números (`pesoAtual`, `pesoAnterior`) | Calcular `pesoAtual - pesoAnterior` e formatar com sinal no frontend |
| `Report` / `ReportArchiveGroup` (`lastReport`, `reportArchive`) | Bate razoavelmente com `MeuRelatorioResponseDto` (`titulo`→`title`, `geradoEm`→`generatedAt`, mas falta `tamanhoBytes`→`sizeLabel` formatado) e a resposta é paginada (`PaginatedResult<MeuRelatorioResponseDto>`), não agrupada por ano — o agrupamento por `year` em `reportArchive` é derivado no frontend a partir de `mesReferencia`/`geradoEm` | Função de agrupamento por ano a partir da lista paginada; `sizeLabel` = `tamanhoBytes` formatado (`formatBytes`, não existe ainda em `utils/format.ts`) |
| `PerformanceRow` (`performanceHistory`) | Ver §1.6 — mapeia razoavelmente para `HistoricoPerformanceResponseDto.serie[]` (`competencia`←`mesReferencia` formatado, `carteira`←`rentabilidade`, `cdi`←`cdi`, `ibovespa`←`ibov`, `percentOfCdi`←`percentualCdi`, que é nulável!) | `percentOfCdi: number` no tipo estático não é opcional, mas `percentualCdi: number \| null` no backend é — tratar `null` (mês sem CDI lançado ainda?) |

---

## 3. `src/data/cliente.ts`

| Campo | Divergência | Sugestão |
|---|---|---|
| `ClientAccount.name` / `.email` | Bate com `AuthMeResponseDto.nome`/`.email` | ok |
| `ClientAccount.clientSince` | **Sem fonte** — `UsuarioResponseDto.criadoEm` existe mas não está em `AuthMeResponseDto` (que não estende `UsuarioResponseDto`, é um DTO próprio sem `criadoEm`) | Achado: `GET /auth/me` não devolve a data de criação da conta. `Conta/Detalhes.vue` mostra "Cliente desde" — perguntar se `criadoEm` deveria ser adicionado a `AuthMeResponseDto`, ou se essa informação vem de outro lugar |
| `ClientAccount.linkedWalletName` | Bate com `AuthMeResponseDto.carteiraVinculada.nome`, mas **é `null`** antes do suitability (ver achado 3.2) | Tratar estado "sem carteira vinculada ainda" na tela de Conta |
| `ProfileAssessment.date` | Bate com `ResultadoAvaliacaoDto.dataAvaliacao` (histórico completo vem de `GET /usuarios/:id/historico-suitability`, mas ver achado 4.5 — o shape de retorno desse endpoint não está documentado no contrato da seção 3 do prompt) | Confirmar o shape real do endpoint antes de implementar `Conta/Detalhes.vue` (tabela de histórico) |
| `ProfileAssessment.score` | Bate com `pontuacaoTotal` | ok |
| `ProfileAssessment.profileLabel` | Bate com `perfilResultante` (`PerfilInvestidor`), mas o tipo estático é `string` livre — deveria ser o union type `PerfilInvestidor` | Estreitar o tipo |
| `ProfileAssessment.profileLevel` | Numérico, ver §1.3 | função de mapeamento |

### 3.1 — `MinhaCarteiraPerformanceResponseDto` não tem Ibovespa

`carteira/Performance.vue` (usado também, via import, potencialmente para a área "minha
carteira") mostra 3 séries: Carteira, CDI e Ibovespa. Mas `GET /minha-carteira/performance`
devolve `historicoUltimosMeses: Array<{ mes, rentabilidade, cdi }>` — **sem `ibov`**. Só
`GET /carteiras/:id/historico-performance` (que exige o `id` da carteira, obtido de
`AuthMeResponseDto.carteiraVinculada.id`) tem os 3 valores. A tela de "Minha carteira" deveria
usar esse segundo endpoint para manter a série completa com Ibovespa, e não
`/minha-carteira/performance` (que serve melhor o resumo do Painel/Dashboard). Confirmar qual
endpoint alimenta qual seção antes de implementar.

### 3.3 — Cliente não tem como ver o próprio histórico de suitability (achado da Tarefa 2)

Descoberto ao implementar `Conta/Detalhes.vue`: `GET /usuarios/:id/historico-suitability` é
**exclusivo de admin** (seção 4.7/6 do prompt — toda a família `/usuarios` é admin-only). Um
cliente logado não pode chamar essa rota nem para o próprio `id` — dá `403 FORBIDDEN`. E
`AuthMeResponseDto` só tem `perfilInvestidor` (o enum atual), sem `pontuacaoTotal` nem
`dataAvaliacao` da última avaliação. Ou seja: **não existe nenhuma rota que um cliente logado
possa chamar para ver a própria pontuação, data da última avaliação, ou histórico de avaliações
anteriores.** A implementação atual de `Conta/Detalhes.vue` mostra só o perfil atual (badge +
gauge, via `auth.usuario.perfilInvestidor`) e omite pontuação/data/histórico — não tem de onde
vir. Perguntar se `GET /usuarios/:id/historico-suitability` deveria aceitar o próprio usuário
autenticado (não só admin), ou se `AuthMeResponseDto`/um novo endpoint deveria trazer a última
avaliação completa.

### 3.2 — Estado "sem avaliação"/"sem carteira vinculada" não existe em nenhuma tela hoje

Todo o app assume que o cliente logado **já tem** `perfilInvestidor` e `carteiraVinculada`
preenchidos (`profileAssessments[0]`, `clientAccount.linkedWalletName`, `painel/Carteira.vue`
cravando "Carteira Moderada Estratégica" no template). O backend modela isso como opcional em
todo canto (`AuthMeResponseDto.perfilInvestidor: PerfilInvestidor | null`,
`.carteiraVinculada: {...} | null`) e tem erros de negócio dedicados
(`422 SUITABILITY_PENDENTE`, `422 CARTEIRA_NAO_VINCULADA` em `GET /minha-carteira/performance`).
Nenhuma view atual tem um estado vazio para "você ainda não fez a avaliação de perfil" — a Tarefa
2 precisa desenhar esses estados (mínimo: Painel e Conta), não só trocar o import de dado.

---

## 4. `src/data/admin.ts`

### 4.1 — `AdminWallet.investors` sem endpoint

Nenhuma rota do catálogo devolve "quantos investidores estão vinculados à carteira X" — nem
`GET /carteiras` nem `GET /dashboard/admin` (que só tem `distribuicaoPerfis` **por perfil**, não
por carteira específica, e carteiras de perfis diferentes podem coexistir). `admin/carteiras/
Tabela.vue` e `admin/carteira/Cabecalho.vue` mostram esse número.

→ **Pergunta em aberto**: perguntar se existe endpoint faltante, ou se o número deve ser omitido/
substituído por algo derivável (ex.: total de investidores com aquele `perfilAlvo`, que é uma
aproximação, não o mesmo dado — carteira ≠ perfil 1:1 necessariamente).

### 4.2 — Papel "Analista" não existe no backend

`AdminUser.role: 'Cliente' | 'Analista'` e `userRoles` (usado no formulário de cadastro de
usuário, `admin/usuarios/FormularioUsuario.vue`) assumem um terceiro papel operacional além de
cliente/admin. O backend só tem `PerfilUsuario = 'admin' | 'cliente'` (dois valores, seção 3 do
prompt). Não há papel intermediário "analista" documentado em lugar nenhum do catálogo (nem em
`/usuarios`, nem em `@Roles` mencionado na seção 5).

→ Achado bloqueante para a tela de Usuários: ou "Analista" é sinônimo de `admin` na UI (rebaixar
o texto, manter o valor `'admin'` por baixo), ou é uma funcionalidade que o backend ainda não
implementa. **Perguntar antes de mapear** — não inventar um terceiro valor de `perfil`.

### 4.3 — Criar e excluir usuário não têm endpoint

`admin/usuarios/FormularioUsuario.vue` tem um fluxo completo de "Novo usuário" (`nome`, `email`,
`role` → cadastro) e `admin/usuarios/Tabela.vue` emite um evento `excluir` com botão "Excluir
usuário". O catálogo de `/usuarios` (seção 4.7 do prompt) só tem `GET` (listar) e `PATCH`
(`{ ativo?, perfil? }` — apenas ativar/inativar e trocar perfil). **Não existe `POST /usuarios`
nem `DELETE /usuarios/:id`.** O único jeito de um usuário `cliente` nascer é via
`POST /auth/register` (auto-cadastro, sempre `perfil: 'cliente'`, sem esse fluxo passar pelo
admin).

→ Achado bloqueante: a tela de "Novo usuário" e o botão "Excluir usuário" não têm o que chamar.
Perguntar se: (a) admin não cadastra usuário — só ativa/inativa/promove os que já se
auto-registraram, então "Novo usuário" deveria sair da UI; (b) exclusão realmente não existe —
"Excluir" deveria virar apenas "Inativar" (que já tem endpoint).

### 4.4 — Editar nome/e-mail do usuário não tem endpoint

O mesmo formulário permite editar `nome`/`email` de um usuário existente. `PATCH /usuarios/:id`
só aceita `{ ativo?, perfil? }` — nome e e-mail não são editáveis via API nenhuma (nem
`PATCH /usuarios/:id`, nem outra rota do catálogo).

→ Reportar como achado: o formulário de edição precisa perder os campos `nome`/`email` (ficando
só `perfil`/`ativo`), ou perguntar se existe endpoint de edição de cadastro que não está no
catálogo.

### 4.5 — Shape de `GET /usuarios/:id/historico-suitability` não está no contrato

A seção 3 do prompt não define uma interface para a resposta desse endpoint (só o descreve na
seção 4.7 como "Histórico de avaliações do usuário"). `AdminUser.history: SuitabilityEntry[]`
(`{ date, description }`) é inteiramente inventado no frontend estático — não dá pra confirmar
campo a campo sem o shape real.

→ **Pergunta em aberto**: pedir o DTO real desse endpoint antes de implementar
`admin/usuarios/Tabela.vue` (drawer de detalhe) e `Conta/Detalhes.vue` (histórico do próprio
usuário, se usar o mesmo endpoint via `/usuarios/:id` com o próprio id).

### 4.6 — `WalletDetail` mistura versão publicada e rascunho num único objeto plano

`walletDetail.publishedAssets` / `.draftAssets` / `.removedAssets` assumem sempre exatamente duas
versões carregadas ao mesmo tempo (vigente + próximo rascunho). O backend modela isso como uma
lista paginada de versões (`GET /carteiras/:id/versoes?publicada=&page=&pageSize=` →
`CarteiraVersaoResumoDto[]`), das quais o frontend escolhe quais carregar em detalhe
(`CarteiraVersaoDetalheDto`, via outro endpoint ainda — **não há `GET
/carteiras/:id/versoes/:versaoId`** no catálogo da seção 4.3! Só existe `POST .../versoes` (criar
rascunho) e `POST .../versoes/:versaoId/publicar` (publicar). Para exibir o detalhe de uma versão
específica que não é a vigente, não há rota de leitura documentada.

→ Achado bloqueante para `admin/carteira/Edicao.vue`/`Revisao.vue`/`Composicao.vue`: falta um
`GET` de detalhe de versão por id no catálogo, ou a tela precisa se apoiar só em
`GET /carteiras/:id` (que devolve `versaoAtual`, a publicada vigente) e no retorno do próprio
`POST .../versoes` (que provavelmente devolve o rascunho recém-criado) para ter o rascunho em
mãos. Perguntar antes de desenhar o fluxo de edição.

### 4.7 — `pesoAnteriorPercentual` e `justificativa` são opcionais/nuláveis

`CarteiraItemDetalheDto.pesoAnteriorPercentual?: number | null` e `.justificativa?: string | null`
— `AdminWalletAsset` (draft/published) não modela isso, sempre assume presença. Relevante para
`admin/carteira/Composicao.vue`/`Revisao.vue`, que exibem justificativa por item.

### 4.8 — `ProfitabilityRow`/`profitabilityDraft` vs. `POST/PUT .../rentabilidade`

Mapeamento razoavelmente direto (`wallet`←`rentabilidadeMes`, `cdi`←`cdiMes`,
`ibovespa`←`ibovMes`) — mas falta o campo `rentabilidadeAcumuladaAno` (lançado manualmente pelo
admin, segundo a seção 4.3 do prompt) em `ProfitabilityRow`/`profitabilityDraft`, e falta tratar
o aviso não-bloqueante `avisos: ["ACUMULADO_DIVERGENTE"]` + `acumuladoCalculado` que a resposta
de sucesso pode trazer (seção 2 do prompt: "não é erro... exibir como alerta"). Nenhuma tela hoje
tem esse alerta.

### 4.9 — `assetClassLabels` / `AssetClass[]` (catálogo de classes de ativo) sem endpoint dedicado

Não há rota `/classes-ativo` ou similar no catálogo (seção 4). As classes de ativo
(`Renda Fixa`, `Ações BR`, `FII`) só aparecem como texto livre dentro de
`CarteiraItemDetalheDto.classeAtivo?: string`. `assetClasses`/`assetClassLabels` alimentam
formulários de cadastro de ativo (`admin/ativos/FormularioAtivo.vue`) com um seletor fixo de
classes — sem uma rota de catálogo, esse seletor não tem de onde vir a lista real, e
**`CatalogAsset`/`catalogAssets` como um todo não têm endpoint** — o catálogo de "ativos"
(`/ativos`, cadastro de tickers usados nas carteiras) não está em nenhuma rota da seção 4 do
prompt.

→ Achado bloqueante: `src/pages/admin/Ativos.vue` (toda a tela) não tem endpoint de backend
documentado — nem para listar, nem para cadastrar/inativar ativo, nem para as classes. Perguntar
se essa área está fora do escopo desta rodada de integração antes de tentar implementá-la.

### 4.10 — `AdminDashboardResponseDto` vs. `closingChecklist`/`adminKpis`

`fechamentoMesAtual: { mesReferencia, versoesPublicadas, relatoriosGerados, pendente }` dá para
montar 2 dos 4 KPIs (`carteirasAtivas`, e um KPI de relatórios a partir de
`relatoriosGerados`/`carteirasAtivas`) e parte do checklist, mas **não** dá pra saber quantas
"versões em rascunho" existem (`adminKpis[2]`, "Versões em rascunho: 1") nem o detalhe por
carteira do checklist (`closingChecklist[0]`, "Rebalancear carteiras de setembro: 2 de 4") — isso
exigiria `GET /carteiras/:id/versoes?publicada=false` por carteira, um `N+1` de chamadas que o
dashboard admin não parece ter sido desenhado para evitar. Reportar como achado de UX/performance,
não só de campo.

### 4.11 — `profileDistribution` bate bem

`distribuicaoPerfis: { CONSERVADOR, MODERADO, ARROJADO, SOFISTICADO, SEM_AVALIACAO }` mapeia limpo
para `ProfileDistribution[]` — a única observação é que o estático **não tem** a fatia
`SEM_AVALIACAO`, que o backend inclui. Incluir na visualização real.

### 4.12 — `SuitabilityRange`/`suitabilityRanges` (`admin/configuracoes/Faixas.vue`) bate bem

Mapeia bem para `ConfiguracaoSuitabilityResponseDto.faixas` (`{ perfil, min, max }` — falta só
`label`, que é `perfil` formatado) e `escalaMaxima`/`versao`. Único aviso: a nota de integração da
seção 4.8 do prompt — **salvar aqui não muda o cálculo do questionário**, que usa faixas fixas no
código do backend. `Faixas.vue` hoje não avisa o admin disso; vale um aviso textual na tela ao
salvar.

---

## 5. `src/data/avaliacao.ts`

### 5.1 — Fluxo de avaliação é 1 pergunta fixa; backend tem N perguntas reais

`assessmentQuestion` é uma única pergunta hardcoded ("Por quanto tempo pretende manter esse
dinheiro investido?", 4 opções, `id: 1..4`), com `assessmentProgress = { currentStep: 2,
totalSteps: 5 }` também fixo — ou seja, a UI já finge estar "no meio" de um questionário de 5
perguntas que não existe em lugar nenhum do frontend. `GET /suitability/perguntas` devolve uma
lista real de `PerguntaSuitabilityResponseDto[]` (quantidade não documentada, decidida pelo
backend), cada uma com `opcoes: OpcaoSuitabilityResponseDto[]` que carregam `peso` (usado no
cálculo do score) — peso que a UI nunca usa nem precisa mostrar, mas precisa **coletar e enviar**.

→ Isso não é uma divergência de campo, é o fluxo inteiro de `avaliacao-perfil/Pergunta.vue` +
`AvaliacaoPerfil.vue` que precisa ser reescrito: buscar a lista real de perguntas, iterar por
todas elas (não só uma), acumular `respostas: [{ perguntaId, opcaoId }]`, e só então chamar
`POST /suitability/avaliar` com `usuarioId` (se logado — nota da seção 4.2 do prompt) ao final.

### 5.2 — `avaliacao-perfil/Resultado.vue` usa dado estático, não a resposta do POST

`Resultado.vue` hoje lê `profileAssessments[0]` de `cliente.ts` em vez de receber o
`ResultadoAvaliacaoDto` devolvido por `POST /suitability/avaliar` (`pontuacaoTotal`,
`perfilResultante`, `carteiraRecomendada`). O texto fixo "A faixa moderada vai de 26 a 50 pontos"
também está hardcoded — isso viria de `ConfiguracaoSuitabilityResponseDto.faixas`, mas essa rota é
**admin-only** (seção 4.8 do prompt) — um cliente respondendo a avaliação não tem permissão de
chamar `GET /configuracoes/suitability`.

→ Achado bloqueante: se a tela de resultado quer mostrar a faixa da pontuação, falta uma via
pública de consultar as faixas vigentes (hoje só existe a rota admin). Perguntar antes de decidir
entre (a) remover a frase da faixa, (b) pedir uma rota pública equivalente, ou (c) o backend
devolver a faixa já formatada dentro do próprio `ResultadoAvaliacaoDto` (ele não devolve hoje).

### 5.3 — `carteiraRecomendada` pode ser `null`

`ResultadoAvaliacaoDto.carteiraRecomendada: {...} | null` — a tela de resultado hoje assume que
sempre existe uma carteira recomendada exibível (CTA "Ir para o painel"). Tratar o caso `null`
(perfil calculado, mas sem carteira ativa cadastrada para aquele perfil ainda).

---

## 6. `src/data/navigation.ts` e layouts

- `navigationGroups`/`adminNavigationGroups` são só rótulos/rotas — sem contrapartida de API,
  corretamente estático (menu não muda por usuário no catálogo atual). Sem achados.
- `AppLayout.vue`/`AdminLayout.vue` cravam `initials="AS"`/`"RD"` e `ProfileGauge :level="2"`
  fixos, sem ler nenhum usuário — ver §1.5.
- Nenhum botão de logout está de fato ligado (`AppTopbar`, "Menu do usuário", é só um `<button>`
  sem `@click`) — a Tarefa 2 precisa ligar isso a `POST /auth/logout` + limpar a store.

---

## 7. Fluxos sem endpoint algum no backend

Consolidando os achados acima que bloqueiam telas inteiras, não só campos:

1. **Recuperação de senha** (`RecuperarSenha.vue`, `LinkEnviado.vue`) — não existe **nenhuma**
   rota de "esqueci minha senha" no catálogo (seção 4 do prompt não lista nada equivalente a
   `/auth/forgot-password` ou `/auth/reset-password`). As duas telas são só mock hoje
   ("Mock: sem envio real nesta fase") e continuam sem o que chamar. **Reportar como achado antes
   de tentar integrar** — não inventar a rota.
2. **Catálogo de Ativos** (`src/pages/admin/Ativos.vue` inteira) — sem rota de leitura/escrita
   (achado 4.9).
3. **Cadastro e exclusão de usuário pelo admin** — sem rota (achados 4.3/4.4).
4. **Detalhe de uma versão específica de carteira por id** (fora a vigente) — sem rota de leitura
   dedicada (achado 4.6).
5. **"Investidores por carteira"** — sem rota (achado 4.1).
6. **Patrimônio em R$ do cliente** (saldo, aporte, dividendos, evolução patrimonial) — sem rota em
   lugar nenhum do domínio do backend (achado 1.1).

---

## 8. Configuração do cliente HTTP

- `.env.example` tem `VITE_API_BASE_URL=http://localhost:3000`, sem o prefixo `/api/v1` — decisão
  pendente entre as duas opções da seção 1.1 do prompt (recomendo a opção A: manter
  `VITE_API_BASE_URL` só com host+porta e concatenar `/api/v1` no client, para não exigir que
  quem for rodar o projeto localmente edite o `.env` além do padrão do `.env.example`).
- `src/boot/axios.ts` hoje **não tem `withCredentials: true`** — sem isso o cookie `access_token`
  não vai/volta, quebrando o fluxo de auth recomendado pela seção 1 do prompt (cookie HttpOnly).
  Precisa ser adicionado.
- Não há interceptor de erro nenhum hoje — precisa ser criado (seção 2.3 do prompt: `UNAUTHORIZED`
  → logout local + redirect para `/login`, evitando loop quando a própria chamada já é a de
  login).
- `router.ts`/`boot/index.ts` ainda não foram lidos em detalhe nesta auditoria — conferir na
  Tarefa 2 como os boots são registrados no `main.ts` antes de adicionar o interceptor.

---

## Como usar este documento na Tarefa 2

Achados marcados **"bloqueante"** ou **"pergunta em aberto"** não têm resposta óbvia no material
disponível — implementar essas telas exige decidir algo que este documento não pode decidir
sozinho (cortar UI, pedir endpoint novo, ou reinterpretar o dado existente). Recomendo tratá-los
em uma rodada de perguntas ao usuário antes de escrever código para essas telas específicas,
seguindo a mesma cautela do prompt original ("não inventar comportamento do backend"). O restante
(mapeamentos diretos ou com transformação clara, seções 2–4 sem marcação de bloqueio) pode seguir
direto para implementação.
