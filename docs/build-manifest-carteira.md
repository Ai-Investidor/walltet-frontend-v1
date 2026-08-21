# Build Manifest — Carteira

> Gerado por /build-prep em 2026-08-21
> Fonte: pencil — `docs/template/dashboard.pen`, node `Tgmcg` ("Cliente · Minha carteira · Composição")
> Para implementar: `/build-page carteira`

## Identificação
- page: carteira
- página: src/pages/Carteira.vue
- seções: src/views/carteira/
- rota: `/carteira` (filha de `AppLayout`, irmã da rota `''` do Painel)

## Decisão de arquitetura — Abas

A tela tem 3 abas no topo (Composição / Movimentações / Performance), mas só **Composição** foi desenhada. Confirmado com o usuário: usar `@components/ui/tabs` do kit (reka-ui), restilizado para o sublinhado do design (`stroke:$green` ativo ↔ `border-b-2 border-success text-foreground`; inativo ↔ `border-transparent text-muted-foreground-faint`). Só o trigger "Composição" fica habilitado; "Movimentações" e "Performance" ficam `disabled` até ganharem seu próprio `/build-prep`+`/build-page`. **Não** criar rota aninhada nem view vazia para as outras abas agora — isso é trabalho de builds futuros, não deste.

## Frame raiz
- node-id: `Tgmcg` — "Cliente · Minha carteira · Composição", 1180×1200
- Screenshot: docs/pencil/carteira-overview.pdf

## Tokens

Nenhum token novo — a tela reusa 100% do que já existe (criado no build do Painel).

### Reusados
- Cor: `--foreground` (`$ink`), `--muted-foreground` (`$ink-soft`), `--muted-foreground-faint` (`$ink-faint`), `--success` (`$green`), `--data-1`/`--data-2`/`--data-3`, `--card`, `--background`, `--border` (`$line`)
- Tipografia: `text-eyebrow`, `text-page-title`, `text-paragraph` (aproximação já usada no Painel: design 14.72px/400/1.6 vs utilitário 15px/400/1.4), `text-card-title`, `text-label`

## Ícones
- Local: nenhum SVG novo a extrair — design usa ícones por nome (Lucide), mesmo padrão do Painel.
- Novo mapeamento nesta página:

| Lucide (design) | Phosphor (`@phosphor-icons/vue`) | Onde |
|---|---|---|
| `chevron-up` | `PhCaretUp` | Ícone de colapsar/expandir no cabeçalho do card "Justificativa" |

Os demais ícones da tela (setas de tendência `MANTER`/`ENTROU` na tabela, escudo do Aviso Legal, download/seta dos botões) pertencem aos componentes reusados `Linha Ativo` (`pabok`) e `Aviso Legal` (`mknb1`) — mapeamento já coberto pela tabela do `docs/build-manifest-painel.md` (`arrow-down-right`→`PhArrowDownRight`, `minus`→`PhMinus`, etc.) ou resolvido dentro do próprio componente no `/build-page`.

## Imagens
Nenhuma — a tela não usa `fill` de imagem em nenhum node.

## Componentes do kit reusados
- `@components/ui/tabs` — as 3 Abas (Composição ativa, Movimentações/Performance `disabled`). Restilizar `TabsList`/`TabsTrigger` para o visual de sublinhado (ver "Decisão de arquitetura" acima); não é o estilo pill padrão do componente.
- `@components/ui/card` — card "Carteira" (composição) e card "Justificativa" (`bg-card rounded-lg border`, igual ao padrão já usado no Painel).
- `@components/ui/button` — "Baixar relatório do mês" (`variant="default"`, mapeia `Botao Primario`/`s4Behq`) e "Ver movimentações" (`variant="outline"`, mapeia `Botao Outline`/`BKFYq`).

## Componentes do projeto reusados
Nenhum ainda — `src/components/<dominio>/` continua vazio. O padrão de markup de `Linha Ativo` (`pabok`) já existe **inline** em `src/views/painel/Carteira.vue`; o `section-builder` desta página deve copiar esse padrão (mesmos dados de `assets`), não recriá-lo do zero.

## Componentes compartilhados — specs
Nenhuma spec nova.

### Estruturas inline-only
- **Aviso Legal** (`mknb1`) — `usos_contados: 1` (primeira vez em código; não apareceu no manifesto do Painel). `inline_na_secao: Composicao`. Conteúdo fixo do componente: ícone de escudo + rótulo "AVISO LEGAL" + parágrafo:
  > "Carteira recomendada com base no seu perfil declarado. Não constitui oferta ou garantia de rentabilidade. Rentabilidade passada não garante resultados futuros."

  node_id: `mknb1` (instância `a1d6h`, sem overrides). screenshot: `docs/pencil/carteira-composicao.webp`.

  Nota para o `/build-page`: se uma segunda página (Movimentações, Performance, Relatórios) também precisar deste bloco, promover para `src/components/shared/legal-notice/` na hora, por R6/R7.

- **Etiqueta de competência** (`GTx4F`, ponto + "AGOSTO 2026") — inline no cabeçalho do card Carteira, mesmo padrão do Eyebrow da página. `usos_contados: 1` nesta seção.

## Plano de dados

### Dados propostos
```yaml
dados_propostos:
  - arquivo: src/data/wallet.ts
    acao: estender
    consumido_por: [Composicao]
    exports_novos:
      - revisionNote: RevisionNote
    tipos_novos:
      - RevisionNote { title: string, body: string }
```

`assets` e `allocation`, já existentes em `src/data/wallet.ts`, cobrem a tabela de composição e a barra de alocação sem alteração — mesmos 4 ativos e mesmos campos (`trend`, `trendLabel`, `weightPercent`) do Painel.

Ficam **literais** no template (mesmo precedente do Painel, que não promoveu strings equivalentes a dado):
- Nome da carteira: "Carteira Moderada Estratégica"
- Tag de competência: "AGOSTO 2026"
- Contagem "COMPOSIÇÃO · 4 ATIVOS" — calcular via `assets.length`, não hardcodear o "4"
- "TOTAL" / "100,00 %" — calcular via soma de `assets[].weightPercent`, não hardcodear
- Texto do Aviso Legal (ver "Estruturas inline-only" acima)

## Inventário de seções

| # | Nome | node-id | Arquivo | Reusa | Dados | Paralelizável | Screenshot | Formato |
|---|------|---------|---------|-------|-------|---------------|------------|---------|
| 1 | Cabecalho | `DAq00` | src/views/carteira/Cabecalho.vue | — | literal | não (serial, primeira seção) | docs/pencil/carteira-cabecalho.webp | webp |
| 2 | Composicao | `x7HH6` (Abas) + `KsaA9` (conteúdo) | src/views/carteira/Composicao.vue | `ui/tabs`, `ui/card`, `ui/button`, padrão `Linha Ativo` do Painel | `data:wallet` (assets, allocation, revisionNote) | não (única seção de conteúdo) | docs/pencil/carteira-abas.webp, docs/pencil/carteira-composicao.webp | webp |

## Plano de execução (Fase 2)
1. Sem Batch 0 (nenhum componente novo em `src/components/`).
2. Serial: Cabecalho (simples, primeira seção).
3. Serial: Composicao (única seção restante; sem ganho real em paralelizar com 1 seção só).
4. `bun check` + `bun run build` uma vez no fim.
5. Ao final, com a página funcionando: atualizar `src/data/navigation.ts`, item "Minha carteira" → `available: true`.

## Critério de aceite por seção
- Fiel aos screenshots (`docs/pencil/carteira-*.webp` e `.pdf`).
- Zero valor arbitrário em cor, tipografia e espaçamento (R1, R2).
- Abas via `@components/ui/tabs`, só "Composição" habilitada; "Movimentações"/"Performance" com `disabled` (não removidas da UI).
- `assets.length` e soma de `weightPercent` calculados, não hardcoded (ver Plano de dados).
- Ícone `chevron-up` → `PhCaretUp`; demais ícones conforme tabela do `build-manifest-painel.md`.
- Tabela de composição reusa o padrão inline de `Linha Ativo` já implementado em `src/views/painel/Carteira.vue` — mesmos dados (`assets`), mesma estrutura visual.
- Desktop-first com `max-*` (R12).
- Tag semântica correta: `<h1>` único (título do Cabecalho), `RouterLink`/roteamento coerente com a Sidebar (item "Minha carteira" deve ficar ativo nesta rota), aviso legal como conteúdo informativo (não interativo).

## Stubs criados
- src/pages/Carteira.vue (seções comentadas)
- src/views/carteira/ (vazia)
- rota `carteira` em src/routers/index.ts (filha de AppLayout, lazy)

## Status

### Seções (Batches 1-N)
- [x] Cabecalho
- [x] Composicao
- [x] bun check + bun run build
- [ ] review
