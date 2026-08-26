<!--
  Órfão desde a integração com o backend real — mesmo motivo de Edicao.vue (ver comentário lá):
  `catalogAssets` é mock; não há GET de catálogo de ativos no backend. Implementação intacta, só
  desconectada de admin/carteira/Composicao.vue.
-->
<script setup lang="ts">
import { AssetChip } from '@components/shared/asset-chip'
import { Button } from '@components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import { Input } from '@components/ui/input'
import type { AdminWalletAsset, CatalogAsset } from '@data/admin'
import { catalogAssets } from '@data/admin'
import { formatPercent } from '@utils/format'
import { computed, ref, watch } from 'vue'

interface Props {
  /** Ativos já presentes no rascunho — ficam fora da lista de escolha. */
  draft: AdminWalletAsset[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  adicionar: [asset: AdminWalletAsset]
}>()

const open = defineModel<boolean>('open', { required: true })

const selected = ref<CatalogAsset | null>(null)
const weight = ref(0)

watch(open, (isOpen) => {
  if (isOpen) {
    selected.value = null
    weight.value = 0
  }
})

// Só ativo do catálogo e que ainda não esteja no rascunho. O `name` do ativo da
// carteira corresponde ao `ticker` do catálogo.
const available = computed(() => {
  const used = new Set(props.draft.map((asset) => asset.name))

  return catalogAssets.filter((asset) => asset.active && !used.has(asset.ticker))
})

const isValid = computed(() => selected.value !== null && weight.value > 0)

function confirm() {
  if (!selected.value || !isValid.value) {
    return
  }

  emit('adicionar', {
    code: selected.value.code,
    name: selected.value.ticker,
    className: selected.value.className,
    movement: 'in',
    weightPercent: weight.value,
  })

  open.value = false
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="gap-0 rounded-lg p-0 sm:max-w-125" :show-close-button="false">
      <DialogHeader class="gap-1.5 border-b border-border p-5">
        <DialogTitle class="text-subtitle">
          Adicionar ativo à versão
        </DialogTitle>

        <DialogDescription class="text-label text-muted-foreground-faint">
          O ativo entra no rascunho com a movimentação “entrou”. O peso pode ser ajustado depois
          pelo stepper.
        </DialogDescription>
      </DialogHeader>

      <div class="flex flex-col gap-4 p-5">
        <div class="flex flex-col gap-1.75">
          <p id="escolha-ativo" class="text-eyebrow text-muted-foreground-faint">
            Ativo do catálogo
          </p>

          <ul
            v-if="available.length"
            class="flex max-h-56 flex-col overflow-y-auto rounded-md border border-border"
            aria-labelledby="escolha-ativo"
          >
            <li v-for="asset in available" :key="asset.ticker" class="border-border not-last:border-b">
              <button
                type="button"
                class="flex w-full items-center gap-3.5 px-3.5 py-2.5 text-left transition-colors hover:bg-muted/50"
                :aria-pressed="selected?.ticker === asset.ticker"
                :class="selected?.ticker === asset.ticker ? 'bg-muted' : ''"
                @click="selected = asset"
              >
                <AssetChip :code="asset.code" />

                <span class="min-w-0 flex-1">
                  <span class="text-paragraph-strong block truncate">{{ asset.ticker }}</span>
                  <span class="text-label block truncate text-muted-foreground-faint">
                    {{ asset.name }}
                  </span>
                </span>

                <span class="text-label shrink-0 text-muted-foreground">{{ asset.className }}</span>
              </button>
            </li>
          </ul>

          <p v-else class="text-label rounded-md border border-border bg-muted px-3.5 py-3 text-muted-foreground">
            Todos os ativos ativos do catálogo já estão nesta versão.
          </p>
        </div>

        <div class="flex flex-col gap-1.75">
          <label for="peso-novo-ativo" class="text-eyebrow text-muted-foreground-faint">
            Peso inicial (%)
          </label>

          <Input
            id="peso-novo-ativo"
            v-model.number="weight"
            type="number"
            min="0"
            max="100"
            step="0.5"
            inputmode="decimal"
            class="text-paragraph h-10.5 w-full rounded-sm px-3"
          />

          <p class="text-label text-muted-foreground-faint">
            A soma dos pesos passa a ser
            {{ formatPercent(props.draft.reduce((sum, a) => sum + a.weightPercent, 0) + (weight || 0)) }}.
          </p>
        </div>
      </div>

      <DialogFooter class="flex-row gap-3 border-t border-border px-5 py-4">
        <Button
          type="button"
          size="lg"
          class="text-button-sm rounded-sm px-4"
          :disabled="!isValid"
          @click="confirm"
        >
          Adicionar ativo
        </Button>

        <DialogClose as-child>
          <Button
            type="button"
            variant="outline"
            size="lg"
            class="text-button-sm rounded-sm border-foreground px-4"
          >
            Cancelar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
