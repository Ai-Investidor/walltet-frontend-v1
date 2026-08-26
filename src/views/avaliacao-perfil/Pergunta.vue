<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Progress } from '@components/ui/progress'
import type { PerguntaSuitabilityResponseDto } from '@services/types'
import { ref, watch } from 'vue'

const PROMPT_ID = 'avaliacao-perfil-pergunta'

interface Props {
  pergunta: PerguntaSuitabilityResponseDto
  currentStep: number
  totalSteps: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  answered: [opcaoId: string]
  voltar: []
}>()

const progressValue = ((props.currentStep - 1) / props.totalSteps) * 100

const selectedOptionId = ref<string | null>(null)

// Cada pergunta nova (troca de `pergunta.id`) reseta a seleção — sem isso a resposta da pergunta
// anterior ficaria marcada visualmente na próxima.
watch(
  () => props.pergunta.id,
  () => {
    selectedOptionId.value = null
  },
)

// "A resposta avança sozinha" (hint do rodapé): escolher uma opção conclui a pergunta atual.
watch(selectedOptionId, (value) => {
  if (value !== null) {
    emit('answered', value)
  }
})

function handleKeydown(event: KeyboardEvent) {
  const digit = Number(event.key)

  if (Number.isInteger(digit) && digit >= 1 && digit <= props.pergunta.opcoes.length) {
    selectedOptionId.value = props.pergunta.opcoes[digit - 1].id
  }
}
</script>

<template>
  <section class="px-6 py-10">
    <div class="mx-auto flex max-w-[720px] flex-col gap-7">
      <div class="flex flex-col gap-3">
        <div class="flex items-baseline justify-between gap-4">
          <p class="text-eyebrow text-muted-foreground-faint">
            Avaliação de perfil
          </p>
          <p class="text-topbar-meta text-muted-foreground">
            Pergunta {{ currentStep }} de {{ totalSteps }}
          </p>
        </div>

        <Progress :model-value="progressValue" />
      </div>

      <h1 :id="PROMPT_ID" class="max-w-[420px] text-page-title text-foreground">
        {{ pergunta.enunciado }}
      </h1>

      <fieldset :aria-labelledby="PROMPT_ID" class="flex flex-col gap-2.5" @keydown="handleKeydown">
        <label
          v-for="(opcao, index) in pergunta.opcoes"
          :key="opcao.id"
          class="bg-card border-border has-focus-visible:border-ring has-focus-visible:ring-ring/50 flex cursor-pointer items-center gap-3.5 rounded-sm border px-4.5 py-4 has-focus-visible:ring-1"
        >
          <input
            v-model="selectedOptionId"
            type="radio"
            name="avaliacao-perfil-opcao"
            :value="opcao.id"
            class="sr-only"
            :aria-keyshortcuts="String(index + 1)"
          >
          <span
            aria-hidden="true"
            class="border-border-strong text-eyebrow text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-sm border"
          >
            {{ index + 1 }}
          </span>
          <span class="text-paragraph text-foreground">{{ opcao.texto }}</span>
        </label>
      </fieldset>

      <div class="border-border flex items-center gap-4 border-t pt-3">
        <Button variant="outline" size="sm" :disabled="currentStep === 1" @click="emit('voltar')">
          Voltar
        </Button>

        <p class="text-label text-muted-foreground-faint">
          Use as teclas 1 a {{ pergunta.opcoes.length }} para responder. A resposta avança sozinha.
        </p>
      </div>
    </div>
  </section>
</template>
