<script setup lang="ts">
import * as suitabilityService from '@services/suitability'
import type { PerguntaSuitabilityResponseDto, ResultadoAvaliacaoDto } from '@services/types'
import { useAuthStore } from '@stores/auth'
import Pergunta from '@views/avaliacao-perfil/Pergunta.vue'
import Resultado from '@views/avaliacao-perfil/Resultado.vue'
import Topbar from '@views/avaliacao-perfil/Topbar.vue'
import { computed, onMounted, ref } from 'vue'

const auth = useAuthStore()

const perguntas = ref<PerguntaSuitabilityResponseDto[]>([])
const respostas = ref<Record<string, string>>({})
const indiceAtual = ref(0)
const resultado = ref<ResultadoAvaliacaoDto | null>(null)

const carregandoPerguntas = ref(true)
const enviandoResultado = ref(false)
const erro = ref('')

const perguntaAtual = computed<PerguntaSuitabilityResponseDto | null>(
  () => perguntas.value[indiceAtual.value] ?? null,
)

async function carregarPerguntas() {
  carregandoPerguntas.value = true
  erro.value = ''

  try {
    perguntas.value = await suitabilityService.listarPerguntas()
  } catch {
    erro.value = 'Não foi possível carregar a avaliação de perfil. Tente novamente mais tarde.'
  } finally {
    carregandoPerguntas.value = false
  }
}

onMounted(carregarPerguntas)

async function enviarAvaliacao() {
  enviandoResultado.value = true
  erro.value = ''

  try {
    // §4.2 do INTEGRATION_PROMPT.md: a rota não lê a sessão sozinha — precisa do `usuarioId`.
    resultado.value = await suitabilityService.avaliar({
      respostas: Object.entries(respostas.value).map(([perguntaId, opcaoId]) => ({
        perguntaId,
        opcaoId,
      })),
      usuarioId: auth.usuario?.id,
    })

    // O perfil e a carteira vinculada do usuário mudaram no backend — recarrega a sessão.
    await auth.carregarSessao()
  } catch {
    erro.value = 'Não foi possível concluir a avaliação. Tente novamente.'
  } finally {
    enviandoResultado.value = false
  }
}

function handleAnswered(opcaoId: string) {
  const pergunta = perguntaAtual.value

  if (!pergunta) {
    return
  }

  respostas.value[pergunta.id] = opcaoId

  if (indiceAtual.value < perguntas.value.length - 1) {
    indiceAtual.value += 1
    return
  }

  enviarAvaliacao()
}

function voltar() {
  if (indiceAtual.value > 0) {
    indiceAtual.value -= 1
  }
}

function reiniciar() {
  indiceAtual.value = 0
  respostas.value = {}
  resultado.value = null
}
</script>

<template>
  <Topbar />
  <main class="flex-1">
    <p v-if="carregandoPerguntas" class="text-paragraph text-muted-foreground px-6 py-10">
      Carregando avaliação de perfil…
    </p>

    <p v-else-if="erro && !resultado" role="alert" class="text-paragraph text-destructive px-6 py-10">
      {{ erro }}
    </p>

    <Resultado v-else-if="resultado" :resultado="resultado" @restart="reiniciar" />

    <p v-else-if="enviandoResultado" class="text-paragraph text-muted-foreground px-6 py-10">
      Calculando seu perfil…
    </p>

    <Pergunta
      v-else-if="perguntaAtual"
      :key="perguntaAtual.id"
      :pergunta="perguntaAtual"
      :current-step="indiceAtual + 1"
      :total-steps="perguntas.length"
      @answered="handleAnswered"
      @voltar="voltar"
    />
  </main>
</template>
