<script setup lang="ts">
import Formulario from '@views/recuperar-senha/Formulario.vue'
import PainelProva from '@views/recuperar-senha/PainelProva.vue'
</script>

<template>
  <div class="flex min-h-screen max-md:flex-col">
    <main class="flex flex-1 flex-col justify-center">
      <Formulario />
    </main>
    <PainelProva class="max-sm:hidden" />
  </div>
</template>
