<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@components/ui/card'
import { AssetRow } from '@components/wallet/asset-row'
import { MOVIMENTACAO_PRESENTATION } from '@constants/movimentacao'
import { PhArrowRight } from '@phosphor-icons/vue'
import type { CarteiraDetalheDto } from '@services/types'
import { agruparPorClasse, TONS_ALOCACAO } from '@utils/alocacao'
import { formatCompetenciaLonga } from '@utils/competencia'
import { formatPercent } from '@utils/format'
import { rotuloMovimentacao, statusParaMovimentacao } from '@utils/movimentacao'
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { cn } from '@/libs/utils'

interface Props {
  carteira: CarteiraDetalheDto | null
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const emit = defineEmits<{ verCompleta: [] }>()

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const itens = computed(() => props.carteira?.versaoAtual?.itens ?? [])

const allocation = computed(() =>
  agruparPorClasse(itens.value).map((fatia, index) => ({
    ...fatia,
    tone: TONS_ALOCACAO[index % TONS_ALOCACAO.length],
  })),
)

const selectedAllocation = ref<string | null>(null)

function highlightAllocation(label: string | null) {
  selectedAllocation.value = label
}
</script>

<template>
  <section :class="cn(props.class)" aria-labelledby="carteira-titulo">
    <Card v-if="carteira?.versaoAtual" :class="CARD_SURFACE">
      <CardHeader class="flex items-center justify-between gap-3 p-3.5">
        <h2 id="carteira-titulo" class="text-card-title">
          {{ carteira.nome }}
        </h2>

        <p v-if="carteira.versaoAtual.publicada" class="text-eyebrow flex items-center gap-1.5 text-success">
          <span class="size-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
          {{ formatCompetenciaLonga(carteira.versaoAtual.mesReferencia) }}
        </p>
      </CardHeader>

      <CardContent class="flex flex-col gap-2.5 border-t border-border-strong p-3.5">
        <h3 class="text-eyebrow text-muted-foreground">
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
        <h3 class="text-eyebrow border-y border-border px-3.5 py-2.5 text-muted-foreground">
          Composição · {{ itens.length }} ativos
        </h3>

        <ul>
          <AssetRow
            v-for="item in itens"
            :key="item.id"
            :code="item.tickerCodigo.slice(0, 2).toUpperCase()"
            :name="item.nomeAtivo"
            :detail="item.classeAtivo ?? '—'"
            :icon="MOVIMENTACAO_PRESENTATION[statusParaMovimentacao(item.statusMovimentacao)].icon"
            :tone="MOVIMENTACAO_PRESENTATION[statusParaMovimentacao(item.statusMovimentacao)].tone"
            :label="rotuloMovimentacao(statusParaMovimentacao(item.statusMovimentacao))"
            :value="formatPercent(item.pesoPercentual)"
          />
        </ul>
      </CardContent>

      <CardFooter class="justify-end border-border-strong p-3.5">
        <Button
          variant="outline"
          size="lg"
          class="text-button-sm hover:border-border-strong h-10 gap-2.5 rounded-sm px-6"
          @click="emit('verCompleta')"
        >
          Ver carteira completa
          <PhArrowRight class="size-4" aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>

    <Card v-else :class="CARD_SURFACE">
      <CardContent class="p-5.5">
        <p class="text-paragraph text-muted-foreground">
          Você ainda não tem uma carteira recomendada vinculada. Complete a avaliação de perfil
          para receber uma.
        </p>
      </CardContent>
    </Card>
  </section>
</template>
