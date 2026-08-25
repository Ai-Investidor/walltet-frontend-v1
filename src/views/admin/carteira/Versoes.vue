<script setup lang="ts">
import { StatusBadge } from '@components/admin/status-badge'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { walletVersions } from '@data/admin'
import { PhArrowRight, PhEye, PhPencilSimple } from '@phosphor-icons/vue'

const emit = defineEmits<{
  edit: []
}>()

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const HEAD_CELL = 'text-eyebrow text-muted-foreground-faint h-auto px-4.5 py-2.5'
const BODY_CELL = 'px-4.5 py-3'
const ROW_ACTION = 'text-button-xs gap-2 rounded-sm border-foreground px-3.5'

const COLUMNS = [
  { label: 'Competência', width: '' },
  { label: 'Status', width: 'w-[110px]' },
  { label: 'Ativos', width: 'w-[100px]' },
  { label: 'Publicada em', width: 'w-[110px]' },
  { label: 'Ação', width: 'w-[110px]' },
]
</script>

<template>
  <Card :class="CARD_SURFACE">
    <Table>
      <TableCaption class="sr-only">
        Versões da carteira por competência, com status de publicação e número de ativos.
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
        <TableRow v-for="version in walletVersions" :key="version.competence">
          <TableCell :class="[BODY_CELL, 'text-paragraph-strong']">
            {{ version.competence }}
          </TableCell>

          <TableCell :class="BODY_CELL">
            <StatusBadge :tone="version.status === 'published' ? 'success' : 'muted'" dot>
              {{ version.status === 'published' ? 'Publicada' : 'Rascunho' }}
            </StatusBadge>
          </TableCell>

          <TableCell :class="[BODY_CELL, 'text-table-value']">
            {{ version.assetCount }} ativos
          </TableCell>

          <TableCell :class="[BODY_CELL, 'text-label text-muted-foreground tabular-nums']">
            {{ version.publishedAt || '—' }}
          </TableCell>

          <TableCell :class="BODY_CELL">
            <span class="flex justify-end">
              <Button
                v-if="version.status === 'draft'"
                type="button"
                variant="outline"
                size="sm"
                :class="ROW_ACTION"
                @click="emit('edit')"
              >
                <PhPencilSimple aria-hidden="true" />
                Editar
                <PhArrowRight aria-hidden="true" />
              </Button>

              <Button
                v-else
                type="button"
                variant="outline"
                size="sm"
                :class="ROW_ACTION"
                :aria-label="`Ver a versão de ${version.competence}`"
              >
                <PhEye aria-hidden="true" />
                Ver
              </Button>
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Card>
</template>
