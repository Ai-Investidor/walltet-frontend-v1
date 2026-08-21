---
title: Menu mobile com botões separados (abrir vs fechar)
date: 2026-04-07
category: navbar
tags: [navbar, mobile, accessibility]
recurrence: baixa
scope: generic
related: ["[[navbar-fixed-positioning]]"]
sources: []
supersedes: []
superseded_by: []
rules_ref: []
origin: MobileMenu
---

# Menu mobile com botões separados (abrir vs fechar)

**Erro:** hamburger com toggle (mesmo botão abre e fecha) — fica sobreposto ao overlay fullscreen.

```jsx
// ❌
<button onClick={() => setOpen(!isOpen)}>{isOpen ? <X /> : <Hamburger />}</button>
```

**Correção:** hamburger fora do overlay (só abre, `invisible` quando aberto). X dentro do overlay (só fecha).

```jsx
// ✅
<button onClick={open} className={isOpen ? 'invisible' : ''}><Hamburger /></button>
<div className="fixed inset-0 z-50">
  <button onClick={close}><XIcon /></button>
</div>
```

**Por quê:** evita conflito de stacking entre botão e overlay e dá foco/keyboard semantics mais claros.
