---
title: Directus — imagem com relação, assetUrl e data-directus
date: 2026-04-08
category: directus
tags: [cms, images, visual-editing]
recurrence: alta
scope: generic
related: ["[[static-assets-import-jsx]]", "[[group-tabs-special-group-flag]]"]
sources: []
supersedes: []
superseded_by: []
rules_ref:
  - "RULES.md#R14"
origin: delta acumulado de commands/directus.md
---

# Directus — imagem com relação, assetUrl e data-directus

**Erro:** três armadilhas frequentes com Directus que repetem entre projetos:

```astro
<!-- ❌ UUID direto no src -->
<img src={item.imagem} />
<!-- ❌ campo de imagem criado sem relation com directus_files -->
<!-- ❌ elemento editável sem data-directus -->
<h2>{item.titulo}</h2>
```

**Correção:**

```astro
<!-- ✅ assetUrl com width/height -->
<img src={assetUrl(item.imagem, { width: 800, height: 600 })} />

<!-- ✅ visual editing -->
<h2 data-directus={editAttr('paginas', item.id, 'titulo')}>{item.titulo}</h2>
```

E ao criar campo de imagem no Directus: **dois passos** — criar o field + criar relation M2O com `directus_files`. Sem a relation, a API retorna o UUID cru e o visual editing quebra.

**Por quê:** consolidação dos 3 erros mais frequentes ao integrar com Directus. Detalhes completos em `.claude/commands/directus.md`.
