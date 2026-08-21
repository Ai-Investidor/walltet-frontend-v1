---
title: group-tabs exige special "group" nos alias de aba
date: 2026-05-20
category: directus
tags: [cms]
recurrence: alta
scope: generic
related: ["[[directus-image-and-visual-editing]]"]
sources: ["directus-exemplo: page_lgpd + site_settings corrigidos via MCP"]
rules_ref: ["directus.md#Interface de Abas (Tabs)"]
origin: directus-exemplo admin — Erro inesperado ao abrir singletons com abas
---

# group-tabs exige special `"group"` nos alias de aba

**Erro:** abas criadas só com `special: ["alias", "no-data"]` (sem `"group"`). No admin: **Erro inesperado** e no console `[interface-group-tabs-error]` + `Cannot read properties of undefined (reading 'filter')`.

```json
{
  "field": "tabs",
  "type": "alias",
  "meta": {
    "interface": "group-tabs",
    "special": ["alias", "no-data"],
    "options": { "title": "(migrado para acordeões)" }
  }
}
```

**Correção:** container `group-tabs` e cada `tab_*` com `group-raw` precisam de `"group"` no `special`. Container com `options: null`.

```json
{
  "field": "tabs",
  "type": "alias",
  "meta": {
    "interface": "group-tabs",
    "special": ["alias", "no-data", "group"],
    "options": null,
    "sort": 0
  }
},
{
  "field": "tab_conteudo",
  "type": "alias",
  "meta": {
    "group": "tabs",
    "interface": "group-raw",
    "special": ["alias", "no-data", "group"],
    "options": { "title": "Conteúdo" }
  }
}
```

**Por quê:** o componente `group-tabs` do Directus filtra os filhos pelo flag `group` nos metadados. Sem ele, a lista de abas fica `undefined` e o Vue quebra no `.filter()`.

**Prevenção no pipeline:** `validate-directus-schema.mjs` falha se `group-tabs`/`group-raw` não tiverem `"group"`. Templates em `build-prep.md` e exemplos em `directus.md` já usam o trio completo.
