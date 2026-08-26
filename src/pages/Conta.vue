<script setup lang="ts">
import { LegalNotice } from '@components/shared/legal-notice'
import { Button } from '@components/ui/button'
import { PhSignOut } from '@phosphor-icons/vue'
import Cabecalho from '@views/conta/Cabecalho.vue'
import Detalhes from '@views/conta/Detalhes.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="flex flex-col gap-8 p-8 max-sm:gap-5 max-sm:px-4 max-sm:py-5">
    <Cabecalho />
    <Detalhes />
    <LegalNotice class="hidden max-sm:flex" />

    <Button as-child variant="outline" size="lg" class="hidden rounded-sm max-sm:flex">
      <RouterLink to="/login">
        <PhSignOut class="size-3.5" aria-hidden="true" />
        Sair da conta
      </RouterLink>
    </Button>
  </div>
</template>
