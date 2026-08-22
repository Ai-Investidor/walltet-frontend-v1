<script setup lang="ts">
import { AssetRow } from '@components/wallet/asset-row'
import type { MovementDetail, MovementGroup } from '@data/wallet'
import { movementGroups } from '@data/wallet'
import {
  PhArrowDown,
  PhArrowDownRight,
  PhArrowsLeftRight,
  PhArrowUp,
  PhArrowUpRight,
  PhMinus,
} from '@phosphor-icons/vue'
import type { Component } from 'vue'

interface Marker {
  icon: Component
  tone: 'text-success' | 'text-warning' | 'text-foreground' | 'text-muted-foreground-faint'
}

const ITEM_DIRECTION: Record<MovementDetail['direction'], Marker> = {
  in: { icon: PhArrowDownRight, tone: 'text-success' },
  out: { icon: PhArrowUpRight, tone: 'text-warning' },
  increase: { icon: PhArrowUp, tone: 'text-success' },
  decrease: { icon: PhArrowDown, tone: 'text-warning' },
  hold: { icon: PhMinus, tone: 'text-muted-foreground-faint' },
}

const GROUP_HEADER: Record<MovementGroup['kind'], Marker> = {
  in: { icon: PhArrowDownRight, tone: 'text-success' },
  out: { icon: PhArrowUpRight, tone: 'text-warning' },
  reweight: { icon: PhArrowsLeftRight, tone: 'text-foreground' },
  hold: { icon: PhMinus, tone: 'text-muted-foreground-faint' },
}

function assetCountLabel(total: number) {
  return `${total} ${total === 1 ? 'ativo' : 'ativos'}`
}
</script>

<template>
  <section class="flex flex-col gap-7">
    <div
      v-for="group in movementGroups"
      :key="group.kind"
      class="overflow-hidden rounded-lg border border-border bg-card"
    >
      <h2 class="flex items-center gap-3.5 border-b border-border px-3.5 py-2.5">
        <component
          :is="GROUP_HEADER[group.kind].icon"
          class="size-4 shrink-0"
          :class="GROUP_HEADER[group.kind].tone"
          aria-hidden="true"
        />

        <span class="flex items-baseline gap-2.5">
          <span class="text-card-title">{{ group.title }}</span>
          <span class="text-label text-muted-foreground-faint">
            {{ assetCountLabel(group.items.length) }}
          </span>
        </span>
      </h2>

      <ul>
        <AssetRow
          v-for="item in group.items"
          :key="item.name"
          :code="item.code"
          :name="item.name"
          :detail="item.detail"
          :icon="ITEM_DIRECTION[item.direction].icon"
          :tone="ITEM_DIRECTION[item.direction].tone"
          :label="item.label"
          :value="item.value"
        />
      </ul>
    </div>
  </section>
</template>
