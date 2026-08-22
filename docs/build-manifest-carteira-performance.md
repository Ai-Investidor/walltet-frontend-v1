# Build Manifest — Carteira · Performance

> Gerado por /build-prep em 2026-08-21
> Fonte: pencil — `docs/template/dashboard.pen`, node `nC1yG` ("Cliente · Minha carteira · Performance")
> Para implementar: `/build-page carteira-performance`

## Identificação
- page (namespace deste build): carteira-performance
- página: **reaproveita** `src/pages/Carteira.vue` — sem arquivo novo
- seções: `src/views/carteira/` (pasta já existe)
- rota: **reaproveita** `/carteira` — sem rota nova

## Decisão de arquitetura — aba, não página nova

Mesmo padrão já estabelecido em `docs/build-manifest-carteira-movimentacoes.md`: o node `nC1yG` selecionado é a tela completa (sidebar + topbar + conteúdo) só para referência visual; a aba "Performance" já existe em `src/views/carteira/Composicao.vue` como `TabsTrigger value="performance" disabled` (linha 80-82), prevista desde o build da Carteira original.

Implicações mecânicas para o `/build-page`:

1. **Cabeçalho é idêntico ao já implementado.** Node `hK9yb` ("Cabecalho") tem o mesmo Eyebrow ("MINHA CARTEIRA · AGOSTO 2026"), Título ("Carteira Moderada Estratégica") e Texto de `src/views/carteira/Cabecalho.vue` — texto conferido 1:1 via `Get`. **Nenhuma seção nova aqui.**
2. **O shell de Abas mora em `Composicao.vue`.** O `/build-page` precisa **editar esse arquivo existente**:
   - remover `disabled` do `TabsTrigger value="performance"`;
   - adicionar `<TabsContent value="performance"><Performance /></TabsContent>`, importando de `@views/carteira/Performance.vue`.
   - Passo explícito fora do padrão "uma seção = um arquivo novo" do `section-builder` — documentar no plano de execução.
3. Nenhum stub novo de página/rota — infraestrutura já existe e passou pelo gate de auditoria dos builds anteriores.

## Frame raiz
- node-id: `nC1yG` — "Cliente · Minha carteira · Performance", 1180×1500 (tela completa; conteúdo relevante é o node `fNbBR`)
- Screenshot overview: `docs/pencil/carteira-performance-overview.pdf`
- Screenshot do conteúdo novo: `docs/pencil/carteira-performance-conteudo.pdf` (node `fNbBR`, 884×1176 — acima de 1000px, exportado em PDF)
- Screenshot das abas (contexto): `docs/pencil/carteira-performance-abas.webp` (node `gIqA4`)

## Tokens

### Adicionados
| Token | Valor | Uso |
|---|---|---|
| `text-metric-sm` | 1.9rem / 800 / 1 / -0.02em | Valor dos 4 indicadores da seção (node `dO59A`/KPI, instâncias com `fontSize` reduzido de 38.4→30.4 em relação ao uso do Painel). Letter-spacing do design ficou herdado do componente base (-0.77px, proporção da fonte maior) sem recálculo para o tamanho menor; aplicado -0.02em consistente com `text-metric`, mesmo critério de aproximação já usado no manifesto anterior para `text-eyebrow`. |
| `text-table-row` | 0.86rem / 400 / 1.55 | Coluna "Competência" das linhas da tabela (node `WFSsd` e equivalentes, 13.76px/400/lh 1.55, fonte `$font-body`) |
| `text-table-value` | 0.88rem / 700 / 1.4 | Colunas de valor da tabela (Carteira/CDI/Ibovespa/% do CDI, 14.08px/700/`$font-head`, ex. node `i8DRv8`) |
| `text-chart-label` | 0.6875rem / 700 / 1.4 | Pills de período (3M/6M/12M/Máx) e labels do eixo X do gráfico (11px/700, mesmos valores de `text-eyebrow` **sem** `uppercase`/`letter-spacing` — esses labels já vêm em caixa alta como texto literal do design, não por transform). Adicionado no `/build-page` após o review apontar `normal-case` empilhado sobre `text-eyebrow` (R2). |

Registrados em `src/assets/index.css` (`@utility`) e em `TEXT_STYLES` (`src/libs/utils.ts`) — feito neste `/build-prep`.

### Reusados
- Cor: `--success` (`$green`), `--warning` (`$amber`), `--foreground` (`$ink`), `--muted-foreground` (`$ink-soft`), `--muted-foreground-faint` (`$ink-faint`), `--border` (`$line`), `--border-strong` (`$line-strong`), `--card`/`--background` (`$paper`) — mesma paleta já documentada no manifesto do Painel, nenhuma cor nova.
- Tipografia: `text-eyebrow` (rótulo dos indicadores, cabeçalho de tabela, labels do eixo X, pills de período — mesma aproximação 700/800 já aceita no manifesto do Painel), `text-card-title` (título "Evolução acumulada", 14.72px/700 batendo exato), `text-page-title`/`text-paragraph` (Cabecalho, reusado sem alteração)

## Ícones

Nenhum SVG a extrair. Dois ícones por nome (Lucide, node `type: "icon"`), ambos já cobertos pelo kit `@components/ui/pagination` (que já importa `PhCaretLeft`/`PhCaretRight` de `@phosphor-icons/vue`):

| Lucide (design) | Phosphor | Onde |
|---|---|---|
| `chevron-left` | `PhCaretLeft` | Botão "Anterior" da paginação (já vem de `PaginationPrevious`) |
| `chevron-right` | `PhCaretRight` | Botão "Próxima" da paginação (já vem de `PaginationNext`) |

## Imagens
Nenhuma — a tela não usa `fill` de imagem em nenhum node. O gráfico é 100% vetor (4 `path`: Grade, Ibovespa, CDI, Carteira, node `ylhUV`), ver spec do componente de gráfico abaixo.

## Componentes do kit reusados
- `@components/ui/tabs` — já em uso por `Composicao.vue`; esta aba só remove o `disabled` do trigger.
- `@components/ui/card` — `Card`/`CardHeader`/`CardContent` para os cards "Evolução acumulada" e "Tabela", mesmo `CARD_SURFACE` (`gap-0 rounded-lg border py-0 ring-0`) já usado em `Composicao.vue`. Confirmado pelo node: `fill:$paper`, `stroke:$line`, `cornerRadius:8` (=`rounded-lg`) nos nodes `G82lx` (Grafico) e `K6Vv92` (Tabela).
- `@components/ui/table` — `Table`/`TableHeader`/`TableBody`/`TableRow`/`TableHead`/`TableCell` para a Tabela (12 linhas de competência), em vez de divs. Tag semântica correta para dado tabular (R13).
- `@components/ui/pagination` — `Pagination`/`PaginationContent`/`PaginationItem`/`PaginationLink`/`PaginationEllipsis`/`PaginationPrevious`/`PaginationNext` para o node `otzHv` (Anterior · 1 2 3 ... 8 · Próxima). Estrutura do node bate 1:1 com a API do componente do kit.

Container "Indicadores" (`utDg3`) **não** é `Card`: `fill:$line` (fundo = cor da borda), `gap:1` (frestas de 1px viram as divisórias), `cornerRadius:6` (=`rounded-md`, não `rounded-lg`). É o mesmo padrão `bg-border grid gap-px rounded-md overflow-hidden border` já usado em `src/views/painel/Overview.vue`, só que com `rounded-md` (6px) em vez de `rounded-lg` (8px) — diferença real do design, não erro de leitura.

## Componentes do projeto reusados
Nenhum de `src/components/wallet/` se aplica diretamente (`AssetRow` é para linhas de ativo, estrutura diferente da tabela de performance).

## Componentes compartilhados — specs

### KpiCard

**Por que criar agora:** o padrão "célula com rótulo caixa-alta + valor grande + nota" (node `dO59A`, componente Pencil "KPI") está inline em `src/views/painel/Overview.vue` (`<li>` dentro do grid de 4 colunas) e esta seção usa exatamente a mesma estrutura de dado (`label`/`value`/`note`/`tone`, já tipada como `Kpi` em `src/data/wallet.ts`) mais 4 vezes. R6: extrair a partir do 2º consumidor. Único ajuste real entre os dois usos é o tamanho do valor (`text-metric` no Painel vs `text-metric-sm` aqui) e o raio do container pai (`rounded-lg` vs `rounded-md` — fica na view, não no componente).

- destino: `src/components/wallet/kpi-card/`
- arquivos: `KpiCard.vue`, `index.ts`
- node_id: `dO59A` ("KPI")
- screenshot: `docs/pencil/carteira-performance-conteudo.pdf` (faixa superior) + `docs/pencil/painel-overview-indicadores.webp` (uso já implementado)
- usos_contados: 4 nesta seção + 4 em `src/views/painel/Overview.vue` (inline, candidato a migrar)
- aparições:
  - Carteira · Performance (4 instâncias, nova)
  - Painel · Overview (`src/views/painel/Overview.vue`, 4 instâncias, inline — candidato a migrar)
- compound: não
- envolve_primitiva: não
- precisa_cva: não (só 1 dimensão de variação — `size`; mapa simples + `cn` cobre)
- props:
  - `class?: HTMLAttributes['class']` — sempre presente
  - `label: string`
  - `value: string`
  - `note: string`
  - `tone: 'positive' | 'neutral'` — controla cor do valor (`text-success` vs `text-foreground`)
  - `size?: 'default' | 'sm'` — default `'default'` (`text-metric`); `'sm'` usa `text-metric-sm` (uso desta seção)
- data_slot: kpi-card
- slots: nenhum — conteúdo via props, igual ao `<li>` que substitui
- tokens_usados: `text-eyebrow`, `text-metric`, `text-metric-sm`, `text-label`, `text-success`, `text-foreground`, `text-muted-foreground`
- depende_de: []
- exemplo_uso: |
  ```vue
  <KpiCard
    label="MÊS"
    value="+1,85 %"
    note="CDI +0,87 % · Ibov +2,10 %"
    tone="positive"
    size="sm"
  />
  ```
- spec_confidence: alta
- spec_source: design_context (`batch_get` no node `dO59A` + 4 instâncias com `descendants` lidas)
- responsivo: célula com `flex-1`/`fill_container` dentro do grid do consumidor; sem regra própria
- a11y: nenhuma — texto simples, sem ícone decorativo

### GraficoEvolucao (inline, não vira slot)

- usos_contados: 1
- inline_na_secao: Performance
- motivo: "Gráfico de linha único nesta tela, geometria vetorial específica do design (3 séries + grade). Sem segundo consumidor e sem variants — fica inline conforme R6."
- recomendacao: inline-na-secao
- node_id: `G82lx` (frame "Grafico"), plot em `ylhUV`
- screenshot: `docs/pencil/carteira-performance-conteudo.pdf`
- tokens_usados: `text-card-title` (título), `text-eyebrow` (pills de período e labels do eixo X), `border`, `--success`, `--muted-foreground-faint`
- **Implementação recomendada:** SVG inline, não biblioteca de gráficos (RULES.md não lista nenhuma). Extrair a geometria exata dos 4 `path` do node `ylhUV` no `/build-page` com `Get("ylhUV/<childId>", {includePathGeometry:true})` — `viewBox="0 0 720 240"` para todos. Linhas: `Carteira` (`stroke:$green`, `strokeWidth:2`, traço sólido), `CDI` (`stroke:$ink-faint`, `strokeWidth:1.5`, traço tracejado — ver legenda `LsZ6E`), `Ibovespa` (`stroke:$ink-faint`, `strokeWidth:1.5`, traço pontilhado — ver legenda `ueBZh`), `Grade` (`stroke:$line`, linhas horizontais de fundo). CDI e Ibovespa têm o mesmo `stroke`, diferenciados só pelo padrão de traço (`stroke-dasharray`) — conferir no screenshot antes de codar os valores exatos do dash.
- Seletor de período (pills "3M"/"6M"/"12M"/"Máx", node `m7W5S`): **apenas o path do período 12M está desenhado no design** (nós `LeyVS`/`cUGbX`/`xTT2L`/`wS6JX` são só os botões, não datasets alternativos). Implementar o toggle como estado local (`ref`) que troca a classe ativa do botão clicado, sem trocar o path do gráfico — não inventar dado para os outros períodos.
- Eixo X (`pjG5I`): 4 labels fixos, texto literal do design — "Set/25", "Jan/26", "Mai/26", "Ago/26" (não é `v-for` sobre os 12 meses da tabela, é um subconjunto de marcação do eixo).

## Plano de dados

### Dados propostos
```yaml
dados_propostos:
  - arquivo: src/data/wallet.ts
    acao: estender
    consumido_por: [Performance]
    exports_novos:
      - performanceIndicators: Kpi[]   # reaproveita a interface Kpi já existente (label/value/note/tone)
      - performanceHistory: PerformanceRow[]
    tipos:
      - "PerformanceRow { competencia: string, carteira: number, cdi: number, ibovespa: number, percentOfCdi: number }"
  - local: src/views/carteira/Performance.vue
    motivo: estado local do seletor de período do gráfico (3M/6M/12M/Máx) e da página atual da paginação
```

`performanceIndicators` (4 itens, node `utDg3`):

| label | value | note | tone |
|---|---|---|---|
| MÊS | +1,85 % | CDI +0,87 % · Ibov +2,10 % | positive |
| NO ANO | +8,42 % | CDI +6,80 % | positive |
| % DO CDI | 212,6 % | Acumulado de 2026 | neutral |
| MESES POSITIVOS | 11 de 12 | Últimos 12 meses | neutral |

`performanceHistory` (12 itens, node `K6Vv92`, mais recente primeiro):

| competencia | carteira | cdi | ibovespa | percentOfCdi |
|---|---|---|---|---|
| Ago/26 | 1.85 | 0.87 | 2.10 | 212.6 |
| Jul/26 | 1.35 | 0.86 | 2.20 | 157.0 |
| Jun/26 | -0.10 | 0.84 | -1.80 | -11.9 |
| Mai/26 | 1.25 | 0.85 | 1.40 | 147.1 |
| Abr/26 | 1.10 | 0.83 | 0.90 | 132.5 |
| Mar/26 | 1.40 | 0.86 | 2.80 | 162.8 |
| Fev/26 | 0.30 | 0.84 | -2.40 | 35.7 |
| Jan/26 | 2.00 | 0.85 | 1.60 | 235.3 |
| Dez/25 | 1.42 | 0.84 | 3.10 | 169.0 |
| Nov/25 | 0.65 | 0.79 | 0.40 | 82.3 |
| Out/25 | 1.10 | 0.82 | -1.20 | 134.1 |
| Set/25 | 0.72 | 0.80 | 1.90 | 90.0 |

**Formatação — conferida no node, não uniforme entre colunas:**
- `carteira`/`cdi`/`ibovespa`: 2 casas decimais, sinal sempre visível (`+1,85 %`, `−0,10 %`) → `Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'always' })`, sufixo `%` manual (padrão já usado em `formatPercent` de `Composicao.vue`, mas esse helper não usa `signDisplay` — criar variante ou parametrizar).
- `percentOfCdi`: 1 casa decimal, sinal só quando negativo (`212,6 %` sem `+`, `-11,9 %` com `-`) → `signDisplay: 'negative'` (ou `'auto'`, mesmo efeito aqui pois nunca é zero).
- Cor por linha: **só a coluna Carteira muda de cor por sinal** (`text-success` quando ≥0, `text-warning` quando <0 — conferido nó a nó, node `M3PPG`/Jun-26 é o único `$amber` da tabela). CDI/Ibovespa/% do CDI permanecem `text-muted-foreground` mesmo quando negativos (design não realça o sinal nessas colunas — conferir no screenshot antes de "corrigir" isso).

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Performance | fNbBR | src/views/carteira/Performance.vue | KpiCard, ui/card, ui/table, ui/pagination | data:wallet (performanceIndicators, performanceHistory) + estado-local (período, página) | não (seção única, sem paralelismo a ganhar) | docs/pencil/carteira-performance-conteudo.pdf | pdf |

Confirmado com o usuário no início deste `/build-prep`: 1 seção (a aba inteira), consistente com o padrão de `Movimentacoes.vue` — indicadores, gráfico e tabela compõem um único arquivo de view, não três.

## Plano de execução (Fase 2)
1. Batch 0 serial: `KpiCard` (`component-builder`)
2. Seção única: `Performance.vue` (`section-builder`), consumindo `KpiCard` + `ui/card` + `ui/table` + `ui/pagination`
3. Edição pontual em `Composicao.vue`: remover `disabled` do trigger "performance", adicionar `<TabsContent value="performance"><Performance /></TabsContent>`
4. Opcional/débito técnico sinalizado: migrar `src/views/painel/Overview.vue` para `KpiCard` (`size="default"`) — não bloqueia esta aba, mas evita duplicar a estrutura pela 3ª vez no futuro
5. `bun check` + `bun run build` uma única vez no fim

## Critério de aceite por seção
- Fiel ao screenshot `docs/pencil/carteira-performance-conteudo.pdf`
- Zero valor arbitrário em cor, tipografia e espaçamento; dimensão só quando vem do design (R1, R2)
- `KpiCard` com pasta, `index.ts`, prop `class`, `cn(..., props.class)`, `data-slot` e conteúdo via props (R5)
- Tabela com `@components/ui/table` (tag semântica correta, R13); paginação com `@components/ui/pagination`
- Gráfico com geometria SVG extraída do node (`includePathGeometry`), não aproximada visualmente
- Cor da coluna "Carteira" por sinal (`text-success`/`text-warning`); demais colunas neutras mesmo quando negativas
- Desktop-first com `max-*` (R12)
- `<h2>`/heading correto para "Evolução acumulada" e cabeçalho de tabela; sem `<h1>` duplicado (Cabecalho já tem o único `<h1>` da página)

## Stubs criados
Nenhum — página, rota e pasta de seções já existem e passaram pelo gate de auditoria dos builds anteriores (Carteira e Carteira · Movimentações).

## Status

### Componentes (Batch 0)
- [x] KpiCard — status: implementado (root `<li>`, desvio documentado: consumidores são `<ul>`)

### Seções (Batches 1-N)
- [x] Performance — status: ok
- [x] Editar Composicao.vue (remover disabled, adicionar TabsContent)
- [x] bun check + bun run build — limpo (nenhum erro nos arquivos desta build; achados pré-existentes no repo, fora de escopo)
- [x] review — 0 blockers, 7 majors (5 corrigidos nesta rodada: paginação, text-eyebrow+normal-case, breakpoint, formatação KpiCard, async import; 2 registrados como débito técnico no handoff: extrair KpiCard em compound (M5) e migrar Overview.vue pro KpiCard (M4))

## Auditoria

- [x] Tokens de cor novos: nenhum novo — todos reusados, conferido contra `src/assets/index.css`
- [x] Text-styles novos (`text-metric-sm`, `text-table-row`, `text-table-value`) existem em `index.css` **e** em `TEXT_STYLES` de `src/libs/utils.ts` — 3 `@utility text-` novas, 3 entradas novas no array
- [x] Ícones: 0 SVGs a extrair (ambos os ícones do design já cobertos pelo kit `ui/pagination`) — sem HARD FAIL
- [x] Imagens: 0 image-fills no design, 0 arquivos esperados em `src/assets/images/carteira-performance/` — pasta não criada, nada a baixar
- [x] Overview capturado em PDF: `docs/pencil/carteira-performance-overview.pdf`
- [x] Seção `fNbBR` (884×1176, >1000px) capturada em PDF: `docs/pencil/carteira-performance-conteudo.pdf`
- [x] Spec `KpiCard` completa: props, data_slot, exemplo_uso, spec_confidence alta
- [x] Nenhum componente com confidence baixa — sem checkpoint humano necessário
- [x] Kit `ui/` consultado antes de propor componente novo: `card`, `table`, `pagination`, `tabs` confirmados existentes e reusados; só `KpiCard` (domínio `wallet`, não existe no kit) virou spec nova
- [x] Fonte de dados declarada: `data:wallet` (indicadores + histórico) + `estado-local` (período do gráfico, página da tabela)
- [x] Dado estático aponta para `src/data/wallet.ts` (estender); reuso por domínio checado via leitura do arquivo atual e do manifesto da Carteira/Movimentações — mesmo domínio, mesmo arquivo
- [x] Stubs: nenhum necessário (infraestrutura já existe); confirmado lendo `src/routers/index.ts`, `src/pages/Carteira.vue` e `src/views/carteira/Composicao.vue`

Todos os gates ✅.

## /build-prep concluído — carteira-performance (fonte: pencil)

✓ Tokens: 3 text-styles novos, 8 cores reusadas (index.css + TEXT_STYLES)
✓ Ícones: 0 extraídos — 2 já cobertos pelo kit ui/pagination
✓ Imagens: 0
✓ Screenshots: 3 (overview PDF, conteúdo PDF, abas webp)
✓ Inventário: 1 seção (Performance — indicadores + gráfico + tabela + paginação, sem paralelismo)
✓ Componentes: 4 reusados do kit (tabs, card, table, pagination), 1 spec nova (KpiCard)
✓ Plano de dados: 1 arquivo estendido (`src/data/wallet.ts` — `performanceIndicators`, `performanceHistory`)
✓ Manifesto: docs/build-manifest-carteira-performance.md
✓ Stubs: nenhum necessário — rota `/carteira` e `Composicao.vue` já existem
✓ Auditoria: todos os gates passaram

**Próximo passo:**

  1. Revisar `docs/build-manifest-carteira-performance.md` (~10 min)
     - spec do `KpiCard`: size variant (`default` vs `sm`), e se vale migrar `Overview.vue` já nesta rodada
     - geometria do gráfico: decisão de extrair path exato via `includePathGeometry` vs redesenhar com valores aproximados
     - formatação de sinal nas colunas da tabela (só "Carteira" muda de cor)
  2. `/build-page carteira-performance`

Ajustes no inventário, nas specs ou no plano de dados devem ser feitos no manifesto antes de seguir — a Fase 2 lê o arquivo como fonte de verdade.
