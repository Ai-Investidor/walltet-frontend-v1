<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

interface Props {
  /** Rótulo em caixa alta acima do título (ex.: "GESTÃO"). */
  eyebrow: string
  /** Título da tela. Ignorado quando o slot `title` é preenchido. */
  title?: string
  description?: string
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <header
    data-slot="page-header"
    :class="cn('flex items-end justify-between gap-6', props.class)"
  >
    <div class="flex flex-col gap-2">
      <p class="text-eyebrow text-muted-foreground-faint">
        {{ props.eyebrow }}
      </p>

      <h1 class="text-page-title text-foreground">
        <slot name="title">{{ props.title }}</slot>
      </h1>

      <p v-if="props.description" class="text-paragraph text-muted-foreground mt-1 max-w-[480px]">
        {{ props.description }}
      </p>
    </div>

    <slot name="action" />
  </header>
</template>
