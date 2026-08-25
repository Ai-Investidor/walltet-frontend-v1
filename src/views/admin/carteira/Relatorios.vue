<script setup lang="ts">
import { StatusBadge } from '@components/admin/status-badge'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { walletReports } from '@data/admin'
import { PhDownloadSimple, PhFileArrowDown, PhFileText } from '@phosphor-icons/vue'
import { toast } from 'vue-sonner'

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const ROW_ACTION = 'text-button-xs gap-2 rounded-sm px-3.5'
</script>

<template>
  <Card :class="CARD_SURFACE">
    <div class="flex items-center justify-between gap-3 border-b border-border px-4.5 py-3.5">
      <h2 id="relatorios-competencia" class="text-card-title">
        Relatórios por competência
      </h2>

      <PhFileText class="size-4 text-muted-foreground" aria-hidden="true" />
    </div>

    <ul aria-labelledby="relatorios-competencia">
      <li
        v-for="report in walletReports"
        :key="report.competence"
        class="border-border flex items-center gap-3.5 px-4.5 py-3 not-last:border-b"
        :class="report.generatedAt ? '' : 'bg-muted'"
      >
        <p class="text-paragraph-strong flex-1">
          {{ report.competence }}
        </p>

        <div class="w-47.5 shrink-0">
          <p v-if="!report.generatedAt" class="text-label text-muted-foreground-faint">
            Nenhum relatório gerado
          </p>

          <p v-else class="flex items-center gap-2">
            <StatusBadge tone="success">
              Publicado
            </StatusBadge>
            <span class="text-label text-muted-foreground-faint">
              {{ report.generatedAt }} · {{ report.sizeLabel }}
            </span>
          </p>
        </div>

        <div class="flex w-37.5 shrink-0 justify-end">
          <Button
            v-if="!report.generatedAt"
            type="button"
            size="sm"
            :class="ROW_ACTION"
            @click="toast.success(`Relatório de ${report.competence} em geração`)"
          >
            <PhFileArrowDown aria-hidden="true" />
            Gerar relatório
          </Button>

          <Button
            v-else
            type="button"
            variant="outline"
            size="sm"
            :class="[ROW_ACTION, 'border-foreground']"
            :aria-label="`Baixar o relatório de ${report.competence}`"
          >
            <PhDownloadSimple aria-hidden="true" />
            Baixar
          </Button>
        </div>
      </li>
    </ul>
  </Card>
</template>
