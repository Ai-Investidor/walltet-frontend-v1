<script setup lang="ts">
import { LegalNotice } from '@components/shared/legal-notice'
import Arquivo from '@views/relatorios/Arquivo.vue'
import Cabecalho from '@views/relatorios/Cabecalho.vue'
</script>

<template>
  <div class="flex flex-col gap-8 p-8 max-sm:gap-5 max-sm:px-4 max-sm:py-5">
    <Cabecalho />
    <Arquivo />
    <LegalNotice class="hidden max-sm:flex" />
  </div>
</template>
