<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { Input } from '@components/ui/input'
import { PhCheckCircle, PhPencilSimple, PhWarning } from '@phosphor-icons/vue'
import * as configuracoesService from '@services/configuracoes'
import type { ErrorPayload, PerfilInvestidor } from '@services/types'
import { perfilParaRotulo } from '@utils/perfil'
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'
const BOUND_FIELD = 'text-subtitle-strong h-9 w-16 rounded-sm px-2 text-center tabular-nums'

const TONS: Record<PerfilInvestidor, string> = {
  CONSERVADOR: 'bg-data-1',
  MODERADO: 'bg-data-2',
  ARROJADO: 'bg-data-3',
  SOFISTICADO: 'bg-data-4',
}

interface Faixa {
  perfil: PerfilInvestidor
  min: number
  max: number
}

const escalaMaxima = ref(100)
const saved = ref<Faixa[]>([])
const ranges = ref<Faixa[]>([])
const carregando = ref(true)
const isEditing = ref(false)
const salvando = ref(false)

function snapshot(source: Faixa[]) {
  return [...source].sort((a, b) => a.min - b.min).map((range) => ({ ...range }))
}

async function carregar() {
  carregando.value = true
  try {
    const config = await configuracoesService.suitabilityVigente()
    escalaMaxima.value = config.escalaMaxima
    saved.value = snapshot(config.faixas)
    ranges.value = snapshot(config.faixas)
  } finally {
    carregando.value = false
  }
}

onMounted(carregar)

const scaleSize = computed(() => escalaMaxima.value + 1)

const isDirty = computed(() =>
  ranges.value.some(
    (range, index) =>
      range.min !== saved.value[index]?.min || range.max !== saved.value[index]?.max,
  ),
)

const problem = computed(() => {
  const list = ranges.value

  if (list.some((range) => !Number.isFinite(range.min) || !Number.isFinite(range.max))) {
    return 'Preencha todos os limites com números.'
  }
  if (list.some((range) => range.max < range.min)) {
    return 'O limite superior de cada faixa precisa ser maior ou igual ao inferior.'
  }
  if (list[0]?.min !== 0) {
    return 'A primeira faixa precisa começar em 0.'
  }
  if (list.at(-1)?.max !== escalaMaxima.value) {
    return `A última faixa precisa terminar em ${escalaMaxima.value}.`
  }

  const broken = list.findIndex(
    (range, index) => index > 0 && range.min !== list[index - 1].max + 1,
  )
  if (broken > 0) {
    return `${perfilParaRotulo(list[broken - 1].perfil)} e ${perfilParaRotulo(list[broken].perfil)} não se encaixam: há lacuna ou sobreposição entre as faixas.`
  }

  return ''
})

const isValid = computed(() => problem.value === '')

function barWidth(range: Faixa) {
  const size = Math.max(0, range.max - range.min + 1)
  return `${(size / scaleSize.value) * 100}%`
}

function startEdit() {
  isEditing.value = true
}

function discard() {
  ranges.value = snapshot(saved.value)
  isEditing.value = false
}

async function save() {
  salvando.value = true
  try {
    const config = await configuracoesService.atualizarSuitability({
      escalaMaxima: escalaMaxima.value,
      faixas: ranges.value.map(({ perfil, min, max }) => ({ perfil, min, max })),
    })
    saved.value = snapshot(config.faixas)
    ranges.value = snapshot(config.faixas)
    isEditing.value = false
    toast.success('Parâmetros de suitability salvos')
  } catch (err) {
    const payload = err as ErrorPayload
    toast.error(payload.error?.message ?? 'Não foi possível salvar os parâmetros.')
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <p v-if="carregando" class="text-paragraph text-muted-foreground">
    Carregando parâmetros…
  </p>

  <Card v-else :class="CARD_SURFACE">
    <div class="flex flex-col gap-4 p-4.5">
      <div
        class="flex h-3.5 overflow-hidden rounded-sm bg-muted"
        role="img"
        :aria-label="`Escala de 0 a ${escalaMaxima} pontos dividida nas faixas de perfil`"
      >
        <span v-for="range in ranges" :key="range.perfil" class="h-full transition-all" :class="TONS[range.perfil]" :style="{ width: barWidth(range) }" />
      </div>

      <dl class="bg-border grid grid-cols-4 gap-px overflow-hidden rounded-md border max-sm:grid-cols-1">
        <div v-for="range in ranges" :key="range.perfil" class="bg-card flex flex-col gap-2 p-4">
          <dt class="text-eyebrow text-muted-foreground-faint">
            {{ perfilParaRotulo(range.perfil) }}
          </dt>

          <dd v-if="!isEditing" class="text-subtitle-strong tabular-nums">
            {{ range.min }} a {{ range.max }} pontos
          </dd>

          <dd v-else class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <Input
                v-model.number="range.min"
                type="number"
                :min="0"
                :max="escalaMaxima"
                inputmode="numeric"
                :class="BOUND_FIELD"
                :aria-label="`Pontuação mínima do perfil ${perfilParaRotulo(range.perfil)}`"
              />
              <span class="text-label text-muted-foreground-faint">a</span>
              <Input
                v-model.number="range.max"
                type="number"
                :min="0"
                :max="escalaMaxima"
                inputmode="numeric"
                :class="BOUND_FIELD"
                :aria-label="`Pontuação máxima do perfil ${perfilParaRotulo(range.perfil)}`"
              />
            </div>
            <span class="text-label text-muted-foreground-faint">pontos</span>
          </dd>
        </div>
      </dl>

      <p
        class="text-label flex items-center gap-2.5 rounded-md border px-3.75 py-3.25"
        :class="isValid ? 'border-border-strong bg-muted text-muted-foreground' : 'border-warning bg-warning/10 text-foreground'"
        role="status"
      >
        <component :is="isValid ? PhCheckCircle : PhWarning" class="size-4 shrink-0" :class="isValid ? 'text-success' : 'text-warning'" aria-hidden="true" />
        {{ isValid ? `As faixas cobrem 0 a ${escalaMaxima} sem lacuna nem sobreposição.` : problem }}
      </p>

      <div class="flex gap-3 max-sm:flex-col">
        <Button v-if="!isEditing" type="button" variant="outline" size="lg" class="text-button-sm gap-2.5 rounded-sm border-foreground px-4 max-sm:w-full max-sm:justify-center" @click="startEdit">
          <PhPencilSimple class="size-4" aria-hidden="true" />
          Editar faixas
        </Button>

        <template v-else>
          <Button type="button" size="lg" class="text-button-sm rounded-sm px-4 max-sm:w-full max-sm:justify-center" :disabled="!isValid || !isDirty || salvando" @click="save">
            {{ salvando ? 'Salvando…' : 'Salvar parâmetros' }}
          </Button>
          <Button type="button" variant="outline" size="lg" class="text-button-sm rounded-sm border-foreground px-4 max-sm:w-full max-sm:justify-center" @click="discard">
            Cancelar
          </Button>
        </template>
      </div>
    </div>
  </Card>
</template>
