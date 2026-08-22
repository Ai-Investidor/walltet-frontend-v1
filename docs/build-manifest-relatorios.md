# Build Manifest — Relatórios

> Gerado por /build-prep em 2026-08-21
> Fonte: pencil — `docs/template/dashboard.pen`, node `EhSSq` ("Cliente · Relatórios")
> Para implementar: `/build-page relatorios`

## Identificação
- page: relatorios
- página: src/pages/Relatorios.vue
- seções: src/views/relatorios/
- rota: `/relatorios` (filha de `AppLayout`, irmã de `carteira`)

## Nota sobre a API do Pencil usada neste build

Este `.pen` foi lido via `mcp__pencil__execute` (API `Get`/`GetVariables`/`Export`), não via as tools discretas (`get_editor_state`/`batch_get`/`export_nodes`) descritas em `.claude/skills/pencil/SKILL.md` — o MCP do Pencil instalado neste ambiente só expõe `execute`. Mesmo resultado, chamadas diferentes; sem impacto no conteúdo do manifesto.

## Frame raiz
- node-id: `EhSSq` — "Cliente · Relatórios", 1180×860
- Screenshot: docs/pencil/relatorios-overview.pdf

## Tokens

Na hora do `/build-prep` nenhum token novo era necessário. Durante o `/build-page`, o code review apontou uma lacuna real de tipografia (ver `docs/build-handoff-relatorios.md`): o botão "Baixar" (12,8px/600, `fontSize: 12.8` no node `Botao Baixar`) não tinha text-style — o `section-builder` havia empilhado `font-semibold` sobre a base do kit (violação R2). O orquestrador fechou essa lacuna:

### Adicionado durante o /build-page (não previsto no /build-prep)
| Token | Valor | Uso |
|---|---|---|
| `text-button-xs` | 0.8rem/600/1 | Label do botão "Baixar" nas linhas de relatório — registrado em `src/assets/index.css` **e** em `TEXT_STYLES` de `src/libs/utils.ts` |

### Reusados
Nenhum token novo — a tela reusa 100% do que já existe (criado no build do Painel).

### Reusados
- Cor: `--foreground` (`$ink`), `--muted-foreground` (`$ink-soft`), `--muted-foreground-faint` (`$ink-faint`), `--border` (`$line`), `--card` (`$paper`)
- Tipografia: `text-eyebrow`, `text-page-title`, `text-paragraph`, `text-label`, `text-paragraph-strong`

Todos conferidos via `GetVariables()` — hex idêntico ao já registrado em `src/assets/index.css` pelos builds anteriores.

## Text-styles

Nenhum novo. Duas aproximações, mesmo padrão já aceito nos manifests anteriores (design entrega tamanhos fracionários, catálogo é discreto):

| Elemento | Design | Utilitário reusado | Desvio |
|---|---|---|---|
| Label "Ano" (2026/2025) | 10.24px/800, ls 0.08em | `text-eyebrow` | eyebrow já consolida variações 700/800 de ~10-11px (mesma decisão do Painel) |
| "Contagem" ("4 relatórios") e "Meta" (linha de arquivo) | 12.48px/400 | `text-label` | label é 13px/400 — diferença sub-pixel |
| "Titulo" da linha de arquivo | 14.08px/600 | `text-paragraph-strong` | match exato (0.88rem = 14.08px) |
| Eyebrow "DOCUMENTOS" | 10.24px/700 | `text-eyebrow` | mesma aproximação já usada no Painel |
| Título "Relatórios mensais" | 28px/800, ls -0.01em | `text-page-title` | match exato |
| Texto de apoio do cabeçalho | 14.72px/400/1.6 | `text-paragraph` | mesma aproximação já usada na Carteira |

## Ícones

Nenhum SVG novo — ícones por nome (Lucide), mesmo padrão das páginas anteriores. Ambos já mapeados em `docs/build-manifest-painel.md`:

| Lucide (design) | Phosphor (`@phosphor-icons/vue`) | Onde |
|---|---|---|
| `file-text` | `PhFileText` | Ícone de arquivo em cada linha de relatório, 18×18 |
| `download` | `PhDownloadSimple` | Botão "Baixar" de cada linha |

## Imagens

Nenhuma — a tela não usa `fill` de imagem em nenhum node.

## Componentes do kit reusados
- `@components/ui/card` — container "Lista" de cada grupo de ano (`bg-card rounded-lg border`, `cornerRadius: 8` = `--radius`, mesmo padrão de card já usado no Painel/Carteira).
- `@components/ui/button` — botão "Baixar" de cada linha, instância de `Botao Outline` (`BKFYq`) com `icon: download` habilitado e label "Baixar" — mapeia `variant="outline"`, já estabelecido no Painel.
  - evolução pedida: o label do design usa 12.8px (menor que o `text-button-sm` do kit, que já não é usado pela tipografia própria do `Button`/`cva`) — mesma ressalva já registrada no Painel, ajuste de `cva` fica para o `/build-page` se o `section-builder` achar a diferença perceptível ao lado do screenshot.

## Componentes do projeto reusados

Nenhum — `src/components/wallet/kpi-card` e `src/components/wallet/asset-row` não se aplicam a este domínio (arquivo/relatório, não carteira/ativo).

## Componentes compartilhados — specs

Nenhuma spec nova em `src/components/`.

### Estruturas inline-only
- **Grupo de ano** (Divisor + Lista) — `usos_contados: 2` (2026 e 2025), mas ambos **dentro da mesma seção** (`Arquivo`) → `recomendacao: v-for` sobre `wallet.reportArchive` (R6: repetição na mesma seção não cria componente). node_ids: `M5RAU` (2026), `xOGJI` (2025). screenshots: `docs/pencil/relatorios-arquivo-2026.webp`, `docs/pencil/relatorios-arquivo-2025.webp`.
- **Linha de relatório** (ícone + título + meta + botão Baixar) — `usos_contados: 6` (4 em 2026, 2 em 2025), todos dentro da mesma seção → `recomendacao: v-for` aninhado, sobre `group.reports`. node_id de referência: `tN5q5`. Estrutura idêntica em todas as 6 instâncias (conferido via `Get`, texto/tamanho variam, layout não).

## Plano de dados

### Dados propostos
```yaml
dados_propostos:
  - arquivo: src/data/wallet.ts
    acao: estender
    consumido_por: [Arquivo]
    exports_novos:
      - reportArchive: ReportArchiveGroup[]
    tipos_novos:
      - ReportArchiveGroup { year: string, reports: Report[] }
```

`Report` (`{ title, generatedAt, sizeLabel }`) já existe em `src/data/wallet.ts` desde o Painel e bate exatamente com "Titulo"/"Meta" da linha de arquivo — reusado sem alteração, não duplicar tipo.

**Contagem ("4 relatórios"/"2 relatórios") não entra como campo de dado** — mesmo precedente da Carteira (R8: calcular, não hardcodear). O `section-builder` deriva no template: `` `${group.reports.length} relatório${group.reports.length === 1 ? '' : 's'}` ``.

Conteúdo real a popular em `reportArchive` (extraído do design, não aproximado):

```yaml
reportArchive:
  - year: "2026"
    reports:
      - { title: "Relatório de Performance — Agosto/2026", generatedAt: "01/09/2026", sizeLabel: "471 KB" }
      - { title: "Relatório de Performance — Julho/2026",  generatedAt: "01/08/2026", sizeLabel: "463 KB" }
      - { title: "Relatório de Performance — Junho/2026",  generatedAt: "01/07/2026", sizeLabel: "455 KB" }
      - { title: "Relatório de Performance — Maio/2026",   generatedAt: "01/06/2026", sizeLabel: "448 KB" }
  - year: "2025"
    reports:
      - { title: "Relatório de Performance — Dezembro/2025", generatedAt: "02/01/2026", sizeLabel: "441 KB" }
      - { title: "Relatório de Performance — Novembro/2025", generatedAt: "01/12/2025", sizeLabel: "437 KB" }
```

Nota: `lastReport` (já existente em `wallet.ts`, usado pelo card "Último relatório" do Painel) é o mesmo relatório de Agosto/2026 que abre `reportArchive[0].reports[0]` — mesmo conteúdo, chaves independentes; não há necessidade de derivar um do outro nesta fase.

Ficam **literais** no template:
- Eyebrow "DOCUMENTOS"
- Título "Relatórios mensais"
- Texto de apoio do cabeçalho

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Cabecalho | `lEv2I` | src/views/relatorios/Cabecalho.vue | — | literal | não (serial, primeira seção) | docs/pencil/relatorios-cabecalho.webp | webp |
| 2 | Arquivo | `M5RAU` + `xOGJI` | src/views/relatorios/Arquivo.vue | `ui/card`, `ui/button` (Botao Outline) | `data:wallet` (reportArchive) | não (única seção de conteúdo) | docs/pencil/relatorios-arquivo-2026.webp, docs/pencil/relatorios-arquivo-2025.webp | webp |

> Inventário confirmado com o usuário: 2 seções (não 3) — "Ano 2026"/"Ano 2025" viram uma única view `Arquivo.vue` com `v-for` duplo, em vez de duas views quase idênticas (R6).

## Plano de execução (Fase 2)
1. Sem Batch 0 (nenhum componente novo em `src/components/`).
2. Serial: Cabecalho (simples, primeira seção).
3. Serial: Arquivo (única seção restante; sem ganho real em paralelizar com 1 seção só).
4. `bun check` + `bun run build` uma vez no fim.
5. Ao final, com a página funcionando: atualizar `src/data/navigation.ts`, item "Relatórios" → `available: true`.

## Critério de aceite por seção
- Fiel aos screenshots (`docs/pencil/relatorios-*.webp` e `.pdf`).
- Zero valor arbitrário em cor, tipografia e espaçamento (R1, R2).
- Contagem de relatórios por ano calculada via `reports.length`, não hardcoded (ver Plano de dados).
- Ícone `file-text`→`PhFileText` (18px) e `download`→`PhDownloadSimple` conforme tabela acima — não inventar ícone fora dela.
- Botão "Baixar" via `@components/ui/button` `variant="outline"`, não markup solto.
- Grupo de ano e linha de relatório via `v-for` sobre `wallet.reportArchive` — não duplicar markup por ano/relatório.
- Desktop-first com `max-*` (R12).
- Tag semântica correta: `<h1>` único (título do Cabecalho), `RouterLink`/roteamento coerente com a Sidebar (item "Relatórios" deve ficar ativo nesta rota).

## Stubs criados
- src/pages/Relatorios.vue (seções comentadas)
- src/views/relatorios/ (vazia, `.gitkeep`)
- rota `relatorios` em src/routers/index.ts (filha de AppLayout, lazy)

## Status

### Seções (Batches 1-N)
- [x] Cabecalho
- [x] Arquivo
- [x] bun check + bun run build
- [x] review
