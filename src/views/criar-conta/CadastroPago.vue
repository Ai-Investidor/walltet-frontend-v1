<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import * as assinaturas from '@services/assinaturas'
import type { ErrorPayload } from '@services/types'
import { onBeforeUnmount, ref } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{ checkoutUrl: string }>()
const emit = defineEmits<{ codigoEnviado: [dados: { email: string; desafioId: string }] }>()
const email = ref('')
const enviando = ref(false)
const aguardando = ref(false)
const erro = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
let rodada = 0
let verificacoes = 0
let desmontado = false
onBeforeUnmount(() => {
  desmontado = true
  rodada++
  clearTimeout(timer)
})
function mensagem(err: unknown) {
  return (
    (err as ErrorPayload).error?.message ??
    'Não foi possível verificar o pagamento agora. Tente novamente.'
  )
}
async function enviarCodigo(destino: string, atual: number) {
  const resposta = await assinaturas.solicitarCodigo(destino)
  if (desmontado || atual !== rodada) return
  if (resposta.status === 'codigo_enviado' && resposta.desafioId) {
    aguardando.value = false
    emit('codigoEnviado', { email: destino, desafioId: resposta.desafioId })
  } else {
    aguardando.value = true
    agendar(destino, atual)
  }
}
function agendar(destino: string, atual: number) {
  clearTimeout(timer)
  if (++verificacoes > 15) {
    aguardando.value = false
    erro.value =
      'Não encontramos uma assinatura com este e-mail. Use o e-mail da compra ou fale com suporte@aiinvest.com.br. Se acabou de pagar por Pix, tente novamente em alguns instantes.'
    return
  }
  timer = setTimeout(async () => {
    try {
      const resposta = await assinaturas.statusCadastro(destino)
      if (desmontado || atual !== rodada) return
      if (resposta.status === 'liberado') await enviarCodigo(destino, atual)
      else agendar(destino, atual)
    } catch (err) {
      if (atual !== rodada || desmontado) return
      aguardando.value = false
      erro.value = mensagem(err)
    }
  }, 8000)
}
async function verificar() {
  clearTimeout(timer)
  const atual = ++rodada
  const destino = email.value.trim().toLowerCase()
  verificacoes = 0
  aguardando.value = false
  erro.value = ''
  enviando.value = true
  try {
    await enviarCodigo(destino, atual)
  } catch (err) {
    if (atual === rodada && !desmontado) erro.value = mensagem(err)
  } finally {
    if (atual === rodada && !desmontado) enviando.value = false
  }
}
function trocarEmail() {
  rodada++
  clearTimeout(timer)
  aguardando.value = false
  erro.value = ''
}
</script>
<template>
  <form class="flex w-full max-w-105 flex-col gap-5 rounded-lg border border-border bg-card p-6" @submit.prevent="verificar">
    <header class="flex flex-col gap-2">
      <p class="text-eyebrow text-muted-foreground-faint">Plano anual</p>
      <h1 id="criar-conta-titulo" class="text-page-title-sm">Ative seu acesso</h1>
      <p class="text-label text-muted-foreground">Use o mesmo e-mail informado no checkout. Após a confirmação do pagamento, enviaremos um código para você criar sua conta.</p>
    </header>
    <div class="flex flex-col gap-2">
      <label for="email-compra" class="text-label-strong">E-mail da compra</label>
      <Input id="email-compra" v-model="email" type="email" required maxlength="255" autocomplete="email" placeholder="nome@email.com" :disabled="enviando" @input="trocarEmail" />
    </div>
    <p v-if="aguardando" role="status" class="text-label text-muted-foreground">Estamos confirmando seu pagamento. Isso leva alguns segundos. Você pode manter esta página aberta.</p>
    <p v-if="erro" role="alert" class="text-label text-destructive">{{ erro }}</p>
    <Button type="submit" :disabled="enviando">{{ enviando ? 'Verificando…' : aguardando ? 'Verificar novamente' : 'Confirmar pagamento e receber código' }}</Button>
    <div class="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-label">
      <a :href="props.checkoutUrl" class="text-primary underline">Ainda não assinei</a>
      <RouterLink to="/login" class="text-foreground underline">Já tenho conta</RouterLink>
    </div>
  </form>
</template>
