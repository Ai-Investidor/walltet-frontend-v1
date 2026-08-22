<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'
import type { ProfileGaugeTone, ProfileLevel } from '.'

interface Props {
  level: ProfileLevel
  tone?: ProfileGaugeTone
  label?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'neutral',
})

const TOTAL_LEVELS = 4

const TONE_FILL: Record<ProfileGaugeTone, string> = {
  neutral: 'bg-foreground',
  success: 'bg-success',
}
</script>

<template>
  <div
    role="img"
    data-slot="profile-gauge"
    :aria-label="props.label ?? `Perfil de investidor, nível ${props.level} de ${TOTAL_LEVELS}`"
    :class="cn('flex items-center gap-0.5', props.class)"
  >
    <span
      v-for="n in TOTAL_LEVELS"
      :key="n"
      class="size-2 rounded-sm border border-border-strong"
      :class="n <= props.level ? TONE_FILL[props.tone] : 'bg-transparent'"
    />
  </div>
</template>
