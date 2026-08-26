<script setup lang="ts">
import * as carteirasService from '@services/carteiras'
import type { CarteiraDetalheDto } from '@services/types'
import Cabecalho from '@views/admin/carteiras/Cabecalho.vue'
import Tabela from '@views/admin/carteiras/Tabela.vue'
import { onMounted, ref } from 'vue'

const carteiras = ref<CarteiraDetalheDto[]>([])
const carregando = ref(true)
const erro = ref('')

async function carregar() {
  carregando.value = true
  erro.value = ''

  try {
    const pagina = await carteirasService.listar({ pageSize: 100 })
    carteiras.value = await Promise.all(
      pagina.items.map((item) => carteirasService.detalhar(item.id)),
    )
  } catch {
    erro.value = 'Não foi possível carregar as carteiras agora.'
  } finally {
    carregando.value = false
  }
}

onMounted(carregar)
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <Cabecalho @criada="carregar" />

    <p v-if="carregando" class="text-paragraph text-muted-foreground">
      Carregando carteiras…
    </p>
    <p v-else-if="erro" role="alert" class="text-paragraph text-destructive">
      {{ erro }}
    </p>
    <Tabela v-else :carteiras="carteiras" />
  </div>
</template>
