<script setup lang="ts">
import * as dashboardService from '@services/dashboard'
import type { AdminDashboardResponseDto } from '@services/types'
import Cabecalho from '@views/admin/painel/Cabecalho.vue'
import Checklist from '@views/admin/painel/Checklist.vue'
import Distribuicao from '@views/admin/painel/Distribuicao.vue'
import Indicadores from '@views/admin/painel/Indicadores.vue'
import { onMounted, ref } from 'vue'

const dashboard = ref<AdminDashboardResponseDto | null>(null)
const carregando = ref(true)
const erro = ref('')

onMounted(async () => {
  try {
    dashboard.value = await dashboardService.admin()
  } catch {
    erro.value = 'Não foi possível carregar o painel administrativo agora.'
  } finally {
    carregando.value = false
  }
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <p v-if="carregando" class="text-paragraph text-muted-foreground">
      Carregando painel…
    </p>

    <p v-else-if="erro" role="alert" class="text-paragraph text-destructive">
      {{ erro }}
    </p>

    <template v-else-if="dashboard">
      <Cabecalho :dashboard="dashboard" />
      <Indicadores :dashboard="dashboard" />

      <div class="flex gap-6 max-lg:flex-col">
        <Checklist :dashboard="dashboard" class="flex-1" />
        <Distribuicao :dashboard="dashboard" class="w-[366px] shrink-0 max-lg:w-full" />
      </div>
    </template>
  </div>
</template>
