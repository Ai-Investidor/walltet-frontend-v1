<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { reportArchive } from '@data/wallet'
import { PhDownloadSimple, PhFileText } from '@phosphor-icons/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

/** Contagem do divisor é derivada da lista, não é campo de dado. */
function formatReportCount(total: number) {
  return `${total} relatório${total === 1 ? '' : 's'}`
}
</script>

<template>
  <section :class="cn('flex flex-col gap-8', props.class)" aria-label="Arquivo de relatórios">
    <div v-for="group in reportArchive" :key="group.year" class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <h2 :id="`arquivo-ano-${group.year}`" class="text-eyebrow text-muted-foreground-faint">
          {{ group.year }}
        </h2>

        <span class="bg-border h-px flex-1" aria-hidden="true" />

        <p class="text-label text-muted-foreground-faint">
          {{ formatReportCount(group.reports.length) }}
        </p>
      </div>

      <Card :class="CARD_SURFACE">
        <ul :aria-labelledby="`arquivo-ano-${group.year}`">
          <li
            v-for="report in group.reports"
            :key="report.title"
            class="text-foreground border-border flex items-center gap-3.5 px-4 py-3.5 not-last:border-b max-md:flex-col max-md:items-start max-md:gap-2.5"
          >
            <div class="flex min-w-0 flex-1 items-center gap-3 max-md:w-full">
              <PhFileText class="size-4.5 shrink-0" aria-hidden="true" />

              <p class="text-paragraph-strong">
                {{ report.title }}
              </p>
            </div>

            <p class="text-label text-muted-foreground-faint w-55 shrink-0 max-lg:w-auto">
              Gerado em {{ report.generatedAt }} · {{ report.sizeLabel }}
            </p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              class="text-button-xs shrink-0 gap-1.5 rounded-sm px-3"
              :aria-label="`Baixar ${report.title}`"
            >
              <PhDownloadSimple aria-hidden="true" />
              Baixar
            </Button>
          </li>
        </ul>
      </Card>
    </div>
  </section>
</template>
