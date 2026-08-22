<script setup lang="ts">
import Pergunta from '@views/avaliacao-perfil/Pergunta.vue'
import Resultado from '@views/avaliacao-perfil/Resultado.vue'
import Topbar from '@views/avaliacao-perfil/Topbar.vue'
import { ref } from 'vue'

const isComplete = ref(false)
</script>

<template>
  <Topbar />
  <main class="flex-1">
    <Pergunta v-if="!isComplete" @answered="isComplete = true" />
    <Resultado v-else @restart="isComplete = false" />
  </main>
</template>
