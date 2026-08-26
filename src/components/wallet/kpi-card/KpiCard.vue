<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/libs/utils'

interface Props {
  /** Rótulo em caixa alta exibido acima do valor (ex.: "NO ANO"). */
  label: string
  /** Valor já formatado (ex.: "+8,42 %"). */
  value: string
  /** Variante mais curta exibida só na versão mobile, quando o valor não cabe na grade 2 colunas (ex.: "R$ 3.500"). */
  valueMobile?: string
  /** Nota de apoio abaixo do valor (ex.: "CDI +6,80 %"). */
  note: string
  /** `positive` realça o valor em verde; `neutral` mantém a cor de texto padrão. */
  tone: 'positive' | 'neutral'
  /** Escala do valor: `default` (painel) ou `sm` (faixa de indicadores da Performance). */
  size?: 'default' | 'sm'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
})

const VALUE_SIZE = {
  default: 'text-metric',
  sm: 'text-metric-sm',
} as const

const VALUE_TONE = {
  positive: 'text-success',
  neutral: 'text-foreground',
} as const

const valueClass = computed(() =>
  cn(VALUE_SIZE[props.size], VALUE_TONE[props.tone], 'whitespace-nowrap max-sm:text-metric-sm'),
)
</script>

<template>
  <li
    data-slot="kpi-card"
    :class="cn('bg-card flex flex-col gap-2 p-5 max-sm:p-3.5', props.class)"
  >
    <p class="text-eyebrow text-muted-foreground-faint">
      {{ props.label }}
    </p>

    <p :class="valueClass">
      <template v-if="props.valueMobile">
        <span class="max-sm:hidden">{{ props.value }}</span>
        <span class="hidden max-sm:inline">{{ props.valueMobile }}</span>
      </template>
      <template v-else>{{ props.value }}</template>
    </p>

    <p class="text-label text-muted-foreground">
      {{ props.note }}
    </p>
  </li>
</template>
