<script setup lang="ts">
import { PageHeader } from '@components/shared/page-header'
import type { AdminDashboardResponseDto } from '@services/types'
import { formatCompetenciaLonga } from '@utils/competencia'
import { computed } from 'vue'

interface Props {
  dashboard: AdminDashboardResponseDto
}

const props = defineProps<Props>()

const competenciaLonga = computed(() =>
  formatCompetenciaLonga(props.dashboard.fechamentoMesAtual.mesReferencia),
)
const mesCurto = computed(() => competenciaLonga.value.split(' ')[0].toLowerCase())

const descricao = computed(() => {
  const { versoesPublicadas, relatoriosGerados } = props.dashboard.fechamentoMesAtual
  return `${versoesPublicadas} versão${versoesPublicadas === 1 ? '' : 'ões'} publicada${versoesPublicadas === 1 ? '' : 's'} e ${relatoriosGerados} relatório${relatoriosGerados === 1 ? '' : 's'} gerado${relatoriosGerados === 1 ? '' : 's'} nesta competência.`
})
</script>

<template>
  <PageHeader
    :eyebrow="`Painel administrativo · Fechamento de ${mesCurto}`"
    :description="descricao"
  >
    <template #title>
      Fechamento de <span class="text-success">{{ mesCurto }}</span>
      {{ dashboard.fechamentoMesAtual.pendente ? 'em andamento' : 'concluído' }}
    </template>
  </PageHeader>
</template>
