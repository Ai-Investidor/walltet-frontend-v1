---
title: SVGs inline devem usar currentColor
date: 2026-04-07
category: tokens
tags: [svg, colors]
recurrence: media
scope: generic
related:
  - "[[gradients-utility-class]]"
  - "[[figma-svg-preserve-aspect-ratio]]"
  - "[[static-assets-import-jsx]]"
sources: []
supersedes: []
superseded_by: []
rules_ref: ["RULES.md#R1"]
origin: Quem Somos / SectionDifferentials
---

# SVGs inline devem usar currentColor

**Erro:** `stroke="#adbe42"` / `fill="#ffffff"` hardcoded em SVGs inline.

```jsx
// ❌
<path stroke="#adbe42" d="M..." />
```

**Correção:** trocar por `currentColor`, controlar cor via classe `text-*` no pai.

```jsx
// ✅
<div className="text-green-light">
  <path stroke="currentColor" d="M..." />
</div>
```

**Por quê:** R1 proíbe hex em cores, mas não menciona SVGs explicitamente. `currentColor` herda do `text-*` do pai e respeita os tokens.
