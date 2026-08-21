---
title: Imagens estáticas no JSX — raster (imagetools URL ou .src), SVG (?url / ?react)
date: 2026-05-04
category: tokens
tags: [images, svg]
recurrence: alta
scope: generic
related:
  - "[[figma-svg-preserve-aspect-ratio]]"
  - "[[svg-currentcolor]]"
  - "[[directus-image-and-visual-editing]]"
sources: []
supersedes: []
superseded_by: []
rules_ref:
  - "RULES.md#R6"
  - "RULES.md#R10"
origin: astro.config.mjs — vite-imagetools, vite-plugin-svgr
---

# Imagens estáticas no JSX — raster (imagetools URL ou .src), SVG (?url / ?react)

**Padrão (raster):** **`vite-imagetools`** na importação: **`?w=`** ou **`?h=`**, **`format=webp`**, **`quality=90`**. No `<img>`: **`src={url}`** + **`alt` descritivo em PT-BR** (conteúdo ou função no ecrã) — **obrigatório**; **proibido** `alt=""` por omissão. **Sem** `sizes` / `decoding` por defeito neste projeto. **`loading="lazy"`** abaixo da dobra; hero/LCP: **`fetchPriority="high"`**.

Camadas só visuais (ex.: overlay CSS) podem levar **`aria-hidden`** no nó certo; a **fotografia** com significado **não** deve ficar escondida de leitores de ecrã só para “decorar”.

`vite-plugin-svgr`: SVG como componente com **`?react`**.

## Raster com `vite-imagetools`

Plugin: `imagetools()` **depois** de `svgr()`. **`fit=cover`:** só com `w` e `h` na query quando queres crop a caixa.

```jsx
import heroBg from 'images/{page}/hero.jpg?w=1920&format=webp&quality=90'

<img
  src={heroBg}
  alt="Descrição PT-BR do conteúdo ou função da imagem no ecrã."
  fetchPriority="high"
  className="absolute inset-0 h-full w-full object-cover"
/>
```

Errado / certo:

```jsx
<img src={heroBg.src} alt="…" />
<img src={heroBg} alt="" />
<img src={heroBg} width={1920} height={1080} alt="…" />
```

## Raster sem query (fallback)

```jsx
import heroBg from 'images/{page}/hero.jpg'

<img
  alt="…"
  src={heroBg.src}
  className="…"
/>
```

## SVG para `<img>`

```jsx
import divider from 'images/{page}/divider.svg?url'

<img
  src={divider}
  alt="Linha separadora entre blocos da listagem."
  className="block w-full max-h-px"
/>
```

Imagetools não aplica a SVG. Raiz: [[figma-svg-preserve-aspect-ratio]].

## SVG como componente

Dimensões do slot: **Tailwind no componente ou no pai** (`size-full`, `h-[…] w-[…]`); **não** duplicar `width`/`height` em props quando o layout já está definido por classes.

Ícones com texto adjacente: **`aria-hidden`** no SVG (R7/R10). Tipos: `vite-plugin-svgr/client`. Cores: [[svg-currentcolor]].

## CMS

Directus: [[directus-image-and-visual-editing]]. Regras: **R6** e **R10**.
