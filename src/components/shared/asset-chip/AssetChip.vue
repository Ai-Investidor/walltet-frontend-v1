<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

interface Props {
  /** Iniciais do ativo exibidas no chip (ex.: "MX"). */
  code: string
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <span
    data-slot="asset-chip"
    aria-hidden="true"
    :class="cn(
      'text-eyebrow flex size-8.5 shrink-0 items-center justify-center rounded-md border border-border-strong text-muted-foreground',
      props.class,
    )"
  >
    {{ props.code }}
  </span>
</template>
