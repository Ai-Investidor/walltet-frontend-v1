<script setup lang="ts">
import { LegalNotice } from '@components/shared/legal-notice'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { MOVIMENTACAO_PRESENTATION } from '@constants/movimentacao'
import { PhDownloadSimple } from '@phosphor-icons/vue'
import * as carteirasService from '@services/carteiras'
import * as relatoriosService from '@services/relatorios'
import type {
  CarteiraDetalheDto,
  MeuRelatorioResponseDto,
  MovimentacoesResponseDto,
} from '@services/types'
import { agruparPorClasse, TONS_ALOCACAO } from '@utils/alocacao'
import { formatPercent } from '@utils/format'
import { rotuloMovimentacao, statusParaMovimentacao } from '@utils/movimentacao'
import type { HTMLAttributes } from 'vue'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { cn } from '@/libs/utils'

interface Props {
  carteira: CarteiraDetalheDto
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const Movimentacoes = defineAsyncComponent(() => import('@views/carteira/Movimentacoes.vue'))
const Performance = defineAsyncComponent(() => import('@views/carteira/Performance.vue'))

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const TAB_LIST =
  'w-full justify-start gap-10 rounded-none border-b border-border bg-transparent p-0 group-data-horizontal/tabs:h-auto max-md:gap-6'

const TAB_TRIGGER =
  'text-nav-item -mb-px h-auto flex-none rounded-none border-0 border-b-2 border-transparent px-0 pb-4 text-muted-foreground-faint data-active:text-card-title data-active:border-b-success data-active:bg-transparent dark:text-muted-foreground-faint dark:data-active:border-b-success dark:data-active:bg-transparent'

const COMPOSITION_GRID =
  'grid grid-cols-[2.125rem_1fr_10rem_5.5rem] items-center gap-3.5 px-3.5 max-lg:grid-cols-[2.125rem_1fr_auto_auto]'

const COMPOSITION_HEADER = cn(COMPOSITION_GRID, 'border-border border-y py-2.5')
const COMPOSITION_ITEM = cn(COMPOSITION_GRID, 'border-border not-last:border-b py-3')
const COMPOSITION_TOTAL = cn(COMPOSITION_GRID, 'border-border-strong border-t bg-muted py-3')

const itens = computed(() => props.carteira.versaoAtual?.itens ?? [])
const totalWeightPercent = computed(() =>
  itens.value.reduce((total, item) => total + item.pesoPercentual, 0),
)

const selectedAllocation = ref<string | null>(null)
function highlightAllocation(label: string | null) {
  selectedAllocation.value = label
}

const allocation = computed(() =>
  agruparPorClasse(itens.value).map((fatia, index) => ({
    ...fatia,
    tone: TONS_ALOCACAO[index % TONS_ALOCACAO.length],
  })),
)

const movimentacoes = ref<MovimentacoesResponseDto | null>(null)
const ultimoRelatorio = ref<MeuRelatorioResponseDto | null>(null)
const baixando = ref(false)

onMounted(async () => {
  const [mov, relatorios] = await Promise.all([
    carteirasService.movimentacoes(props.carteira.id),
    relatoriosService.meusRelatorios({ pageSize: 1 }),
  ])
  movimentacoes.value = mov
  ultimoRelatorio.value = relatorios.items[0] ?? null
})

// Não existe um campo único de "justificativa da revisão" no backend — cada entrada/saída pode
// trazer a própria `justificativa` (docs/AUDITORIA-INTEGRACAO.md, achado admin.ts §4.7). A lista
// abaixo junta as que vieram preenchidas nesta competência, no lugar do parágrafo único do design.
const justificativas = computed(() => {
  const mov = movimentacoes.value?.movimentacoes
  if (!mov) return []

  return [
    ...mov.entradas
      .filter((item) => item.justificativa)
      .map((item) => ({ ticker: item.ticker, texto: item.justificativa as string })),
    ...mov.saidas
      .filter((item) => item.justificativa)
      .map((item) => ({ ticker: item.ticker, texto: item.justificativa as string })),
  ]
})

async function baixarUltimoRelatorio() {
  if (!ultimoRelatorio.value) return
  baixando.value = true
  try {
    await relatoriosService.baixar(ultimoRelatorio.value.id, `${ultimoRelatorio.value.titulo}.pdf`)
  } finally {
    baixando.value = false
  }
}
</script>

<template>
  <section :class="cn(props.class)" aria-label="Carteira recomendada">
    <Tabs default-value="composicao" class="gap-6">
      <TabsList :class="TAB_LIST" aria-label="Seções da carteira">
        <TabsTrigger value="composicao" :class="TAB_TRIGGER">
          Composição
        </TabsTrigger>
        <TabsTrigger value="movimentacoes" :class="TAB_TRIGGER">
          Movimentações
        </TabsTrigger>
        <TabsTrigger value="performance" :class="TAB_TRIGGER">
          Performance
        </TabsTrigger>
      </TabsList>

      <TabsContent value="composicao" class="flex flex-col gap-9">
        <Card :class="CARD_SURFACE">
          <CardHeader class="flex items-center justify-between gap-3 p-3.5">
            <h2 class="text-card-title">
              {{ carteira.nome }}
            </h2>
          </CardHeader>

          <CardContent class="flex flex-col gap-2.5 border-t border-border-strong p-3.5">
            <h3 class="text-eyebrow text-muted-foreground-faint">
              Alocação por classe
            </h3>

            <div class="flex h-2.5 overflow-hidden rounded-sm">
              <button
                v-for="item in allocation"
                :key="item.label"
                type="button"
                class="h-full transition-colors"
                :class="selectedAllocation === item.label ? 'bg-success' : item.tone"
                :style="{ width: `${item.percent}%` }"
                :aria-label="`${item.label} ${formatPercent(item.percent)}`"
                @mouseenter="highlightAllocation(item.label)"
                @mouseleave="highlightAllocation(null)"
                @focus="highlightAllocation(item.label)"
                @blur="highlightAllocation(null)"
              />
            </div>

            <ul class="flex flex-wrap gap-x-4 gap-y-1">
              <li
                v-for="item in allocation"
                :key="item.label"
                class="text-label"
                :class="selectedAllocation === item.label ? 'text-success' : 'text-muted-foreground'"
              >
                {{ item.label }} {{ formatPercent(item.percent) }}
              </li>
            </ul>
          </CardContent>

          <CardContent class="p-0">
            <div :class="COMPOSITION_HEADER">
              <h3 class="text-eyebrow col-span-2 text-muted-foreground-faint">
                Composição · {{ itens.length }} ativos
              </h3>
              <span class="text-eyebrow text-muted-foreground-faint">Movimentação</span>
              <span class="text-eyebrow text-right text-muted-foreground-faint">Peso</span>
            </div>

            <ul>
              <li v-for="item in itens" :key="item.id" :class="COMPOSITION_ITEM">
                <span
                  class="text-eyebrow flex h-7.5 w-8.5 items-center justify-center rounded-md border border-border text-muted-foreground"
                  aria-hidden="true"
                >
                  {{ item.tickerCodigo.slice(0, 2).toUpperCase() }}
                </span>

                <div class="min-w-0">
                  <p class="text-paragraph truncate">
                    {{ item.nomeAtivo }}
                  </p>
                  <p class="text-label truncate text-muted-foreground">
                    {{ item.classeAtivo ?? '—' }}
                  </p>
                </div>

                <p
                  class="flex items-center gap-1.5"
                  :class="MOVIMENTACAO_PRESENTATION[statusParaMovimentacao(item.statusMovimentacao)].tone"
                >
                  <component
                    :is="MOVIMENTACAO_PRESENTATION[statusParaMovimentacao(item.statusMovimentacao)].icon"
                    class="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span class="text-eyebrow">
                    {{ rotuloMovimentacao(statusParaMovimentacao(item.statusMovimentacao)) }}
                  </span>
                </p>

                <span class="text-card-title text-right tabular-nums">
                  {{ formatPercent(item.pesoPercentual) }}
                </span>
              </li>
            </ul>

            <p :class="COMPOSITION_TOTAL">
              <span class="text-eyebrow col-span-3 text-muted-foreground-faint">Total</span>
              <span class="text-card-title text-right tabular-nums">
                {{ formatPercent(totalWeightPercent) }}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card v-if="justificativas.length > 0" :class="CARD_SURFACE">
          <CardHeader class="p-3.5">
            <h2 class="text-card-title">
              Justificativas desta competência
            </h2>
          </CardHeader>
          <CardContent class="flex flex-col gap-3 border-t border-border-strong p-3.5">
            <p v-for="item in justificativas" :key="item.ticker" class="text-paragraph">
              <span class="text-paragraph-strong">{{ item.ticker }}:</span> {{ item.texto }}
            </p>
          </CardContent>
        </Card>

        <LegalNotice class="w-3/4 max-lg:w-full" />

        <div v-if="ultimoRelatorio" class="flex flex-wrap items-center gap-4">
          <Button type="button" size="lg" :disabled="baixando" class="text-button-sm h-10 gap-2.5 rounded-sm px-6" @click="baixarUltimoRelatorio">
            <PhDownloadSimple class="size-4" aria-hidden="true" />
            {{ baixando ? 'Baixando…' : 'Baixar relatório do mês' }}
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="movimentacoes">
        <Movimentacoes :movimentacoes="movimentacoes" />
      </TabsContent>

      <TabsContent value="performance">
        <Performance :carteira-id="carteira.id" />
      </TabsContent>
    </Tabs>
  </section>
</template>
