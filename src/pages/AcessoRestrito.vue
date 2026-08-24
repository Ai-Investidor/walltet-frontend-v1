<script setup lang="ts">
import Mensagem from '@views/acesso-restrito/Mensagem.vue'
import Topbar from '@views/acesso-restrito/Topbar.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Topbar />
    <main class="flex flex-1 flex-col">
      <Mensagem />
    </main>
  </div>
</template>
