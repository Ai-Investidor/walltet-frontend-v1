<script setup lang="ts">
import { StatusBadge } from '@components/admin/status-badge'
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
import type { CarteiraVersaoResumoDto } from '@services/types'
import { formatCompetenciaLonga } from '@utils/competencia'
import { formatDataCurta } from '@utils/format'

interface Props {
  versoes: CarteiraVersaoResumoDto[]
}

defineProps<Props>()

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'
const HEAD_CELL = 'text-eyebrow text-muted-foreground-faint h-auto px-4.5 py-2.5'
const BODY_CELL = 'px-4.5 py-3'

const COLUMNS = [
  { label: 'Competência', width: '' },
  { label: 'Status', width: 'w-[110px]' },
  { label: 'Ativos', width: 'w-[100px]' },
  { label: 'Publicada em', width: 'w-[140px]' },
]
</script>

<template>
  <!--
    A ação "Editar rascunho" saiu (sem catálogo de ativos — ver Composicao.vue) e a coluna "Ação"
    de "Ver" também: só a versão vigente tem endpoint de detalhe (GET /carteiras/:id devolve
    `versaoAtual`); não existe GET de detalhe por versaoId pra abrir uma versão antiga — ver
    docs/AUDITORIA-INTEGRACAO.md, achado 4.6. A versão vigente pode ser vista na aba Composição.
  -->
  <Card :class="CARD_SURFACE">
    <Table>
      <TableCaption class="sr-only">
        Versões da carteira por competência, com status de publicação e número de ativos.
      </TableCaption>

      <TableHeader>
        <TableRow class="hover:bg-transparent">
          <TableHead v-for="column in COLUMNS" :key="column.label" scope="col" :class="[HEAD_CELL, column.width]">
            {{ column.label }}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableEmpty v-if="versoes.length === 0" :colspan="COLUMNS.length">
          Nenhuma versão registrada ainda.
        </TableEmpty>

        <TableRow v-for="versao in versoes" :key="versao.id">
          <TableCell :class="[BODY_CELL, 'text-paragraph-strong']">
            {{ formatCompetenciaLonga(versao.mesReferencia) }}
          </TableCell>

          <TableCell :class="BODY_CELL">
            <StatusBadge :tone="versao.publicada ? 'success' : 'muted'" dot>
              {{ versao.publicada ? 'Publicada' : 'Rascunho' }}
            </StatusBadge>
          </TableCell>

          <TableCell :class="[BODY_CELL, 'text-table-value']">
            {{ versao.totalItens }} ativos
          </TableCell>

          <TableCell :class="[BODY_CELL, 'text-label text-muted-foreground tabular-nums']">
            {{ versao.publicadaEm ? formatDataCurta(versao.publicadaEm) : '—' }}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Card>
</template>
