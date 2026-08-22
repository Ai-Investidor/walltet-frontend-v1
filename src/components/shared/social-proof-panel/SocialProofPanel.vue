<script setup lang="ts">
import { LegalNotice } from '@components/shared/legal-notice'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import type { AllocationClass, RecommendedWallet } from '@data/wallet'
import type { HTMLAttributes } from 'vue'
import { computed, useId } from 'vue'
import { cn } from '@/libs/utils'

interface Props {
  /** Carteira exibida no preview. A view resolve o slug em `@data/wallet` e repassa (R8). */
  wallet: RecommendedWallet
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const titleId = useId()

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const ALLOCATION_TONE: Record<AllocationClass['tone'], string> = {
  'data-1': 'bg-data-1',
  'data-2': 'bg-data-2',
  'data-3': 'bg-data-3',
}

/** O design mostra 3 dos 4 ativos — é um preview, não a composição completa. */
const previewAssets = computed(() => props.wallet.composicao.slice(0, 3))

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatPercent(value: number) {
  return `${percentFormatter.format(value)} %`
}
</script>

<template>
  <section
    data-slot="social-proof-panel"
    :class="
      cn(
        'border-border flex flex-col justify-center gap-5.5 border-l bg-muted px-9 py-10 max-md:border-l-0 max-md:px-6',
        props.class,
      )
    "
    :aria-labelledby="titleId"
  >
    <div class="flex flex-col gap-2">
      <p class="text-eyebrow text-muted-foreground">
        O que você recebe
      </p>

      <h2 :id="titleId" class="text-section-title">
        Uma carteira revisada e um laudo assinado, todo mês
      </h2>
    </div>

    <Card :class="CARD_SURFACE">
      <CardHeader class="flex items-center justify-between gap-3 px-4 py-3.5">
        <h3 class="text-table-value">
          {{ props.wallet.name }}
        </h3>

        <p class="text-eyebrow text-muted-foreground">
          Agosto 2026
        </p>
      </CardHeader>

      <CardContent class="border-border flex flex-col gap-2.25 border-t px-4 py-3.5">
        <h4 class="text-eyebrow text-muted-foreground">
          Alocação por classe
        </h4>

        <div class="flex h-2.5 overflow-hidden rounded-sm" aria-hidden="true">
          <span
            v-for="item in props.wallet.allocationPreview"
            :key="item.label"
            class="h-full"
            :class="ALLOCATION_TONE[item.tone]"
            :style="{ width: `${item.percent}%` }"
          />
        </div>

        <ul class="flex flex-wrap gap-3.5">
          <li
            v-for="item in props.wallet.allocationPreview"
            :key="item.label"
            class="text-label text-muted-foreground"
          >
            {{ item.label }} {{ formatPercent(item.percent) }}
          </li>
        </ul>
      </CardContent>

      <ul>
        <li
          v-for="asset in previewAssets"
          :key="asset.code"
          class="border-border flex items-center gap-2.75 border-t px-4 py-2.75"
        >
          <span
            class="text-eyebrow flex h-7.5 w-8.5 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground"
            aria-hidden="true"
          >
            {{ asset.code }}
          </span>

          <div class="min-w-0 flex-1">
            <p class="text-paragraph-strong truncate">
              {{ asset.name }}
            </p>
            <p class="text-label truncate text-muted-foreground">
              {{ asset.className }}
            </p>
          </div>

          <span class="text-topbar-meta shrink-0 tabular-nums">
            {{ formatPercent(asset.weightPercent) }}
          </span>
        </li>
      </ul>
    </Card>

    <LegalNotice />
  </section>
</template>
