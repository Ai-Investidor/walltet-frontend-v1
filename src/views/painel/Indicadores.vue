<script setup lang="ts">
import { KpiCard } from '@components/wallet/kpi-card'
import type {
  DashboardInvestidorResponseDto,
  MinhaCarteiraPerformanceResponseDto,
} from '@services/types'
import { formatRatio, formatSignedPercent } from '@utils/format'
import { computed } from 'vue'

interface Props {
  dashboard: DashboardInvestidorResponseDto
  /** `null` enquanto a avaliação de suitability/carteira vinculada estiverem pendentes. */
  performance: MinhaCarteiraPerformanceResponseDto | null
}

const props = defineProps<Props>()

// "Aporte do mês" e "Dividendos no ano" saíram: sem fonte no backend, ver
// docs/AUDITORIA-INTEGRACAO.md §1.1 e docs/PROPOSTA-BACKEND-PATRIMONIO.md.
const kpis = computed(() => {
  const mesAtual = props.performance?.mesAtual
  const acumuladoAno = props.performance?.acumuladoAno

  // % do CDI no ano não vem pronto de `MinhaCarteiraPerformanceResponseDto` (só o valor do mês
  // atual vem, em `mesAtual.percentualCdi`) — deriva de rentabilidade/CDI acumulados.
  const percentCdiAno =
    acumuladoAno && acumuladoAno.cdi !== 0
      ? (acumuladoAno.rentabilidade / acumuladoAno.cdi) * 100
      : null

  return [
    {
      label: 'Rentabilidade do mês',
      value: mesAtual ? formatSignedPercent(mesAtual.rentabilidade) : '—',
      note: mesAtual ? `CDI do mês: ${formatSignedPercent(mesAtual.cdi)}` : 'Sem dado ainda',
      tone: mesAtual && mesAtual.rentabilidade >= 0 ? ('positive' as const) : ('neutral' as const),
    },
    {
      label: 'Acumulado no ano',
      value: acumuladoAno ? formatSignedPercent(acumuladoAno.rentabilidade) : '—',
      note: acumuladoAno
        ? `CDI no ano: ${formatSignedPercent(acumuladoAno.cdi)}`
        : 'Sem dado ainda',
      tone:
        acumuladoAno && acumuladoAno.rentabilidade >= 0
          ? ('positive' as const)
          : ('neutral' as const),
    },
    {
      label: '% do CDI no ano',
      value: percentCdiAno !== null ? formatRatio(percentCdiAno) : '—',
      note: 'Carteira sobre o CDI',
      tone: 'neutral' as const,
    },
    {
      label: 'Ativos na carteira',
      value: props.dashboard.carteira ? String(props.dashboard.carteira.totalAtivos) : '—',
      note: props.dashboard.carteira ? props.dashboard.carteira.nome : 'Sem carteira vinculada',
      tone: 'neutral' as const,
    },
  ]
})
</script>

<template>
  <ul
    class="bg-border flex gap-px overflow-x-auto rounded-lg border max-sm:grid max-sm:grid-cols-1 max-sm:overflow-visible"
  >
    <KpiCard
      v-for="kpi in kpis"
      :key="kpi.label"
      :label="kpi.label"
      :value="kpi.value"
      :note="kpi.note"
      :tone="kpi.tone"
      class="min-w-55 flex-1 shrink-0"
    />
  </ul>
</template>
