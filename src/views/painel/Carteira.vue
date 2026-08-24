<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card'
import { AssetRow } from '@components/wallet/asset-row'
import type { AllocationClass, Asset } from '@data/wallet'
import { allocation, assets, painelAssetStatus } from '@data/wallet'
import { PhArrowDownRight, PhArrowRight, PhArrowUpRight, PhMinus } from '@phosphor-icons/vue'
import type { Component, HTMLAttributes } from 'vue'
import { computed } from 'vue'
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
const ASSET_STATUS: Record<
  Asset['trend'],
  { icon: Component; tone: 'text-success' | 'text-warning' | 'text-muted-foreground' }
> = {
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

// Status "deste mês" é específico do Painel — junta com `assets` sem alterar
// o dado compartilhado com /carteira.
const composicao = computed(() =>
  assets.map((asset) => {
    const status = painelAssetStatus.find((item) => item.code === asset.code)
    const trend = status?.trend ?? asset.trend
    const trendLabel = status?.trendLabel ?? asset.trendLabel
    return { ...asset, trend, trendLabel }
  }),
)
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
          Composição · {{ composicao.length }} ativos
        </h3>

        <ul>
          <AssetRow
            v-for="asset in composicao"
            :key="asset.code"
            :code="asset.code"
            :name="asset.name"
            :detail="asset.className"
            :icon="ASSET_STATUS[asset.trend].icon"
            :tone="ASSET_STATUS[asset.trend].tone"
            :label="asset.trendLabel"
            :value="formatPercent(asset.weightPercent)"
          />
        </ul>
      </CardContent>

      <CardFooter class="justify-end border-border-strong p-3.5">
        <Button variant="outline" size="lg" class="text-button-sm hover:border-border-strong h-10 gap-2.5 rounded-sm px-6">
          Ver carteira completa
          <PhArrowRight class="size-4" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  </section>
</template>
