<script setup lang="ts">
import Cabecalho from '@views/admin/painel/Cabecalho.vue'
import Checklist from '@views/admin/painel/Checklist.vue'
import Distribuicao from '@views/admin/painel/Distribuicao.vue'
import Indicadores from '@views/admin/painel/Indicadores.vue'
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <Cabecalho />
    <Indicadores />

    <div class="flex gap-6">
      <Checklist class="flex-1" />
      <Distribuicao class="w-[366px] shrink-0" />
    </div>
  </div>
</template>
