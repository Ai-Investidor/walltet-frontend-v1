<script setup lang="ts">
import { LegalNotice } from '@components/shared/legal-notice'
import { ProfileGauge } from '@components/shared/profile-gauge'
import { Button } from '@components/ui/button'
import { assessmentProgress } from '@data/avaliacao'
import { profileAssessments } from '@data/cliente'
import { PhArrowRight, PhCheckCircle } from '@phosphor-icons/vue'
import { RouterLink } from 'vue-router'

defineEmits<{ restart: [] }>()

const currentAssessment = profileAssessments[0]

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatLongDate(isoDate: string) {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`))
}
</script>

<template>
  <section class="px-6 py-10 max-sm:flex max-sm:flex-1 max-sm:flex-col max-sm:justify-center max-sm:px-5 max-sm:py-8">
    <div class="mx-auto flex max-w-[720px] flex-col gap-6">
      <p class="text-table-row text-muted-foreground-faint flex items-center gap-2">
        <PhCheckCircle class="text-success size-4" aria-hidden="true" />
        Avaliação concluída em {{ formatLongDate(currentAssessment.date) }} ·
        {{ assessmentProgress.totalSteps }} de {{ assessmentProgress.totalSteps }} respostas
      </p>

      <div class="flex flex-col gap-2">
        <p class="text-eyebrow text-muted-foreground-faint">
          Resultado
        </p>

        <h1 class="text-page-title">
          <span class="text-foreground">Seu perfil é </span>
          <span class="text-success max-sm:block">{{ currentAssessment.profileLabel.toLowerCase() }}</span>
        </h1>

        <p class="text-paragraph text-muted-foreground">
          Pontuação {{ currentAssessment.score }} de 100. A faixa moderada vai de 26 a 50 pontos.
          A carteira abaixo é a recomendada para esse perfil na competência de agosto de 2026.
        </p>
      </div>

      <div
        class="bg-muted border-border-strong flex items-center gap-3.5 rounded-md border p-4 max-sm:flex-col max-sm:items-start max-sm:gap-3"
      >
        <ProfileGauge :level="currentAssessment.profileLevel" tone="success" />

        <p class="text-tag text-success">
          {{ currentAssessment.profileLabel }}
        </p>

        <p class="text-table-row text-muted-foreground">
          Tolera oscilação moderada em troca de retorno acima da inflação.
        </p>
      </div>

      <LegalNotice />

      <div class="flex items-center gap-2.5 max-sm:flex-col max-sm:items-stretch max-sm:gap-3">
        <Button as-child size="lg" class="rounded-sm max-sm:w-full">
          <RouterLink to="/">
            Ir para o painel
            <PhArrowRight class="size-4" aria-hidden="true" />
          </RouterLink>
        </Button>

        <Button
          variant="outline"
          size="lg"
          class="rounded-sm max-sm:w-full"
          @click="$emit('restart')"
        >
          Refazer avaliação
        </Button>
      </div>
    </div>
  </section>
</template>
