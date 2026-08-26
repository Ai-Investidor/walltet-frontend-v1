<script setup lang="ts">
import { AssetChip } from '@components/shared/asset-chip'
import type { Component, HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

interface Props {
  /** Iniciais exibidas no chip decorativo à esquerda (ex.: "MX"). */
  code: string
  name: string
  /** Classe do ativo ou faixa de transição de peso (ex.: "FII · Papel"). */
  detail: string
  /** Ícone Phosphor já resolvido pelo caller (ex.: `PhArrowDownRight`). */
  icon: Component
  /** Classe utilitária de cor aplicada ao ícone e ao rótulo. */
  tone:
    | 'text-success'
    | 'text-warning'
    | 'text-foreground'
    | 'text-muted-foreground'
    | 'text-muted-foreground-faint'
  /** Rótulo de status em caixa alta (ex.: "ENTROU"). */
  label: string
  /** Valor já formatado, alinhado à direita (ex.: "20,00 %"). */
  value: string
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <li
    data-slot="asset-row"
    :class="cn('border-border flex items-center gap-3.5 px-3.5 py-2.5 not-first:border-t', props.class)"
  >
    <AssetChip :code="props.code" />

    <div class="min-w-0 flex-1">
      <p class="text-paragraph-strong truncate">
        {{ props.name }}
      </p>
      <p class="text-label truncate text-muted-foreground">
        {{ props.detail }}
      </p>
    </div>

    <div class="flex shrink-0 items-center gap-1.5 max-sm:flex-col-reverse max-sm:items-end max-sm:gap-0.5">
      <p class="flex w-37.5 shrink-0 items-center gap-1.5 max-sm:w-auto" :class="props.tone">
        <component :is="props.icon" class="size-3.5 shrink-0" aria-hidden="true" />
        <span class="text-eyebrow truncate">{{ props.label }}</span>
      </p>

      <span class="text-card-title w-19 shrink-0 text-right tabular-nums max-sm:w-auto">
        {{ props.value }}
      </span>
    </div>
  </li>
</template>
