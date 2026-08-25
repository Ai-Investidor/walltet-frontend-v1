<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'
import type { StatusTone } from '.'

interface Props {
  tone: StatusTone
  /** Ponto colorido à esquerda do rótulo — usado nos estados de versão. */
  dot?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  dot: false,
})

const TONE_TEXT: Record<StatusTone, string> = {
  success: 'text-success',
  warning: 'text-warning',
  muted: 'text-muted-foreground-faint',
}
</script>

<template>
  <span
    data-slot="status-badge"
    :class="cn('text-tag-sm inline-flex items-center gap-1.5', TONE_TEXT[props.tone], props.class)"
  >
    <span v-if="props.dot" class="size-1.75 shrink-0 rounded-full bg-current" aria-hidden="true" />
    <slot />
  </span>
</template>
