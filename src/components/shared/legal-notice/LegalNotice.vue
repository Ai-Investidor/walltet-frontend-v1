<script setup lang="ts">
import { PhShieldCheck } from '@phosphor-icons/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <aside
    data-slot="legal-notice"
    :class="cn('flex flex-col gap-2 rounded-lg border bg-white p-3.5', props.class)"
  >
    <h2 class="text-eyebrow flex items-center gap-2 text-muted-foreground">
      <PhShieldCheck class="size-4 shrink-0" aria-hidden="true" />
      Aviso legal
    </h2>

    <p class="text-caption-sm text-muted-foreground">
      Carteira recomendada com base no seu perfil declarado. Não constitui oferta ou garantia
      de rentabilidade. Rentabilidade passada não garante resultados futuros.
    </p>
  </aside>
</template>
