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
import type { AdminUser } from '@data/admin'
import { userRoles } from '@data/admin'
import { PhX } from '@phosphor-icons/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { computed, ref } from 'vue'
import * as z from 'zod'

interface Props {
  /** `null` cadastra um usuário novo; um usuário abre o formulário em edição. */
  user: AdminUser | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  salvar: [values: { name: string; email: string; role: AdminUser['role'] }]
}>()

const open = defineModel<boolean>('open', { required: true })

/** Campo do design: 42 px de altura, raio pequeno e tipografia de parágrafo. */
const FIELD = 'text-paragraph h-10.5 w-full rounded-sm px-3'

const isEdit = computed(() => props.user !== null)

const schema = toTypedSchema(
  z.object({
    name: z
      .string({ message: 'Informe o nome' })
      .min(3, 'O nome precisa ter ao menos 3 caracteres'),
    email: z.string({ message: 'Informe o e-mail' }).email('Informe um e-mail válido'),
    role: z.string({ message: 'Selecione o papel' }),
  }),
)

const initialValues = computed(() => ({
  name: props.user?.name ?? '',
  email: props.user?.email ?? '',
  role: props.user?.role ?? userRoles[0],
}))

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
    name: pending.value.name,
    email: pending.value.email,
    role: pending.value.role as AdminUser['role'],
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
      class="gap-0 p-0 data-[side=right]:w-115! data-[side=right]:sm:max-w-115!"
    >
      <Form
        v-slot="{ meta }"
        :key="props.user?.id ?? 'novo'"
        :validation-schema="schema"
        :initial-values="initialValues"
        class="flex min-h-0 flex-1 flex-col"
        @submit="onSubmit"
      >
        <SheetHeader
          class="flex-row items-center justify-between gap-3.5 border-b border-border p-5"
        >
          <SheetTitle class="text-subtitle-strong">
            {{ isEdit ? 'Editar usuário' : 'Novo usuário' }}
          </SheetTitle>

          <SheetDescription class="sr-only">
            Cadastro do usuário com nome, e-mail e papel na plataforma.
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
          <FormField v-slot="{ componentField }" name="name">
            <FormItem class="gap-1.75">
              <FormLabel class="text-eyebrow text-muted-foreground-faint">
                Nome completo
              </FormLabel>
              <FormControl>
                <Input type="text" :class="FIELD" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="email">
            <FormItem class="gap-1.75">
              <FormLabel class="text-eyebrow text-muted-foreground-faint">
                E-mail
              </FormLabel>
              <FormControl>
                <Input type="email" :class="FIELD" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="role">
            <FormItem class="gap-1.75">
              <FormLabel class="text-eyebrow text-muted-foreground-faint">
                Papel
              </FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger :class="FIELD">
                    <SelectValue placeholder="Selecione o papel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem v-for="role in userRoles" :key="role" :value="role">
                    {{ role }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-label text-muted-foreground-faint">
                Cliente responde à avaliação de perfil. Analista administra carteiras e ativos.
              </p>
              <FormMessage />
            </FormItem>
          </FormField>

          <p
            v-if="!isEdit"
            class="text-label rounded-sm border border-border-strong bg-muted px-3.75 py-3.25 text-muted-foreground"
          >
            O usuário entra ativo e sem perfil de investidor. O perfil é definido quando ele conclui
            a avaliação de suitability.
          </p>
        </div>

        <div class="flex gap-3 border-t border-border-strong px-5 py-4.5">
          <Button type="submit" size="lg" class="text-button-sm rounded-sm px-4">
            {{ isEdit ? 'Salvar alterações' : 'Cadastrar usuário' }}
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
    :title="isEdit ? 'Salvar as alterações do usuário?' : 'Cadastrar o novo usuário?'"
    :description="
      isEdit
        ? 'Os dados passam a valer imediatamente para este cadastro.'
        : 'O usuário recebe acesso à plataforma com o papel selecionado.'
    "
    :confirm-label="isEdit ? 'Salvar alterações' : 'Cadastrar usuário'"
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
