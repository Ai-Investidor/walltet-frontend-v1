<script setup lang="ts">
import Carteira from '@views/painel/Carteira.vue'
import Movimentacoes from '@views/painel/Movimentacoes.vue'
import Overview from '@views/painel/Overview.vue'
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <Overview />
    <div class="flex gap-6 max-lg:flex-col">
      <Carteira class="w-123.5 max-lg:w-full" />
      <Movimentacoes class="w-91.5 max-lg:w-full" />
    </div>
  </div>
</template>
