<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { Input } from '@components/ui/input'
import { PhCheckCircle, PhShield } from '@phosphor-icons/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { nextTick, ref, useTemplateRef } from 'vue'
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
const emailEnviado = ref('')
const descricaoRef = useTemplateRef<HTMLParagraphElement>('descricao')

async function onSubmit(values: Record<string, unknown>) {
  emailEnviado.value = String(values.email ?? '')
  enviado.value = true
  await nextTick()
  descricaoRef.value?.focus()
}

// "Enviar de novo" (design): sem endpoint de reenvio real nesta fase, então a ação
// disponível é reabrir o formulário pra um novo envio.
function reenviar() {
  enviado.value = false
}
</script>

<template>
  <section
    aria-labelledby="recuperar-senha-titulo"
    class="flex w-full flex-col items-center gap-6.5 px-6 py-10 max-sm:px-4 max-sm:py-8"
  >
    <div class="flex items-center gap-2.5">
      <div class="bg-foreground flex size-6.5 items-center justify-center rounded-sm">
        <span class="text-eyebrow text-background" aria-hidden="true">AI</span>
      </div>
      <span class="text-card-title">AI Invest</span>
    </div>

    <div class="bg-card border-border flex w-full max-w-105 flex-col gap-5 rounded-lg border px-6 py-6.5">
      <template v-if="!enviado">
        <header class="flex flex-col gap-2">
          <p class="text-eyebrow text-muted-foreground-faint">
            ACESSO
          </p>
          <h1 id="recuperar-senha-titulo" class="text-page-title-sm">
            Recuperar senha
          </h1>
          <p class="text-table-row text-muted-foreground">
            Informe o e-mail cadastrado. Enviamos um link de redefinição válido por 30 minutos.
          </p>
        </header>

        <Form class="flex flex-col gap-5" :validation-schema="schema" @submit="onSubmit">
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

        <RouterLink to="/login" class="text-topbar-meta text-foreground self-start hover:underline">
          Voltar para entrar
        </RouterLink>
      </template>

      <template v-else>
        <PhCheckCircle class="text-success size-6.5" aria-hidden="true" />

        <div class="flex flex-col gap-2">
          <h1 id="recuperar-senha-titulo" class="text-page-title-sm">
            Link enviado
          </h1>
          <p
            ref="descricao"
            tabindex="-1"
            class="text-table-row text-muted-foreground focus-visible:outline-none"
            aria-live="polite"
          >
            Se existir uma conta com {{ emailEnviado }}, o link de redefinição chega em alguns
            minutos. Ele expira em 30 minutos e só pode ser usado uma vez.
          </p>
        </div>

        <div class="border-border flex flex-col gap-2 border-t pt-4">
          <Button as-child class="text-table-value h-11 w-full rounded-sm">
            <RouterLink to="/login">
              Voltar para entrar
            </RouterLink>
          </Button>

          <button
            type="button"
            class="text-label text-success self-start hover:underline"
            @click="reenviar"
          >
            Enviar de novo
          </button>
        </div>
      </template>
    </div>

    <p class="text-label text-muted-foreground-faint max-w-105 text-center">
      AI Invest · carteiras recomendadas revisadas mensalmente por analistas. Suporte:
      suporte@aiinvest.com.br
    </p>
  </section>
</template>
