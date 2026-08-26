<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Progress } from '@components/ui/progress'
import { assessmentProgress, assessmentQuestion } from '@data/avaliacao'
import { ref, watch } from 'vue'

const PROMPT_ID = 'avaliacao-perfil-pergunta'

const emit = defineEmits<{ answered: [] }>()

// A barra representa passos concluídos: currentStep=2 significa 1 de 5 concluído (20%).
const progressValue = ((assessmentProgress.currentStep - 1) / assessmentProgress.totalSteps) * 100

const selectedOptionId = ref<number | null>(null)

// "A resposta avança sozinha" (hint do rodapé): escolher uma opção conclui a
// única pergunta implementada nesta fase e revela o resultado.
watch(selectedOptionId, (value) => {
  if (value !== null) {
    emit('answered')
  }
})

function handleKeydown(event: KeyboardEvent) {
  const digit = Number(event.key)

  if (Number.isInteger(digit) && digit >= 1 && digit <= assessmentQuestion.options.length) {
    selectedOptionId.value = digit
  }
}
</script>

<template>
  <section class="px-6 py-10 max-sm:flex max-sm:flex-1 max-sm:flex-col max-sm:px-5 max-sm:py-6">
    <div class="mx-auto flex max-w-[720px] flex-col gap-7 max-sm:flex-1 max-sm:justify-between">
      <div class="flex flex-col gap-7 max-sm:gap-6">
        <div class="flex flex-col gap-3">
          <div class="flex items-baseline justify-between gap-4">
            <p class="text-eyebrow text-muted-foreground-faint">
              Avaliação de perfil
            </p>
            <p class="text-topbar-meta text-muted-foreground">
              Pergunta {{ assessmentProgress.currentStep }} de {{ assessmentProgress.totalSteps }}
            </p>
          </div>

          <Progress :model-value="progressValue" />
        </div>

        <h1 :id="PROMPT_ID" class="max-w-[420px] text-page-title text-foreground max-sm:text-page-title-sm">
          {{ assessmentQuestion.prompt }}
        </h1>

        <fieldset
          :aria-labelledby="PROMPT_ID"
          class="flex flex-col gap-2.5 max-sm:gap-2"
          @keydown="handleKeydown"
        >
          <label
            v-for="option in assessmentQuestion.options"
            :key="option.id"
            class="bg-card border-border has-focus-visible:border-ring has-focus-visible:ring-ring/50 flex cursor-pointer items-center gap-3.5 rounded-sm border px-4.5 py-4 has-focus-visible:ring-1 max-sm:gap-3 max-sm:px-4 max-sm:py-3.5"
          >
            <input
              v-model="selectedOptionId"
              type="radio"
              name="avaliacao-perfil-horizonte"
              :value="option.id"
              class="sr-only"
              :aria-keyshortcuts="String(option.id)"
            >
            <span
              aria-hidden="true"
              class="border-border-strong text-eyebrow text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-sm border"
            >
              {{ option.id }}
            </span>
            <span class="text-paragraph text-foreground">{{ option.label }}</span>
          </label>
        </fieldset>
      </div>

      <div class="border-border flex items-center gap-4 border-t pt-3 max-sm:justify-between">
        <Button variant="outline" size="sm">
          Voltar
        </Button>

        <p class="text-label text-muted-foreground-faint max-sm:hidden">
          Use as teclas 1 a 4 para responder. A resposta avança sozinha.
        </p>

        <p class="text-label text-muted-foreground-faint hidden max-sm:block">
          {{ assessmentProgress.currentStep }} de {{ assessmentProgress.totalSteps }}
        </p>
      </div>
    </div>
  </section>
</template>
