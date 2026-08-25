<script setup lang="ts">
import { AssetChip } from '@components/shared/asset-chip'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { ASSET_MOVEMENT } from '@constants/asset-movement'
import type { AdminWalletAsset } from '@data/admin'
import { walletDetail } from '@data/admin'
import { PhArrowRight, PhFloppyDisk, PhPencilSimple, PhPlus, PhWarning } from '@phosphor-icons/vue'
import { formatPercent } from '@utils/format'
import AdicionarAtivo from '@views/admin/carteira/AdicionarAtivo.vue'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

const assets = defineModel<AdminWalletAsset[]>({ required: true })

const emit = defineEmits<{
  exit: []
  review: []
}>()

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const ROW = 'flex items-center gap-3.5 border-b border-border px-4.5 py-3'
const STEP_BUTTON = 'size-7 rounded-sm border-border-strong'

/** Passo do stepper em pontos percentuais. */
const STEP = 0.5

const TARGET_TOTAL = 100

const total = computed(() => assets.value.reduce((sum, asset) => sum + asset.weightPercent, 0))

const isBalanced = computed(() => Math.abs(total.value - TARGET_TOTAL) < 0.005)

const missing = computed(() => TARGET_TOTAL - total.value)

const removedLabel = computed(() =>
  new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' }).format(
    walletDetail.removedAssets,
  ),
)

const addOpen = ref(false)

function addAsset(asset: AdminWalletAsset) {
  assets.value = [...assets.value, asset]
  toast.success(`${asset.name} adicionado à versão`)
}

function changeWeight(code: string, delta: number) {
  assets.value = assets.value.map((asset) =>
    asset.code === code
      ? {
          ...asset,
          // Arredonda para 2 casas: somar 0,5 repetidamente acumula erro binário.
          weightPercent: Math.max(0, Math.round((asset.weightPercent + delta) * 100) / 100),
        }
      : asset,
  )
}
</script>

<template>
  <section class="flex flex-col gap-4.5" aria-label="Edição do rascunho">
    <div class="flex items-center justify-between gap-4">
      <p class="text-tag-sm flex items-center gap-2 text-muted-foreground-faint">
        <PhPencilSimple class="size-4 shrink-0" aria-hidden="true" />
        Modo de edição · Rascunho de {{ walletDetail.draftCompetence }} · Salvo automaticamente
      </p>

      <button type="button" class="text-button-xs text-success" @click="emit('exit')">
        Sair do modo de edição
      </button>
    </div>

    <Card :class="CARD_SURFACE">
      <div class="flex flex-col gap-2.25 px-4.5 py-4">
        <div class="flex items-end justify-between gap-3">
          <h2 class="text-eyebrow text-muted-foreground-faint">
            Soma dos pesos
          </h2>

          <p
            class="text-subtitle-strong tabular-nums"
            :class="isBalanced ? 'text-success' : 'text-warning'"
          >
            {{ formatPercent(total) }}
          </p>
        </div>

        <div class="h-2.5 overflow-hidden rounded-sm bg-muted">
          <span
            class="block h-full transition-all"
            :class="isBalanced ? 'bg-success' : 'bg-warning'"
            :style="{ width: `${Math.min(total, TARGET_TOTAL)}%` }"
          />
        </div>
      </div>

      <div class="px-4.5 pb-4">
        <p
          v-if="!isBalanced"
          class="text-label flex items-start gap-2.5 rounded-sm border border-warning bg-warning/10 px-3.75 py-3.25"
          role="status"
        >
          <PhWarning class="size-4 shrink-0 text-warning" aria-hidden="true" />
          <span>
            A soma dos pesos está em {{ formatPercent(total) }}.
            {{
              missing > 0
                ? `Faltam ${formatPercent(missing)} para fechar em ${formatPercent(TARGET_TOTAL)}.`
                : `Há ${formatPercent(-missing)} acima de ${formatPercent(TARGET_TOTAL)}.`
            }}
            Ajuste antes de salvar e revisar.
          </span>
        </p>

        <p
          v-else
          class="text-label flex items-center gap-2.5 rounded-sm border border-success bg-success/10 px-3.75 py-3.25"
          role="status"
        >
          <PhFloppyDisk class="size-4 shrink-0 text-success" aria-hidden="true" />
          Os pesos fecham em {{ formatPercent(TARGET_TOTAL) }}. O rascunho pode ser revisado.
        </p>
      </div>

      <div class="flex items-center gap-3.5 border-b border-border px-4.5 py-2.5">
        <span class="text-eyebrow flex-1 text-muted-foreground-faint">Ativo</span>
        <span class="text-eyebrow w-37.5 text-muted-foreground-faint">Movimentação</span>
        <span class="text-eyebrow w-34 text-right text-muted-foreground-faint">Peso</span>
      </div>

      <ul>
        <li v-for="asset in assets" :key="asset.code" :class="ROW">
          <AssetChip :code="asset.code" />

          <div class="min-w-0 flex-1">
            <p class="text-paragraph-strong truncate">
              {{ asset.name }}
            </p>
            <p class="text-label truncate text-muted-foreground-faint">
              {{ asset.className }}
            </p>
          </div>

          <p class="flex w-37.5 shrink-0 items-center gap-1.5" :class="ASSET_MOVEMENT[asset.movement].tone">
            <component
              :is="ASSET_MOVEMENT[asset.movement].icon"
              class="size-3.5 shrink-0"
              aria-hidden="true"
            />
            <span class="text-tag-sm">{{ ASSET_MOVEMENT[asset.movement].label }}</span>
          </p>

          <div class="flex w-34 shrink-0 items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              :class="STEP_BUTTON"
              :aria-label="`Reduzir o peso de ${asset.name}`"
              @click="changeWeight(asset.code, -STEP)"
            >
              <span class="text-card-title" aria-hidden="true">−</span>
            </Button>

            <span class="text-card-title w-16 text-center tabular-nums">
              {{ formatPercent(asset.weightPercent) }}
            </span>

            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              :class="STEP_BUTTON"
              :aria-label="`Aumentar o peso de ${asset.name}`"
              @click="changeWeight(asset.code, STEP)"
            >
              <span class="text-card-title" aria-hidden="true">+</span>
            </Button>
          </div>
        </li>
      </ul>

      <div class="flex items-center gap-3.5 border-b border-border px-4.5 py-3.5">
        <Button
          type="button"
          variant="outline"
          size="lg"
          class="text-button-xs gap-2 rounded-sm border-border-strong px-3.5 text-muted-foreground"
          @click="addOpen = true"
        >
          <PhPlus class="size-3.5" aria-hidden="true" />
          Adicionar ativo
        </Button>

        <p class="text-label text-muted-foreground-faint">
          {{ removedLabel }} saem nesta versão.
        </p>
      </div>

      <div class="flex items-center gap-3.5 border-t border-border-strong px-4.5 py-3.5">
        <Button
          type="button"
          variant="outline"
          size="lg"
          class="text-button-sm rounded-sm border-foreground px-4"
          @click="toast.success('Rascunho salvo')"
        >
          Salvar rascunho
        </Button>

        <Button
          type="button"
          size="lg"
          class="text-button-sm gap-2.5 rounded-sm px-4"
          :disabled="!isBalanced"
          @click="emit('review')"
        >
          Salvar e revisar
          <PhArrowRight class="size-3.5" aria-hidden="true" />
        </Button>

        <p class="text-label text-muted-foreground-faint">
          Justificativa por ativo é obrigatória antes de publicar.
        </p>
      </div>
    </Card>

    <AdicionarAtivo v-model:open="addOpen" :draft="assets" @adicionar="addAsset" />
  </section>
</template>
