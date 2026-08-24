<script setup lang="ts">
import Mensagem from '@views/nao-encontrada/Mensagem.vue'
import Topbar from '@views/nao-encontrada/Topbar.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Topbar />
    <main class="flex flex-1 flex-col">
      <Mensagem />
    </main>
  </div>
</template>
