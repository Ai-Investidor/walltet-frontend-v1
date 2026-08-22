# Build Manifest — Carteira · Movimentações

> Gerado por /build-prep em 2026-08-21
> Fonte: pencil — `docs/template/dashboard.pen`, node `FOByI` ("Cliente · Minha carteira · Movimentações")
> Para implementar: `/build-page carteira-movimentacoes`

## Identificação
- page (namespace deste build): carteira-movimentacoes
- página: **reaproveita** `src/pages/Carteira.vue` — sem arquivo novo
- seções: `src/views/carteira/` (pasta já existe)
- rota: **reaproveita** `/carteira` — sem rota nova

## Decisão de arquitetura — aba, não página nova

Confirmado com o usuário no início deste `/build-prep`: o manifesto anterior (`docs/build-manifest-carteira.md`) já havia deixado a aba "Movimentações" como `disabled`, prevista para ganhar seu próprio `/build-prep` + `/build-page`. O node `FOByI` selecionado agora é exatamente essa aba — mesma rota `/carteira`, mesmo `src/pages/Carteira.vue`, mesmo shell de Abas.

Implicações mecânicas para o `/build-page`:

1. **Cabeçalho é idêntico ao já implementado.** O node `o2a1Qt` ("Cabecalho") desta tela tem o mesmo Eyebrow ("MINHA CARTEIRA · AGOSTO 2026"), o mesmo Título ("Carteira Moderada Estratégica") e o mesmo Texto de `src/views/carteira/Cabecalho.vue`. **Não há seção nova a implementar aqui** — o componente existente já cobre esta aba. Confirmar visualmente contra `docs/pencil/carteira-cabecalho.webp` (já capturado no build anterior) antes de assumir, mas o texto batendo 1:1 no `batch_get` já é forte evidência.
2. **O shell de Abas mora em `Composicao.vue`, não em `Carteira.vue`.** A implementação atual (`src/views/carteira/Composicao.vue`) já contém `<Tabs>` + `<TabsList>` com os 3 triggers, dois deles `disabled`, e só `<TabsContent value="composicao">`. Para ligar esta aba, o `/build-page` precisa **editar esse arquivo existente**, não só criar um novo:
   - remover `disabled` do `TabsTrigger value="movimentacoes"`;
   - adicionar `<TabsContent value="movimentacoes"><Movimentacoes /></TabsContent>`, importando `Movimentacoes` de `@views/carteira/Movimentacoes.vue`.
   - Isso está fora do padrão "uma seção = um arquivo novo" do `section-builder` — documentar como passo explícito no plano de execução (ver abaixo), a ser feito depois que `Movimentacoes.vue` existir.
3. Nenhum stub novo de página/rota é necessário — a infraestrutura já existe e passou pelo gate de auditoria dos dois builds anteriores.

## Frame raiz
- node-id: `FOByI` — "Cliente · Minha carteira · Movimentações", 1180×1000
- Screenshot: `docs/pencil/carteira-movimentacoes-overview.pdf`

## Tokens

### Adicionados
| Token | Valor | Uso |
|---|---|---|
| `text-paragraph-strong` | 0.88rem / 600 / 1.4 | Campo "Nome" da Linha Ativo (`pabok`/`sgfHB`) — 14.08px/600/`font-body` no design; nenhum text-style existente tem peso 600 em corpo de texto (`text-paragraph` é 400, `text-button-sm` é 600 mas 15px/line-height 1, feito para botão). Registrado em `src/assets/index.css` e em `TEXT_STYLES` (`src/libs/utils.ts`). |

Nenhuma cor nova — a paleta inteira desta tela (`$green`, `$amber`, `$ink`, `$ink-soft`, `$ink-faint`, `$line`, `$paper`) já existe em `src/assets/index.css` desde o build do Painel (`--success`, `--warning`, `--foreground`, `--muted-foreground`, `--muted-foreground-faint`, `--border`, `--card`/`--background`).

### Reusados
- Cor: `--success`, `--warning`, `--foreground`, `--muted-foreground-faint`, `--border`, `--card`
- Tipografia: `text-eyebrow` (rótulo de status, "ENTROU"/"SAIU"/... — mesma aproximação 700 vs 800 já documentada no manifesto do Painel), `text-label` (detalhe do ativo e contagem "N ativo(s)"), `text-card-title` (título do grupo e valor à direita), `text-page-title`/`text-paragraph` (Cabecalho, reusado sem alteração)

## Ícones

Nenhum SVG a extrair — mesmo padrão já estabelecido nos dois builds anteriores: o design usa ícones por nome (Lucide, node `type: "icon"`), mapeados para `@phosphor-icons/vue`. Todos os ícones desta tela **já constam** na tabela de `docs/build-manifest-painel.md`, nenhuma entrada nova:

| Lucide (design) | Phosphor | Onde nesta tela |
|---|---|---|
| `arrow-down-right` | `PhArrowDownRight` | Cabeçalho e linha do grupo "Entradas" (verde) |
| `arrow-up-right` | `PhArrowUpRight` | Cabeçalho e linha do grupo "Saídas" (âmbar) |
| `arrow-left-right` | `PhArrowsLeftRight` | Cabeçalho do grupo "Alterações de peso" (neutro) |
| `arrow-up` | `PhArrowUp` | Linha "AUMENTOU" dentro de Alterações de peso (verde) |
| `arrow-down` | `PhArrowDown` | Linha "REDUZIU" dentro de Alterações de peso (âmbar) |
| `minus` | `PhMinus` | Cabeçalho e linha do grupo "Mantidos" (neutro-fraco) |

## Imagens
Nenhuma — a tela não usa `fill` de imagem em nenhum node.

## Componentes do kit reusados
- `@components/ui/tabs` — já em uso por `Composicao.vue`; esta aba só remove o `disabled` do trigger correspondente.

Nenhum outro componente do kit novo: os 4 grupos são `div`s com borda/raio (não `Card`), consistente com o node (`fill:$paper, cornerRadius:8, stroke:$line`) — mais simples que o `bg-card rounded-lg border` do padrão `Card` usado em Composição/Painel. Avaliar no `/build-page` se vale usar `Card`/`CardHeader`/`CardContent` mesmo assim por consistência com o resto do app, ou manter `div` simples fiel ao node — decisão visual de baixo risco, não trava a implementação.

## Componentes do projeto reusados
Nenhum ainda existe em `src/components/wallet/` (pasta vazia). Ver spec nova abaixo — este build é o gatilho para finalmente extrair o padrão.

## Componentes compartilhados — specs

### AssetRow

**Por que criar agora:** o padrão "chip com iniciais + nome/detalhe + ícone-status/rótulo + valor à direita" (node Pencil `pabok`, "Linha Ativo") já está duplicado **inline, palavra por palavra em classes Tailwind**, em `src/views/painel/Carteira.vue` (4 instâncias) e `src/views/carteira/Composicao.vue` (4 instâncias). R6 do `RULES.md` manda extrair a partir do 2º consumidor; a regra 6 do Passo 7 deste comando é ainda mais explícita — "aparece com 1 uso em manifesto anterior e ganha mais um agora → cria slot novo". Isso já deveria ter acontecido no build da Carteira; não aconteceu. Esta seção usa o mesmo padrão mais 4 vezes — é o 3º consumidor. Criar agora e não adiar de novo.

- destino: `src/components/wallet/asset-row/`
- arquivos: `AssetRow.vue`, `index.ts`
- node_id: `pabok` ("Linha Ativo")
- screenshot: `docs/pencil/carteira-movimentacoes-conteudo.webp` (uso nativo, layout flex do node) + `docs/pencil/carteira-composicao.webp` (uso já implementado, hoje como grid inline)
- usos_contados: 4 nesta seção (Entradas, Saídas ×1, Alterações de peso ×2, Mantidos) + 2 páginas já implementadas inline (`painel/Carteira.vue`, `carteira/Composicao.vue`)
- aparições:
  - Movimentacoes (4 instâncias, nova)
  - Painel · Carteira (`src/views/painel/Carteira.vue`, 4 instâncias, inline — candidato a migrar)
  - Carteira · Composicao (`src/views/carteira/Composicao.vue`, 4 instâncias, inline — candidato a migrar)
- compound: não
- envolve_primitiva: não
- precisa_cva: não (conteúdo varia por props, não por variantes de classe)
- props:
  - `class?: HTMLAttributes['class']` — sempre presente
  - `code: string` — iniciais do chip (ex.: "MX")
  - `name: string`
  - `detail: string` — classe do ativo ou faixa de transição de peso (ex.: "FII · Papel", "25,00 % → 30,00 %")
  - `icon: Component` — ícone Phosphor já resolvido pelo caller
  - `tone: string` — classe Tailwind de cor aplicada ao ícone+rótulo (ex.: `'text-success'`)
  - `label: string` — rótulo em caixa alta (ex.: "ENTROU")
  - `value: string` — valor já formatado, alinhado à direita (ex.: "20,00 %", "+5,00 p.p.")
- data_slot: asset-row
- slots: nenhum — todo o conteúdo via props (layout fixo replicando o node `pabok`: identificação `fill_container` + status `w-[150px]` + valor `w-[76px]` alinhado à direita)
- tokens_usados: `text-eyebrow`, `text-paragraph-strong`, `text-label`, `text-card-title`, `border`
- depende_de: []
- exemplo_uso: |
  ```vue
  <AssetRow
    code="MX"
    name="MXRF11"
    detail="FII · Papel"
    :icon="PhArrowDownRight"
    tone="text-success"
    label="ENTROU"
    value="20,00 %"
  />
  ```
- spec_confidence: alta
- spec_source: `batch_get` direto do node `pabok` (estrutura completa lida, sem ambiguidade) + confirmação visual via screenshot da seção
- responsivo: largura controlada pelo container pai (`fill_container`); sem breakpoint próprio — o grupo pai já limita a 884px/desktop
- a11y: chip é decorativo (`aria-hidden`); ícone de status também `aria-hidden` (o rótulo textual ao lado já comunica o estado)
- status: **implementado** (`src/components/wallet/asset-row/`, `AssetRow.vue` + `index.ts`, 53 linhas)
- nota de migração (opcional, não bloqueia este build): os dois usos existentes usam grid CSS (`grid-cols-[...]`) para alinhar colunas com cabeçalho de tabela — layout diferente do flex nativo do node `pabok` que esta seção usa sem cabeçalho de coluna. Migrar `painel/Carteira.vue` e `carteira/Composicao.vue` para `AssetRow` é recomendado por R6, mas exige adaptar o wrapper (grid vs flex) — decisão do `/build-page`, não trava a implementação desta seção.
- **nota para a section-builder desta página:** o root do `AssetRow` é `<li>` (R13 — linha de lista semântica). Cada grupo (Entradas/Saídas/Alterações de peso/Mantidos) precisa envolver as instâncias em `<ul>`, com `AssetRow` como filho direto (o separador entre linhas é `not-first:border-t` no próprio componente — só funciona sem wrapper por item).

## Estruturas inline-only
Nenhuma — os 4 cabeçalhos de grupo (Entradas/Saídas/Alterações de peso/Mantidos) têm estrutura idêntica entre si (ícone + título + contagem) mas aparecem só nesta seção; ficam inline no `v-for` sobre `movementGroups` (ver Plano de dados), não viram componente à parte — não atingem o patamar de reuso cross-seção que justificaria extração (R6).

## Plano de dados

### Dados propostos
```yaml
dados_propostos:
  - arquivo: src/data/wallet.ts
    acao: estender
    consumido_por: [Movimentacoes]
    exports_novos:
      - movementGroups: MovementGroup[]
    tipos_novos:
      - MovementDetail { code: string, name: string, detail: string, direction: 'in' | 'out' | 'increase' | 'decrease' | 'hold', label: string, value: string }
      - MovementGroup { kind: 'in' | 'out' | 'reweight' | 'hold', title: string, items: MovementDetail[] }
```

**Por que tipos novos e não estender `Movement`/`Asset` existentes:** `Movement` (usado no widget de `src/views/painel/Movimentacoes.vue`) só tem `{id, name, direction, label}` — sem chip/detalhe/valor, formato mais pobre; alargar sua forma quebraria o consumidor existente ou o deixaria com campos `undefined`. `Asset` (usado em Composição) tem `weightPercent: number`, mas aqui o valor por linha às vezes é uma diferença já formatada com sinal e unidade (`"+5,00 p.p."`, `"−15,00 p.p."`) — não é um número puro reaproveitável pela mesma fórmula de `formatPercent`. Tipo novo evita forçar semânticas diferentes na mesma interface (R8: assinatura é contrato).

### Conteúdo proposto (`movementGroups`)
```ts
export const movementGroups: MovementGroup[] = [
  {
    kind: 'in',
    title: 'Entradas',
    items: [
      { code: 'MX', name: 'MXRF11', detail: 'FII · Papel', direction: 'in', label: 'ENTROU', value: '20,00 %' },
    ],
  },
  {
    kind: 'out',
    title: 'Saídas',
    items: [
      { code: 'PT', name: 'PETR4', detail: 'Ações BR · Petróleo', direction: 'out', label: 'SAIU', value: '−15,00 p.p.' },
    ],
  },
  {
    kind: 'reweight',
    title: 'Alterações de peso',
    items: [
      { code: 'TD', name: 'Tesouro IPCA+ 2035', detail: '25,00 % → 30,00 %', direction: 'increase', label: 'AUMENTOU', value: '+5,00 p.p.' },
      { code: 'VL', name: 'VALE3', detail: '25,00 % → 20,00 %', direction: 'decrease', label: 'REDUZIU', value: '−5,00 p.p.' },
    ],
  },
  {
    kind: 'hold',
    title: 'Mantidos',
    items: [
      { code: 'BB', name: 'BBDC4', detail: 'Ações BR · Bancos', direction: 'hold', label: 'MANTER', value: '30,00 %' },
    ],
  },
]
```

Texto literal confirmado pelos campos `content` dos nodes (não lido do screenshot), por grupo:
- `GCS0l`/`B7wnQZ`/`oScIi`/`SOMtg` (cabeçalhos) e as 5 instâncias de `pabok` (`S4XpX`, `LgMlN`, `jkMfZ`, `F9W5U`, `av4hM`).

Fica **literal no template**, não em `src/data/`:
- Contagem "N ativo(s)" por grupo — calcular via `group.items.length` + pluralização (`ativo`/`ativos`), não hardcodear (mesmo precedente de `assets.length` em Composição).

### Mapeamento ícone/tom (local ao componente, não em `src/data/`)
Mesma convenção de `DIRECTIONS`/`ASSET_STATUS` já usada em `painel/Movimentacoes.vue` e `carteira/Composicao.vue` — mapa local no `<script setup>` da nova view, **não** em `src/data/` (é apresentação, não dado):

```ts
const ITEM_DIRECTION: Record<MovementDetail['direction'], { icon: Component; tone: string }> = {
  in: { icon: PhArrowDownRight, tone: 'text-success' },
  out: { icon: PhArrowUpRight, tone: 'text-warning' },
  increase: { icon: PhArrowUp, tone: 'text-success' },
  decrease: { icon: PhArrowDown, tone: 'text-warning' },
  hold: { icon: PhMinus, tone: 'text-muted-foreground-faint' },
}

const GROUP_HEADER: Record<MovementGroup['kind'], { icon: Component; tone: string }> = {
  in: { icon: PhArrowDownRight, tone: 'text-success' },
  out: { icon: PhArrowUpRight, tone: 'text-warning' },
  reweight: { icon: PhArrowsLeftRight, tone: 'text-foreground' },
  hold: { icon: PhMinus, tone: 'text-muted-foreground-faint' },
}
```

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| — | Cabecalho | `o2a1Qt` | *(nenhum — já implementado)* | `src/views/carteira/Cabecalho.vue` (idêntico) | literal | — | `docs/pencil/carteira-cabecalho.webp` (reusado do build anterior) | webp |
| 1 | Movimentacoes | `AkiBM` (Abas) + `Wuvha` (conteúdo) | `src/views/carteira/Movimentacoes.vue` | `AssetRow` (novo, Batch 0) | `data:wallet` (`movementGroups`) | não (única seção de conteúdo) | `docs/pencil/carteira-movimentacoes-abas.webp`, `docs/pencil/carteira-movimentacoes-conteudo.webp` | webp |

A linha "Cabecalho" não entra no plano de execução como seção a construir — é confirmação de que nada muda ali.

## Plano de execução (Fase 2)
1. **Batch 0 (serial):** criar `AssetRow` (`component-builder`) — sem `depende_de`.
2. **Seção (serial, única):** `Movimentacoes.vue` (`section-builder`), consumindo `AssetRow` e `movementGroups`.
3. **Passo direto (fora do `section-builder`, depois do passo 2):** editar `src/views/carteira/Composicao.vue` — remover `disabled` do `TabsTrigger value="movimentacoes"` e adicionar `<TabsContent value="movimentacoes"><Movimentacoes /></TabsContent>` com o import de `@views/carteira/Movimentacoes.vue`.
4. `bun check` + `bun run build` uma vez no fim.
5. Avaliar a nota de migração da spec `AssetRow` (opcional): atualizar `painel/Carteira.vue` e `carteira/Composicao.vue` para consumir o componente novo em vez do markup duplicado.

## Critério de aceite por seção
- Fiel aos screenshots (`docs/pencil/carteira-movimentacoes-*.webp`).
- Zero valor arbitrário em cor, tipografia e espaçamento (R1, R2); `text-paragraph-strong` é o único text-style novo, já registrado nos dois lugares.
- `AssetRow` segue a anatomia R5 (pasta própria, `index.ts`, `class` prop, `cn(..., props.class)`, `data-slot`, sem slot — conteúdo 100% via props conforme spec).
- Contagem "N ativo(s)" calculada via `items.length`, não hardcoded.
- Ícones conforme a tabela acima — todos já mapeados no manifesto do Painel, nenhum novo a inventar.
- Aba "Movimentações" habilitada em `Composicao.vue` (sem `disabled`), "Performance" continua `disabled`.
- Desktop-first com `max-*` (R12).
- Tag semântica correta; `<h2>` por grupo (Entradas/Saídas/...) mantendo a hierarquia abaixo do `<h1>` do Cabecalho.

## Stubs criados
Nenhum. Reaproveita integralmente `src/pages/Carteira.vue`, `src/views/carteira/`, e a rota `carteira` já registrada em `src/routers/index.ts`.

## Status

### Tokens
- [x] `text-paragraph-strong` adicionado em `src/assets/index.css` e `TEXT_STYLES`

### Dados
- [x] `src/data/wallet.ts` estendido — `MovementDetail`, `MovementGroup`, `movementGroups`

### Componentes (Batch 0)
- [x] AssetRow

### Seções (Batches 1-N)
- [x] Movimentacoes (`src/views/carteira/Movimentacoes.vue`, 78 linhas)
- [x] Edição de Composicao.vue (habilitar aba + `TabsContent`)
- [x] bun check + bun run build
- [x] review (0 blockers, 5 major — M1 corrigido, M3 parcial, M2/M4/M5 no backlog do handoff)
