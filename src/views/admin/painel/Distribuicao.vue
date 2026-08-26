<script setup lang="ts">
import { Card } from '@components/ui/card'
import type { AdminDashboardResponseDto } from '@services/types'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/libs/utils'

interface Props {
  dashboard: AdminDashboardResponseDto
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const TONE_FILL = ['bg-data-1', 'bg-data-2', 'bg-data-3', 'bg-data-4', 'bg-muted-foreground-faint']

const itens = computed(() => {
  const d = props.dashboard.distribuicaoPerfis
  return [
    { label: 'Conservador', count: d.CONSERVADOR },
    { label: 'Moderado', count: d.MODERADO },
    { label: 'Arrojado', count: d.ARROJADO },
    { label: 'Sofisticado', count: d.SOFISTICADO },
    { label: 'Sem avaliação', count: d.SEM_AVALIACAO },
  ]
})

// A barra é proporcional ao maior perfil, não ao total: o perfil mais numeroso ocupa a faixa
// inteira e os demais ficam legíveis em comparação com ele.
const largestCount = computed(() => Math.max(...itens.value.map((item) => item.count), 1))
const totalCount = computed(() => itens.value.reduce((total, item) => total + item.count, 0))
</script>

<template>
  <Card :class="cn(CARD_SURFACE, props.class)">
    <div class="border-b border-border px-4.5 py-3.5">
      <h2 id="distribuicao-perfil" class="text-card-title">
        Distribuição por perfil
      </h2>
    </div>

    <div class="flex flex-col gap-3.5 p-4.5">
      <ul class="flex flex-col gap-3.5" aria-labelledby="distribuicao-perfil">
        <li v-for="(item, index) in itens" :key="item.label" class="flex flex-col gap-1.5">
          <div class="flex items-end justify-between gap-3">
            <span class="text-label text-muted-foreground">{{ item.label }}</span>
            <span class="text-table-value tabular-nums">{{ item.count }}</span>
          </div>

          <div class="h-2.5 overflow-hidden bg-muted">
            <span
              class="block h-full"
              :class="TONE_FILL[index]"
              :style="{ width: `${(item.count / largestCount) * 100}%` }"
            />
          </div>
        </li>
      </ul>

      <p class="text-label text-muted-foreground-faint">
        {{ totalCount }} investidores no total.
      </p>
    </div>
  </Card>
</template>
