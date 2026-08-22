<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { Input } from '@components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import { RouterLink, useRouter } from 'vue-router'
import * as z from 'zod'

const router = useRouter()

const schema = toTypedSchema(
  z.object({
    email: z
      .string({ message: 'Informe seu e-mail' })
      .min(1, 'Informe seu e-mail')
      .email('Informe um e-mail válido'),
    senha: z.string({ message: 'Informe sua senha' }).min(1, 'Informe sua senha'),
  }),
)

// Mock: sem auth real nesta fase — qualquer envio válido navega direto pro painel.
function onSubmit() {
  router.push({ name: 'painel' })
}
</script>

<template>
  <section aria-labelledby="login-titulo" class="flex w-full flex-col items-center gap-6.5 px-6 py-10 max-sm:px-4">
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
          ACESSO
        </p>
        <h1 id="login-titulo" class="text-page-title-sm">
          Entrar
        </h1>
        <p class="text-table-row text-muted-foreground">
          Use o e-mail cadastrado para acessar sua carteira recomendada.
        </p>
      </header>

      <FormField v-slot="{ componentField }" name="email">
        <FormItem class="gap-2">
          <FormLabel class="text-eyebrow text-muted-foreground-faint">
            E-MAIL
          </FormLabel>
          <FormControl>
            <Input
              type="email"
              autocomplete="email"
              placeholder="nome@email.com"
              class="text-table-row md:text-table-row placeholder:text-muted-foreground-faint border-border h-10.5 rounded-sm px-3"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="senha">
        <FormItem class="gap-2">
          <FormLabel class="text-eyebrow text-muted-foreground-faint">
            SENHA
          </FormLabel>
          <FormControl>
            <Input
              type="password"
              autocomplete="current-password"
              placeholder="Sua senha"
              class="text-table-row md:text-table-row placeholder:text-muted-foreground-faint border-border h-10.5 rounded-sm px-3"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <Button type="submit" class="text-table-value h-11 w-full rounded-sm">
        Entrar
      </Button>

      <div class="border-border flex items-center justify-between gap-2.5 border-t pt-4">
        <RouterLink to="/recuperar-senha" class="text-table-row text-primary hover:underline">
          Esqueci minha senha
        </RouterLink>
        <RouterLink to="/criar-conta" class="text-topbar-meta text-foreground hover:underline">
          Criar conta
        </RouterLink>
      </div>
    </Form>

    <p class="text-label text-muted-foreground-faint max-w-105 text-center">
      AI Invest · carteiras recomendadas revisadas mensalmente por analistas. Suporte:
      suporte@aiinvest.com.br
    </p>
  </section>
</template>
