# RULES.md — Regras do template

Template para iniciar **SaaS em SPA**. Clonar, renomear e começar pela primeira rota.

Este arquivo é a fonte única de regras de código. Skills e agents referenciam, não duplicam.

## Arquitetura

| Camada | Tecnologia |
| --- | --- |
| UI | Vue 3 (SFC `<script setup>`) + TypeScript strict |
| Build | Vite + bun |
| Estilo | Tailwind CSS v4, configurado em CSS (`src/assets/index.css`) |
| Componentes | shadcn-vue sobre primitivas reka-ui |
| Estado / rotas | Pinia + vue-router |
| Qualidade | Biome (lint + formatter) |

Fluxo de composição:

```
routers → layouts → pages → views (seções) → components/<dominio> → components/ui
```

---

## R1 — Valores Tailwind

**Cor, tipografia e espaçamento saem sempre de utilitário.** Valor arbitrário nessas três dimensões é erro grave. Se o utilitário ainda não existe, criar em `src/assets/index.css` — o design system cresce por ali.

**Exceção: dimensão.** `w-`, `h-`, `max-w-`, `min-h-` aceitam valor arbitrário quando vêm de uma medida concreta do design e nenhum utilitário equivalente cobre. Verificar antes de usar.

❌ Errado:

```html
<div class="bg-[#46454d] p-[22px] gap-[10px]">
  <span class="text-[14px] font-[500] tracking-[-0.01em]">Saldo</span>
</div>
```

✅ Certo — utilitários para cor, tipografia e espaçamento; arbitrário só na largura:

```html
<div class="bg-card p-6 gap-3 max-w-[835px]">
  <span class="text-heading text-muted-foreground">Saldo</span>
</div>
```

**Por quê:** cor arbitrária ignora o `.dark` e quebra o tema; tipografia e espaçamento arbitrários dissolvem a escala e tornam o design system decorativo. Dimensão é a única faixa em que o design produz valores contínuos demais para tabelar.

**Token novo entra em três lugares** de `src/assets/index.css`:

```css
:root         { --success: oklch(0.72 0.15 150); }
.dark         { --success: oklch(0.62 0.14 150); }
@theme inline { --color-success: var(--success); }
```

Depois disso `bg-success` e `text-success` existem e acompanham o tema.

---

## R2 — Tipografia

Cada elemento de texto recebe **um** text-style. Eles já definem `font-size`, `font-weight` e `line-height`.

| Classe | Uso |
| --- | --- |
| `text-title` | título de tela |
| `text-heading` | título de seção ou card |
| `text-heading-caps` | título em caixa alta |
| `text-label` | rótulo de campo, legenda de dado |
| `text-paragraph` | texto corrido |
| `text-paragraph-light` | texto corrido secundário |
| `text-caption` | apoio |
| `text-caption-sm` | apoio compacto |
| `text-button` | ação |
| `text-button-sm` | ação compacta |

Cor é independente e vem dos tokens da R1. Variantes responsivas funcionam normalmente: `max-md:text-caption-sm`.

❌ Errado — tipografia arbitrária, ou override empilhado sobre o text-style:

```html
<h2 class="text-[14px] font-medium tracking-[-0.01em]">Extrato</h2>
<p class="text-paragraph font-semibold leading-tight">Ajuste manual</p>
```

✅ Certo:

```html
<h2 class="text-heading-caps">Extrato</h2>
<p class="text-paragraph text-muted-foreground">Últimos 30 dias</p>
```

**Por quê:** o text-style é o contrato entre design e código. Empilhar `font-semibold` sobre ele produz um estilo fora da escala, que ninguém consegue rastrear depois.

A tabela é o ponto de partida, não um limite. Figma e Pencil entregam combinações bem específicas de tamanho, peso e entrelinha, e é esperado que o catálogo cresça junto com o produto: quando nenhum estilo existente reproduz o que o design pede, criar um novo é a resposta correta. Aproximar no olho ou compensar com `font-*` e `leading-*` no template deixa o design system defasado e o desvio invisível.

Antes de criar, procurar um estilo equivalente — dois nomes para o mesmo CSS custam mais do que um nome bem escolhido.

### Text-style novo entra em dois lugares

```css
/* 1 — src/assets/index.css */
@utility text-paragraph-lg {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}
```

```ts
// 2 — src/libs/utils.ts
const TEXT_STYLES = [..., "paragraph-lg"]
```

**Por quê o segundo passo:** `tailwind-merge` não conhece as classes do projeto e, pelo formato do nome, as classifica como utilitário de cor. Sem o registro no grupo `font-size`, `cn('text-paragraph', 'text-muted-foreground')` devolve só a cor e a tipografia some — sem erro de build, sem aviso.

---

## R3 — Aliases

Importar sempre por alias. Caminho relativo fica restrito a arquivos irmãos dentro da mesma pasta de componente (`from '.'`, `from './utils'`).

| Alias | Destino |
| --- | --- |
| `@/*` | `src/*` |
| `@assets/*` | `src/assets/*` |
| `@boot/*` | `src/boot/*` |
| `@components/*` | `src/components/*` |
| `@components/ui/*` | `src/components/ui/*` |
| `@composables/*` | `src/composables/*` |
| `@config/*` | `src/config/*` |
| `@constants/*` | `src/constants/*` |
| `@data/*` | `src/data/*` |
| `@layouts/*` | `src/layouts/*` |
| `@libs/*` | `src/libs/*` |
| `@pages/*` | `src/pages/*` |
| `@routers/*` | `src/routers/*` |
| `@services/*` | `src/services/*` |
| `@stores/*` | `src/stores/*` |
| `@utils/*` | `src/utils/*` |
| `@views/*` | `src/views/*` |

`@assets` tem ainda os atalhos `@assets/css`, `@assets/icons` e `@assets/images`.

❌ Errado:

```ts
import { Button } from '../../components/ui/button'
```

✅ Certo:

```ts
import { Button } from '@components/ui/button'
import { cn } from '@/libs/utils'
```

**Alias novo entra em `tsconfig.json` e `vite.config.ts`.**

**Por quê:** caminho relativo quebra em refactor e amarra o import à posição do arquivo. E os dois arquivos resolvem coisas diferentes — o `tsconfig` atende o editor, o Vite monta o bundle; atualizar só um produz código que passa na IDE e quebra no build.

---

## R4 — SFC e TypeScript

Todo componente é `<script setup lang="ts">` com props tipadas por generic.

- `defineProps<Props>()`, com `withDefaults` quando há default
- `import type` para tipo puro
- prop de classe é `class?: HTMLAttributes['class']`
- `noUnusedLocals` e `noUnusedParameters` estão ativos: identificador sem uso quebra o build

❌ Errado:

```vue
<script setup>
const props = defineProps({
  variant: { type: String, default: 'default' },
  class: { type: String, default: '' },
})
</script>
```

✅ Certo:

```vue
<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

interface Props {
  variant?: 'default' | 'outline'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
})
</script>
```

**Por quê:** a forma objeto não expressa união literal, então o consumidor perde autocomplete e o erro de valor inválido. `class` como `string` rejeita array e objeto, que `cn` aceita.

---

## R5 — Anatomia de componente

Duas camadas, **uma única anatomia**.

`src/components/ui/` — peças atômicas e universais: botão, input, card, dialog. É o design system do template. Editar é esperado (cor, raio, densidade, comportamento), desde que a anatomia abaixo seja preservada. Peça nova vem do CLI:

```bash
bunx shadcn-vue@latest add <componente>
```

O CLI gera o import de `cn` apontando para `@/lib/utils`; ajustar para `@/libs/utils`.

`src/components/<dominio>/<componente>/` — peças específicas do produto, agrupadas pela área que servem:

```
src/components/
├── ui/
│   ├── button/
│   └── card/
├── wallet/
│   ├── balance-card/
│   │   ├── BalanceCard.vue
│   │   └── index.ts
│   └── transaction-row/
└── shared/
    └── page-header/
```

### Anatomia obrigatória em qualquer nível

1. Pasta própria com `index.ts` exportando as peças
2. `<script setup lang="ts">`
3. prop `class?: HTMLAttributes['class']`
4. `cn(..., props.class)` no elemento raiz, sempre por último
5. `data-slot="<nome>"` no elemento raiz
6. conteúdo entra por `<slot />`
7. estrutura com várias partes vira compound (`Card` + `CardHeader` + `CardContent`)

❌ Errado — classe concatenada, sem prop `class`, sem slot, markup fechado:

```vue
<script setup lang="ts">
defineProps<{ titulo: string, valor: string }>()
</script>

<template>
  <div class="bg-card rounded-lg p-6">
    <h3 class="text-heading">{{ titulo }}</h3>
    <p class="text-title">{{ valor }}</p>
  </div>
</template>
```

✅ Certo:

```vue
<!-- src/components/wallet/balance-card/BalanceCard.vue -->
<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="balance-card"
    :class="cn('bg-card text-card-foreground flex flex-col gap-2 rounded-lg p-6', props.class)"
  >
    <slot />
  </div>
</template>
```

```ts
// src/components/wallet/balance-card/index.ts
export { default as BalanceCard } from './BalanceCard.vue'
export { default as BalanceCardLabel } from './BalanceCardLabel.vue'
export { default as BalanceCardValue } from './BalanceCardValue.vue'
```

**Por quê:** o Vue concatena o `class` do consumidor por fallthrough sem resolver conflitos — `p-6` do componente e `p-4` do consumidor coexistem, e vence a ordem do CSS. `cn` em último lugar deixa `tailwind-merge` remover o perdedor. Declarar `class` como prop já a retira de `$attrs`, então o restante (`id`, `disabled`, `aria-*`, listeners) continua chegando na raiz sozinho.

### Envolvendo uma primitiva reka-ui

Repassar as props da primitiva, tirando `class` do repasse:

```vue
<script setup lang="ts">
import type { AccordionItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AccordionItem, useForwardProps } from 'reka-ui'
import { cn } from '@/libs/utils'

const props = defineProps<AccordionItemProps & { class?: HTMLAttributes['class'] }>()

const forwardedProps = useForwardProps(reactiveOmit(props, 'class'))
</script>

<template>
  <AccordionItem
    v-slot="slotProps"
    data-slot="accordion-item"
    v-bind="forwardedProps"
    :class="cn('not-last:border-b', props.class)"
  >
    <slot v-bind="slotProps" />
  </AccordionItem>
</template>
```

Quando há emits ou `v-model`, trocar por `useForwardPropsEmits(props, emits)`.

**Por quê:** sem o repasse, a primitiva perde as próprias props e o componente vira uma casca que só estiliza. `reactiveOmit` impede que `class` chegue duas vezes.

### `cva` é exceção

`cva` entra no `index.ts` **quando o componente tem variants reais** — dimensões ortogonais como `variant` × `size`, cada combinação mudando várias classes. No kit, 16 arquivos em cerca de 360 usam. O resto é só `cn`.

```ts
// src/components/ui/button/index.ts
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva('inline-flex items-center justify-center', {
  variants: {
    variant: { default: 'bg-primary text-primary-foreground', ghost: 'hover:bg-muted' },
    size: { default: 'h-8 px-3', lg: 'h-9 px-4' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})

export type ButtonVariants = VariantProps<typeof buttonVariants>
```

Para uma única dimensão, um mapa é mais legível e tem o mesmo alcance:

```ts
const DENSIDADE = {
  compacta: 'gap-2 p-3',
  confortavel: 'gap-4 p-6',
} as const
```

---

## R6 — Quando criar um componente

Extrair a partir de **dois consumidores**. Com um só, o markup fica onde está.

- repetição dentro da mesma seção resolve com `v-for` sobre um array
- shell de página fica na view ou no layout da rota
- constante de classes só quando reusada duas vezes no arquivo ou exportada

❌ Errado — arquivo criado para um único importador:

```
src/components/wallet/transaction-row/   ← usado só por views/wallet/Statement.vue
```

✅ Certo — inline na seção, repetição por `v-for`:

```vue
<!-- src/views/wallet/Statement.vue -->
<template>
  <li v-for="t in transactions" :key="t.id" class="flex items-center justify-between py-3">
    <span class="text-paragraph">{{ t.description }}</span>
    <span class="text-label text-muted-foreground">{{ t.amount }}</span>
  </li>
</template>
```

**Por quê:** extração com um consumidor fragmenta a leitura e define uma API de props chutada para um caso. Com o segundo consumidor a API fica real.

---

## R7 — Páginas e views

Toda tela se monta do mesmo jeito: a **página** é uma por rota e compõe as **views**, que são as seções daquela tela.

| Pasta | Papel |
| --- | --- |
| `src/routers/` | definição das rotas |
| `src/layouts/` | shell entre rotas: header, sidebar, `<RouterView />` |
| `src/pages/` | uma página por rota, composta pelas seções |
| `src/views/<pagina>/` | as seções daquela página |

❌ Errado — seção registrada como rota, página tratada como seção:

```
src/pages/WalletBalance.vue    ← seção dentro de pages/
src/views/Wallet.vue         ← página dentro de views/
```

✅ Certo:

```
src/pages/Wallet.vue
src/views/wallet/Balance.vue
src/views/wallet/Statement.vue
```

```vue
<!-- src/pages/Wallet.vue -->
<script setup lang="ts">
import Extrato from '@views/wallet/Statement.vue'
import Saldo from '@views/wallet/Balance.vue'
</script>

<template>
  <Saldo />
  <Extrato />
</template>
```

**Por quê:** o router conhece apenas páginas e layouts. A página fica sendo um índice legível da tela, e cada seção pode crescer sem inchar um arquivo único.

---

## R8 — Estado e dados

A camada dinâmica existe desde a integração com `carteira-sistema-backend` (ver
`docs/AUDITORIA-INTEGRACAO.md`). `src/data/*.ts` deixou de ser o caminho padrão — só sobrevive
para conteúdo genuinely estático (marketing/decorativo, sem endpoint correspondente).

| Precisa de | Vai em |
| --- | --- |
| chamada HTTP a um endpoint do backend | função em `src/services/<dominio>.ts`, tipada com os DTOs de `src/services/types.ts` |
| sessão do usuário ou outro estado compartilhado entre páginas | store Pinia em `src/stores/<dominio>.ts` |
| tradução de DTO da API para a prop de um componente, quando os campos não são idênticos | função de mapeamento explícita (`src/utils/<assunto>.ts`), não um cast solto |
| conteúdo genuinely estático (texto de marketing, prova social, menu de navegação) sem endpoint | constante tipada em `src/data/<dominio>.ts`, como antes |
| texto literal (título, rótulo, microcopy) | direto no template |
| estado derivado de interação do usuário (filtro, paginação, seleção, open/closed) | `ref`/`reactive` na própria view |

Toda função de `src/services/` usa a instância única `http` de `src/boot/http.ts`
(`axios.create({ baseURL: API_URL, withCredentials: true })`, com o interceptor de `401
UNAUTHORIZED` já plugado — ver `src/config/env.ts` para `API_URL`). Nunca instanciar outro client
axios num componente.

Page ou view busca o dado num `onMounted` (ou reage a props/params via `watch`), guarda o
resultado em `ref` tipado com o DTO de `src/services/types.ts`, e cobre pelo menos três estados:
carregando, erro (mostrar `error.message` do envelope padrão) e vazio/sem-dado (perfil sem
avaliação, carteira não vinculada — não assumir que o campo opcional do DTO sempre vem
preenchido). Um componente sem consumidor duplo não precisa de composable genérico de fetch — a
lógica de `onMounted` + `ref` direto na page/view já resolve; extrair só a partir do segundo
consumidor (R6).

❌ Errado — axios solto no componente, sem tratar estado de carregamento/erro:

```vue
<script setup lang="ts">
import axios from 'axios'

const { data } = await axios.get('https://api.exemplo.com/v1/wallet/balance')
</script>
```

✅ Certo:

```ts
// src/services/wallet.ts
import { http } from '@boot/http'
import type { BalanceResponseDto } from './types'

export async function balance(): Promise<BalanceResponseDto> {
  const { data } = await http.get<BalanceResponseDto>('/wallet/balance')
  return data
}
```

```vue
<!-- view -->
<script setup lang="ts">
import * as walletService from '@services/wallet'
import type { BalanceResponseDto } from '@services/types'
import { onMounted, ref } from 'vue'

const balance = ref<BalanceResponseDto | null>(null)
const carregando = ref(true)
const erro = ref('')

onMounted(async () => {
  try {
    balance.value = await walletService.balance()
  } catch {
    erro.value = 'Não foi possível carregar o saldo agora.'
  } finally {
    carregando.value = false
  }
})
</script>

<template>
  <p v-if="carregando">Carregando…</p>
  <p v-else-if="erro" role="alert">{{ erro }}</p>
  <span v-else-if="balance">{{ balance.total }}</span>
</template>
```

**Por quê:** a instância única de `http` mantém `baseURL`, cookie de sessão e tratamento de 401
consistentes em todo o app; duplicar `axios.create` por componente reabre exatamente o problema
que a integração fechou. Cobrir carregando/erro/vazio explicitamente evita telas que assumem
dado sempre presente — o backend real modela ausência (`perfilInvestidor: null`,
`carteiraVinculada: null`) onde o mock antigo sempre tinha valor.

### Dados estáticos (o que sobra em `src/data/`)

Continua um arquivo por domínio, reunindo o conteúdo mockado. Só entra aqui o que não tem — e não
deveria ter — endpoint: menu de navegação (`navigation.ts`), texto de prova social nas telas
públicas de login/cadastro. Antes de criar arquivo novo aqui: confirmar que não existe rota no
backend para esse dado (ver `docs/AUDITORIA-INTEGRACAO.md`) — se existir, o caminho é
`services/`, não `data/`.

**Por quê:** o mesmo motivo de sempre — um arquivo por domínio mantém o conteúdo mockado legível
num lugar só. A diferença é que agora "mockado" é a exceção documentada, não o padrão.
---

## R9 — Rotas e code-splitting

Rota carrega lazy; componente pesado abaixo da dobra carrega assíncrono; conteúdo acima da dobra carrega junto.

❌ Errado:

```ts
import Relatorios from '@pages/Reports.vue'

const routes = [{ path: '/relatorios', component: Relatorios }]
```

✅ Certo:

```ts
const routes = [
  { path: '/', component: () => import('@pages/Wallet.vue') },
  { path: '/relatorios', component: () => import('@pages/Reports.vue') },
]
```

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

const SpendingChart = defineAsyncComponent(() => import('@components/wallet/spending-chart'))
</script>
```

**Por quê:** num SaaS a maioria das rotas nunca é aberta na sessão. Import eager coloca todas elas no bundle de boot e atrasa a primeira tela para todo mundo.

---

## R10 — Ícones

`@phosphor-icons/vue`. Os componentes têm prefixo `Ph`. Tamanho por classe utilitária, `aria-hidden` quando o ícone é decorativo.

❌ Errado:

```vue
<script setup lang="ts">
import { CaretDown } from '@phosphor-icons/vue'
</script>

<template>
  <button><PhX /></button>
</template>
```

✅ Certo:

```vue
<script setup lang="ts">
import { PhArrowUpRight, PhCaretDown } from '@phosphor-icons/vue'
</script>

<template>
  <PhCaretDown class="size-4" aria-hidden="true" />

  <button aria-label="Enviar transferência">
    <PhArrowUpRight class="size-5" weight="bold" aria-hidden="true" />
  </button>
</template>
```

Ícone de marca ou ilustração fora do catálogo vira SVG inline em `src/components/icons/`, com `fill="currentColor"` para herdar `text-*`.

**Por quê:** o kit inteiro já usa Phosphor. Uma segunda biblioteca duplica peso e mistura dois grids ópticos na mesma tela. Botão só-ícone precisa do `aria-label`, já que o SVG não tem nome acessível.

---

## R11 — Imagens

- arquivo em `src/assets/images/`, importado por alias — o import devolve a URL com hash de build
- fonte entregue já otimizada em `.webp`
- `alt` descritivo em português em toda imagem
- `loading="lazy"` abaixo da dobra
- dimensão pelo CSS

❌ Errado:

```vue
<template>
  <img :src="cover" :width="1920" :height="1080" alt="">
</template>
```

✅ Certo:

```vue
<script setup lang="ts">
import cover from '@assets/images/wallet/cover.webp'
</script>

<template>
  <img
    :src="cover"
    alt="Pessoa conferindo o extrato da carteira no celular."
    class="h-full w-full object-cover"
    loading="lazy"
  >
</template>
```

**Por quê:** `alt` vazio remove a imagem da leitura assistiva sem marcá-la como decorativa, e atributo de dimensão inline compete com o CSS, virando override difícil de rastrear.

---

## R12 — Responsive desktop-first

O estilo base descreve o desktop; telas menores recebem ajuste com `max-*`.

Breakpoints são os padrões do Tailwind v4: `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem, `2xl` 96rem. Breakpoint próprio se declara em `@theme`.

❌ Errado:

```html
<div class="text-caption-sm md:text-paragraph lg:text-title"></div>
```

✅ Certo:

```html
<div class="text-title max-lg:text-paragraph max-md:text-caption-sm"></div>
```

**Por quê:** o alvo primário de um SaaS é a tela grande, onde a densidade de informação é maior. Misturar as duas direções na mesma base gera cascata imprevisível.

---

## R13 — Semântica, acessibilidade e formulários

Cada conteúdo usa a tag que descreve sua função; a classe visual entra por cima dela.

- landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) no layout; `<main>` envolve o `<RouterView />`
- um `<h1>` por página, headings em sequência
- navegação interna com `<RouterLink>`
- `aria-label` em botão só-ícone
- texto corrido em `<p>`, listas em `<ul>`/`<ol>`; espaçamento por `gap`/`margin`

Formulário usa vee-validate com schema zod, através de `@components/ui/form`.

❌ Errado — tag genérica, label solto, botão como div:

```vue
<template>
  <div class="text-heading">Transferir</div>

  <form>
    <span class="text-label">Valor</span>
    <input v-model="amount" required>
    <div @click="enviar">Enviar</div>
  </form>
</template>
```

✅ Certo:

```vue
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Button } from '@components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { Input } from '@components/ui/input'

const schema = toTypedSchema(z.object({
  amount: z.number({ message: 'Informe um valor' }).positive('O valor deve ser maior que zero'),
}))
</script>

<template>
  <h2 class="text-heading">Transferir</h2>

  <Form :validation-schema="schema" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="amount">
      <FormItem>
        <FormLabel>Valor</FormLabel>
        <FormControl>
          <Input type="number" inputmode="decimal" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit">
      Enviar
    </Button>
  </Form>
</template>
```

**Por quê:** `FormItem` gera o `id` e liga label, campo e mensagem de erro por `aria-describedby`; montar isso à mão erra a associação quase sempre. O schema zod concentra validação e tipo no mesmo lugar.

Componentizar não conflita com semântica: o que importa é a tag que sai no DOM. `Button` renderiza `<button>`, `RouterLink` renderiza `<a>` — quem encapsula é responsável pela tag correta na raiz.

---

## R14 — Tooling

`bun` como package manager. Biome cobre lint e formatação.

| Comando | Efeito |
| --- | --- |
| `bun dev` | servidor de desenvolvimento |
| `bun run build` | `vue-tsc -b && vite build` — checagem de tipo faz parte do build |
| `bun check` | lint + formatação, sem escrever |
| `bun format` | aplica as correções |

A regra `useSortedClasses` ordena as classes automaticamente e reconhece `cn`, `cva` e `clsx`; rodar `bun format` e aceitar a ordem gerada.

Padrão de formatação do template: 2 espaços e aspas simples, alinhado ao que o CLI do shadcn-vue gera.

**Gate antes de entregar:** `bun check` limpo e `bun run build` passando.

---

## Bibliotecas padrão

Antes de adicionar dependência, verificar se a necessidade já está coberta.

| Necessidade | Solução |
| --- | --- |
| Componente de interface | `@components/ui/*` (shadcn-vue sobre reka-ui) |
| Carrossel | `@components/ui/carousel` (embla) |
| Formulário e validação | vee-validate + zod via `@components/ui/form` |
| Notificação | `@components/ui/sonner` (vue-sonner) |
| Ícone | `@phosphor-icons/vue` |
| Estado compartilhado | Pinia |
| HTTP | axios, encapsulado nos serviços de domínio |
| Utilitário reativo | `@vueuse/core` |
| Animação | GSAP, com cleanup em `onUnmounted` |
| Scroll suave | Lenis |

---

## Meta

Regra nova entra aqui com ❌ e ✅ ancorados em código real do repositório. Detalhe que vale para um produto específico, e não para o template, fica fora deste arquivo.
