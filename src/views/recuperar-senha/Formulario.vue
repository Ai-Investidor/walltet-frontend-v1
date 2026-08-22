<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { Input } from '@components/ui/input'
import { PhShield } from '@phosphor-icons/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { RouterLink } from 'vue-router'
import * as z from 'zod'

const schema = toTypedSchema(
  z.object({
    email: z
      .string({ message: 'Informe seu e-mail' })
      .min(1, 'Informe seu e-mail')
      .email('Informe um e-mail válido'),
  }),
)

// Mock: sem envio real nesta fase. A tela de confirmação ("Link enviado") ainda não existe como
// rota, então o sucesso troca o conteúdo do card em vez de navegar.
const enviado = ref(false)
const descricaoRef = useTemplateRef<HTMLParagraphElement>('descricao')

const titulo = computed(() => (enviado.value ? 'Link enviado' : 'Recuperar senha'))

const descricao = computed(() =>
  enviado.value
    ? 'Se existe uma conta com esse e-mail, enviamos um link de redefinição.'
    : 'Informe o e-mail cadastrado. Enviamos um link de redefinição válido por 30 minutos.',
)

async function onSubmit() {
  enviado.value = true
  await nextTick()
  descricaoRef.value?.focus()
}

function tentarOutroEmail() {
  enviado.value = false
}
</script>

<template>
  <section
    aria-labelledby="recuperar-senha-titulo"
    class="flex w-full flex-col items-center gap-6.5 px-6 py-10 max-sm:px-4"
  >
    <div class="flex items-center gap-2.5">
      <div class="bg-foreground flex size-6.5 items-center justify-center rounded-sm">
        <span class="text-eyebrow text-background" aria-hidden="true">AI</span>
      </div>
      <span class="text-card-title">AI Invest</span>
    </div>

    <div class="bg-card border-border flex w-full max-w-105 flex-col gap-5 rounded-lg border px-6 py-6.5">
      <header class="flex flex-col gap-2">
        <p class="text-eyebrow text-muted-foreground-faint">
          ACESSO
        </p>
        <h1 id="recuperar-senha-titulo" class="text-page-title-sm">
          {{ titulo }}
        </h1>
        <p
          ref="descricao"
          tabindex="-1"
          class="text-table-row text-muted-foreground focus-visible:outline-none"
          aria-live="polite"
        >
          {{ descricao }}
        </p>
      </header>

      <Form
        v-if="!enviado"
        class="flex flex-col gap-5"
        :validation-schema="schema"
        @submit="onSubmit"
      >
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
                class="text-table-row placeholder:text-muted-foreground-faint border-border h-10.5 rounded-sm px-3"
                v-bind="componentField"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <Button type="submit" class="text-table-value h-11 w-full rounded-sm">
          Enviar link de redefinição
        </Button>

        <div class="bg-muted border-border-strong flex items-center gap-3 rounded-sm border p-3.5">
          <PhShield class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
          <p class="text-label text-muted-foreground">
            Por segurança, a resposta é a mesma exista ou não uma conta com esse e-mail.
          </p>
        </div>
      </Form>

      <Button v-if="enviado" variant="ghost" class="text-table-value h-11 w-full rounded-sm" @click="tentarOutroEmail">
        Usar outro e-mail
      </Button>

      <RouterLink to="/login" class="text-topbar-meta text-foreground self-start hover:underline">
        Voltar para entrar
      </RouterLink>
    </div>

    <p class="text-label text-muted-foreground-faint max-w-105 text-center">
      AI Invest · carteiras recomendadas revisadas mensalmente por analistas. Suporte:
      suporte@aiinvest.com.br
    </p>
  </section>
</template>
