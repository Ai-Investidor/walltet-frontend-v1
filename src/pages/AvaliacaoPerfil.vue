<script setup lang="ts">
import Pergunta from '@views/avaliacao-perfil/Pergunta.vue'
import Resultado from '@views/avaliacao-perfil/Resultado.vue'
import Topbar from '@views/avaliacao-perfil/Topbar.vue'
import { ref } from 'vue'

const isComplete = ref(false)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <Topbar />
    <main class="flex flex-1 flex-col">
      <Pergunta v-if="!isComplete" @answered="isComplete = true" />
      <Resultado v-else @restart="isComplete = false" />
    </main>
  </div>
</template>
