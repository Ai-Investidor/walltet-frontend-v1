<script setup lang="ts">
import { LegalNotice } from '@components/shared/legal-notice'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@components/ui/collapsible'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { AssetRow } from '@components/wallet/asset-row'
import type { AllocationClass, Asset } from '@data/wallet'
import { allocation, assets, revisionNote } from '@data/wallet'
import {
  PhArrowDownRight,
  PhArrowRight,
  PhArrowUpRight,
  PhCaretDown,
  PhCaretUp,
  PhDownloadSimple,
  PhMinus,
} from '@phosphor-icons/vue'
import type { Component, HTMLAttributes } from 'vue'
import { defineAsyncComponent, ref } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const Movimentacoes = defineAsyncComponent(() => import('@views/carteira/Movimentacoes.vue'))
const Performance = defineAsyncComponent(() => import('@views/carteira/Performance.vue'))

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

/** Abas do design: sublinhado no item ativo, no lugar do fundo pill padrão do kit. */
const TAB_LIST =
  'w-full justify-start gap-10 rounded-none border-b border-border bg-transparent p-0 group-data-horizontal/tabs:h-auto max-md:gap-6'

const TAB_TRIGGER =
  'text-nav-item -mb-px h-auto flex-none rounded-none border-0 border-b-2 border-transparent px-0 pb-4 text-muted-foreground-faint data-active:text-card-title data-active:border-b-success data-active:bg-transparent dark:text-muted-foreground-faint dark:data-active:border-b-success dark:data-active:bg-transparent'

/** Cabeçalho, linhas de ativo e total compartilham a mesma grade de colunas. */
const COMPOSITION_GRID =
  'grid grid-cols-[2.125rem_1fr_10rem_5.5rem] items-center gap-3.5 px-3.5 max-lg:grid-cols-[2.125rem_1fr_auto_auto]'

const COMPOSITION_HEADER = cn(COMPOSITION_GRID, 'border-border border-y py-2.5')
const COMPOSITION_ITEM = cn(COMPOSITION_GRID, 'border-border not-last:border-b py-3')
const COMPOSITION_TOTAL = cn(COMPOSITION_GRID, 'border-border-strong border-t bg-muted py-3')

const ALLOCATION_TONE: Record<AllocationClass['tone'], string> = {
  'data-1': 'bg-data-1',
  'data-2': 'bg-data-2',
  'data-3': 'bg-data-3',
}

// Glifos de status conforme o design: entrada é seta para dentro (↘) e saída
// é seta para fora (↗) — não seguem a direção literal de alta/baixa.
const ASSET_STATUS: Record<
  Asset['trend'],
  { icon: Component; tone: 'text-success' | 'text-warning' | 'text-muted-foreground' }
> = {
  up: { icon: PhArrowDownRight, tone: 'text-success' },
  down: { icon: PhArrowUpRight, tone: 'text-warning' },
  flat: { icon: PhMinus, tone: 'text-muted-foreground' },
}

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatPercent(value: number) {
  return `${percentFormatter.format(value)} %`
}

const selectedAllocation = ref<string | null>(null)

function highlightAllocation(label: string | null) {
  selectedAllocation.value = label
}

const totalWeightPercent = assets.reduce((total, asset) => total + asset.weightPercent, 0)
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
              Carteira Moderada Estratégica
            </h2>

            <p class="text-eyebrow flex items-center gap-1.5 text-success">
              <span class="size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
              <span class="max-sm:hidden">Agosto 2026</span>
              <span class="hidden max-sm:inline">AGO 2026</span>
            </p>
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
                :class="selectedAllocation === item.label ? 'bg-success' : ALLOCATION_TONE[item.tone]"
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
            <div :class="COMPOSITION_HEADER" class="max-sm:hidden">
              <h3 class="text-eyebrow col-span-2 text-muted-foreground-faint">
                Composição · {{ assets.length }} ativos
              </h3>
              <span class="text-eyebrow text-muted-foreground-faint">Movimentação</span>
              <span class="text-eyebrow text-right text-muted-foreground-faint">Peso</span>
            </div>

            <ul class="max-sm:hidden">
              <li v-for="asset in assets" :key="asset.code" :class="COMPOSITION_ITEM">
                <span
                  class="text-eyebrow flex h-7.5 w-8.5 items-center justify-center rounded-md border border-border text-muted-foreground"
                  aria-hidden="true"
                >
                  {{ asset.code }}
                </span>

                <div class="min-w-0">
                  <p class="text-paragraph truncate">
                    {{ asset.name }}
                  </p>
                  <p class="text-label truncate text-muted-foreground">
                    {{ asset.className }}
                  </p>
                </div>

                <p class="flex items-center gap-1.5" :class="ASSET_STATUS[asset.trend].tone">
                  <component :is="ASSET_STATUS[asset.trend].icon" class="size-3.5 shrink-0" aria-hidden="true" />
                  <span class="text-eyebrow">{{ asset.trendLabel }}</span>
                </p>

                <span class="text-card-title text-right tabular-nums">
                  {{ formatPercent(asset.weightPercent) }}
                </span>
              </li>
            </ul>

            <p :class="COMPOSITION_TOTAL" class="max-sm:hidden">
              <span class="text-eyebrow col-span-3 text-muted-foreground-faint">Total</span>
              <span class="text-card-title text-right tabular-nums">
                {{ formatPercent(totalWeightPercent) }}
              </span>
            </p>

            <h3 class="text-eyebrow hidden border-y border-border px-3.5 py-2.5 text-muted-foreground-faint max-sm:block">
              Composição · {{ assets.length }} ativos
            </h3>

            <ul class="hidden max-sm:block">
              <AssetRow
                v-for="asset in assets"
                :key="asset.code"
                :code="asset.code"
                :name="asset.name"
                :detail="asset.className"
                :icon="ASSET_STATUS[asset.trend].icon"
                :tone="ASSET_STATUS[asset.trend].tone"
                :label="asset.trendLabel"
                :value="formatPercent(asset.weightPercent)"
              />
            </ul>

            <div class="border-border-strong bg-muted hidden items-center justify-between border-t px-3.5 py-3 max-sm:flex">
              <span class="text-eyebrow text-muted-foreground-faint">Total</span>
              <span class="text-card-title tabular-nums">
                {{ formatPercent(totalWeightPercent) }}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card :class="CARD_SURFACE">
          <Collapsible default-open>
            <CollapsibleTrigger class="group/justificativa flex w-full items-center justify-between gap-3 p-3.5 text-left">
              <h2 class="text-card-title">
                {{ revisionNote.title }}
              </h2>
              <PhCaretUp
                class="hidden size-4 shrink-0 text-muted-foreground group-aria-expanded/justificativa:inline"
                aria-hidden="true"
              />
              <PhCaretDown
                class="size-4 shrink-0 text-muted-foreground group-aria-expanded/justificativa:hidden"
                aria-hidden="true"
              />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <p class="text-paragraph px-3.5 pb-3.5">
                {{ revisionNote.body }}
              </p>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        <LegalNotice class="w-3/4 max-lg:w-full" />

        <div class="flex flex-wrap items-center gap-4 max-sm:flex-col max-sm:items-stretch max-sm:gap-2.5">
          <Button type="button" size="lg" class="text-button-sm h-10 justify-center gap-2.5 rounded-sm px-6 max-sm:w-full">
            <PhDownloadSimple class="size-4" aria-hidden="true" />
            Baixar relatório do mês
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            class="text-button-sm hover:border-border-strong h-10 justify-center gap-2.5 rounded-sm px-6 max-sm:w-full"
          >
            Ver movimentações
            <PhArrowRight class="size-4" aria-hidden="true" />
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="movimentacoes">
        <Movimentacoes />
      </TabsContent>

      <TabsContent value="performance">
        <Performance />
      </TabsContent>
    </Tabs>
  </section>
</template>
