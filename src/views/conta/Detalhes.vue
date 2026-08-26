<script setup lang="ts">
import { ProfileGauge } from '@components/shared/profile-gauge'
import { Button } from '@components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { clientAccount, profileAssessments } from '@data/cliente'
import { cn } from '@/libs/utils'

const CARD_CLASS = 'bg-card flex flex-col rounded-lg border border-border'
const CARD_HEADER_CLASS = 'text-card-title border-b border-border px-4.5 py-3'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`))
}

const accountFields: Array<{ label: string; labelMobile?: string; value: string }> = [
  { label: 'Nome', value: clientAccount.name },
  { label: 'E-mail', value: clientAccount.email },
  { label: 'Cliente desde', value: formatDate(clientAccount.clientSince) },
  { label: 'Carteira vinculada', labelMobile: 'Carteira', value: clientAccount.linkedWalletName },
]

/** A avaliação mais recente é a posição 0 do histórico — não há registro "atual" separado. */
const currentAssessment = profileAssessments[0]

const gaugeLabel = `Perfil ${currentAssessment.profileLabel.toLocaleLowerCase('pt-BR')}, nível ${currentAssessment.profileLevel} de 4`

const HISTORY_COLUMNS = [
  { label: 'Data', align: 'text-left' },
  { label: 'Pontos', align: 'text-right' },
  { label: 'Perfil', align: 'text-right' },
]
</script>

<template>
  <div class="grid grid-cols-[1.35fr_1fr] items-start gap-6 max-md:grid-cols-1 max-sm:gap-5">
    <section :class="CARD_CLASS" aria-labelledby="conta-dados-titulo">
      <h2 id="conta-dados-titulo" :class="CARD_HEADER_CLASS">
        Dados
      </h2>

      <dl>
        <div
          v-for="field in accountFields"
          :key="field.label"
          class="flex items-center justify-between gap-4 border-b border-border px-4.5 py-3 max-sm:flex-col max-sm:items-start max-sm:gap-1 max-sm:px-3.5 max-sm:py-2.5"
        >
          <dt class="text-eyebrow text-muted-foreground">
            <span v-if="field.labelMobile" class="max-sm:hidden">{{ field.label }}</span>
            <span v-if="field.labelMobile" class="hidden max-sm:inline">{{ field.labelMobile }}</span>
            <template v-if="!field.labelMobile">{{ field.label }}</template>
          </dt>
          <dd class="text-table-row text-right max-sm:text-left">
            {{ field.value }}
          </dd>
        </div>
      </dl>

      <p class="text-label px-4.5 py-3 text-muted-foreground max-sm:px-3.5 max-sm:py-2.5">
        Para alterar nome ou e-mail, escreva para suporte@aiinvest.com.br.
      </p>
    </section>

    <section :class="CARD_CLASS" aria-labelledby="conta-perfil-titulo">
      <h2 id="conta-perfil-titulo" :class="CARD_HEADER_CLASS">
        Perfil de investidor
      </h2>

      <div class="flex flex-col items-start gap-4 border-b border-border p-4.5 max-sm:gap-2.5 max-sm:p-3.5">
        <div class="flex items-center gap-2.5">
          <ProfileGauge
            :level="currentAssessment.profileLevel"
            tone="success"
            :label="gaugeLabel"
          />

          <p class="text-tag text-success">
            {{ currentAssessment.profileLabel }}
          </p>
        </div>

        <p class="text-table-row text-muted-foreground">
          Avaliação de {{ formatDate(currentAssessment.date) }} · {{ currentAssessment.score }} pontos
        </p>

        <Button
          type="button"
          variant="outline"
          disabled
          class="text-button-sm rounded-sm border-border-strong px-4"
        >
          Refazer avaliação
        </Button>
      </div>

      <h3 class="text-eyebrow border-b border-border px-4.5 py-2.5 text-muted-foreground max-sm:px-3.5 max-sm:py-2.5">
        Histórico de avaliações
      </h3>

      <ul class="hidden max-sm:block">
        <li
          v-for="(assessment, index) in profileAssessments"
          :key="assessment.date"
          class="border-border flex items-center gap-2.5 px-3.5 py-2.5 not-first:border-t"
        >
          <span class="text-table-row min-w-0 flex-1 truncate">
            {{ formatDate(assessment.date) }}
          </span>

          <span class="text-table-value shrink-0 tabular-nums">
            {{ assessment.score }}
          </span>

          <span
            class="text-tag-sm shrink-0"
            :class="index === 0 ? 'text-success' : 'text-muted-foreground'"
          >
            {{ assessment.profileLabel }}
          </span>
        </li>
      </ul>

      <Table class="max-sm:hidden">
        <TableCaption class="sr-only">
          Histórico de avaliações de perfil de investidor: data, pontuação e perfil resultante.
        </TableCaption>

        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead
              v-for="column in HISTORY_COLUMNS"
              :key="column.label"
              scope="col"
              :class="cn('px-4.5', column.align)"
            >
              <span class="text-eyebrow text-muted-foreground-faint">{{ column.label }}</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="(assessment, index) in profileAssessments" :key="assessment.date">
            <TableCell class="text-table-row px-4.5 py-3">
              {{ formatDate(assessment.date) }}
            </TableCell>

            <TableCell class="text-table-value px-4.5 py-3 text-right tabular-nums">
              {{ assessment.score }}
            </TableCell>

            <TableCell
              :class="cn(
                'text-tag-sm px-4.5 py-3 text-right',
                index === 0 ? 'text-success' : 'text-muted-foreground',
              )"
            >
              {{ assessment.profileLabel }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  </div>
</template>
