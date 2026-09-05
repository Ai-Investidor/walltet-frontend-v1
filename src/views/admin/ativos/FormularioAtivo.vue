<script setup lang="ts">
import { ConfirmDialog } from '@components/admin/confirm-dialog'
import { Button } from '@components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { Input } from '@components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet'
import type { CatalogAsset } from '@data/admin'
import { assetClassLabels } from '@data/admin'
import { PhX } from '@phosphor-icons/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { computed, ref } from 'vue'
import * as z from 'zod'

interface Props {
  /** `null` cadastra um ativo novo; um ativo abre o formulário em edição. */
  asset: CatalogAsset | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  salvar: [asset: CatalogAsset]
}>()

const open = defineModel<boolean>('open', { required: true })

/** Campo do design: 42 px de altura, raio pequeno e tipografia de parágrafo. */
const FIELD = 'text-paragraph h-10.5 w-full rounded-sm px-3'

const isEdit = computed(() => props.asset !== null)

const schema = toTypedSchema(
  z.object({
    ticker: z
      .string({ message: 'Informe o código de negociação' })
      .min(2, 'O código precisa ter ao menos 2 caracteres'),
    name: z.string({ message: 'Informe o nome do ativo' }).min(3, 'O nome é obrigatório'),
    className: z.string({ message: 'Selecione a classe' }),
    code: z
      .string({ message: 'Informe as iniciais' })
      .length(2, 'As iniciais têm exatamente 2 caracteres'),
  }),
)

const initialValues = computed(() => ({
  ticker: props.asset?.ticker ?? '',
  name: props.asset?.name ?? '',
  className: props.asset?.className ?? assetClassLabels[0],
  code: props.asset?.code ?? '',
}))

// Confirmações: o formulário só emite depois do aceite, e o descarte só
// pergunta quando existe edição pendente.
const confirmSaveOpen = ref(false)
const confirmDiscardOpen = ref(false)
const pending = ref<Record<string, string> | null>(null)

function onSubmit(values: Record<string, unknown>) {
  pending.value = values as Record<string, string>
  confirmSaveOpen.value = true
}

function confirmSave() {
  if (!pending.value) {
    return
  }

  emit('salvar', {
    code: pending.value.code.toLocaleUpperCase('pt-BR'),
    ticker: pending.value.ticker,
    name: pending.value.name,
    className: pending.value.className,
    walletCount: props.asset?.walletCount ?? 0,
    active: props.asset?.active ?? true,
    deactivationReason: props.asset?.deactivationReason,
  })

  pending.value = null
  open.value = false
}

function requestClose(dirty: boolean) {
  if (dirty) {
    confirmDiscardOpen.value = true
    return
  }

  open.value = false
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent
      side="right"
      :show-close-button="false"
      class="gap-0 p-0 data-[side=right]:w-105! data-[side=right]:sm:max-w-105! max-sm:data-[side=right]:w-full!"
    >
      <Form
        v-slot="{ meta }"
        :key="props.asset?.ticker ?? 'novo'"
        :validation-schema="schema"
        :initial-values="initialValues"
        class="flex min-h-0 flex-1 flex-col"
        @submit="onSubmit"
      >
        <SheetHeader
          class="flex-row items-center justify-between gap-3.5 border-b border-border p-5"
        >
          <SheetTitle class="text-subtitle-strong">
            {{ isEdit ? 'Editar ativo' : 'Novo ativo' }}
          </SheetTitle>

          <SheetDescription class="sr-only">
            Cadastro do ativo no catálogo, com código, nome, classe e iniciais.
          </SheetDescription>

          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            class="rounded-sm"
            aria-label="Fechar formulário"
            @click="requestClose(meta.dirty)"
          >
            <PhX class="size-3.5" aria-hidden="true" />
          </Button>
        </SheetHeader>

        <div class="flex flex-1 flex-col gap-4.5 overflow-y-auto p-5">
          <FormField v-slot="{ componentField }" name="ticker">
            <FormItem class="gap-1.75">
              <FormLabel class="text-eyebrow text-muted-foreground-faint">
                Código de negociação
              </FormLabel>
              <FormControl>
                <Input type="text" :class="FIELD" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="name">
            <FormItem class="gap-1.75">
              <FormLabel class="text-eyebrow text-muted-foreground-faint">
                Nome do ativo
              </FormLabel>
              <FormControl>
                <Input type="text" :class="FIELD" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="className">
            <FormItem class="gap-1.75">
              <FormLabel class="text-eyebrow text-muted-foreground-faint">
                Classe
              </FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger :class="FIELD">
                    <SelectValue placeholder="Selecione a classe" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem v-for="label in assetClassLabels" :key="label" :value="label">
                    {{ label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="code">
            <FormItem class="gap-1.75">
              <FormLabel class="text-eyebrow text-muted-foreground-faint">
                Iniciais
              </FormLabel>
              <FormControl>
                <Input type="text" maxlength="2" :class="FIELD" v-bind="componentField" />
              </FormControl>
              <p class="text-label text-muted-foreground-faint">
                Duas letras exibidas no chip do ativo nas tabelas e nas carteiras.
              </p>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex gap-3 border-t border-border-strong px-5 py-4.5">
          <Button type="submit" size="lg" class="text-button-sm rounded-sm px-4">
            {{ isEdit ? 'Salvar alterações' : 'Cadastrar ativo' }}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            class="text-button-sm rounded-sm border-foreground px-4"
            @click="requestClose(meta.dirty)"
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </SheetContent>
  </Sheet>

  <ConfirmDialog
    v-model:open="confirmSaveOpen"
    :title="isEdit ? 'Salvar as alterações do ativo?' : 'Cadastrar o novo ativo?'"
    :description="
      isEdit
        ? 'As alterações valem para as próximas versões de carteira. As versões já publicadas mantêm o cadastro antigo.'
        : 'O ativo fica disponível para entrar em qualquer carteira a partir da próxima versão.'
    "
    :confirm-label="isEdit ? 'Salvar alterações' : 'Cadastrar ativo'"
    cancel-label="Voltar ao formulário"
    @confirm="confirmSave"
  />

  <ConfirmDialog
    v-model:open="confirmDiscardOpen"
    title="Descartar as alterações?"
    description="O que foi preenchido no formulário será perdido."
    confirm-label="Descartar"
    cancel-label="Continuar editando"
    tone="destructive"
    @confirm="open = false"
  />
</template>
