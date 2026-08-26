<script setup lang="ts">
import * as carteirasService from '@services/carteiras'
import * as dashboardService from '@services/dashboard'
import * as minhaCarteiraService from '@services/minha-carteira'
import * as relatoriosService from '@services/relatorios'
import type {
  CarteiraDetalheDto,
  DashboardInvestidorResponseDto,
  MeuRelatorioResponseDto,
  MinhaCarteiraPerformanceResponseDto,
  MovimentacoesResponseDto,
} from '@services/types'
import Cabecalho from '@views/painel/Cabecalho.vue'
import Carteira from '@views/painel/Carteira.vue'
import Indicadores from '@views/painel/Indicadores.vue'
import Movimentacoes from '@views/painel/Movimentacoes.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// `EvolucaoPatrimonial` saiu da composição da página — ver comentário em
// src/views/painel/EvolucaoPatrimonial.vue e docs/PROPOSTA-BACKEND-PATRIMONIO.md.

const router = useRouter()

const carregando = ref(true)
const erro = ref('')

const dashboard = ref<DashboardInvestidorResponseDto | null>(null)
const performance = ref<MinhaCarteiraPerformanceResponseDto | null>(null)
const carteira = ref<CarteiraDetalheDto | null>(null)
const movimentacoes = ref<MovimentacoesResponseDto | null>(null)
const ultimoRelatorio = ref<MeuRelatorioResponseDto | null>(null)

onMounted(async () => {
  try {
    dashboard.value = await dashboardService.investidor()
    const carteiraId = dashboard.value.carteira?.id

    const tarefas: Array<Promise<unknown>> = [
      relatoriosService.meusRelatorios({ pageSize: 1 }).then((pagina) => {
        ultimoRelatorio.value = pagina.items[0] ?? null
      }),
    ]

    if (carteiraId) {
      tarefas.push(
        carteirasService.detalhar(carteiraId).then((data) => {
          carteira.value = data
        }),
        carteirasService.movimentacoes(carteiraId).then((data) => {
          movimentacoes.value = data
        }),
      )
    }

    if (dashboard.value.suitabilityRealizado && dashboard.value.carteira) {
      tarefas.push(
        minhaCarteiraService
          .performance()
          .then((data) => {
            performance.value = data
          })
          // 422 SUITABILITY_PENDENTE / CARTEIRA_NAO_VINCULADA já são cobertos pelas flags do
          // dashboard acima — qualquer outro erro aqui só deixa os indicadores sem esse dado.
          .catch(() => {}),
      )
    }

    await Promise.all(tarefas)
  } catch {
    erro.value = 'Não foi possível carregar o painel agora.'
  } finally {
    carregando.value = false
  }
})

function irParaCarteira() {
  router.push({ name: 'carteira' })
}
</script>

<template>
  <div class="flex flex-col gap-7 px-10 py-8 max-sm:gap-5 max-sm:px-4 max-sm:py-5">
    <p v-if="carregando" class="text-paragraph text-muted-foreground">
      Carregando painel…
    </p>

    <p v-else-if="erro" role="alert" class="text-paragraph text-destructive">
      {{ erro }}
    </p>

    <template v-else-if="dashboard">
      <Cabecalho :dashboard="dashboard" :movimentacoes="movimentacoes" />
      <Indicadores :dashboard="dashboard" :performance="performance" />

      <div class="grid grid-cols-[minmax(0,1fr)_22.5rem] gap-6 max-lg:grid-cols-1 max-sm:gap-5">
        <Carteira :carteira="carteira" @ver-completa="irParaCarteira" />
        <Movimentacoes :movimentacoes="movimentacoes" :ultimo-relatorio="ultimoRelatorio" />
      </div>
    </template>
  </div>
</template>
