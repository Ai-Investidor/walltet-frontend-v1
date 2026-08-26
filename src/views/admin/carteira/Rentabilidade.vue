<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { Input } from '@components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { PhPlus, PhX } from '@phosphor-icons/vue'
import * as carteirasService from '@services/carteiras'
import type { ErrorPayload, HistoricoPerformanceResponseDto } from '@services/types'
import { formatCompetenciaLonga } from '@utils/competencia'
import { formatRatio, formatSignedPercent } from '@utils/format'
import { toTypedSchema } from '@vee-validate/zod'
import { onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'

interface Props {
  carteiraId: string
}

const props = defineProps<Props>()

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'
const HEAD_CELL = 'text-eyebrow text-muted-foreground-faint h-auto px-4.5 py-2.5'
const BODY_CELL = 'px-4.5 py-3'
const VALUE_CELL = 'text-table-value px-4.5 py-3 tabular-nums'
/** Campo do design: 42 px de altura e raio pequeno (tipografia já é o default do Input/Select). */
const FIELD = 'h-10.5 rounded-sm px-3'

const COLUMNS = [
  { label: 'Competência', width: '' },
  { label: 'Carteira', width: 'w-[110px]' },
  { label: 'CDI', width: 'w-[100px]' },
  { label: 'Ibovespa', width: 'w-[110px]' },
  { label: '% do CDI', width: 'w-[110px]' },
]

const historico = ref<HistoricoPerformanceResponseDto | null>(null)
const carregando = ref(true)

// Não existe GET dedicado de lançamentos de rentabilidade — reaproveita o mesmo endpoint que
// alimenta o histórico público da carteira (GET /carteiras/:id/historico-performance).
async function carregar() {
  carregando.value = true
  try {
    historico.value = await carteirasService.historicoPerformance(props.carteiraId, 60)
  } finally {
    carregando.value = false
  }
}

onMounted(carregar)

const drawerOpen = ref(false)
const salvando = ref(false)

const schema = toTypedSchema(
  z.object({
    mesReferencia: z
      .string({ message: 'Informe a competência' })
      .regex(/^\d{4}-\d{2}$/, 'Use o formato AAAA-MM'),
    rentabilidadeMes: z.coerce.number({ message: 'Informe a rentabilidade do mês' }),
    rentabilidadeAcumuladaAno: z.coerce.number({ message: 'Informe o acumulado do ano' }),
    cdiMes: z.coerce.number({ message: 'Informe o CDI' }).positive('O CDI deve ser maior que zero'),
    ibovMes: z.coerce.number({ message: 'Informe o Ibovespa' }),
  }),
)

function previewRatio(values: Record<string, unknown>) {
  const carteira = Number(values.rentabilidadeMes)
  const cdi = Number(values.cdiMes)

  if (!Number.isFinite(carteira) || !Number.isFinite(cdi) || cdi === 0) {
    return '—'
  }

  return formatRatio((carteira / cdi) * 100)
}

async function onSubmit(values: Record<string, unknown>) {
  salvando.value = true

  try {
    const resultado = await carteirasService.lancarRentabilidade(props.carteiraId, {
      mesReferencia: values.mesReferencia as string,
      rentabilidadeMes: values.rentabilidadeMes as number,
      rentabilidadeAcumuladaAno: values.rentabilidadeAcumuladaAno as number,
      cdiMes: values.cdiMes as number,
      ibovMes: values.ibovMes as number,
    })

    drawerOpen.value = false
    toast.success(`Rentabilidade de ${values.mesReferencia} lançada`)

    // ACUMULADO_DIVERGENTE não é erro — é um aviso dentro da resposta de sucesso (§2 do prompt).
    if (resultado.avisos?.includes('ACUMULADO_DIVERGENTE')) {
      toast.warning(
        `O acumulado informado diverge do calculado a partir dos lançamentos mensais (calculado: ${formatSignedPercent(resultado.acumuladoCalculado ?? 0)}).`,
      )
    }

    await carregar()
  } catch (err) {
    const payload = err as ErrorPayload
    toast.error(payload.error?.message ?? 'Não foi possível lançar a rentabilidade.')
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <section class="flex flex-col gap-4.5" aria-label="Rentabilidade da carteira">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-subtitle">
        Histórico mensal
      </h2>

      <Button type="button" size="lg" class="text-button-sm gap-2.5 rounded-sm px-4" @click="drawerOpen = true">
        <PhPlus class="size-4" aria-hidden="true" />
        Lançar rentabilidade
      </Button>
    </div>

    <Card :class="CARD_SURFACE">
      <Table>
        <TableCaption class="sr-only">
          Rentabilidade mensal da carteira comparada ao CDI e ao Ibovespa.
        </TableCaption>

        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead v-for="column in COLUMNS" :key="column.label" scope="col" :class="[HEAD_CELL, column.width]">
              {{ column.label }}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableEmpty v-if="!carregando && (historico?.serie.length ?? 0) === 0" :colspan="COLUMNS.length">
            Nenhum lançamento ainda.
          </TableEmpty>

          <TableRow v-for="row in historico?.serie ?? []" :key="row.mesReferencia">
            <TableCell :class="[BODY_CELL, 'text-table-row']">
              {{ formatCompetenciaLonga(row.mesReferencia) }}
            </TableCell>

            <TableCell :class="[VALUE_CELL, row.rentabilidade >= 0 ? 'text-success' : 'text-warning']">
              {{ formatSignedPercent(row.rentabilidade) }}
            </TableCell>

            <TableCell :class="[VALUE_CELL, 'text-muted-foreground']">
              {{ formatSignedPercent(row.cdi) }}
            </TableCell>

            <TableCell :class="[VALUE_CELL, 'text-muted-foreground']">
              {{ formatSignedPercent(row.ibov) }}
            </TableCell>

            <TableCell :class="[VALUE_CELL, 'text-muted-foreground']">
              {{ row.percentualCdi === null ? '—' : formatRatio(row.percentualCdi) }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <Sheet v-model:open="drawerOpen">
      <SheetContent
        side="right"
        :show-close-button="false"
        class="gap-0 p-0 data-[side=right]:w-120! data-[side=right]:sm:max-w-120!"
      >
        <SheetHeader class="flex-row items-center justify-between gap-3.5 border-b border-border p-5">
          <SheetTitle class="text-subtitle-strong">
            Lançar rentabilidade
          </SheetTitle>

          <SheetDescription class="sr-only">
            Lançamento da rentabilidade da carteira e dos benchmarks para uma competência.
          </SheetDescription>

          <SheetClose as-child>
            <Button variant="outline" size="icon-lg" class="rounded-sm" aria-label="Fechar lançamento">
              <PhX class="size-3.5" aria-hidden="true" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <Form v-slot="{ values }" :validation-schema="schema" class="flex min-h-0 flex-1 flex-col" @submit="onSubmit">
          <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
            <div class="flex gap-4">
              <FormField v-slot="{ componentField }" name="mesReferencia">
                <FormItem class="flex-1 gap-1.75">
                  <FormLabel class="text-eyebrow text-muted-foreground-faint">
                    Competência (AAAA-MM)
                  </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="2026-09" :class="FIELD" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="rentabilidadeMes">
                <FormItem class="flex-1 gap-1.75">
                  <FormLabel class="text-eyebrow text-muted-foreground-faint">
                    Carteira no mês (%)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" inputmode="decimal" :class="FIELD" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ componentField }" name="rentabilidadeAcumuladaAno">
              <FormItem class="gap-1.75">
                <FormLabel class="text-eyebrow text-muted-foreground-faint">
                  Acumulado no ano (%)
                </FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" inputmode="decimal" :class="FIELD" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="flex gap-4">
              <FormField v-slot="{ componentField }" name="cdiMes">
                <FormItem class="flex-1 gap-1.75">
                  <FormLabel class="text-eyebrow text-muted-foreground-faint">
                    CDI (%)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" inputmode="decimal" :class="FIELD" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="ibovMes">
                <FormItem class="flex-1 gap-1.75">
                  <FormLabel class="text-eyebrow text-muted-foreground-faint">
                    Ibovespa (%)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" inputmode="decimal" :class="FIELD" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div class="flex items-center justify-between gap-3 rounded-md border border-border-strong bg-muted px-4 py-3.5">
              <span class="text-eyebrow text-muted-foreground-faint">Prévia · % do CDI no mês</span>
              <output class="text-subtitle-strong text-success tabular-nums">
                {{ previewRatio(values) }}
              </output>
            </div>
          </div>

          <div class="flex gap-3 border-t border-border-strong px-5 py-4.5">
            <Button type="submit" size="lg" :disabled="salvando" class="text-button-sm rounded-sm px-4">
              {{ salvando ? 'Lançando…' : 'Lançar rentabilidade' }}
            </Button>

            <SheetClose as-child>
              <Button type="button" variant="outline" size="lg" class="text-button-sm rounded-sm border-foreground px-4">
                Cancelar
              </Button>
            </SheetClose>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  </section>
</template>
