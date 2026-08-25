<script setup lang="ts">
import { PageHeader } from '@components/shared/page-header'
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
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet'
import { Textarea } from '@components/ui/textarea'
import { profileLabels } from '@data/admin'
import { PhArrowRight, PhPlus, PhX } from '@phosphor-icons/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const drawerOpen = ref(false)

const schema = toTypedSchema(
  z.object({
    nome: z
      .string({ message: 'Informe o nome da carteira' })
      .min(3, 'O nome precisa ter ao menos 3 caracteres'),
    perfil: z.string({ message: 'Selecione o perfil-alvo' }),
    descricao: z.string().max(240, 'A descrição pode ter no máximo 240 caracteres').optional(),
  }),
)

const initialValues = {
  nome: 'Carteira Moderada Estratégica II',
  perfil: 'Moderado',
  descricao: 'Núcleo em renda fixa indexada com parcela em renda variável doméstica.',
}

/** Campo do design: largura total, 42 px de altura, raio pequeno e tipografia de parágrafo. */
const FIELD = 'text-paragraph h-10.5 w-full rounded-sm px-3'

function onSubmit(values: Record<string, unknown>) {
  drawerOpen.value = false
  toast.success(`Carteira "${values.nome}" salva`)
}
</script>

<template>
  <PageHeader
    eyebrow="Gestão"
    title="Carteiras"
    description="Quatro carteiras ativas, uma por perfil. Abrir uma carteira dá acesso a composição, versões, rentabilidade e relatórios."
  >
    <template #action>
      <Button
        type="button"
        size="lg"
        class="text-button-sm gap-2.5 rounded-sm px-4"
        @click="drawerOpen = true"
      >
        <PhPlus class="size-4" aria-hidden="true" />
        Nova carteira
        <PhArrowRight class="size-3.5" aria-hidden="true" />
      </Button>
    </template>
  </PageHeader>

  <Sheet v-model:open="drawerOpen">
    <SheetContent
      side="right"
      :show-close-button="false"
      class="gap-0 p-0 data-[side=right]:w-105! data-[side=right]:sm:max-w-105!"
    >
      <SheetHeader class="flex-row items-center justify-between gap-3.5 border-b border-border p-5">
        <SheetTitle class="text-subtitle-strong">
          Nova carteira
        </SheetTitle>

        <SheetDescription class="sr-only">
          Cadastro de uma nova carteira recomendada, com nome, perfil-alvo e descrição.
        </SheetDescription>

        <SheetClose as-child>
          <Button variant="outline" size="icon-lg" class="rounded-sm" aria-label="Fechar cadastro">
            <PhX class="size-3.5" aria-hidden="true" />
          </Button>
        </SheetClose>
      </SheetHeader>

      <Form
        :validation-schema="schema"
        :initial-values="initialValues"
        class="flex min-h-0 flex-1 flex-col"
        @submit="onSubmit"
      >
        <div class="flex flex-1 flex-col gap-4.5 overflow-y-auto p-5">
          <FormField v-slot="{ componentField }" name="nome">
            <FormItem class="gap-1.75">
              <FormLabel class="text-eyebrow text-muted-foreground-faint">
                Nome da carteira
              </FormLabel>
              <FormControl>
                <Input type="text" :class="FIELD" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="perfil">
            <FormItem class="gap-1.75">
              <FormLabel class="text-eyebrow text-muted-foreground-faint">
                Perfil-alvo
              </FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger :class="FIELD">
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem v-for="label in profileLabels" :key="label" :value="label">
                    {{ label }}
                  </SelectItem>
                </SelectContent>
              </Select>
              <p class="text-label text-muted-foreground-faint">
                Cada perfil pode ter mais de uma carteira, mas só uma ativa por vez.
              </p>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="descricao">
            <FormItem class="gap-1.75">
              <FormLabel class="text-eyebrow text-muted-foreground-faint">
                Descrição
              </FormLabel>
              <FormControl>
                <Textarea
                  class="text-paragraph h-21 rounded-sm px-3 py-2.75"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <div class="flex gap-3 border-t border-border-strong px-5 py-4.5">
          <Button type="submit" size="lg" class="text-button-sm rounded-sm px-4">
            Salvar carteira
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
</template>
