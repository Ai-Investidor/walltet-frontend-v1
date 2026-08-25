<script setup lang="ts">
import { Card } from '@components/ui/card'
import type { ProfileDistribution } from '@data/admin'
import { profileDistribution } from '@data/admin'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const TONE_FILL: Record<ProfileDistribution['tone'], string> = {
  'data-1': 'bg-data-1',
  'data-2': 'bg-data-2',
  'data-3': 'bg-data-3',
  'data-4': 'bg-data-4',
}

// A barra é proporcional ao maior perfil, não ao total: o perfil mais numeroso
// ocupa a faixa inteira e os demais ficam legíveis em comparação com ele.
const largestCount = computed(() =>
  profileDistribution.reduce((largest, item) => Math.max(largest, item.count), 0),
)

const totalCount = computed(() =>
  profileDistribution.reduce((total, item) => total + item.count, 0),
)
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
        <li v-for="item in profileDistribution" :key="item.label" class="flex flex-col gap-1.5">
          <div class="flex items-end justify-between gap-3">
            <span class="text-label text-muted-foreground">{{ item.label }}</span>
            <span class="text-table-value tabular-nums">{{ item.count }}</span>
          </div>

          <div class="h-2.5 overflow-hidden bg-muted">
            <span
              class="block h-full"
              :class="TONE_FILL[item.tone]"
              :style="{ width: `${(item.count / largestCount) * 100}%` }"
            />
          </div>
        </li>
      </ul>

      <p class="text-label text-muted-foreground-faint">
        {{ totalCount }} investidores com avaliação concluída.
      </p>
    </div>
  </Card>
</template>
