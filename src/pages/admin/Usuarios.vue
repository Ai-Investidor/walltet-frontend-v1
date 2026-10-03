<script setup lang="ts">
import { Button } from '@components/ui/button'
import type { UsuarioListagemDto } from '@services/types'
import * as usuariosService from '@services/usuarios'
import Cabecalho from '@views/admin/usuarios/Cabecalho.vue'
import FormularioUsuario from '@views/admin/usuarios/FormularioUsuario.vue'
import Tabela from '@views/admin/usuarios/Tabela.vue'
import { onMounted, ref } from 'vue'

const usuarios = ref<UsuarioListagemDto[]>([])
const carregando = ref(true)
const erro = ref('')
const termoBusca = ref('')
const page = ref(1)
const total = ref(0)
const pageSize = 20
const novoOpen = ref(false)
let requisicao = 0
async function carregar() {
  const atual = ++requisicao
  carregando.value = true
  erro.value = ''
  try {
    const pagina = await usuariosService.listar({
      search: termoBusca.value || undefined,
      page: page.value,
      pageSize,
    })
    if (atual !== requisicao) return
    usuarios.value = pagina.items
    total.value = pagina.total
  } catch {
    if (atual === requisicao) erro.value = 'Não foi possível carregar os usuários agora.'
  } finally {
    if (atual === requisicao) carregando.value = false
  }
}
onMounted(carregar)
function buscar(termo: string) {
  termoBusca.value = termo
  page.value = 1
  carregar()
}
function navegar(delta: number) {
  page.value += delta
  carregar()
}
function criado() {
  page.value = 1
  carregar()
}
</script>
<template>
  <div class="flex flex-col gap-8 p-8 max-sm:gap-5 max-sm:px-4 max-sm:py-5">
    <Cabecalho @novo="novoOpen = true" />
    <p v-if="carregando" role="status" class="text-label text-muted-foreground">Carregando usuários…</p>
    <div v-if="erro" role="alert" class="flex items-center gap-4 text-label text-destructive">{{ erro }}<Button variant="outline" @click="carregar">Tentar novamente</Button></div>
    <Tabela :usuarios="usuarios" @buscar="buscar" @atualizado="carregar" />
    <div class="flex flex-wrap items-center justify-between gap-3">
      <p class="text-label text-muted-foreground">{{ total }} {{ total === 1 ? 'usuário' : 'usuários' }} · Página {{ page }} de {{ Math.max(1, Math.ceil(total / pageSize)) }}</p>
      <div class="flex gap-2"><Button variant="outline" :disabled="carregando || page === 1" @click="navegar(-1)">Anterior</Button><Button variant="outline" :disabled="carregando || page * pageSize >= total" @click="navegar(1)">Próxima</Button></div>
    </div>
    <FormularioUsuario v-model:open="novoOpen" @criado="criado" />
  </div>
</template>
