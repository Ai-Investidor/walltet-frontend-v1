<script setup lang="ts">
import { AssetChip } from '@components/shared/asset-chip'
import { LegalNotice } from '@components/shared/legal-notice'
import { Button } from '@components/ui/button'
import { AssetRow } from '@components/wallet/asset-row'
import {
  PhArrowDown,
  PhArrowDownRight,
  PhArrowsLeftRight,
  PhArrowUp,
  PhArrowUpRight,
  PhMinus,
} from '@phosphor-icons/vue'
import type { MovimentacoesResponseDto } from '@services/types'
import { formatPercent } from '@utils/format'
import type { Component } from 'vue'
import { computed } from 'vue'

interface Props {
  movimentacoes: MovimentacoesResponseDto | null
}

const props = defineProps<Props>()

interface Marker {
  icon: Component
  tone: 'text-success' | 'text-warning' | 'text-foreground' | 'text-muted-foreground-faint'
}

const GROUP_HEADER: Record<'in' | 'out' | 'reweight' | 'hold', Marker> = {
  in: { icon: PhArrowDownRight, tone: 'text-success' },
  out: { icon: PhArrowUpRight, tone: 'text-warning' },
  reweight: { icon: PhArrowsLeftRight, tone: 'text-foreground' },
  hold: { icon: PhMinus, tone: 'text-muted-foreground-faint' },
}

function assetCountLabel(total: number) {
  return `${total} ${total === 1 ? 'ativo' : 'ativos'}`
}

// Espelha as 4 listas de `MovimentacoesResponseDto.movimentacoes` — a melhor correspondência
// de todo o antigo src/data/wallet.ts (docs/AUDITORIA-INTEGRACAO.md).
const grupos = computed(() => {
  const mov = props.movimentacoes?.movimentacoes

  if (!mov) {
    return []
  }

  return [
    {
      kind: 'in' as const,
      title: 'Entradas',
      items: mov.entradas.map((item) => ({
        code: item.ticker.slice(0, 2).toUpperCase(),
        name: item.ticker,
        detail: item.nome,
        icon: PhArrowDownRight,
        tone: 'text-success' as const,
        label: 'ENTROU',
        value: formatPercent(item.pesoAtual),
      })),
    },
    {
      kind: 'out' as const,
      title: 'Saídas',
      items: mov.saidas.map((item) => ({
        code: item.ticker.slice(0, 2).toUpperCase(),
        name: item.ticker,
        detail: item.nome,
        icon: PhArrowUpRight,
        tone: 'text-warning' as const,
        label: 'SAIU',
        value: `−${formatPercent(item.pesoAnterior)}`,
      })),
    },
    {
      kind: 'reweight' as const,
      title: 'Alterações de peso',
      items: mov.alteracoes.map((item) => ({
        code: item.ticker.slice(0, 2).toUpperCase(),
        name: item.ticker,
        detail: `${formatPercent(item.pesoAnterior)} → ${formatPercent(item.pesoAtual)}`,
        icon: item.tipo === 'AUMENTOU' ? PhArrowUp : PhArrowDown,
        tone: item.tipo === 'AUMENTOU' ? ('text-success' as const) : ('text-warning' as const),
        label: item.tipo,
        value: `${item.pesoAtual >= item.pesoAnterior ? '+' : '−'}${formatPercent(Math.abs(item.pesoAtual - item.pesoAnterior))}`,
      })),
    },
    {
      kind: 'hold' as const,
      title: 'Mantidos',
      items: mov.mantidos.map((item) => ({
        code: item.ticker.slice(0, 2).toUpperCase(),
        name: item.ticker,
        detail: item.nome,
        icon: PhMinus,
        tone: 'text-muted-foreground-faint' as const,
        label: 'MANTER',
        value: formatPercent(item.peso),
      })),
    },
  ].filter((group) => group.items.length > 0)
})
</script>

<template>
  <section class="flex flex-col gap-7 max-sm:gap-4">
    <p v-if="!movimentacoes" class="text-paragraph text-muted-foreground">
      Carregando movimentações…
    </p>

    <p v-else-if="grupos.length === 0" class="text-paragraph text-muted-foreground">
      Nenhuma movimentação registrada nesta competência.
    </p>

    <div
      v-for="group in grupos"
      :key="group.kind"
      class="overflow-hidden rounded-lg border border-border bg-card"
    >
      <h2 class="flex items-center gap-3.5 border-b border-border px-3.5 py-2.5 max-sm:gap-2">
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

      <ul class="max-sm:hidden">
        <AssetRow
          v-for="item in group.items"
          :key="item.name"
          :code="item.code"
          :name="item.name"
          :detail="item.detail"
          :icon="item.icon"
          :tone="item.tone"
          :label="item.label"
          :value="item.value"
        />
      </ul>

      <ul class="hidden max-sm:block">
        <li
          v-for="item in group.items"
          :key="item.name"
          class="border-border flex flex-col gap-2 px-3.5 py-3 not-first:border-t"
        >
          <div class="flex items-center gap-2.5">
            <AssetChip :code="item.code" />

            <div class="min-w-0 flex-1">
              <p class="text-paragraph-strong truncate">
                {{ item.name }}
              </p>
              <p class="text-label truncate text-muted-foreground">
                {{ item.detail }}
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <p class="flex items-center gap-1.5" :class="item.tone">
              <component :is="item.icon" class="size-3.5 shrink-0" aria-hidden="true" />
              <span class="text-eyebrow">{{ item.label }}</span>
            </p>

            <span class="text-card-title tabular-nums">
              {{ item.value }}
            </span>
          </div>
        </li>
      </ul>
    </div>

    <LegalNotice class="hidden max-sm:flex" />

    <div class="hidden flex-col gap-2.5 max-sm:flex">
      <Button type="button" size="lg" class="text-button-sm h-10 w-full justify-center gap-2.5 rounded-sm px-6">
        Continuar
      </Button>

      <Button
        type="button"
        variant="outline"
        size="lg"
        class="text-button-sm hover:border-border-strong h-10 w-full justify-center gap-2.5 rounded-sm px-6"
      >
        Voltar
      </Button>
    </div>
  </section>
</template>
