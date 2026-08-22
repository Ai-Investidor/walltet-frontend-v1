<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/libs/utils'

interface Props {
  /** Rótulo em caixa alta exibido acima do valor (ex.: "NO ANO"). */
  label: string
  /** Valor já formatado (ex.: "+8,42 %"). */
  value: string
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

const valueClass = computed(() => cn(VALUE_SIZE[props.size], VALUE_TONE[props.tone]))
</script>

<template>
  <li
    data-slot="kpi-card"
    :class="cn('bg-card flex flex-col gap-2 p-5', props.class)"
  >
    <p class="text-eyebrow text-muted-foreground-faint">
      {{ props.label }}
    </p>

    <p :class="valueClass">
      {{ props.value }}
    </p>

    <p class="text-label text-muted-foreground">
      {{ props.note }}
    </p>
  </li>
</template>
