---
title: Componente em 2+ telas extrai já na primeira
date: 2026-04-08
category: components
tags: [components, refactor, dry]
recurrence: media
scope: generic
related: []
sources: []
supersedes: []
superseded_by: []
rules_ref: []
origin: Equipe / TeamCard em SectionLeadership + SectionTeam
---

# Componente em 2+ telas extrai já na primeira

**Erro:** mesmo componente (ex.: `TeamCard`) como função local em duas screens com código quase idêntico.

```jsx
// ❌ src/pages/equipe/SectionLeadership.astro
function TeamCard({ name }) { /* mesma marcação */ }

// ❌ src/pages/equipe/SectionTeam.astro
function TeamCard({ name }) { /* idem */ }
```

**Correção:** se aparece em 2+ telas, extrair pra `src/components/` na primeira implementação.

```jsx
// ✅ src/components/TeamCard.astro
// importado em ambas as sections
```

**Por quê:** "refatorar depois" cobra juros — divergência de marcação entre cópias gera bugs sutis e dobra o trabalho de design.
