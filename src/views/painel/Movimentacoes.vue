<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card'
import {
  PhArrowDown,
  PhArrowDownRight,
  PhArrowsLeftRight,
  PhArrowUp,
  PhArrowUpRight,
  PhDownloadSimple,
  PhFileText,
} from '@phosphor-icons/vue'
import * as relatoriosService from '@services/relatorios'
import type { MeuRelatorioResponseDto, MovimentacoesResponseDto } from '@services/types'
import { formatBytes, formatDataCurta } from '@utils/format'
import type { Component, HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { cn } from '@/libs/utils'

interface Props {
  movimentacoes: MovimentacoesResponseDto | null
  ultimoRelatorio: MeuRelatorioResponseDto | null
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

type Direcao = 'in' | 'out' | 'increase' | 'decrease'

const DIRECTIONS: Record<Direcao, { icon: Component; tone: string; label: string }> = {
  in: { icon: PhArrowDownRight, tone: 'text-success', label: 'Entrou' },
  out: { icon: PhArrowUpRight, tone: 'text-warning', label: 'Saiu' },
  increase: { icon: PhArrowUp, tone: 'text-success', label: 'Aumentou' },
  decrease: { icon: PhArrowDown, tone: 'text-warning', label: 'Reduziu' },
}

// Achata as 4 listas de `MovimentacoesResponseDto` numa lista só de "o que mudou" — o resumo
// rápido do Painel. O detalhe completo (com pesos) fica em /carteira → aba Movimentações.
const movimentos = computed(() => {
  const mov = props.movimentacoes?.movimentacoes

  if (!mov) {
    return []
  }

  return [
    ...mov.entradas.map((item) => ({
      id: `in-${item.ticker}`,
      name: item.ticker,
      direction: 'in' as const,
    })),
    ...mov.saidas.map((item) => ({
      id: `out-${item.ticker}`,
      name: item.ticker,
      direction: 'out' as const,
    })),
    ...mov.alteracoes.map((item) => ({
      id: `alt-${item.ticker}`,
      name: item.ticker,
      direction: item.tipo === 'AUMENTOU' ? ('increase' as const) : ('decrease' as const),
    })),
  ]
})

const baixando = ref(false)

async function baixarUltimoRelatorio() {
  if (!props.ultimoRelatorio) {
    return
  }

  baixando.value = true
  try {
    await relatoriosService.baixar(props.ultimoRelatorio.id, `${props.ultimoRelatorio.titulo}.pdf`)
  } finally {
    baixando.value = false
  }
}
</script>

<template>
  <section :class="cn('flex flex-col gap-6', props.class)">
    <Card :class="CARD_SURFACE">
      <CardHeader class="flex items-center justify-between gap-3 px-4 py-3.5">
        <h2 class="text-card-title">
          Movimentações do mês
        </h2>
        <PhArrowsLeftRight class="text-muted-foreground size-4.5" aria-hidden="true" />
      </CardHeader>

      <CardContent class="px-0">
        <p v-if="movimentos.length === 0" class="text-label text-muted-foreground-faint px-4 py-3">
          Nenhuma movimentação nesta competência.
        </p>

        <ul v-else>
          <li
            v-for="movement in movimentos"
            :key="movement.id"
            class="flex items-center justify-between gap-3 border-t px-4 py-3"
          >
            <span class="text-paragraph">{{ movement.name }}</span>

            <span :class="cn('text-eyebrow flex items-center gap-1.5', DIRECTIONS[movement.direction].tone)">
              <component
                :is="DIRECTIONS[movement.direction].icon"
                class="size-3.5"
                weight="bold"
                aria-hidden="true"
              />
              {{ DIRECTIONS[movement.direction].label }}
            </span>
          </li>
        </ul>
      </CardContent>

      <CardFooter class="p-0">
        <Button
          as-child
          variant="ghost"
          class="text-button-sm text-success hover:text-success h-auto w-full justify-start rounded-none px-4 py-3"
        >
          <RouterLink to="/carteira">
            Ver detalhes
          </RouterLink>
        </Button>
      </CardFooter>
    </Card>

    <Card v-if="ultimoRelatorio" :class="CARD_SURFACE">
      <CardContent class="flex flex-col items-start gap-4 p-4">
        <h2 class="text-eyebrow text-muted-foreground-faint">
          Último relatório
        </h2>

        <div class="flex items-start gap-3">
          <PhFileText class="size-6 shrink-0" aria-hidden="true" />

          <div class="flex flex-col gap-0.5">
            <p class="text-card-title">
              {{ ultimoRelatorio.titulo }}
            </p>
            <p class="text-caption-sm text-muted-foreground">
              Gerado em {{ formatDataCurta(ultimoRelatorio.geradoEm) }} · {{ formatBytes(ultimoRelatorio.tamanhoBytes) }}
            </p>
          </div>
        </div>

        <Button size="lg" :disabled="baixando" class="h-11 gap-2.5 rounded-md px-5" @click="baixarUltimoRelatorio">
          <PhDownloadSimple class="size-5" weight="bold" aria-hidden="true" />
          {{ baixando ? 'Baixando…' : 'Baixar PDF' }}
        </Button>
      </CardContent>
    </Card>
  </section>
</template>
