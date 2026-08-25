<script setup lang="ts">
import { ConfirmDialog } from '@components/admin/confirm-dialog'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { Input } from '@components/ui/input'
import type { SuitabilityRange } from '@data/admin'
import { suitabilityRanges } from '@data/admin'
import { PhCheckCircle, PhWarning } from '@phosphor-icons/vue'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const BOUND_FIELD = 'text-subtitle-strong h-9 w-16 rounded-sm px-2 text-center tabular-nums'

const SCALE_MIN = 0
const SCALE_MAX = 100

const TONE_FILL: Record<SuitabilityRange['tone'], string> = {
  'data-1': 'bg-data-1',
  'data-2': 'bg-data-2',
  'data-3': 'bg-data-3',
  'data-4': 'bg-data-4',
}

// Cópia local editável, na ordem crescente de pontuação.
const ranges = ref<SuitabilityRange[]>(
  [...suitabilityRanges].sort((a, b) => a.min - b.min).map((range) => ({ ...range })),
)

const confirmOpen = ref(false)

const scaleSize = computed(() => SCALE_MAX - SCALE_MIN + 1)

const isDirty = computed(() =>
  ranges.value.some((range, index) => {
    const original = [...suitabilityRanges].sort((a, b) => a.min - b.min)[index]
    return range.min !== original.min || range.max !== original.max
  }),
)

/** As faixas são válidas quando cobrem a escala inteira sem lacuna nem sobreposição. */
const problem = computed(() => {
  const list = ranges.value

  if (list.some((range) => !Number.isFinite(range.min) || !Number.isFinite(range.max))) {
    return 'Preencha todos os limites com números.'
  }

  if (list.some((range) => range.max < range.min)) {
    return 'O limite superior de cada faixa precisa ser maior ou igual ao inferior.'
  }

  if (list[0].min !== SCALE_MIN) {
    return `A primeira faixa precisa começar em ${SCALE_MIN}.`
  }

  if (list[list.length - 1].max !== SCALE_MAX) {
    return `A última faixa precisa terminar em ${SCALE_MAX}.`
  }

  const broken = list.findIndex(
    (range, index) => index > 0 && range.min !== list[index - 1].max + 1,
  )

  if (broken > 0) {
    return `${list[broken - 1].label} e ${list[broken].label} não se encaixam: há lacuna ou sobreposição entre as faixas.`
  }

  return ''
})

const isValid = computed(() => problem.value === '')

function barWidth(range: SuitabilityRange) {
  const size = Math.max(0, range.max - range.min + 1)
  return `${(size / scaleSize.value) * 100}%`
}

function reset() {
  ranges.value = [...suitabilityRanges].sort((a, b) => a.min - b.min).map((range) => ({ ...range }))
}

function save() {
  toast.success('Parâmetros de suitability salvos')
}
</script>

<template>
  <Card :class="CARD_SURFACE">
    <div class="flex flex-col gap-4 p-4.5">
      <div
        class="flex h-3.5 overflow-hidden rounded-sm bg-muted"
        role="img"
        aria-label="Escala de 0 a 100 pontos dividida nas quatro faixas de perfil"
      >
        <span
          v-for="range in ranges"
          :key="range.label"
          class="h-full transition-all"
          :class="TONE_FILL[range.tone]"
          :style="{ width: barWidth(range) }"
        />
      </div>

      <div class="bg-border grid grid-cols-4 gap-px overflow-hidden rounded-md border">
        <div v-for="range in ranges" :key="range.label" class="bg-card flex flex-col gap-2 p-4">
          <p :id="`faixa-${range.tone}`" class="text-eyebrow text-muted-foreground-faint">
            {{ range.label }}
          </p>

          <div class="flex items-center gap-2">
            <Input
              v-model.number="range.min"
              type="number"
              :min="SCALE_MIN"
              :max="SCALE_MAX"
              inputmode="numeric"
              :class="BOUND_FIELD"
              :aria-label="`Pontuação mínima do perfil ${range.label}`"
            />

            <span class="text-label text-muted-foreground-faint">a</span>

            <Input
              v-model.number="range.max"
              type="number"
              :min="SCALE_MIN"
              :max="SCALE_MAX"
              inputmode="numeric"
              :class="BOUND_FIELD"
              :aria-label="`Pontuação máxima do perfil ${range.label}`"
            />
          </div>

          <p class="text-label text-muted-foreground-faint">pontos</p>
        </div>
      </div>

      <p
        class="text-label flex items-center gap-2.5 rounded-md border px-3.75 py-3.25"
        :class="
          isValid
            ? 'border-border-strong bg-muted text-muted-foreground'
            : 'border-warning bg-warning/10 text-foreground'
        "
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
            : problem
        }}
      </p>

      <div class="flex gap-3">
        <Button
          type="button"
          size="lg"
          class="text-button-sm rounded-sm px-4"
          :disabled="!isValid || !isDirty"
          @click="confirmOpen = true"
        >
          Salvar parâmetros
        </Button>

        <Button
          v-if="isDirty"
          type="button"
          variant="outline"
          size="lg"
          class="text-button-sm rounded-sm border-foreground px-4"
          @click="reset"
        >
          Descartar alterações
        </Button>
      </div>
    </div>
  </Card>

  <ConfirmDialog
    v-model:open="confirmOpen"
    title="Salvar os parâmetros de suitability?"
    description="As novas faixas valem apenas para avaliações futuras. Os perfis já atribuídos aos investidores não são recalculados."
    confirm-label="Salvar parâmetros"
    @confirm="save"
  />
</template>
