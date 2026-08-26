<script setup lang="ts">
import Formulario from '@views/criar-conta/Formulario.vue'
import PainelProva from '@views/criar-conta/PainelProva.vue'
</script>

<template>
  <div class="flex min-h-screen max-md:flex-col">
    <main class="flex flex-1 flex-col justify-center">
      <Formulario />
    </main>
    <PainelProva class="max-sm:hidden" />
  </div>
</template>
