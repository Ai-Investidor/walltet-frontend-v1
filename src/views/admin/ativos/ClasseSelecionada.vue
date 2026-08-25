<script setup lang="ts">
import { assetClasses, catalogAssets } from '@data/admin'
import { formatPercent } from '@utils/format'
import { computed } from 'vue'

interface Props {
  activeClass: string
}

const props = defineProps<Props>()

const selected = computed(() => assetClasses.find((item) => item.label === props.activeClass))

const assetCount = computed(
  () => catalogAssets.filter((asset) => asset.className === props.activeClass).length,
)
</script>

<template>
  <aside
    v-if="selected"
    class="flex w-[680px] flex-col gap-2 rounded-md border border-border-strong bg-muted p-4.5"
    aria-label="Contexto da classe selecionada"
  >
    <p class="text-eyebrow text-muted-foreground-faint">
      Classe selecionada
    </p>

    <h2 class="text-topbar-title">
      {{ selected.label }}
    </h2>

    <p class="text-label text-muted-foreground">
      {{ selected.description }}
    </p>

    <ul class="flex flex-wrap gap-x-4 gap-y-1">
      <li class="text-label text-muted-foreground-faint">
        {{ assetCount }} ativos cadastrados
      </li>
      <li class="text-label text-muted-foreground-faint">
        Participação média nas carteiras: {{ formatPercent(selected.averageWeightPercent) }}
      </li>
    </ul>
  </aside>
</template>
