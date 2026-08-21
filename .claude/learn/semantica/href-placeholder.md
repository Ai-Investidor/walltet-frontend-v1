---
title: href="#" proibido — usar /TODO
date: 2026-04-07
category: semantica
tags: [links, placeholders, semantics]
recurrence: alta
scope: generic
related: []
sources: []
supersedes: []
superseded_by: []
rules_ref: []
origin: Quem Somos / botão "Código de Ética"
---

# href="#" proibido — usar /TODO

**Erro:** links/botões com `href="#"` placeholder que vão pra produção.

```jsx
// ❌
<a href="#">Baixar PDF</a>
```

**Correção:** usar `href="/TODO"` com comentário — gera 404 óbvio e é buscável.

```jsx
// ✅
<a href="/TODO">{/* TODO: URL real do PDF */}Baixar PDF</a>
```

**Por quê:** `#` faz scroll-to-top silencioso e passa despercebido em review. `/TODO` quebra explicitamente em runtime e é fácil de grepar.
