<!--
  Órfão desde a integração com o backend real: não há POST /usuarios (cadastro pelo admin) nem
  edição de nome/e-mail via API (PATCH /usuarios/:id só aceita `ativo`/`perfil`) — ver
  docs/AUDITORIA-INTEGRACAO.md, achados 4.3 e 4.4. A edição de papel e status agora acontece
  direto no drawer de detalhe em admin/usuarios/Tabela.vue. Implementação original preservada
  abaixo, comentada.

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
  user: AdminUser | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  salvar: [values: { name: string; email: string; role: AdminUser['role'] }]
}>()

const open = defineModel<boolean>('open', { required: true })
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

// ... formulário completo com nome, e-mail e papel — ver histórico do git para o markup.
</script>
-->

<template />
