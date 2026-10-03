<script setup lang="ts">
import logo from '@assets/images/brand/ai-invest.svg'
import { cn } from '@libs/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    data-slot="brand-logo"
    :class="cn('inline-flex h-12 shrink-0 items-center', props.class)"
  >
    <slot>
      <img
        :src="logo"
        alt="Logo AI Invest"
        class="h-full w-auto max-w-full object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
      >
    </slot>
  </span>
</template>
