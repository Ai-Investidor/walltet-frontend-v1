<script setup lang="ts">
import { PhList } from '@phosphor-icons/vue'
import type { HTMLAttributes } from 'vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utils'
import { useSidebar } from './utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon-sm"
    :class="cn('', props.class)"
    @click="toggleSidebar"
  >
    <PhList class="size-5" aria-hidden="true" />
    <span class="sr-only">Abrir menu</span>
  </Button>
</template>
