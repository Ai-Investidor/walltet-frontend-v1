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
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { profitabilityDraft, walletProfitability } from '@data/admin'
import { PhPlus, PhX } from '@phosphor-icons/vue'
import { formatRatio, formatSignedPercent } from '@utils/format'
import { toTypedSchema } from '@vee-validate/zod'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
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

const drawerOpen = ref(false)

const schema = toTypedSchema(
  z.object({
    competencia: z
      .string({ message: 'Informe a competência' })
      .regex(/^\d{4}-\d{2}$/, 'Use o formato AAAA-MM'),
    carteira: z.coerce.number({ message: 'Informe a rentabilidade da carteira' }),
    cdi: z.coerce.number({ message: 'Informe o CDI' }).positive('O CDI deve ser maior que zero'),
    ibovespa: z.coerce.number({ message: 'Informe o Ibovespa' }),
  }),
)

const initialValues = {
  competencia: profitabilityDraft.competence,
  carteira: profitabilityDraft.wallet,
  cdi: profitabilityDraft.cdi,
  ibovespa: profitabilityDraft.ibovespa,
}

/** A prévia acompanha o formulário: sem CDI válido não há proporção a exibir. */
function previewRatio(values: Record<string, unknown>) {
  const wallet = Number(values.carteira)
  const cdi = Number(values.cdi)

  if (!Number.isFinite(wallet) || !Number.isFinite(cdi) || cdi === 0) {
    return '—'
  }

  return formatRatio((wallet / cdi) * 100)
}

function onSubmit(values: Record<string, unknown>) {
  drawerOpen.value = false
  toast.success(`Rentabilidade de ${values.competencia} lançada`)
}
</script>

<template>
  <section class="flex flex-col gap-4.5" aria-label="Rentabilidade da carteira">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-subtitle">
        Histórico mensal
      </h2>

      <Button
        type="button"
        size="lg"
        class="text-button-sm gap-2.5 rounded-sm px-4"
        @click="drawerOpen = true"
      >
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
            <TableHead
              v-for="column in COLUMNS"
              :key="column.label"
              scope="col"
              :class="[HEAD_CELL, column.width]"
            >
              {{ column.label }}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="row in walletProfitability" :key="row.competence">
            <TableCell :class="[BODY_CELL, 'text-table-row']">
              {{ row.competence }}
            </TableCell>

            <TableCell :class="[VALUE_CELL, row.wallet >= 0 ? 'text-success' : 'text-warning']">
              {{ formatSignedPercent(row.wallet) }}
            </TableCell>

            <TableCell :class="[VALUE_CELL, 'text-muted-foreground']">
              {{ formatSignedPercent(row.cdi) }}
            </TableCell>

            <TableCell :class="[VALUE_CELL, 'text-muted-foreground']">
              {{ formatSignedPercent(row.ibovespa) }}
            </TableCell>

            <TableCell :class="[VALUE_CELL, 'text-muted-foreground']">
              {{ formatRatio(row.percentOfCdi) }}
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
        <SheetHeader
          class="flex-row items-center justify-between gap-3.5 border-b border-border p-5"
        >
          <SheetTitle class="text-subtitle-strong">
            Lançar rentabilidade
          </SheetTitle>

          <SheetDescription class="sr-only">
            Lançamento da rentabilidade da carteira e dos benchmarks para uma competência.
          </SheetDescription>

          <SheetClose as-child>
            <Button
              variant="outline"
              size="icon-lg"
              class="rounded-sm"
              aria-label="Fechar lançamento"
            >
              <PhX class="size-3.5" aria-hidden="true" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <Form
          v-slot="{ values }"
          :validation-schema="schema"
          :initial-values="initialValues"
          class="flex min-h-0 flex-1 flex-col"
          @submit="onSubmit"
        >
          <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
            <div class="flex gap-4">
              <FormField v-slot="{ componentField }" name="competencia">
                <FormItem class="flex-1 gap-1.75">
                  <FormLabel class="text-eyebrow text-muted-foreground-faint">
                    Competência
                  </FormLabel>
                  <FormControl>
                    <Input type="text" :class="FIELD" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="carteira">
                <FormItem class="flex-1 gap-1.75">
                  <FormLabel class="text-eyebrow text-muted-foreground-faint">
                    Carteira (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      inputmode="decimal"
                      :class="FIELD"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div class="flex gap-4">
              <FormField v-slot="{ componentField }" name="cdi">
                <FormItem class="flex-1 gap-1.75">
                  <FormLabel class="text-eyebrow text-muted-foreground-faint">
                    CDI (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      inputmode="decimal"
                      :class="FIELD"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="ibovespa">
                <FormItem class="flex-1 gap-1.75">
                  <FormLabel class="text-eyebrow text-muted-foreground-faint">
                    Ibovespa (%)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      inputmode="decimal"
                      :class="FIELD"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div
              class="flex items-center justify-between gap-3 rounded-md border border-border-strong bg-muted px-4 py-3.5"
            >
              <span class="text-eyebrow text-muted-foreground-faint">Prévia · % do CDI</span>
              <output class="text-subtitle-strong text-success tabular-nums">
                {{ previewRatio(values) }}
              </output>
            </div>
          </div>

          <div class="flex gap-3 border-t border-border-strong px-5 py-4.5">
            <Button type="submit" size="lg" class="text-button-sm rounded-sm px-4">
              Lançar rentabilidade
            </Button>

            <SheetClose as-child>
              <Button
                type="button"
                variant="outline"
                size="lg"
                class="text-button-sm rounded-sm border-foreground px-4"
              >
                Cancelar
              </Button>
            </SheetClose>
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  </section>
</template>
