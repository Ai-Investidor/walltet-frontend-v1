<script setup lang="ts">
import { Card, CardContent } from '@components/ui/card'
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
import * as carteirasService from '@services/carteiras'
import type { HistoricoPerformanceResponseDto } from '@services/types'
import { formatCompetenciaCurta } from '@utils/competencia'
import { formatRatio, formatSignedPercent } from '@utils/format'
import type { HTMLAttributes } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'
import { cn } from '@/libs/utils'

interface Props {
  carteiraId: string
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'
const VALUE_CELL = 'text-table-value px-3.5 py-3 text-right tabular-nums'

const CHART_PERIODS = [
  { label: '3M', meses: 3 },
  { label: '6M', meses: 6 },
  { label: '12M', meses: 12 },
  { label: 'Máx', meses: 60 },
] as const

const activePeriodo = ref(12)

const historico = ref<HistoricoPerformanceResponseDto | null>(null)
const carregando = ref(true)
const erro = ref('')

async function carregar() {
  carregando.value = true
  erro.value = ''

  try {
    historico.value = await carteirasService.historicoPerformance(
      props.carteiraId,
      activePeriodo.value,
    )
  } catch {
    erro.value = 'Não foi possível carregar o histórico de performance agora.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregar)
watch(activePeriodo, carregar)

const serie = computed(() => historico.value?.serie ?? [])

const kpis = computed(() => {
  const ultimoMes = serie.value.at(-1)
  const acumulado = historico.value?.acumulado
  const percentCdiAcumulado =
    acumulado && acumulado.cdi !== 0 ? (acumulado.carteira / acumulado.cdi) * 100 : null
  const mesesPositivos = serie.value.filter((item) => item.rentabilidade >= 0).length

  return [
    {
      label: 'Mês',
      value: ultimoMes ? formatSignedPercent(ultimoMes.rentabilidade) : '—',
      note: ultimoMes
        ? `CDI ${formatSignedPercent(ultimoMes.cdi)} · Ibov ${formatSignedPercent(ultimoMes.ibov)}`
        : '—',
      tone:
        ultimoMes && ultimoMes.rentabilidade >= 0 ? ('positive' as const) : ('neutral' as const),
    },
    {
      label: 'No período',
      value: acumulado ? formatSignedPercent(acumulado.carteira) : '—',
      note: acumulado ? `CDI ${formatSignedPercent(acumulado.cdi)}` : '—',
      tone: acumulado && acumulado.carteira >= 0 ? ('positive' as const) : ('neutral' as const),
    },
    {
      label: '% do CDI',
      value: percentCdiAcumulado !== null ? formatRatio(percentCdiAcumulado) : '—',
      note: 'Acumulado do período',
      tone: 'neutral' as const,
    },
    {
      label: 'Meses positivos',
      value: serie.value.length ? `${mesesPositivos} de ${serie.value.length}` : '—',
      note: 'No período selecionado',
      tone: 'neutral' as const,
    },
  ]
})

// --- Gráfico "Evolução acumulada" -------------------------------------------------------------

const CHART_WIDTH = 720
const CHART_HEIGHT = 240

/** Composição mês a mês em série acumulada (%) — a API só devolve o total do período em
 * `acumulado`, não uma série; a curva é a composição de juros a partir de `serie[].rentabilidade`. */
function acumular(valores: number[]) {
  let acumulado = 1
  return valores.map((valor) => {
    acumulado *= 1 + valor / 100
    return (acumulado - 1) * 100
  })
}

function buildPath(valores: number[], min: number, max: number) {
  if (valores.length === 0) {
    return ''
  }

  const range = max - min || 1
  const stepX = valores.length > 1 ? CHART_WIDTH / (valores.length - 1) : 0

  return valores
    .map((valor, index) => {
      const x = index * stepX
      const y = CHART_HEIGHT - ((valor - min) / range) * CHART_HEIGHT
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
}

const chartPaths = computed(() => {
  const carteiraAcumulada = acumular(serie.value.map((item) => item.rentabilidade))
  const cdiAcumulado = acumular(serie.value.map((item) => item.cdi))
  const ibovAcumulado = acumular(serie.value.map((item) => item.ibov))

  const todos = [...carteiraAcumulada, ...cdiAcumulado, ...ibovAcumulado]
  const min = todos.length ? Math.min(...todos, 0) : 0
  const max = todos.length ? Math.max(...todos, 0) : 1

  return {
    carteira: buildPath(carteiraAcumulada, min, max),
    cdi: buildPath(cdiAcumulado, min, max),
    ibov: buildPath(ibovAcumulado, min, max),
  }
})

const CHART_LEGEND = [
  { label: 'Carteira', mark: 'h-0.5 w-5 rounded-full bg-success' },
  { label: 'CDI', mark: 'w-5 border-t-2 border-dashed border-muted-foreground-faint' },
  { label: 'Ibovespa', mark: 'w-5 border-t-2 border-dotted border-muted-foreground-faint' },
]

const chartXLabels = computed(() => {
  const total = serie.value.length
  if (total === 0) {
    return []
  }

  const indices = new Set([0, Math.floor(total / 3), Math.floor((total * 2) / 3), total - 1])
  return Array.from(indices)
    .sort((a, b) => a - b)
    .map((index) => formatCompetenciaCurta(serie.value[index].mesReferencia))
})

const TABLE_COLUMNS = [
  { label: 'Competência', align: 'text-left' },
  { label: 'Carteira', align: 'text-right' },
  { label: 'CDI', align: 'text-right' },
  { label: 'Ibovespa', align: 'text-right' },
  { label: '% do CDI', align: 'text-right' },
]

function formatRatioOuTraco(value: number | null) {
  return value === null ? '—' : formatRatio(value)
}
</script>

<template>
  <section :class="cn('flex flex-col gap-6', props.class)" aria-label="Performance da carteira">
    <p v-if="erro" role="alert" class="text-paragraph text-destructive">
      {{ erro }}
    </p>

    <template v-else>
      <ul
        class="bg-border grid grid-cols-4 gap-px overflow-hidden rounded-md border max-lg:grid-cols-2 max-sm:grid-cols-1"
        aria-label="Indicadores de performance"
      >
        <KpiCard
          v-for="kpi in kpis"
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

            <div class="flex gap-0.5 rounded-sm border p-0.5" role="group" aria-label="Período do gráfico">
              <button
                v-for="periodo in CHART_PERIODS"
                :key="periodo.label"
                type="button"
                :aria-pressed="periodo.meses === activePeriodo"
                :class="cn(
                  'text-chart-label rounded-sm px-2.5 py-1',
                  periodo.meses === activePeriodo ? 'bg-foreground text-background' : 'text-muted-foreground',
                )"
                @click="activePeriodo = periodo.meses"
              >
                {{ periodo.label }}
              </button>
            </div>
          </div>

          <p v-if="carregando" class="text-paragraph text-muted-foreground">Carregando…</p>

          <template v-else>
            <svg
              class="aspect-848/240 w-full"
              :viewBox="`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`"
              fill="none"
              preserveAspectRatio="none"
              role="img"
              aria-label="Gráfico de linha com a evolução acumulada da carteira, do CDI e do Ibovespa no período selecionado. Os valores mês a mês estão na tabela abaixo."
            >
              <path :d="chartPaths.ibov" class="stroke-muted-foreground-faint" stroke-width="1.5" stroke-linecap="round" vector-effect="non-scaling-stroke" />
              <path :d="chartPaths.cdi" class="stroke-muted-foreground-faint" stroke-width="1.5" stroke-linecap="round" vector-effect="non-scaling-stroke" />
              <path :d="chartPaths.carteira" class="stroke-success" stroke-width="2" stroke-linecap="round" vector-effect="non-scaling-stroke" />
            </svg>

            <ul class="flex justify-between">
              <li v-for="label in chartXLabels" :key="label" class="text-chart-label text-muted-foreground-faint">
                {{ label }}
              </li>
            </ul>

            <ul class="flex flex-wrap gap-4 border-t border-border pt-3">
              <li v-for="item in CHART_LEGEND" :key="item.label" class="text-label flex items-center gap-2 text-muted-foreground">
                <span :class="cn('shrink-0', item.mark)" aria-hidden="true" />
                {{ item.label }}
              </li>
            </ul>
          </template>
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
                <TableHead v-for="column in TABLE_COLUMNS" :key="column.label" scope="col" :class="cn('px-3.5', column.align)">
                  <span class="text-eyebrow text-muted-foreground-faint">{{ column.label }}</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              <TableRow v-for="row in serie" :key="row.mesReferencia">
                <TableCell class="text-table-row px-3.5 py-3">
                  {{ formatCompetenciaCurta(row.mesReferencia) }}
                </TableCell>
                <TableCell :class="cn(VALUE_CELL, row.rentabilidade >= 0 ? 'text-success' : 'text-warning')">
                  {{ formatSignedPercent(row.rentabilidade) }}
                </TableCell>
                <TableCell :class="cn(VALUE_CELL, 'text-muted-foreground')">
                  {{ formatSignedPercent(row.cdi) }}
                </TableCell>
                <TableCell :class="cn(VALUE_CELL, 'text-muted-foreground')">
                  {{ formatSignedPercent(row.ibov) }}
                </TableCell>
                <TableCell :class="cn(VALUE_CELL, 'text-muted-foreground')">
                  {{ formatRatioOuTraco(row.percentualCdi) }}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </template>
  </section>
</template>
