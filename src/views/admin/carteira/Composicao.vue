<script setup lang="ts">
import { StatusBadge } from '@components/admin/status-badge'
import { AllocationBar } from '@components/shared/allocation-bar'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { AssetRow } from '@components/wallet/asset-row'
import { ASSET_MOVEMENT } from '@constants/asset-movement'
import { walletDetail } from '@data/admin'
import { PhArrowRight, PhPencilSimple, PhWarning } from '@phosphor-icons/vue'
import { formatPercent } from '@utils/format'
import { computed } from 'vue'

interface Props {
  /** Soma dos pesos do rascunho em edição, usada no alerta de pendência. */
  draftTotal: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: []
}>()

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const publishedTotal = computed(() =>
  walletDetail.publishedAssets.reduce((total, asset) => total + asset.weightPercent, 0),
)
</script>

<template>
  <section class="flex flex-col gap-5" aria-label="Composição da carteira">
    <div
      class="flex items-center justify-between gap-4 rounded-md border border-border-strong bg-muted p-4"
    >
      <p class="text-label flex items-center gap-2.5 text-muted-foreground">
        <PhWarning class="size-4 shrink-0 text-warning" aria-hidden="true" />
        A versão de {{ walletDetail.draftCompetence.toLocaleLowerCase('pt-BR') }} está em rascunho
        com {{ walletDetail.draftAssets.length }} ativos e a soma dos pesos em
        {{ formatPercent(props.draftTotal) }}.
      </p>

      <Button
        type="button"
        size="lg"
        class="text-button-sm shrink-0 gap-2.5 rounded-sm px-4"
        @click="emit('edit')"
      >
        <PhPencilSimple class="size-4" aria-hidden="true" />
        Continuar rebalanceamento
        <PhArrowRight class="size-3.5" aria-hidden="true" />
      </Button>
    </div>

    <Card :class="CARD_SURFACE">
      <div class="flex items-center justify-between gap-3 px-4.5 py-4">
        <h2 id="versao-vigente" class="text-card-title">
          Versão vigente · {{ walletDetail.currentCompetence }}
        </h2>

        <StatusBadge tone="success" dot>
          Publicada
        </StatusBadge>
      </div>

      <div class="flex flex-col gap-2.5 border-b border-border-strong px-4.5 pb-4">
        <h3 class="text-eyebrow text-muted-foreground-faint">
          Alocação por classe
        </h3>

        <AllocationBar :slices="walletDetail.allocation" legend />
      </div>

      <ul aria-labelledby="versao-vigente">
        <AssetRow
          v-for="asset in walletDetail.publishedAssets"
          :key="asset.code"
          :code="asset.code"
          :name="asset.name"
          :detail="asset.className"
          :icon="ASSET_MOVEMENT[asset.movement].icon"
          :tone="ASSET_MOVEMENT[asset.movement].tone"
          :label="ASSET_MOVEMENT[asset.movement].label"
          :value="formatPercent(asset.weightPercent)"
          class="px-4.5 py-3"
        />
      </ul>

      <div
        class="flex items-center justify-between gap-3 border-t border-border-strong bg-muted px-4.5 py-3.5"
      >
        <span class="text-tag-sm text-muted-foreground">Total</span>
        <span class="text-card-title tabular-nums">{{ formatPercent(publishedTotal) }}</span>
      </div>
    </Card>
  </section>
</template>
