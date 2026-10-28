<script setup lang="ts">
import { BrandLogo } from '@components/shared/brand-logo'
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
import type { ConfiguracaoCadastro } from '@services/assinaturas'
import * as assinaturasService from '@services/assinaturas'
import type { ErrorPayload } from '@services/types'
import { useAuthStore } from '@stores/auth'
import { toTypedSchema } from '@vee-validate/zod'
import CadastroPago from '@views/criar-conta/CadastroPago.vue'
import { computed, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import * as z from 'zod'

const router = useRouter()
const auth = useAuthStore()
const configuracao = ref<ConfiguracaoCadastro | null>(null)
const erroConfiguracao = ref(false)
const desafio = ref<{ email: string; desafioId: string } | null>(null)
async function carregarConfiguracao() {
  erroConfiguracao.value = false
  try {
    configuracao.value = await assinaturasService.configuracaoCadastro()
  } catch {
    erroConfiguracao.value = true
  }
}
onMounted(carregarConfiguracao)

const CAMPO_CLASSES = 'placeholder:text-muted-foreground-faint border-border h-10.5 rounded-sm px-3'

// Regra do backend (INTEGRATION_PROMPT.md §4.1): mín. 8 caracteres, 1 número, 1 caractere
// especial. O front valida o mesmo antes de enviar, pra não depender só do erro da API.
const schema = computed(() =>
  toTypedSchema(
    z.object({
      codigoConfirmacao: configuracao.value?.exigirPagamento
        ? z
            .string({ message: 'Informe o código recebido' })
            .regex(/^\d{8}$/, 'O código precisa ter 8 dígitos')
        : z.string().optional(),
      nome: z.string({ message: 'Informe seu nome completo' }).min(2, 'Informe seu nome completo'),
      email: z
        .string({ message: 'Informe seu e-mail' })
        .min(1, 'Informe seu e-mail')
        .email('Informe um e-mail válido'),
      senha: z
        .string({ message: 'Informe uma senha' })
        .min(8, 'A senha precisa ter no mínimo 8 caracteres')
        .regex(/\d/, 'A senha precisa de ao menos 1 número')
        .regex(/[^A-Za-z0-9]/, 'A senha precisa de ao menos 1 caractere especial'),
    }),
  ),
)

const erroGeral = ref('')
const enviando = ref(false)
function receberDesafio(dados: { email: string; desafioId: string }) {
  desafio.value = dados
  erroGeral.value = ''
}
function reiniciarConfirmacao() {
  desafio.value = null
  erroGeral.value = ''
}

async function onSubmit(values: Record<string, unknown>) {
  erroGeral.value = ''
  enviando.value = true

  try {
    await auth.registrar({
      nome: values.nome as string,
      email: values.email as string,
      senha: values.senha as string,
      ...(configuracao.value?.exigirPagamento && desafio.value
        ? {
            desafioId: desafio.value.desafioId,
            codigoConfirmacao: values.codigoConfirmacao as string,
          }
        : {}),
    })
    router.push({ name: 'avaliacao-perfil' })
  } catch (err) {
    const payload = err as ErrorPayload
    erroGeral.value = payload.error?.message ?? 'Não foi possível criar a conta. Tente novamente.'
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <section
    aria-labelledby="criar-conta-titulo"
    class="flex w-full flex-col items-center gap-6.5 px-6 py-10 max-sm:px-4 max-sm:py-8"
  >
    <BrandLogo class="h-14" />

    <div v-if="erroConfiguracao" role="alert" class="flex max-w-105 flex-col gap-4 text-label text-destructive">
      Não foi possível verificar o cadastro agora. Tente novamente.
      <Button variant="outline" @click="carregarConfiguracao">Tentar novamente</Button>
    </div>
    <p v-else-if="!configuracao" role="status" class="text-label text-muted-foreground">Verificando acesso ao cadastro…</p>
    <div v-else-if="configuracao.cadastroDisponivel === false" class="flex w-full max-w-105 flex-col gap-5 rounded-lg border border-border bg-card p-6">
      <h1 id="criar-conta-titulo" class="text-page-title-sm">Cadastro temporariamente indisponível</h1>
      <p class="text-label text-muted-foreground">Se você já comprou o plano anual, fale com nossa equipe para ativar seu acesso.</p>
      <a href="mailto:suporte@aiinvest.com.br" class="text-label text-primary underline">suporte@aiinvest.com.br</a>
      <Button as-child variant="outline"><RouterLink to="/login">Já tenho conta · Entrar</RouterLink></Button>
    </div>
    <CadastroPago v-else-if="configuracao.exigirPagamento && !desafio" :checkout-url="configuracao.checkoutUrl" @codigo-enviado="receberDesafio" />
    <Form v-else
      :initial-values="{ email: desafio?.email ?? '' }"
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
              :readonly="Boolean(desafio)"
              placeholder="nome@email.com"
              :class="CAMPO_CLASSES"
              v-bind="componentField"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div v-if="desafio" class="flex flex-col gap-3">
        <p class="text-label text-muted-foreground">Enviamos um código para {{ desafio.email }}. Ele vale por 10 minutos.</p>
        <FormField v-slot="{ componentField }" name="codigoConfirmacao">
          <FormItem><FormLabel>Código de confirmação</FormLabel><FormControl><Input autocomplete="one-time-code" inputmode="numeric" maxlength="8" v-bind="componentField" /></FormControl><FormMessage /></FormItem>
        </FormField>
        <Button type="button" variant="outline" @click="reiniciarConfirmacao">Usar outro e-mail ou solicitar novo código</Button>
      </div>
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
            Use 8 caracteres ou mais, com pelo menos um número e um símbolo.
          </FormDescription>

          <FormMessage />
        </FormItem>
      </FormField>

      <p v-if="erroGeral" role="alert" class="text-label text-destructive">
        {{ erroGeral }}
      </p>

      <Button type="submit" :disabled="enviando" class="text-table-value h-11 w-full rounded-sm">
        {{ enviando ? 'Criando conta…' : desafio ? 'Confirmar e criar conta' : 'Criar conta' }}
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
