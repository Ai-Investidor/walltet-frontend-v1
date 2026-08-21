<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card'
import type { AllocationClass, Asset } from '@data/wallet'
import { allocation, assets } from '@data/wallet'
import { PhArrowDownRight, PhArrowRight, PhArrowUpRight, PhMinus } from '@phosphor-icons/vue'
import type { Component, HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const ALLOCATION_TONE: Record<AllocationClass['tone'], string> = {
  'data-1': 'bg-data-1',
  'data-2': 'bg-data-2',
  'data-3': 'bg-data-3',
}

// Glifos de status conforme o design: entrada é seta para dentro (↘) e saída
// é seta para fora (↗) — não seguem a direção literal de alta/baixa.
const ASSET_STATUS: Record<Asset['trend'], { icon: Component; tone: string }> = {
  up: { icon: PhArrowDownRight, tone: 'text-success' },
  down: { icon: PhArrowUpRight, tone: 'text-warning' },
  flat: { icon: PhMinus, tone: 'text-muted-foreground' },
}

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatPercent(value: number) {
  return `${percentFormatter.format(value)} %`
}
</script>

<template>
  <section :class="cn(props.class)" aria-labelledby="carteira-titulo">
    <Card :class="CARD_SURFACE">
      <CardHeader class="flex items-center justify-between gap-3 p-3.5">
        <h2 id="carteira-titulo" class="text-card-title">
          Carteira Moderada Estratégica
        </h2>

        <p class="text-eyebrow flex items-center gap-1.5 text-success">
          <span class="size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
          Agosto 2026
        </p>
      </CardHeader>

      <CardContent class="flex flex-col gap-2.5 border-t border-border-strong p-3.5">
        <h3 class="text-eyebrow text-muted-foreground">
          Alocação por classe
        </h3>

        <div class="flex h-2.5 overflow-hidden rounded-sm" aria-hidden="true">
          <span
            v-for="item in allocation"
            :key="item.label"
            class="h-full"
            :class="ALLOCATION_TONE[item.tone]"
            :style="{ width: `${item.percent}%` }"
          />
        </div>

        <ul class="flex flex-wrap gap-x-4 gap-y-1">
          <li v-for="item in allocation" :key="item.label" class="text-label text-muted-foreground">
            {{ item.label }} {{ formatPercent(item.percent) }}
          </li>
        </ul>
      </CardContent>

      <CardContent class="p-0">
        <h3 class="text-eyebrow border-y border-border px-3.5 py-2.5 text-muted-foreground">
          Composição · {{ assets.length }} ativos
        </h3>

        <ul>
          <li
            v-for="asset in assets"
            :key="asset.code"
            class="grid grid-cols-[2.125rem_10.25rem_1fr_auto] items-center gap-3.5 border-border px-3.5 py-3 not-last:border-b max-lg:grid-cols-[2.125rem_1fr_auto_auto]"
          >
            <span
              class="text-eyebrow flex h-7.5 w-8.5 items-center justify-center rounded-md border border-border text-muted-foreground"
              aria-hidden="true"
            >
              {{ asset.code }}
            </span>

            <div class="min-w-0">
              <p class="text-paragraph truncate">
                {{ asset.name }}
              </p>
              <p class="text-label truncate text-muted-foreground">
                {{ asset.className }}
              </p>
            </div>

            <p class="flex items-center gap-1.5" :class="ASSET_STATUS[asset.trend].tone">
              <component :is="ASSET_STATUS[asset.trend].icon" class="size-3.5 shrink-0" aria-hidden="true" />
              <span class="text-eyebrow">{{ asset.trendLabel }}</span>
            </p>

            <span class="text-card-title text-right tabular-nums">
              {{ formatPercent(asset.weightPercent) }}
            </span>
          </li>
        </ul>
      </CardContent>

      <CardFooter class="justify-end border-border-strong p-3.5">
        <Button variant="outline" size="sm" class="gap-2 rounded-sm px-4">
          Ver carteira completa
          <PhArrowRight class="size-3.5" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  </section>
</template>
