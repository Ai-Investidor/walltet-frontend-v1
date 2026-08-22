---
title: Painel lateral com largura fixa quebra em layout full-bleed
date: 2026-08-22
category: responsive
tags: [responsive, layout, tailwind]
recurrence: media
scope: generic
related: ["[[container-intermediate-viewports]]"]
sources: ["git:719559c", "git:ef56bc2"]
supersedes: []
superseded_by: []
rules_ref: ["RULES.md#R1", "RULES.md#R12"]
origin: src/pages/Login.vue, src/views/login/PainelProva.vue
---

# Painel lateral com largura fixa quebra em layout full-bleed

**Erro:** copiar a largura literal do node do design (Pencil: `width: 460` no
frame do painel) direto pro componente como utilitário fixo, num layout
full-bleed (as duas colunas ocupam a tela inteira, sem um container com
max-width envolvendo as duas). Funciona só na largura de referência do
frame (1180px); em qualquer viewport mais largo, a coluna flexível (o
formulário) cresce sem limite enquanto o painel fica travado em 460px, e a
proporção pretendida no design (~39%/61%) despenca — chegou a ~25% em tela
wide.

```vue
<PainelProva class="w-115 shrink-0 max-md:w-full" />
```

**Correção:** trocar o valor fixo por uma fração da largura do container +
um teto (`max-w-*`) equivalente ao que o design pedia como "suficiente",
mantendo o colapso pra full-width no mobile.

```vue
<PainelProva class="w-2/5 max-w-180 shrink-0 max-md:w-full max-md:max-w-none" />
```

**Por quê:** uma medida de design é a largura do elemento na largura de
referência do frame, não um contrato de pixels absolutos pro navegador. Em
layout full-bleed (edge-to-edge, sem card/container global com max-width),
qualquer coluna com largura fixa em px quebra a proporção assim que o
viewport real diverge da largura do frame original — e como não há um teto
geral segurando a página inteira, o desvio cresce sem limite em monitores
largos. Fração (`w-2/5`) preserva a proporção nas larguras comuns de
desktop; `max-w-*` evita que o painel cresça indefinidamente em ultra-wide.
R1 permite valor de dimensão vindo do design, mas isso não dispensa
perguntar se o valor deve ser um teto (`max-w-`) ou o tamanho real
(`w-`) — a resposta depende de o layout ao redor ter ou não um container
que limite a largura total.
