<script setup lang="ts">
import { StatusBadge } from '@components/admin/status-badge'
import { AssetChip } from '@components/shared/asset-chip'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { ALL_CLASSES } from '@constants/asset-class'
import type { CatalogAsset } from '@data/admin'
import { PhArrowCounterClockwise, PhPencilSimple, PhProhibit } from '@phosphor-icons/vue'
import { computed } from 'vue'

interface Props {
  assets: CatalogAsset[]
  /** Classe selecionada nos filtros, ou `ALL_CLASSES` para o catálogo inteiro. */
  activeClass: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  editar: [asset: CatalogAsset]
  inativar: [asset: CatalogAsset]
  reativar: [asset: CatalogAsset]
}>()

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const HEAD_CELL = 'text-eyebrow text-muted-foreground-faint h-auto px-4.5 py-2.5'
const BODY_CELL = 'px-4.5 py-3'
const ICON_ACTION = 'size-7.5 rounded-sm border-border'

const COLUMNS = [
  { label: 'Ativo', width: '' },
  { label: 'Classe', width: 'w-[110px]' },
  { label: 'Em carteiras', width: 'w-[100px]' },
  { label: 'Status', width: 'w-[110px]' },
  { label: 'Ações', width: 'w-[110px]' },
]

const visibleAssets = computed(() =>
  props.activeClass === ALL_CLASSES
    ? props.assets
    : props.assets.filter((asset) => asset.className === props.activeClass),
)
</script>

<template>
  <Card :class="CARD_SURFACE">
    <Table class="max-sm:hidden">
      <TableCaption class="sr-only">
        Catálogo de ativos com classe, presença nas carteiras e situação do cadastro.
      </TableCaption>

      <TableHeader>
        <TableRow class="hover:bg-transparent">
          <TableHead
            v-for="column in COLUMNS"
            :key="column.label"
            scope="col"
            :class="[HEAD_CELL, column.width]"
          >
            {{ column.label }}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableEmpty v-if="!visibleAssets.length" :colspan="COLUMNS.length">
          Nenhum ativo cadastrado nesta classe.
        </TableEmpty>

        <TableRow v-for="asset in visibleAssets" :key="asset.ticker">
          <TableCell :class="BODY_CELL">
            <span class="flex items-center gap-3.5">
              <AssetChip :code="asset.code" />

              <span class="min-w-0">
                <span class="text-paragraph-strong block truncate">{{ asset.ticker }}</span>
                <span class="text-label block truncate text-muted-foreground-faint">
                  {{ asset.name }}
                </span>
              </span>
            </span>
          </TableCell>

          <TableCell :class="[BODY_CELL, 'text-label text-muted-foreground']">
            {{ asset.className }}
          </TableCell>

          <TableCell :class="[BODY_CELL, 'text-table-value tabular-nums']">
            {{ asset.walletCount }}
          </TableCell>

          <TableCell :class="BODY_CELL">
            <StatusBadge
              :tone="asset.active ? 'success' : 'muted'"
              :title="asset.active ? undefined : asset.deactivationReason"
            >
              {{ asset.active ? 'Ativo' : 'Inativo' }}
            </StatusBadge>
          </TableCell>

          <TableCell :class="BODY_CELL">
            <span class="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                :class="ICON_ACTION"
                :aria-label="`Editar ${asset.ticker}`"
                @click="emit('editar', asset)"
              >
                <PhPencilSimple class="size-3.5" aria-hidden="true" />
              </Button>

              <Button
                v-if="asset.active"
                type="button"
                variant="outline"
                size="icon-sm"
                :class="ICON_ACTION"
                :aria-label="`Inativar ${asset.ticker}`"
                @click="emit('inativar', asset)"
              >
                <PhProhibit class="size-3.5" aria-hidden="true" />
              </Button>

              <Button
                v-else
                type="button"
                variant="outline"
                size="icon-sm"
                :class="ICON_ACTION"
                :aria-label="`Reativar ${asset.ticker}`"
                @click="emit('reativar', asset)"
              >
                <PhArrowCounterClockwise class="size-3.5" aria-hidden="true" />
              </Button>
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <ul class="hidden max-sm:block" aria-label="Catálogo de ativos com classe, presença nas carteiras e situação do cadastro">
      <li v-if="!visibleAssets.length" class="text-paragraph text-muted-foreground p-4">
        Nenhum ativo cadastrado nesta classe.
      </li>

      <li
        v-for="asset in visibleAssets"
        :key="asset.ticker"
        class="border-border not-last:border-b flex flex-col gap-2.5 p-4"
      >
        <div class="flex items-start justify-between gap-2.5">
          <span class="flex min-w-0 items-center gap-3">
            <AssetChip :code="asset.code" />

            <span class="min-w-0">
              <span class="text-paragraph-strong block truncate">{{ asset.ticker }}</span>
              <span class="text-label block truncate text-muted-foreground-faint">
                {{ asset.name }}
              </span>
            </span>
          </span>

          <span class="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              :class="ICON_ACTION"
              :aria-label="`Editar ${asset.ticker}`"
              @click="emit('editar', asset)"
            >
              <PhPencilSimple class="size-3.5" aria-hidden="true" />
            </Button>

            <Button
              v-if="asset.active"
              type="button"
              variant="outline"
              size="icon-sm"
              :class="ICON_ACTION"
              :aria-label="`Inativar ${asset.ticker}`"
              @click="emit('inativar', asset)"
            >
              <PhProhibit class="size-3.5" aria-hidden="true" />
            </Button>

            <Button
              v-else
              type="button"
              variant="outline"
              size="icon-sm"
              :class="ICON_ACTION"
              :aria-label="`Reativar ${asset.ticker}`"
              @click="emit('reativar', asset)"
            >
              <PhArrowCounterClockwise class="size-3.5" aria-hidden="true" />
            </Button>
          </span>
        </div>

        <div class="border-border flex items-center justify-between gap-3 border-t pt-2.5">
          <p class="text-label text-muted-foreground">
            {{ asset.className }} · {{ asset.walletCount }}
            {{ asset.walletCount === 1 ? 'carteira' : 'carteiras' }}
          </p>

          <StatusBadge
            :tone="asset.active ? 'success' : 'muted'"
            :title="asset.active ? undefined : asset.deactivationReason"
          >
            {{ asset.active ? 'Ativo' : 'Inativo' }}
          </StatusBadge>
        </div>
      </li>
    </ul>
  </Card>
</template>
