<script setup lang="ts">
import Cabecalho from '@views/admin/ativos/Cabecalho.vue'
import ClasseSelecionada from '@views/admin/ativos/ClasseSelecionada.vue'
import Filtros from '@views/admin/ativos/Filtros.vue'
import Tabela from '@views/admin/ativos/Tabela.vue'
import { ref } from 'vue'

// A classe filtrada governa a tabela e o painel de contexto — por isso vive na página.
const activeClass = ref('Ações BR')
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <Cabecalho />
    <Filtros v-model="activeClass" />
    <Tabela :active-class="activeClass" />
    <ClasseSelecionada :active-class="activeClass" />
  </div>
</template>
