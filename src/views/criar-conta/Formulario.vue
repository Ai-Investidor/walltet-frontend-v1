<script setup lang="ts">
import { Button } from '@components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form'
import { Input } from '@components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import { RouterLink, useRouter } from 'vue-router'
import * as z from 'zod'

const router = useRouter()

const CAMPO_CLASSES =
  'text-table-row placeholder:text-muted-foreground-faint border-border h-10.5 rounded-sm px-3'

const schema = toTypedSchema(
  z.object({
    nome: z.string({ message: 'Informe seu nome completo' }).min(1, 'Informe seu nome completo'),
    email: z
      .string({ message: 'Informe seu e-mail' })
      .min(1, 'Informe seu e-mail')
      .email('Informe um e-mail válido'),
    senha: z
      .string({ message: 'Informe uma senha' })
      .min(8, 'A senha precisa ter no mínimo 8 caracteres'),
  }),
)

// Mock: sem auth real nesta fase — qualquer envio válido segue para a avaliação de perfil.
function onSubmit() {
  router.push({ name: 'avaliacao-perfil' })
}
</script>

<template>
  <section aria-labelledby="criar-conta-titulo" class="flex w-full flex-col items-center gap-6.5 px-6 py-10 max-sm:px-4">
    <div class="flex items-center gap-2.5">
      <div class="bg-foreground flex size-6.5 items-center justify-center rounded-sm">
        <span class="text-eyebrow text-background" aria-hidden="true">AI</span>
      </div>
      <span class="text-card-title">AI Invest</span>
    </div>

    <Form
      class="bg-card border-border flex w-full max-w-105 flex-col gap-5 rounded-lg border px-6 py-6.5"
      :validation-schema="schema"
      @submit="onSubmit"
    >
      <header class="flex flex-col gap-2">
        <p class="text-eyebrow text-muted-foreground-faint">
          Cadastro
        </p>
        <h1 id="criar-conta-titulo" class="text-page-title-sm">
          Criar conta
        </h1>
        <p class="text-table-row text-muted-foreground">
          Depois do cadastro você responde a avaliação de perfil e recebe a carteira recomendada.
        </p>
      </header>

      <FormField v-slot="{ componentField }" name="nome">
        <FormItem class="gap-2">
          <FormLabel class="text-eyebrow text-muted-foreground-faint">
            Nome completo
          </FormLabel>
          <FormControl>
            <Input
              type="text"
              autocomplete="name"
              placeholder="Como consta no seu documento"
              :class="CAMPO_CLASSES"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="email">
        <FormItem class="gap-2">
          <FormLabel class="text-eyebrow text-muted-foreground-faint">
            E-mail
          </FormLabel>
          <FormControl>
            <Input
              type="email"
              autocomplete="email"
              placeholder="nome@email.com"
              :class="CAMPO_CLASSES"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="senha">
        <FormItem class="gap-2">
          <FormLabel class="text-eyebrow text-muted-foreground-faint">
            Senha
          </FormLabel>
          <FormControl>
            <Input
              type="password"
              autocomplete="new-password"
              placeholder="Mínimo de 8 caracteres"
              :class="CAMPO_CLASSES"
              v-bind="componentField"
            />
          </FormControl>

          <!-- Indicador de força: mock estático, sem cálculo real (sem camada de auth nesta fase). -->
          <div class="flex items-center gap-1.5" aria-hidden="true">
            <span v-for="segmento in 4" :key="segmento" class="bg-muted h-1 flex-1 rounded-full" />
          </div>

          <FormDescription class="text-label text-muted-foreground">
            Use 8 caracteres ou mais, com letras e números.
          </FormDescription>

          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="text-table-value h-11 w-full rounded-sm">
        Criar conta
      </Button>

      <p class="text-label text-muted-foreground">
        Ao criar a conta você concorda com os termos de uso e com a política de privacidade da AI
        Invest.
      </p>

      <div class="border-border flex items-center justify-between gap-2.5 border-t pt-4">
        <span class="text-table-row text-muted-foreground">Já tem conta?</span>
        <RouterLink to="/login" class="text-topbar-meta text-foreground hover:underline">
          Entrar
        </RouterLink>
      </div>
    </Form>

    <p class="text-label text-muted-foreground-faint max-w-105 text-center">
      AI Invest · carteiras recomendadas revisadas mensalmente por analistas. Suporte:
      suporte@aiinvest.com.br
    </p>
  </section>
</template>
