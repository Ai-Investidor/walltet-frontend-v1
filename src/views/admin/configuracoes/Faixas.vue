<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import type { SuitabilityRange } from '@data/admin'
import { suitabilityRanges } from '@data/admin'
import { PhCheckCircle, PhWarning } from '@phosphor-icons/vue'
import { computed } from 'vue'
import { toast } from 'vue-sonner'

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const SCALE_MIN = 0
const SCALE_MAX = 100

const TONE_FILL: Record<SuitabilityRange['tone'], string> = {
  'data-1': 'bg-data-1',
  'data-2': 'bg-data-2',
  'data-3': 'bg-data-3',
  'data-4': 'bg-data-4',
}

const sorted = computed(() => [...suitabilityRanges].sort((a, b) => a.min - b.min))

const scaleSize = computed(() => SCALE_MAX - SCALE_MIN + 1)

/** As faixas são válidas quando cobrem a escala inteira sem lacuna nem sobreposição. */
const isValid = computed(() => {
  const ranges = sorted.value

  if (ranges[0].min !== SCALE_MIN || ranges[ranges.length - 1].max !== SCALE_MAX) {
    return false
  }

  return ranges.every(
    (range, index) =>
      range.max >= range.min && (index === 0 || range.min === ranges[index - 1].max + 1),
  )
})
</script>

<template>
  <Card :class="CARD_SURFACE">
    <div class="flex flex-col gap-4 p-4.5">
      <div
        class="flex h-3.5 overflow-hidden rounded-sm"
        role="img"
        aria-label="Escala de 0 a 100 pontos dividida nas quatro faixas de perfil"
      >
        <span
          v-for="range in sorted"
          :key="range.label"
          class="h-full"
          :class="TONE_FILL[range.tone]"
          :style="{ width: `${((range.max - range.min + 1) / scaleSize) * 100}%` }"
        />
      </div>

      <dl class="bg-border grid grid-cols-4 gap-px overflow-hidden rounded-md border">
        <div v-for="range in sorted" :key="range.label" class="bg-card flex flex-col gap-1.75 p-4">
          <dt class="text-eyebrow text-muted-foreground-faint">
            {{ range.label }}
          </dt>
          <dd class="text-subtitle-strong tabular-nums">
            {{ range.min }} a {{ range.max }} pontos
          </dd>
        </div>
      </dl>

      <p
        class="text-label flex items-center gap-2.5 rounded-md border border-border-strong bg-muted px-3.75 py-3.25 text-muted-foreground"
        role="status"
      >
        <component
          :is="isValid ? PhCheckCircle : PhWarning"
          class="size-4 shrink-0"
          :class="isValid ? 'text-success' : 'text-warning'"
          aria-hidden="true"
        />
        {{
          isValid
            ? `As faixas cobrem ${SCALE_MIN} a ${SCALE_MAX} sem lacuna nem sobreposição.`
            : `As faixas precisam cobrir ${SCALE_MIN} a ${SCALE_MAX} sem lacuna nem sobreposição.`
        }}
      </p>

      <div>
        <Button
          type="button"
          size="lg"
          class="text-button-sm rounded-sm px-4"
          :disabled="!isValid"
          @click="toast.success('Parâmetros de suitability salvos')"
        >
          Salvar parâmetros
        </Button>
      </div>
    </div>
  </Card>
</template>
