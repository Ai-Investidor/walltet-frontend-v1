<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card'
import type { Movement } from '@data/wallet'
import { lastReport, movements } from '@data/wallet'
import {
  PhArrowDown,
  PhArrowDownRight,
  PhArrowsLeftRight,
  PhArrowUp,
  PhArrowUpRight,
  PhDownloadSimple,
  PhFileText,
} from '@phosphor-icons/vue'
import type { Component, HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const DIRECTIONS: Record<Movement['direction'], { icon: Component; tone: string }> = {
  in: { icon: PhArrowDownRight, tone: 'text-success' },
  out: { icon: PhArrowUpRight, tone: 'text-warning' },
  increase: { icon: PhArrowUp, tone: 'text-success' },
  decrease: { icon: PhArrowDown, tone: 'text-warning' },
}
</script>

<template>
  <section :class="cn('flex flex-col gap-8', props.class)">
    <Card :class="CARD_SURFACE">
      <CardHeader class="flex items-center justify-between gap-3 px-4 py-3.5">
        <h2 class="text-card-title">
          Movimentações do mês
        </h2>
        <PhArrowsLeftRight class="text-muted-foreground size-4.5" aria-hidden="true" />
      </CardHeader>

      <CardContent class="px-0">
        <ul>
          <li
            v-for="movement in movements"
            :key="movement.id"
            class="flex items-center justify-between gap-3 border-t px-4 py-3"
          >
            <span class="text-paragraph">{{ movement.name }}</span>

            <span :class="cn('text-eyebrow flex items-center gap-1.5', DIRECTIONS[movement.direction].tone)">
              <component
                :is="DIRECTIONS[movement.direction].icon"
                class="size-3.5"
                weight="bold"
                aria-hidden="true"
              />
              {{ movement.label }}
            </span>
          </li>
        </ul>
      </CardContent>

      <CardFooter class="p-0">
        <Button
          variant="ghost"
          class="text-button-sm text-success hover:text-success h-auto w-full justify-start rounded-none px-4 py-3"
        >
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>

    <Card :class="CARD_SURFACE">
      <CardContent class="flex flex-col items-start gap-4 p-4">
        <h2 class="text-eyebrow text-muted-foreground-faint">
          Último relatório
        </h2>

        <div class="flex items-start gap-3">
          <PhFileText class="size-6 shrink-0" aria-hidden="true" />

          <div class="flex flex-col gap-0.5">
            <p class="text-card-title">
              {{ lastReport.title }}
            </p>
            <p class="text-caption-sm text-muted-foreground">
              Gerado em {{ lastReport.generatedAt }} · {{ lastReport.sizeLabel }}
            </p>
          </div>
        </div>

        <Button class="text-button-sm rounded-md px-4">
          <PhDownloadSimple class="size-4" weight="bold" aria-hidden="true" />
          Baixar PDF
        </Button>
      </CardContent>
    </Card>
  </section>
</template>
