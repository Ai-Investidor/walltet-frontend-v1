<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Progress } from '@components/ui/progress'
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireItem,
} from '@components/ui/questionnaire'
import { assessmentProgress, assessmentQuestion } from '@data/avaliacao'

const QUESTION_NAME = 'horizonte-investimento'
const PROMPT_ID = 'avaliacao-perfil-pergunta'

// A barra representa passos concluídos: currentStep=2 significa 1 de 5 concluído (20%).
const progressValue = ((assessmentProgress.currentStep - 1) / assessmentProgress.totalSteps) * 100

// Fluxo estático nesta fase: não há próxima pergunta nem envio real, então o
// submit nativo (Enter sobre a opção marcada) não pode recarregar a página.
function handleSubmit(event: Event) {
  event.preventDefault()
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
            Pergunta {{ assessmentProgress.currentStep }} de {{ assessmentProgress.totalSteps }}
          </p>
        </div>

        <Progress :model-value="progressValue" />
      </div>

      <h1 :id="PROMPT_ID" class="max-w-[420px] text-page-title text-foreground">
        {{ assessmentQuestion.prompt }}
      </h1>

      <Questionnaire
        :default-item="QUESTION_NAME"
        shortcuts="numbers"
        @submit="handleSubmit"
      >
        <QuestionnaireItem :aria-labelledby="PROMPT_ID" :name="QUESTION_NAME" required>
          <QuestionnaireChoices class="gap-3">
            <QuestionnaireChoice
              v-for="option in assessmentQuestion.options"
              :key="option.id"
              :value="String(option.id)"
              class="bg-card border-border text-paragraph text-foreground items-center gap-3.5 rounded-sm px-4.5 py-4"
            >
              {{ option.label }}
            </QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
      </Questionnaire>

      <div class="border-border flex items-center gap-4 border-t pt-3">
        <Button variant="outline" size="sm">
          Voltar
        </Button>

        <p class="text-label text-muted-foreground-faint">
          Use as teclas 1 a 4 para responder. A resposta avança sozinha.
        </p>
      </div>
    </div>
  </section>
</template>
