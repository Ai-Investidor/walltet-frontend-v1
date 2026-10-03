<script setup lang="ts">
import { PageHeader } from '@components/shared/page-header'
import { Button } from '@components/ui/button'
import type { AdminDashboardResponseDto } from '@services/types'
import { formatCompetenciaLonga } from '@utils/competencia'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{ dashboard: AdminDashboardResponseDto }>()
const descricao = computed(() => {
  const { versoesPublicadas, relatoriosGerados, mesReferencia } = props.dashboard.fechamentoMesAtual
  return `${formatCompetenciaLonga(mesReferencia)} · ${versoesPublicadas} ${versoesPublicadas === 1 ? 'versão publicada' : 'versões publicadas'} e ${relatoriosGerados} ${relatoriosGerados === 1 ? 'relatório gerado' : 'relatórios gerados'}.`
})
</script>
<template>
  <PageHeader eyebrow="Administração" title="Visão geral" :description="descricao">
    <template #action><Button as-child variant="outline"><RouterLink to="/admin/usuarios">Gerenciar usuários</RouterLink></Button></template>
  </PageHeader>
</template>
