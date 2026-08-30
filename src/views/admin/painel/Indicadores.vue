<script setup lang="ts">
import { KpiCard } from '@components/wallet/kpi-card'
import type { AdminDashboardResponseDto } from '@services/types'
import { computed } from 'vue'

interface Props {
  dashboard: AdminDashboardResponseDto
}

const props = defineProps<Props>()

const kpis = computed(() => {
  const { totalInvestidores, carteirasAtivas, fechamentoMesAtual } = props.dashboard

  return [
    {
      label: 'Investidores ativos',
      value: String(totalInvestidores),
      note: `${props.dashboard.distribuicaoPerfis.SEM_AVALIACAO} sem avaliação ainda`,
    },
    {
      label: 'Carteiras ativas',
      value: String(carteirasAtivas),
      note: 'Total de carteiras ativas',
    },
    {
      label: 'Versões publicadas',
      value: String(fechamentoMesAtual.versoesPublicadas),
      note: `Competência ${fechamentoMesAtual.mesReferencia}`,
    },
    {
      label: 'Relatórios gerados',
      value: `${fechamentoMesAtual.relatoriosGerados} de ${carteirasAtivas}`,
      note: fechamentoMesAtual.pendente ? 'Fechamento pendente' : 'Fechamento concluído',
    },
  ]
})
</script>

<template>
  <ul
    class="bg-border grid grid-cols-4 gap-px overflow-hidden rounded-lg border max-sm:grid-cols-2"
    aria-label="Indicadores do fechamento"
  >
    <KpiCard
      v-for="kpi in kpis"
      :key="kpi.label"
      :label="kpi.label"
      :value="kpi.value"
      :note="kpi.note"
      tone="neutral"
    />
  </ul>
</template>
