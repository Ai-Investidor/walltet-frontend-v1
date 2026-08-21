---
title: SVG export Figma — preserveAspectRatio não pode ser none
date: 2026-05-04
category: tokens
tags: [svg, css]
recurrence: alta
scope: generic
related: ["[[svg-currentcolor]]", "[[static-assets-import-jsx]]"]
sources: []
supersedes: []
superseded_by: []
rules_ref: []
origin: assets em src/assets/images/{page}/*.svg; logos via *.svg?react
---

# SVG export Figma — preserveAspectRatio não pode ser none

**Erro:** raiz `<svg>` vinda do Figma com `preserveAspectRatio="none"` e `width="100%" height="100%"`. Em `<img>` ou container com proporção diferente do `viewBox`, o vetor **estica** em X e Y de forma independente (logo/ícone “distorcido”).

```svg
<!-- ❌ -->
<svg preserveAspectRatio="none" width="100%" height="100%" viewBox="0 0 173 40" ...>
```

**Correção:** usar escala uniforme e tirar o forçar 100% na raiz do arquivo (tamanho vem do CSS/`width`/`height` no uso).

```svg
<!-- ✅ -->
<svg viewBox="0 0 173 40" preserveAspectRatio="xMidYMid meet" overflow="visible" ...>
```

Em componentes React inline, declarar no `<svg>`:

```jsx
<svg viewBox="..." preserveAspectRatio="xMidYMid meet" ...>
```

**Por quê:** `none` desliga o aspect ratio do SVG; `xMidYMid meet` é o comportamento padrão do SVG quando `none` não está definido — encaixa o `viewBox` inteiro sem deformar. Combina com `object-contain` em `<img>` quando as dimensões do box não batem com o `viewBox`.

**Escopo no repo:** ajuste aplicado nos `.svg` em `src/assets/images/{page}/` usados em `<img>` ou via `vite-plugin-svgr` (`?react`).
