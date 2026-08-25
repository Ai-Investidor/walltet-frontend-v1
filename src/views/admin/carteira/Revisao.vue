<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { AssetRow } from '@components/wallet/asset-row'
import { ASSET_MOVEMENT } from '@constants/asset-movement'
import type { AdminWalletAsset } from '@data/admin'
import { walletDetail } from '@data/admin'
import { PhClipboardText, PhPaperPlaneTilt, PhWarning } from '@phosphor-icons/vue'
import { formatPercent } from '@utils/format'
import { computed, ref } from 'vue'

interface Props {
  assets: AdminWalletAsset[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  back: []
  publish: []
}>()

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const TARGET_TOTAL = 100

const confirmOpen = ref(false)

const total = computed(() => props.assets.reduce((sum, asset) => sum + asset.weightPercent, 0))

const isBalanced = computed(() => Math.abs(total.value - TARGET_TOTAL) < 0.005)

function confirmPublish() {
  confirmOpen.value = false
  emit('publish')
}
</script>

<template>
  <section class="flex flex-col gap-4.5" aria-label="Revisão do rascunho">
    <p class="text-tag-sm flex items-center gap-2 text-muted-foreground-faint">
      <PhClipboardText class="size-4 shrink-0" aria-hidden="true" />
      Revisão da versão de {{ walletDetail.draftCompetence }} · Prévia exata do que o investidor verá
    </p>

    <Card :class="CARD_SURFACE">
      <div class="flex items-center justify-between gap-3 px-4.5 py-4">
        <h2 id="previa-versao" class="text-card-title">
          {{ walletDetail.name }}
        </h2>

        <p class="text-tag-sm text-muted-foreground-faint">
          {{ walletDetail.draftCompetence }} · Rascunho
        </p>
      </div>

      <span class="h-px bg-border-strong" aria-hidden="true" />

      <ul aria-labelledby="previa-versao">
        <AssetRow
          v-for="asset in props.assets"
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

      <div class="flex items-center justify-between gap-3 bg-muted px-4.5 py-3.5">
        <span class="text-tag-sm text-muted-foreground">Total</span>
        <span
          class="text-card-title tabular-nums"
          :class="isBalanced ? 'text-foreground' : 'text-warning'"
        >
          {{ formatPercent(total) }}
        </span>
      </div>
    </Card>

    <div
      class="flex items-center gap-3.5 rounded-md border border-border-strong bg-card px-4 py-3.5"
    >
      <Button
        type="button"
        variant="outline"
        size="lg"
        class="text-button-sm rounded-sm border-foreground px-4"
        @click="emit('back')"
      >
        Voltar e editar
      </Button>

      <Button
        type="button"
        size="lg"
        class="text-button-sm gap-2.5 rounded-sm px-4"
        :disabled="!isBalanced"
        @click="confirmOpen = true"
      >
        <PhPaperPlaneTilt class="size-4" aria-hidden="true" />
        Publicar versão
      </Button>

      <p class="text-label text-muted-foreground-faint">
        Publicar torna a versão imutável e visível para {{ walletDetail.investors }} investidores.
      </p>
    </div>

    <AlertDialog v-model:open="confirmOpen">
      <AlertDialogContent class="gap-0 rounded-lg p-0 sm:max-w-115">
        <AlertDialogHeader class="gap-3 p-5">
          <AlertDialogTitle class="text-subtitle">
            Publicar a versão de
            {{ walletDetail.draftCompetence.toLocaleLowerCase('pt-BR') }}?
          </AlertDialogTitle>

          <AlertDialogDescription class="text-paragraph-strong font-normal text-muted-foreground">
            A versão passa a ser visível para {{ walletDetail.investors }} investidores vinculados a
            esta carteira e não pode mais ser editada. A versão de
            {{ walletDetail.currentCompetence.toLocaleLowerCase('pt-BR') }} vira histórico.
          </AlertDialogDescription>

          <p
            class="text-label flex items-start gap-2.5 rounded-sm border border-border-strong bg-muted px-3.5 py-3 text-muted-foreground"
          >
            <PhWarning class="size-4 shrink-0 text-warning" aria-hidden="true" />
            Só existe uma versão publicada por competência. Esta ação é irreversível.
          </p>
        </AlertDialogHeader>

        <AlertDialogFooter class="flex-row gap-3 border-t border-border px-5 py-4">
          <AlertDialogAction
            class="text-button-sm h-9 gap-2.5 rounded-sm px-4"
            @click="confirmPublish"
          >
            <PhPaperPlaneTilt class="size-4" aria-hidden="true" />
            Publicar versão
          </AlertDialogAction>

          <AlertDialogCancel class="text-button-sm h-9 rounded-sm border-foreground px-4">
            Cancelar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </section>
</template>
