<script setup lang="ts">
import * as carteirasService from '@services/carteiras'
import type { CarteiraDetalheDto } from '@services/types'
import { useAuthStore } from '@stores/auth'
import Cabecalho from '@views/carteira/Cabecalho.vue'
import Composicao from '@views/carteira/Composicao.vue'
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const auth = useAuthStore()

const carteiraId = computed(() => auth.usuario?.carteiraVinculada?.id ?? null)

const carteira = ref<CarteiraDetalheDto | null>(null)
const carregando = ref(true)
const erro = ref('')

onMounted(async () => {
  if (!carteiraId.value) {
    carregando.value = false
    return
  }

  try {
    carteira.value = await carteirasService.detalhar(carteiraId.value)
  } catch {
    erro.value = 'Não foi possível carregar sua carteira agora.'
  } finally {
    carregando.value = false
  }
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8 max-sm:gap-5 max-sm:px-4 max-sm:py-5">
    <p v-if="carregando" class="text-paragraph text-muted-foreground">
      Carregando sua carteira…
    </p>

    <p v-else-if="erro" role="alert" class="text-paragraph text-destructive">
      {{ erro }}
    </p>

    <!-- Estado "sem avaliação/sem carteira vinculada" — ver docs/AUDITORIA-INTEGRACAO.md §3.2. -->
    <div v-else-if="!carteira" class="flex flex-col items-start gap-3">
      <h1 class="text-page-title text-foreground">
        Você ainda não tem uma carteira vinculada
      </h1>
      <p class="text-paragraph text-muted-foreground max-w-[460px]">
        Responda a avaliação de perfil para receber a carteira recomendada para você.
      </p>
      <RouterLink to="/avaliacao-perfil" class="text-table-row text-success hover:underline">
        Fazer avaliação de perfil
      </RouterLink>
    </div>

    <template v-else>
      <Cabecalho :carteira="carteira" />
      <Composicao :carteira="carteira" />
    </template>
  </div>
</template>
