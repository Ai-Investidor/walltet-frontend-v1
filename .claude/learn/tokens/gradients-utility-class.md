---
title: Gradientes em classe utilitária, nunca inline
date: 2026-04-07
category: tokens
tags: [gradients, css, tailwind]
recurrence: media
scope: generic
related: ["[[svg-currentcolor]]"]
sources: []
supersedes: []
superseded_by: []
rules_ref: ["RULES.md#R1"]
origin: Quem Somos / SectionTimeline
---

# Gradientes em classe utilitária, nunca inline

**Erro:** `style={{ background: 'radial-gradient(...)' }}` com rgba hardcoded no JSX.

```jsx
// ❌
<div style={{ background: 'radial-gradient(ellipse, rgba(173,190,66,0.3), transparent)' }} />
```

**Correção:** criar classe `.bg-{nome}-gradient` em `tailwind.css` usando `var(--token)`.

```css
/* ✅ tailwind.css */
.bg-timeline-gradient {
  background: radial-gradient(ellipse at center, rgb(var(--green-light) / 0.3), transparent);
}
```

**Por quê:** centraliza o gradiente no design system, respeita tokens (R1) e fica reutilizável.
