<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet'
import type { ErrorPayload } from '@services/types'
import * as usuariosService from '@services/usuarios'
import { reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ criado: [] }>()
const dados = reactive<usuariosService.CriarUsuarioPayload>({
  nome: '',
  email: '',
  senha: '',
  perfil: 'cliente',
})
const salvando = ref(false)
const erro = ref('')
watch(open, (aberto) => {
  if (aberto) {
    Object.assign(dados, { nome: '', email: '', senha: '', perfil: 'cliente' })
    erro.value = ''
  }
})
async function salvar() {
  if (salvando.value) return
  erro.value = ''
  if (!/^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,72}$/.test(dados.senha)) {
    erro.value = 'A senha precisa ter de 8 a 72 caracteres, um número e um caractere especial.'
    return
  }
  salvando.value = true
  try {
    await usuariosService.criar({ ...dados, nome: dados.nome.trim(), email: dados.email.trim() })
    dados.senha = ''
    toast.success('Usuário cadastrado')
    open.value = false
    emit('criado')
  } catch (err) {
    erro.value = (err as ErrorPayload).error?.message ?? 'Não foi possível cadastrar o usuário.'
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <Sheet v-model:open="open">
    <SheetContent class="overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Novo usuário</SheetTitle>
        <SheetDescription>Cadastre um cliente ou administrador. O usuário deverá aceitar os termos no primeiro acesso.</SheetDescription>
      </SheetHeader>
      <form class="flex flex-col gap-5 p-4" @submit.prevent="salvar">
        <div class="flex flex-col gap-2"><label for="novo-nome" class="text-label-strong">Nome completo</label><Input id="novo-nome" v-model="dados.nome" required minlength="2" maxlength="150" autocomplete="name" /></div>
        <div class="flex flex-col gap-2"><label for="novo-email" class="text-label-strong">E-mail</label><Input id="novo-email" v-model="dados.email" type="email" required maxlength="255" autocomplete="email" /></div>
        <div class="flex flex-col gap-2"><label for="novo-senha" class="text-label-strong">Senha inicial</label><Input id="novo-senha" v-model="dados.senha" type="password" required minlength="8" maxlength="72" autocomplete="new-password" /><p class="text-label text-muted-foreground">Use pelo menos 8 caracteres, um número e um símbolo. Compartilhe a senha diretamente com o usuário.</p></div>
        <div class="flex flex-col gap-2"><label for="novo-papel" class="text-label-strong">Permissão</label><select id="novo-papel" v-model="dados.perfil" class="h-10 rounded-md border border-input bg-card px-3 text-label"><option value="cliente">Cliente</option><option value="admin">Administrador</option></select></div>
        <p v-if="erro" role="alert" class="text-label text-destructive">{{ erro }}</p>
        <Button type="submit" :disabled="salvando">{{ salvando ? 'Cadastrando…' : 'Cadastrar usuário' }}</Button>
        <Button type="button" variant="outline" :disabled="salvando" @click="open = false">Cancelar</Button>
      </form>
    </SheetContent>
  </Sheet>
</template>
