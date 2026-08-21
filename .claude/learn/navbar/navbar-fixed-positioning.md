---
title: Navbar precisa ser fixed top-0
date: 2026-04-07
category: navbar
tags: [navbar, layout]
recurrence: baixa
scope: generic
related: ["[[mobile-menu-separate-buttons]]"]
sources: []
supersedes: []
superseded_by: []
rules_ref: []
origin: Navbar / MobileMenu
---

# Navbar precisa ser fixed top-0

**Erro:** Navbar com posição estática — rola junto com a página.

```jsx
// ❌
<nav className="w-full h-20">
```

**Correção:** `fixed top-0 left-0 w-full z-50` + spacer/padding-top no conteúdo abaixo.

```jsx
// ✅
<nav className="fixed top-0 left-0 w-full h-20 z-50">
```

**Por quê:** o design exige navbar persistente; sem `fixed` ela some no scroll. Lembrar do offset no conteúdo seguinte.
