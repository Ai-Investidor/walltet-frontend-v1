---
name: pencil-design-rules
description: >
  Regras de qualidade para criacao de designs no Pencil. Garante estrutura limpa
  (auto-layout, variaveis, componentes) sem limitar criatividade visual.
  Use quando: criar designs no Pencil, "design no Pencil", "criar tela",
  "novo layout", "criar pagina", "novo design",
  ou SEMPRE antes de usar batch_design para criar/editar qualquer elemento visual.
user-invocable: true
---

# Pencil Design Rules — Qualidade sem Limitar Criatividade

Guia para criar designs estruturalmente limpos e prontos para codigo, sem restringir decisoes criativas. A filosofia e simples:

> **Estrutura e organizacao sao obrigatorias. Escolhas visuais e de composicao sao livres.**

**Este guia complementa os guidelines do Pencil MCP** — carregue-os com `get_guidelines` antes de comecar.

---

## Principio Central

Cada regra tem um nivel de rigidez:

| Nivel | Significado | Quando quebrar |
|-------|-------------|----------------|
| **OBRIGATORIO** | Nunca quebrar. Afeta diretamente a qualidade do codigo gerado | Nunca |
| **PREFERIR** | Seguir por padrao. Quebrar quando houver intencao criativa clara | Quando a alternativa produz um resultado visual melhor |
| **RECOMENDADO** | Boa pratica. Seguir quando nao houver motivo para nao seguir | Quando atrapalha o fluxo ou nao faz sentido no contexto |

---

## 1. Layout: Preferir Auto-Layout

**Nivel: PREFERIR**

Auto-layout (`layout: "vertical"` / `"horizontal"`) deve ser a escolha padrao para organizar elementos. Produz designs mais faceis de converter em codigo responsivo.

### Padrao (auto-layout)

```javascript
// Cards distribuidos uniformemente
row=I(section, {type: "frame", layout: "horizontal", width: "fill_container", gap: 24})
card1=I(row, {type: "ref", ref: "cardId", width: "fill_container"})
card2=I(row, {type: "ref", ref: "cardId", width: "fill_container"})
card3=I(row, {type: "ref", ref: "cardId", width: "fill_container"})
```

### Quando posicionamento absoluto e valido

Posicionamento absoluto (`layout: "none"` ou `layoutPosition: "absolute"`) e totalmente aceitavel quando a **intencao criativa exige**:

- **Composicoes sobrepostas** — texto sobre imagem em posicao especifica, elementos que se cruzam
- **Layouts broken-grid** — assimetria intencional, elementos que "escapam" do grid
- **Hero sections com composicao livre** — titulo posicionado de forma artistica, nao alinhado a grid
- **Elementos decorativos** — vectors ornamentais, linhas, formas abstratas
- **Overlays e badges** — indicadores posicionados sobre outros elementos
- **Parallax ou efeitos de profundidade** — camadas visuais sobrepostas

### O que EVITAR (problema real)

O problema nao e usar absoluto — e usar absoluto **por preguica** quando auto-layout resolve melhor:

```javascript
// RUIM: grid de cards identicos posicionados na mao (preguica, nao criatividade)
grid=I(section, {type: "frame", layout: "none", height: 560})
card1=I(grid, {type: "frame", width: 597, x: 0, y: 0, ...})
card2=I(grid, {type: "frame", width: 597, x: 597, y: 0, ...})
card3=I(grid, {type: "frame", width: 597, x: 1194, y: 0, ...})

// BOM: mesmo resultado, estrutura limpa
row=I(section, {type: "frame", layout: "horizontal", gap: 0})
card1=I(row, {type: "ref", ref: "cardId", width: "fill_container"})
card2=I(row, {type: "ref", ref: "cardId", width: "fill_container"})
card3=I(row, {type: "ref", ref: "cardId", width: "fill_container"})
```

### Dica para grids 2D

Flexbox do Pencil e single-axis. Para grids, criar rows separadas:

```javascript
grid=I(section, {type: "frame", layout: "vertical", width: "fill_container", gap: 24})
row1=I(grid, {type: "frame", layout: "horizontal", width: "fill_container", gap: 24})
row2=I(grid, {type: "frame", layout: "horizontal", width: "fill_container", gap: 24})
```

---

## 2. Cores: Sempre Variaveis

**Nivel: OBRIGATORIO**

Toda cor DEVE referenciar uma variavel `$--nome`. Hex codes diretos tornam o design impossivel de manter e geram codigo com valores magicos.

### Errado

```javascript
I(parent, {type: "frame", fill: "#ffffff", ...})
I(parent, {type: "text", fill: "#3f402a", content: "Titulo", ...})
I(parent, {type: "frame", stroke: {fill: "#dedad3", thickness: 1}, ...})
```

### Correto

```javascript
I(parent, {type: "frame", fill: "$--white", ...})
I(parent, {type: "text", fill: "$--dark-olive", content: "Titulo", ...})
I(parent, {type: "frame", stroke: {fill: "$--border", thickness: 1}, ...})
```

### Antes de comecar qualquer design

1. Rodar `get_variables` para listar variaveis disponiveis
2. Se uma cor necessaria NAO existe, **criar uma nova variavel** antes de usar
3. Para cores com opacidade, criar variavel derivada (ex: `$--white-30`, `$--green-accent-10`)

---

## 3. Tipografia: Sistema Padronizado

**Nivel: OBRIGATORIO**

Todo texto no design DEVE seguir o sistema tipografico do projeto. Isso garante que ao converter para codigo, cada texto mapeie para uma unica classe Tailwind (`text-{categoria}-{numero}`) sem valores arbitrarios.

### Categorias tipograficas

| Categoria | Uso | fontSize range | lineHeight range |
|-----------|-----|----------------|------------------|
| **Display** | Numeros grandes, destaque visual, hero statements | 56–120px | 1.0–1.1 (100%–110%) |
| **Headline** | Titulos de secao, h1–h3 | 32–64px | 1.0–1.2 (100%–120%) |
| **Title** | Subtitulos, h4–h6, card titles | 20–32px | 1.1–1.3 (110%–130%) |
| **Paragraph** | Texto corrido, descricoes, body | 14–20px | 1.4–1.7 (140%–170%) |
| **Caps** | Labels, badges, tags, navegacao | 10–14px | 1.0–1.3 (100%–130%) |

### Nomenclatura

Formato: `{Categoria}/{Numero}` — do maior (1) ao menor (N):

```
Display/1    → maior display (ex: 120px)
Display/2    → segundo display (ex: 80px)
Headline/1   → maior headline (ex: 64px)
Headline/2   → (ex: 48px)
Headline/3   → (ex: 40px)
Title/1      → maior titulo (ex: 32px)
Title/2      → (ex: 24px)
Title/3      → (ex: 20px)
Paragraph/1  → maior paragrafo (ex: 20px)
Paragraph/2  → (ex: 18px)
Paragraph/3  → (ex: 16px)
Paragraph/4  → (ex: 14px)
Caps/1       → maior caps (ex: 14px)
Caps/2       → (ex: 12px)
Caps/3       → (ex: 10px)
```

### Line-height — valores permitidos

Line-height DEVE ser um dos seguintes valores (steps de 10%):

| Valor | Ratio | Quando usar |
|-------|-------|-------------|
| **1.0** | 100% | Display grande, numeros, texto single-line apertado |
| **1.1** | 110% | Headlines grandes, titulos impactantes |
| **1.2** | 120% | Headlines medios, titulos de secao |
| **1.3** | 130% | Titulos menores, subtitulos, caps |
| **1.4** | 140% | Paragrafos curtos, descricoes de card |
| **1.5** | 150% | Texto corrido padrao |
| **1.6** | 160% | Texto corrido com mais respiro |
| **1.7** | 170% | Texto longo, blocos de leitura extensos |

**NUNCA** usar valores intermediarios como `1.15`, `1.25`, `1.35`, `1.45`, `1.65`.

### Propriedades obrigatorias em cada text style

Todo texto DEVE definir **todas** estas propriedades:

```javascript
I(container, {
  type: "text",
  content: "Titulo da Secao",
  fontFamily: "$--font-heading",   // OBRIGATORIO — variavel de fonte
  fontWeight: "600",               // OBRIGATORIO — peso da fonte
  fontSize: 48,                    // OBRIGATORIO — tamanho
  lineHeight: 1.1,                 // OBRIGATORIO — um dos valores permitidos
  letterSpacing: 0,                // OBRIGATORIO (pode ser 0) — espacamento entre letras
  fill: "$--dark-olive",           // OBRIGATORIO — cor via variavel
  textGrowth: "fixed-width",      // recomendado para texto em flexbox
  width: "fill_container"          // recomendado para texto em flexbox
})
```

### Errado

```javascript
// ERRADO: sem lineHeight definido (usa default do browser — inconsistente)
I(container, {type: "text", content: "Titulo", fontSize: 48, fill: "$--dark-olive"})

// ERRADO: lineHeight fora do sistema
I(container, {type: "text", content: "Titulo", fontSize: 48, lineHeight: 1.15, fill: "$--dark-olive"})

// ERRADO: sem fontFamily (herda qualquer coisa)
I(container, {type: "text", content: "Titulo", fontSize: 48, lineHeight: 1.1, fill: "$--dark-olive"})

// ERRADO: fontSize nao bate com a categoria
I(container, {type: "text", name: "Display/1", fontSize: 16, ...})  // Display com 16px?
```

### Correto

```javascript
// Display — numero destaque
I(container, {type: "text", name: "Display/1",
  content: "R$ 50bi+", fontFamily: "$--font-heading", fontWeight: "300",
  fontSize: 80, lineHeight: 1.0, letterSpacing: -1, fill: "$--dark-olive"})

// Headline — titulo de secao
I(container, {type: "text", name: "Headline/2",
  content: "Nossas Transacoes", fontFamily: "$--font-heading", fontWeight: "600",
  fontSize: 48, lineHeight: 1.1, letterSpacing: 0, fill: "$--dark-olive",
  textGrowth: "fixed-width", width: "fill_container"})

// Paragraph — texto corrido
I(container, {type: "text", name: "Paragraph/2",
  content: "A Arsenal e uma boutique...", fontFamily: "$--font-body", fontWeight: "400",
  fontSize: 18, lineHeight: 1.6, letterSpacing: 0, fill: "$--dark-olive-70",
  textGrowth: "fixed-width", width: "fill_container"})

// Caps — label de navegacao
I(container, {type: "text", name: "Caps/2",
  content: "O QUE FAZEMOS", fontFamily: "$--font-body", fontWeight: "500",
  fontSize: 12, lineHeight: 1.0, letterSpacing: 2, fill: "$--white-65"})
```

### Fontes — usar variaveis

Definir variaveis para as familias tipograficas do projeto:

```
$--font-heading  → fonte de titulos (ex: Garamond, Playfair Display)
$--font-body     → fonte de corpo (ex: Montserrat, Inter)
$--font-mono     → fonte mono se necessario (ex: JetBrains Mono)
```

**NUNCA** hardcodar o nome da fonte direto no texto:

```javascript
// ERRADO
{fontFamily: "Montserrat", ...}

// CORRETO
{fontFamily: "$--font-body", ...}
```

### Referencia rapida — lineHeight por categoria

```
Display   → 1.0 ou 1.1
Headline  → 1.0, 1.1 ou 1.2
Title     → 1.1, 1.2 ou 1.3
Paragraph → 1.4, 1.5, 1.6 ou 1.7
Caps      → 1.0, 1.1, 1.2 ou 1.3
```

---

## 4. Sizing: Dinamico por Padrao, Fixo Quando Intencional

**Nivel: PREFERIR**

Usar `fill_container` e `fit_content` como escolha padrao. Pixels fixos sao validos quando representam uma decisao de design intencional.

### Preferir dinamico

```javascript
// Cards que se adaptam ao container
I(row, {type: "ref", ref: "cardId", width: "fill_container"})

// Secoes que preenchem a pagina
I(page, {type: "frame", width: "fill_container", ...})
```

### Fixo e valido quando intencional

```javascript
// Card de carrossel com largura fixa (decisao de design)
I(carousel, {type: "ref", ref: "cardId", width: 300})

// Sidebar com largura definida
I(layout, {type: "frame", name: "Sidebar", width: 280, ...})

// Coluna de texto com largura maxima para legibilidade
I(section, {type: "frame", name: "Content Column", width: 720, ...})

// Icones, avatares, logos — sempre fixos
I(nav, {type: "icon_font", width: 24, height: 24, ...})
```

### O que EVITAR

```javascript
// RUIM: largura que e resultado de divisao manual (597.333 = 1792/3)
// Indica que deveria ser fill_container com gap
I(grid, {type: "frame", width: 597.3333, x: 0, y: 0, ...})

// RUIM: gap enorme para empurrar elementos (usar justifyContent)
{layout: "horizontal", gap: 418}
// MELHOR:
{layout: "horizontal", justifyContent: "space_between"}
```

### Regra pratica

Pergunte: "esse tamanho fixo e uma **decisao de design** ou e **consequencia de nao usar auto-layout**?"
- Decisao de design → pixel fixo OK
- Consequencia → usar `fill_container`

---

## 5. Estrutura de Pagina e Spacing

**Nivel: PREFERIR**

### Hierarquia recomendada

```
Pagina (frame, layout: "vertical", width: 1920)
  └── Secao (frame, layout: "vertical", width: "fill_container", padding)
       └── Conteudo
```

### Spacing consistente (mas nao rigido)

Definir um sistema de spacing e usa-lo como base. Variacoes sao aceitas quando ha intencao:

```javascript
// Base: usar variaveis de spacing
section=I(page, {type: "frame", padding: ["$--section-padding-y", "$--section-padding-x"], ...})

// Hero com mais respiro — decisao criativa valida
hero=I(page, {type: "frame", padding: [160, 64, 120, 64], ...})

// Secao de stats mais compacta — tambem valido
stats=I(page, {type: "frame", padding: [48, 64], ...})
```

### O que EVITAR

Padding que parece **acidental** em vez de **intencional**:

```javascript
// RUIM: valores que parecem aleatorios sem logica visual
section1=I(page, {..., padding: [112, 64]})
section2=I(page, {..., padding: [120, 64]})  // 8px de diferenca? parece erro
section3=I(page, {..., padding: [88, 240, 120, 0]})  // assimetrico sem motivo claro
```

A regra nao e "todo padding igual" — e "todo padding intencional".

---

## 6. Componentes Reutilizaveis

**Nivel: OBRIGATORIO (para 3+ repeticoes) / PREFERIR (para 2 repeticoes)**

Elementos visuais que aparecem **3 ou mais vezes** DEVEM ser componentes reutilizaveis. Para 2 repeticoes, e fortemente recomendado.

### Errado

```javascript
// Mesmo card copiado 4x com copy-paste
statCard1=I(row, {type: "frame", layout: "vertical", padding: 64, gap: 8,
  children: [{type: "text", content: "22+", fontSize: 48, ...}, ...]})
statCard2=I(row, {type: "frame", layout: "vertical", padding: 64, gap: 8,
  children: [{type: "text", content: "50+", fontSize: 48, ...}, ...]})
// ... mais 2x
```

### Correto

```javascript
// Componente reutilizavel
statCard=I(document, {
  type: "frame", name: "Component/Card/Stat", reusable: true,
  layout: "vertical", padding: 64, gap: 8, width: "fill_container",
  children: [
    {id: "value", type: "text", content: "00", fontSize: 48, fill: "$--dark-olive"},
    {id: "label", type: "text", content: "Label", fontSize: 14, fill: "$--dark-olive-70"}
  ]
})

// Instancias
card1=I(row, {type: "ref", ref: statCard, width: "fill_container",
  descendants: {"value": {content: "22+"}, "label": {content: "anos"}}})
card2=I(row, {type: "ref", ref: statCard, width: "fill_container",
  descendants: {"value": {content: "50+"}, "label": {content: "transacoes"}}})
```

### Nomenclatura de componentes

Usar prefixo `Component/` com categoria:

```
Component/Button/Primary
Component/Card/Stat
Component/Card/Service
Component/Nav/Link
Component/Footer
```

---

## 7. Nomenclatura Semantica

**Nivel: OBRIGATORIO**

Todo node DEVE ter `name` que descreva seu proposito. Nomes genericos automaticos sao inaceitaveis.

### Errado

```
Frame 1597887590
Frame 48096564
Group 1
Rectangle 5
```

### Correto

```
Hero Content
Stats Row
Services Grid
CTA Button Primary
Decorative Vector
```

### Padroes sugeridos

| Tipo | Formato | Exemplo |
|------|---------|---------|
| Secao | `Section - N. Nome` | `Section - 1. Hero` |
| Container | `{Contexto} Content` | `Hero Content` |
| Linha | `{Contexto} Row` | `Stats Row` |
| Grid | `{Contexto} Grid` | `Services Grid` |
| Componente | `Component/{Cat}/{Nome}` | `Component/Card/Stat` |
| Decorativo | `Decorative {Tipo}` | `Decorative Vector` |

---

## 8. Texto

**Nivel: OBRIGATORIO (fill) / PREFERIR (sizing)**

### Obrigatorio: texto SEMPRE com fill

Texto sem `fill` e **invisivel**. Sempre definir cor:

```javascript
// ERRADO: texto invisivel
I(container, {type: "text", content: "Titulo", fontSize: 48})

// CORRETO
I(container, {type: "text", content: "Titulo", fontSize: 48, fill: "$--dark-olive"})
```

### Preferir: sizing via layout

Deixar o auto-layout controlar o tamanho do texto quando possivel:

```javascript
// Texto que preenche o pai (headings, paragrafos)
I(container, {type: "text", textGrowth: "fixed-width", width: "fill_container",
  fill: "$--dark-olive", content: "Titulo", fontSize: 48})

// Texto com tamanho proprio (labels, botoes)
I(button, {type: "text", content: "CONTATO", fontSize: 12, fill: "$--white"})
```

### Largura fixa em texto — quando e valido

Limitar largura do texto para **legibilidade** e uma decisao de design valida:

```javascript
// Paragrafo com largura maxima para manter 60-75 caracteres por linha
I(section, {type: "text", textGrowth: "fixed-width", width: 640,
  content: "Texto longo...", fontSize: 18, fill: "$--dark-olive", lineHeight: 1.7})
```

---

## 9. Imagens

**Nivel: OBRIGATORIO**

NAO existe node type `image`. Imagens sao `fill` de tipo `image` em frames ou rectangles:

```javascript
// Imagem que preenche um espaco
imageFrame=I(container, {
  type: "frame", name: "Hero Image",
  width: "fill_container", height: 560, clip: true,
  fill: {type: "image", url: "./images/hero.jpg", mode: "fill", enabled: true}
})

// Imagem gerada por AI
G(imageFrame, "ai", "modern office, professional team")

// Logo com dimensao fixa
logo=I(nav, {type: "rectangle", name: "Logo", width: 188, height: 50,
  fill: {type: "image", url: "./images/logo.png", mode: "fit", enabled: true}})
```

---

## 10. Strokes e Borders

**Nivel: OBRIGATORIO**

Borders DEVEM usar variaveis de cor. Consistencia no `align` dentro do mesmo design:

```javascript
// ERRADO
{stroke: {fill: "#dedad3", thickness: {right: 1}}}

// CORRETO
{stroke: {align: "inside", fill: "$--border", thickness: {right: 1}}}
```

---

## 11. Workflow

**Nivel: RECOMENDADO**

### Antes de criar

1. `get_editor_state` — entender contexto
2. `get_variables` — listar variaveis
3. `get_guidelines` — carregar guias relevantes
4. `batch_get` — listar componentes existentes
5. Planejar: quais componentes criar, qual estrutura

### Durante

6. Criar componentes reutilizaveis primeiro
7. Frame da pagina com `placeholder: true`
8. Montar secoes com auto-layout (ou absoluto quando intencional)
9. Instanciar componentes via `ref`
10. Nomear todos os nodes

### Depois

11. `get_screenshot` — validar visualmente
12. Remover `placeholder: true`

---

## 12. Checklist de Review

Apos terminar, verificar com `batch_get`:

| Problema | Sinal | Acao |
|----------|-------|------|
| Layout acidental | `layout: "none"` em grid de cards identicos | Trocar para auto-layout |
| Cor hardcoded | Hex (`#...`) em `fill` ou `stroke` | Substituir por `$--variavel` |
| Largura acidental | `width: 597.333` (divisao manual) | Usar `fill_container` |
| Gap como spacer | `gap: 418` (valor enorme) | Usar `justifyContent` |
| Nome generico | `Frame 12345` | Renomear |
| Texto invisivel | `type: "text"` sem `fill` | Adicionar fill |
| Card duplicado | Mesmo frame 3+ vezes | Extrair componente |

**Nota:** Esses checks buscam erros **acidentais**. Se algo aparece como "problema" mas e uma decisao criativa intencional, esta tudo bem — o designer tem a ultima palavra sobre composicao visual.

---

## Resumo

| # | Regra | Nivel |
|---|-------|-------|
| 1 | Preferir auto-layout (absoluto OK quando intencional) | PREFERIR |
| 2 | Cores sempre via variaveis `$--` | OBRIGATORIO |
| 3 | Tipografia padronizada (categorias, lineHeight 100%–170% em steps de 10%) | OBRIGATORIO |
| 4 | Sizing dinamico por padrao, fixo quando intencional | PREFERIR |
| 5 | Spacing consistente (variacoes intencionais OK) | PREFERIR |
| 6 | Componentes reutilizaveis para 3+ repeticoes | OBRIGATORIO |
| 7 | Nomes semanticos em todos os nodes | OBRIGATORIO |
| 8 | Texto sempre com fill definido | OBRIGATORIO |
| 9 | Imagens via frame/rectangle fill | OBRIGATORIO |
| 10 | Strokes via variaveis de cor | OBRIGATORIO |
| 11 | Workflow: variables → componentes → layout → review | RECOMENDADO |
