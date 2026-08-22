<script setup lang="ts">
import Formulario from '@views/login/Formulario.vue'
import PainelProva from '@views/login/PainelProva.vue'
</script>

<template>
  <div class="flex min-h-screen max-md:flex-col">
    <main class="flex flex-1 flex-col justify-center">
      <Formulario />
    </main>
    <PainelProva class="w-115 shrink-0 max-md:w-full" />
  </div>
</template>
