<script setup lang="ts">
import type { UsuarioListagemDto } from '@services/types'
import * as usuariosService from '@services/usuarios'
import Cabecalho from '@views/admin/usuarios/Cabecalho.vue'
import Tabela from '@views/admin/usuarios/Tabela.vue'
import { onMounted, ref } from 'vue'

const usuarios = ref<UsuarioListagemDto[]>([])
const carregando = ref(true)
const erro = ref('')
const termoBusca = ref('')

async function carregar() {
  carregando.value = true
  erro.value = ''

  try {
    const pagina = await usuariosService.listar({
      search: termoBusca.value || undefined,
      pageSize: 100,
    })
    usuarios.value = pagina.items
  } catch {
    erro.value = 'Não foi possível carregar os usuários agora.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregar)

function buscar(termo: string) {
  termoBusca.value = termo
  carregar()
}
</script>

<template>
  <div class="flex flex-col gap-8 p-8 max-sm:gap-5 max-sm:px-4 max-sm:py-5">
    <Cabecalho />

    <p v-if="carregando" class="text-paragraph text-muted-foreground">
      Carregando usuários…
    </p>
    <p v-else-if="erro" role="alert" class="text-paragraph text-destructive">
      {{ erro }}
    </p>
    <Tabela v-else :usuarios="usuarios" @buscar="buscar" @atualizado="carregar" />
  </div>
</template>
