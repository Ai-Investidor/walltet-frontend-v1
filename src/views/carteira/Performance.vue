<script setup lang="ts">
import { Card, CardContent } from '@components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@components/ui/pagination'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { KpiCard } from '@components/wallet/kpi-card'
import { performanceHistory, performanceIndicators } from '@data/wallet'
import { PhCaretLeft, PhCaretRight, PhDotsThree } from '@phosphor-icons/vue'
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

/** Colunas de valor da tabela compartilham tipografia, alinhamento e padding. */
const VALUE_CELL = 'text-table-value px-3.5 py-3 text-right tabular-nums'

// --- Gráfico "Evolução acumulada" -------------------------------------------

const CHART_PERIODS = ['3M', '6M', '12M', 'Máx'] as const

type ChartPeriod = (typeof CHART_PERIODS)[number]

// O design desenha apenas a série de 12 meses: o seletor troca só o botão ativo,
// sem dataset alternativo para os demais períodos.
const activePeriod = ref<ChartPeriod>('12M')

/** Marcações do eixo X — subconjunto fixo do design, não deriva de `performanceHistory`. */
const CHART_X_LABELS = ['Set/25', 'Jan/26', 'Mai/26', 'Ago/26']

const CHART_LEGEND = [
  { label: 'Carteira', mark: 'h-0.5 w-5 rounded-full bg-success' },
  { label: 'CDI', mark: 'w-5 border-t-2 border-dashed border-muted-foreground-faint' },
  { label: 'Ibovespa', mark: 'w-5 border-t-2 border-dotted border-muted-foreground-faint' },
]

// Geometria vetorial extraída dos 4 `path` do node `ylhUV` (viewBox 0 0 720 240).
// Valores exatos do design — não aproximar nem regenerar.
// CDI e Ibovespa já vêm em micro-segmentos (o tracejado/pontilhado é da própria
// geometria), por isso nenhum dos dois usa `stroke-dasharray`.

const CHART_GRID_PATH = 'M0 8l720 0m-720 58l720 0m-720 58l720 0m-720 58l720 0m-720 50l720 0'

const CHART_IBOVESPA_PATH =
  'M2 232l1.8-0.9m2.7-1.4l1.7-0.9m2.7-1.3l1.8-0.9m2.7-1.4l1.8-0.9m2.6-1.3l1.8-0.9m2.7-1.4l1.8-0.9m2.7-1.4l1.7-0.9m2.7-1.3l1.8-0.9m2.7-1.4l1.8-0.9m2.6-1.3l1.8-0.9m2.7-1.4l1.8-0.9m2.7-1.4l1.7-0.9m2.7-1.3l1.8-0.9m2.7-1.4l1.7-0.8m0 0l0.1 0m2.8 0.9l1.9 0.7m2.9 0.9l1.9 0.6m2.8 0.9l1.9 0.7m2.9 0.9l1.9 0.6m2.8 0.9l1.9 0.7m2.9 0.9l1.9 0.6m2.8 0.9l1.9 0.7m2.9 0.9l1.9 0.6m2.9 0.9l1.9 0.7m2.8 0.9l1.9 0.6m2.9 0.9l1.9 0.7m2.8 0.9l1.9 0.6m2.9 0.8l2-0.2m3-0.3l1.9-0.3m3-0.3l2-0.2m3-0.3l2-0.2m3-0.3l2-0.3m2.9-0.3l2-0.2m3-0.3l2-0.2m3-0.4l2-0.2m3-0.3l1.9-0.2m3-0.3l2-0.2m3-0.4l2-0.2m3-0.3l2-0.2m2.9-0.5l1.5-1.3m2.3-1.9l1.5-1.3m2.3-1.9l1.6-1.3m2.3-1.9l1.5-1.3m2.3-1.9l1.5-1.3m2.3-1.9l1.6-1.3m2.3-1.9l1.5-1.3m2.3-1.9l1.6-1.3m2.3-2l1.5-1.2m2.3-2l1.5-1.2m2.3-2l1.6-1.2m2.3-2l1.5-1.3m2.3-1.9l1.5-1.3m2.3-1.9l1.6-1.3m2.3-1.9l1.5-1.3m2.3-1.9l1.5-1.3m2.7-1.3l1.9-0.8m2.7-1.2l1.8-0.8m2.8-1.3l1.8-0.8m2.7-1.2l1.9-0.8m2.7-1.2l1.8-0.8m2.8-1.3l1.8-0.8m2.7-1.2l1.9-0.8m2.7-1.2l1.8-0.8m2.8-1.2l1.8-0.9m2.7-1.2l1.9-0.8m2.7-1.2l1.8-0.8m2.8-1.2l1.8-0.9m2.8-1.2l1.8-0.8m2.5 1l1.7 1.1m2.5 1.7l1.6 1.1m2.5 1.7l1.7 1.1m2.4 1.7l1.7 1.1m2.5 1.7l1.6 1.1m2.5 1.7l1.7 1.1m2.5 1.7l1.6 1.2m2.5 1.6l1.7 1.2m2.4 1.6l1.7 1.2m2.5 1.6l1.6 1.2m2.5 1.7l1.7 1.1m2.5 1.7l1.6 1.1m2.5 1.7l1.6 1.1m2.5 1.7l1.7 1.1m2.5 1.4l1.5-1.2m2.4-1.8l1.6-1.2m2.4-1.9l1.6-1.2m2.3-1.8l1.6-1.3m2.4-1.8l1.6-1.2m2.4-1.8l1.5-1.3m2.4-1.8l1.6-1.2m2.4-1.9l1.6-1.2m2.3-1.8l1.6-1.2m2.4-1.9l1.6-1.2m2.3-1.8l1.6-1.2m2.4-1.9l1.6-1.2m2.4-1.8l1.5-1.2m2.4-1.9l1.6-1.2m2.4-1.8l1.6-1.3m2.3-1.8l0.2-0.1m0 0l1.7-0.4m3-0.8l1.9-0.5m2.9-0.7l1.9-0.5m2.9-0.8l2-0.4m2.9-0.8l1.9-0.5m2.9-0.7l2-0.5m2.9-0.8l1.9-0.5m2.9-0.7l2-0.5m2.9-0.7l1.9-0.5m2.9-0.8l2-0.5m2.9-0.7l1.9-0.5m2.9-0.7l1.9-0.5m3-0.8l1.6-0.4m0 0l0.3-0.1m2.8-1.1l1.8-0.8m2.8-1.1l1.9-0.7m2.7-1.1l1.9-0.8m2.8-1.1l1.8-0.7m2.8-1.1l1.9-0.8m2.8-1.1l1.8-0.7m2.8-1.2l1.9-0.7m2.8-1.1l1.8-0.8m2.8-1.1l1.9-0.7m2.7-1.1l1.9-0.8m2.8-1.1l1.8-0.7m2.8-1.1l1.9-0.8m2.8-1.1l0.9-0.4m0 0l0.9 0.5m2.6 1.4l1.8 0.9m2.7 1.4l1.7 0.9m2.7 1.4l1.8 0.9m2.6 1.4l1.8 0.9m2.7 1.4l1.7 0.9m2.7 1.4l1.8 1m2.6 1.3l1.8 1m2.7 1.4l1.7 0.9m2.7 1.4l1.8 0.9m2.6 1.4l1.8 0.9m2.7 1.4l1.7 0.9m2.7 1.4l1.8 0.9m2.6 1.4l1.8 0.9m2.6-0.2l1.7-1.1m2.5-1.6l1.7-1.1m2.6-1.6l1.7-1m2.5-1.6l1.7-1.1m2.6-1.6l1.6-1m2.6-1.6l1.7-1.1m2.5-1.6l1.7-1m2.6-1.6l1.7-1.1m2.5-1.6l1.7-1m2.5-1.6l1.7-1.1m2.6-1.6l1.7-1m2.5-1.6l1.7-1.1m2.6-1.6l1.7-1.1m2.5-1.5l1.7-1.1m2.5-1.6l1.7-1m2.6-1.6l1.7-1m2.6-1.6l1.7-1m2.5-1.6l1.7-1.1m2.6-1.5l1.7-1.1m2.6-1.5l1.7-1.1m2.5-1.5l1.7-1.1m2.6-1.5l1.7-1.1m2.6-1.5l1.7-1.1m2.5-1.5l1.7-1.1m2.6-1.6l1.7-1m2.6-1.6l1.7-1m2.5-1.6l1.7-1m2.6-1.6l1.7-1'

const CHART_CDI_PATH =
  'M2 232l4.9-1m3.9-0.9l4.9-1m3.9-0.9l4.9-1m3.9-0.8l4.9-1.1m3.9-0.8l4.9-1.1m3.9-0.8l4.9-1m3.9-0.9l4.9-1m3.9-0.9l4.9-1m3.9-0.9l4.9-1.1m3.9-0.8l4.9-1.1m3.9-0.9l4.9-1m3.9-0.9l4.8-1.1m4-0.8l4.8-1.1m3.9-0.9l4.9-1.1m3.9-0.8l4.9-1m3.9-0.9l4.9-1m3.9-0.9l4.9-1m3.9-0.9l4.9-1m3.9-0.8l4.9-1.1m3.9-0.8l4.9-1.1m3.9-0.8l3.1-0.7m0 0l1.8-0.4m3.9-0.9l4.9-1.1m3.9-0.9l4.9-1.1m3.9-0.9l4.8-1.1m3.9-0.9l4.9-1.1m3.9-0.9l4.9-1.1m3.9-0.9l4.9-1.2m3.9-0.8l1.3-0.3m0 0l3.5-0.9m3.9-0.9l4.9-1.1m3.9-0.9l4.9-1.2m3.8-0.9l4.9-1.1m3.9-1l4.9-1.1m3.9-0.9l4.8-1.1m3.9-1l4.9-1.1m3.9-0.9l4.9-1.1m3.9-1l4.8-1.1m3.9-0.9l4.9-1.1m3.9-0.9l4.9-1.2m3.9-0.9l4.8-1.1m3.9-0.9l4.9-1.2m3.9-0.9l4.9-1.1m3.8-0.9l4.9-1.2m3.9-0.9l4.9-1.2m3.8-1l4.9-1.1m3.9-1l4.9-1.1m3.8-1l4.9-1.1m3.9-1l4.9-1.1m3.8-1l4.9-1.2m3.9-0.9l4.9-1.1m3.9-0.9l4.8-1.2m3.9-0.9l4.9-1.1m3.9-0.9l4.9-1.2m3.8-0.9l4.9-1.1m3.9-0.9l4.9-1.2m3.9-0.9l3.4-0.8m0 0l1.4-0.4m3.9-0.9l4.9-1.2m3.9-0.9l4.8-1.2m3.9-0.9l4.9-1.2m3.9-0.9l4.8-1.2m3.9-1l4.9-1.1m3.9-1l4.8-1.2m3.9-0.9l1.9-0.5m0 0l3-0.7m3.9-0.9l4.8-1.2m3.9-0.9l4.9-1.2m3.9-0.9l4.8-1.2m3.9-0.9l4.9-1.2m3.9-1l4.8-1.1m3.9-1l4.9-1.1m3.9-1l0.3-0.1m0 0l4.5-1.1m3.9-1l4.8-1.2m3.9-0.9l4.9-1.2m3.8-1l4.9-1.2m3.9-1l4.8-1.2m3.9-1l4.9-1.2m3.8-0.9l4.9-1.2m3.9-1l4.8-1.3m3.9-0.9l4.8-1.3m3.9-1l4.9-1.2m3.8-1l4.9-1.2m3.9-1l4.8-1.2m3.9-1l4.8-1.2m3.9-1l4.9-1.3'

const CHART_CARTEIRA_PATH =
  'M2 232l59.7-11.5 59.6-17.6 59.7-10.5 59.7-23.2 59.6-33.1 59.7-5 59.7-23.7 59.6-18.9 59.7-21.7 59.7 1.8 59.6-23.7 59.7-32.9'

// --- Tabela -----------------------------------------------------------------

const TABLE_COLUMNS = [
  { label: 'Competência', align: 'text-left' },
  { label: 'Carteira', align: 'text-right' },
  { label: 'CDI', align: 'text-right' },
  { label: 'Ibovespa', align: 'text-right' },
  { label: '% do CDI', align: 'text-right' },
]

// Rentabilidade: 2 casas e sinal sempre visível (+1,85 % / -0,10 %).
const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'always',
})

// % do CDI: 1 casa e sinal só quando negativo. `auto` equivale a `negative` aqui
// (nenhum valor é zero) e é o único dos dois tipado no lib ES2022 do projeto.
const ratioFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: 'auto',
})

function formatPercent(value: number) {
  return `${percentFormatter.format(value)} %`
}

function formatRatio(value: number) {
  return `${ratioFormatter.format(value)} %`
}

// --- Paginação --------------------------------------------------------------

// Paginação fiel ao design (1 2 3 … 8). O histórico estático cabe em uma tela,
// então o controle não fatia os dados — só reflete a página selecionada.
const TOTAL_PAGES = 8
const currentPage = ref(1)
</script>

<template>
  <section :class="cn('flex flex-col gap-6', props.class)" aria-label="Performance da carteira">
    <ul
      class="bg-border grid grid-cols-4 gap-px overflow-hidden rounded-md border max-lg:grid-cols-2 max-sm:grid-cols-1"
      aria-label="Indicadores de performance"
    >
      <KpiCard
        v-for="kpi in performanceIndicators"
        :key="kpi.label"
        :label="kpi.label"
        :value="kpi.value"
        :note="kpi.note"
        :tone="kpi.tone"
        size="sm"
      />
    </ul>

    <Card :class="CARD_SURFACE">
      <CardContent class="flex flex-col gap-3.5 p-3.5">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-card-title">
            Evolução acumulada
          </h2>

          <div
            class="flex gap-0.5 rounded-sm border p-0.5"
            role="group"
            aria-label="Período do gráfico"
          >
            <button
              v-for="period in CHART_PERIODS"
              :key="period"
              type="button"
              :aria-pressed="period === activePeriod"
              :class="cn(
                'text-chart-label rounded-sm px-2.5 py-1',
                period === activePeriod ? 'bg-foreground text-background' : 'text-muted-foreground',
              )"
              @click="activePeriod = period"
            >
              {{ period }}
            </button>
          </div>
        </div>

        <svg
          class="aspect-848/240 w-full"
          viewBox="0 0 720 240"
          fill="none"
          preserveAspectRatio="none"
          role="img"
          aria-label="Gráfico de linha com a evolução acumulada da carteira, do CDI e do Ibovespa entre setembro de 2025 e agosto de 2026. Os valores mês a mês estão na tabela abaixo."
        >
          <path
            :d="CHART_GRID_PATH"
            class="stroke-border"
            stroke-width="1"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
          <path
            :d="CHART_IBOVESPA_PATH"
            class="stroke-muted-foreground-faint"
            stroke-width="1.5"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
          <path
            :d="CHART_CDI_PATH"
            class="stroke-muted-foreground-faint"
            stroke-width="1.5"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
          <path
            :d="CHART_CARTEIRA_PATH"
            class="stroke-success"
            stroke-width="2"
            stroke-linecap="round"
            vector-effect="non-scaling-stroke"
          />
        </svg>

        <ul class="flex justify-between">
          <li
            v-for="label in CHART_X_LABELS"
            :key="label"
            class="text-chart-label text-muted-foreground-faint"
          >
            {{ label }}
          </li>
        </ul>

        <ul class="flex flex-wrap gap-4 border-t border-border pt-3">
          <li
            v-for="item in CHART_LEGEND"
            :key="item.label"
            class="text-label flex items-center gap-2 text-muted-foreground"
          >
            <span :class="cn('shrink-0', item.mark)" aria-hidden="true" />
            {{ item.label }}
          </li>
        </ul>
      </CardContent>
    </Card>

    <Card :class="CARD_SURFACE">
      <CardContent class="p-0">
        <Table>
          <TableCaption class="sr-only">
            Histórico mensal de rentabilidade da carteira comparada ao CDI e ao Ibovespa.
          </TableCaption>

          <TableHeader>
            <TableRow class="hover:bg-transparent">
              <TableHead
                v-for="column in TABLE_COLUMNS"
                :key="column.label"
                scope="col"
                :class="cn('px-3.5', column.align)"
              >
                <span class="text-eyebrow text-muted-foreground-faint">{{ column.label }}</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow v-for="row in performanceHistory" :key="row.competencia">
              <TableCell class="text-table-row px-3.5 py-3">
                {{ row.competencia }}
              </TableCell>

              <TableCell :class="cn(VALUE_CELL, row.carteira >= 0 ? 'text-success' : 'text-warning')">
                {{ formatPercent(row.carteira) }}
              </TableCell>

              <TableCell :class="cn(VALUE_CELL, 'text-muted-foreground')">
                {{ formatPercent(row.cdi) }}
              </TableCell>

              <TableCell :class="cn(VALUE_CELL, 'text-muted-foreground')">
                {{ formatPercent(row.ibovespa) }}
              </TableCell>

              <TableCell :class="cn(VALUE_CELL, 'text-muted-foreground')">
                {{ formatRatio(row.percentOfCdi) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <CardContent class="border-t border-border p-3.5">
        <Pagination
          v-model:page="currentPage"
          :items-per-page="performanceHistory.length"
          :total="performanceHistory.length * TOTAL_PAGES"
          :sibling-count="0"
          show-edges
          aria-label="Paginação do histórico mensal"
        >
          <PaginationContent v-slot="{ items }">
            <PaginationPrevious aria-label="Página anterior">
              <PhCaretLeft class="size-4" aria-hidden="true" />
              <span class="max-sm:hidden">Anterior</span>
            </PaginationPrevious>

            <template
              v-for="(item, index) in items"
              :key="item.type === 'page' ? `page-${item.value}` : `ellipsis-${index}`"
            >
              <PaginationItem
                v-if="item.type === 'page'"
                :value="item.value"
                :is-active="item.value === currentPage"
              >
                {{ item.value }}
              </PaginationItem>
              <PaginationEllipsis v-else>
                <PhDotsThree aria-hidden="true" />
                <span class="sr-only">Mais páginas</span>
              </PaginationEllipsis>
            </template>

            <PaginationNext aria-label="Próxima página">
              <span class="max-sm:hidden">Próxima</span>
              <PhCaretRight class="size-4" aria-hidden="true" />
            </PaginationNext>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  </section>
</template>
