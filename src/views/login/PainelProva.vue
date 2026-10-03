<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <aside :class="cn('flex w-2/5 max-w-180 flex-col justify-between border-l border-border bg-sidebar p-12 max-md:w-full max-md:max-w-none', props.class)">
    <p class="text-label-strong text-muted-foreground">Match Wallet · AI Invest</p>
    <div class="flex flex-col gap-6 py-12">
      <span class="h-1 w-12 rounded-full bg-primary" aria-hidden="true" />
      <h2 class="text-metric leading-tight">Sua carteira,
        <br />com direção.</h2>
      <p class="text-paragraph max-w-80 text-muted-foreground">Um lugar para conhecer seu perfil, acompanhar as carteiras recomendadas e consultar seus relatórios.</p>
      <ol class="mt-4 flex flex-col divide-y divide-border">
        <li class="flex gap-5 py-4"><span class="text-label text-muted-foreground-faint">01</span><span class="text-label-strong">Conheça seu perfil de investidor</span></li>
        <li class="flex gap-5 py-4"><span class="text-label text-muted-foreground-faint">02</span><span class="text-label-strong">Explore as carteiras recomendadas</span></li>
        <li class="flex gap-5 py-4"><span class="text-label text-muted-foreground-faint">03</span><span class="text-label-strong">Acompanhe cada atualização</span></li>
      </ol>
    </div>
    <p class="text-label text-muted-foreground-faint">Investir envolve riscos. Considere seus objetivos antes de decidir.</p>
  </aside>
</template>
