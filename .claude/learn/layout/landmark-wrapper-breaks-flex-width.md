---
title: Wrapper de landmark adicionado por cima de um flex child quebra sua largura
date: 2026-08-22
category: layout
tags: [layout, tailwind, accessibility]
recurrence: baixa
scope: generic
related: ["[[fixed-width-panel-fullbleed]]"]
sources: ["git:f3ee80b"]
supersedes: []
superseded_by: []
rules_ref: ["RULES.md#R13"]
origin: src/pages/Login.vue, src/pages/CriarConta.vue
---

# Wrapper de landmark adicionado por cima de um flex child quebra sua largura

**Erro:** um finding de code review pediu landmark pro painel lateral ("seção
fora de `<main>`/`<aside>`/`<nav>`"). A correção envolveu embrulhar o
componente existente num `<aside>` novo, sem perceber que o componente já
era o **item flex direto** do container pai — e era nele, não num wrapper
futuro, que viviam as classes de dimensionamento (`w-2/5 max-w-180
shrink-0`).

```vue
<!-- ❌ src/pages/Login.vue / src/pages/CriarConta.vue -->
<div class="flex min-h-screen max-md:flex-col">
  <main class="flex flex-1 flex-col justify-center">
    <Formulario />
  </main>
  <aside>
    <PainelProva />
  </aside>
</div>
```

`PainelProva` renderiza um `<section :class="cn('w-2/5 max-w-180 shrink-0 ...', props.class)">`.
Com o `<aside>` por fora, o item flex real passou a ser o `<aside>` — um
elemento sem nenhuma classe de largura, que caiu no comportamento default do
flexbox (`flex-basis: auto`, `flex-shrink: 1`, `min-width: auto`) e encolheu
pra caber no conteúdo. O painel, antes ~40% da tela, colapsou a ponto de
truncar texto (`"Tesouro I..."`, `"Ações BR ..."`) e quebrar o título em 3
linhas.

**Correção:** remover o wrapper. `<section aria-labelledby="...">` já é um
landmark nomeado por si só (HTML/ARIA: `section` com nome acessível vira
"region") — o finding do review já estava resolvido antes da "correção".

```vue
<!-- ✅ -->
<div class="flex min-h-screen max-md:flex-col">
  <main class="flex flex-1 flex-col justify-center">
    <Formulario />
  </main>
  <PainelProva />
</div>
```

**Por quê:** em flexbox, as classes de dimensionamento (`w-*`, `shrink-*`,
`grow-*`) só têm efeito no item flex **direto** — o filho imediato do
container `flex`. Embrulhar esse filho num elemento novo não propaga a
sizing pra dentro; cria um item flex novo e sem classes por cima do antigo,
que agora é só um bloco comum. Qualquer ajuste "de fora" num componente já
usado como flex child (landmark, wrapper de analytics, div de animação)
precisa ou repassar as classes de sizing pro wrapper, ou usar `contents`, ou
questionar se o wrapper é necessário — aqui não era: o elemento raiz do
componente já resolvia a semântica sozinho. Regra prática: antes de embrulhar
um componente que é item flex direto, checar se ele carrega classes de
`w-`/`shrink-`/`grow-`/`flex-` no próprio root: se sim, o wrapper precisa
herdar isso ou a sizing morre.
