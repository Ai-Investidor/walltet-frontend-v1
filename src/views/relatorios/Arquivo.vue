<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { PhDownloadSimple, PhFileText } from '@phosphor-icons/vue'
import * as relatoriosService from '@services/relatorios'
import type { MeuRelatorioResponseDto } from '@services/types'
import { formatCompetenciaLonga } from '@utils/competencia'
import { formatBytes, formatDataCurta } from '@utils/format'
import type { HTMLAttributes } from 'vue'
import { computed, onMounted, ref } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const relatorios = ref<MeuRelatorioResponseDto[]>([])
const carregando = ref(true)
const erro = ref('')
const baixandoId = ref<string | null>(null)

onMounted(async () => {
  try {
    // Acervo cabe numa página razoável (relatório é mensal — no máximo 1 por mês vinculado).
    const pagina = await relatoriosService.meusRelatorios({ pageSize: 100 })
    relatorios.value = pagina.items
  } catch {
    erro.value = 'Não foi possível carregar seus relatórios agora.'
  } finally {
    carregando.value = false
  }
})

// Agrupamento por ano é derivado de `mesReferencia` ("YYYY-MM") — o backend devolve uma lista
// paginada só, sem agrupamento (docs/AUDITORIA-INTEGRACAO.md).
const arquivoPorAno = computed(() => {
  const grupos = new Map<string, MeuRelatorioResponseDto[]>()

  for (const relatorio of relatorios.value) {
    const ano = relatorio.mesReferencia.slice(0, 4)
    const lista = grupos.get(ano) ?? []
    lista.push(relatorio)
    grupos.set(ano, lista)
  }

  return Array.from(grupos.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([year, reports]) => ({ year, reports }))
})

function formatReportCount(total: number) {
  return `${total} relatório${total === 1 ? '' : 's'}`
}

async function baixar(relatorio: MeuRelatorioResponseDto) {
  baixandoId.value = relatorio.id
  try {
    await relatoriosService.baixar(relatorio.id, `${relatorio.titulo}.pdf`)
  } finally {
    baixandoId.value = null
  }
}
</script>

<template>
  <section :class="cn('flex flex-col gap-8 max-sm:gap-5', props.class)" aria-label="Arquivo de relatórios">
    <p v-if="carregando" class="text-paragraph text-muted-foreground">
      Carregando relatórios…
    </p>

    <p v-else-if="erro" role="alert" class="text-paragraph text-destructive">
      {{ erro }}
    </p>

    <p v-else-if="relatorios.length === 0" class="text-paragraph text-muted-foreground">
      Nenhum relatório disponível ainda.
    </p>

    <div v-for="group in arquivoPorAno" v-else :key="group.year" class="flex flex-col gap-4">
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
            :key="report.id"
            class="text-foreground border-border flex items-center gap-3.5 px-4 py-3.5 not-last:border-b max-md:flex-col max-md:items-start max-md:gap-2.5"
          >
            <div class="flex min-w-0 flex-1 items-center gap-3 max-md:w-full">
              <PhFileText class="size-4.5 shrink-0" aria-hidden="true" />

              <div class="min-w-0">
                <p class="text-paragraph-strong truncate">
                  {{ report.titulo }}
                </p>
                <p class="text-label text-muted-foreground-faint">
                  {{ formatCompetenciaLonga(report.mesReferencia) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-3.5 max-md:w-full max-md:justify-between max-md:gap-3">
              <p class="text-label text-muted-foreground-faint w-55 shrink-0 max-lg:w-auto">
                Gerado em {{ formatDataCurta(report.geradoEm) }} · {{ formatBytes(report.tamanhoBytes) }}
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                :disabled="baixandoId === report.id"
                class="text-button-xs shrink-0 gap-1.5 rounded-sm px-3"
                :aria-label="`Baixar ${report.titulo}`"
                @click="baixar(report)"
              >
                <PhDownloadSimple aria-hidden="true" />
                {{ baixandoId === report.id ? 'Baixando…' : 'Baixar' }}
              </Button>
            </div>
          </li>
        </ul>
      </Card>
    </div>
  </section>
</template>
