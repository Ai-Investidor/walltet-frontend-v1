<script setup lang="ts">
import { formatPercent } from '@utils/format'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/libs/utils'
import type { AllocationSlice } from '.'

interface Props {
  slices: AllocationSlice[]
  /** Exibe a legenda "Classe 00,00 %" abaixo da fita. */
  legend?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  legend: false,
})

const TONE_FILL: Record<AllocationSlice['tone'], string> = {
  'data-1': 'bg-data-1',
  'data-2': 'bg-data-2',
  'data-3': 'bg-data-3',
  'data-4': 'bg-data-4',
}

function sliceLabel(slice: AllocationSlice) {
  return `${slice.label} ${formatPercent(slice.percent)}`
}

const barLabel = computed(() => props.slices.map(sliceLabel).join(', '))
</script>

<template>
  <div data-slot="allocation-bar" :class="cn('flex flex-col gap-2.5', props.class)">
    <div class="flex h-2.5 overflow-hidden rounded-sm" role="img" :aria-label="barLabel">
      <span
        v-for="slice in props.slices"
        :key="slice.label"
        class="h-full"
        :class="TONE_FILL[slice.tone]"
        :style="{ width: `${slice.percent}%` }"
      />
    </div>

    <ul v-if="props.legend" class="flex flex-wrap gap-x-3.5 gap-y-1">
      <li
        v-for="slice in props.slices"
        :key="slice.label"
        class="text-label text-muted-foreground"
      >
        {{ sliceLabel(slice) }}
      </li>
    </ul>
  </div>
</template>
