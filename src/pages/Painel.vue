<script setup lang="ts">
import Cabecalho from '@views/painel/Cabecalho.vue'
import Carteira from '@views/painel/Carteira.vue'
import EvolucaoPatrimonial from '@views/painel/EvolucaoPatrimonial.vue'
import Indicadores from '@views/painel/Indicadores.vue'
import Movimentacoes from '@views/painel/Movimentacoes.vue'
</script>

<template>
  <div class="flex flex-col gap-7 px-10 py-8 max-sm:gap-5 max-sm:px-4 max-sm:py-5">
    <Cabecalho />
    <Indicadores />

    <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_22.5rem] gap-6 max-2xl:grid-cols-2 max-lg:grid-cols-1 max-sm:gap-5">
      <Carteira />
      <EvolucaoPatrimonial />
      <Movimentacoes class="max-2xl:col-span-2 max-lg:col-span-1" />
    </div>
  </div>
</template>
