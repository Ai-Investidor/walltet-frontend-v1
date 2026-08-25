<script setup lang="ts">
import { ConfirmDialog } from '@components/admin/confirm-dialog'
import type { AdminUser } from '@data/admin'
import { adminUsers } from '@data/admin'
import Cabecalho from '@views/admin/usuarios/Cabecalho.vue'
import FormularioUsuario from '@views/admin/usuarios/FormularioUsuario.vue'
import Tabela from '@views/admin/usuarios/Tabela.vue'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

// Cópia local do cadastro: criação, edição, status e exclusão acontecem aqui
// até a camada dinâmica existir.
const users = ref<AdminUser[]>(adminUsers.map((user) => ({ ...user })))

const formOpen = ref(false)
const deactivateOpen = ref(false)
const reactivateOpen = ref(false)
const deleteOpen = ref(false)

/** Usuário em foco no formulário; `null` significa cadastro novo. */
const editing = ref<AdminUser | null>(null)
/** Usuário alvo da confirmação de status ou exclusão. */
const target = ref<AdminUser | null>(null)

const dateFormatter = new Intl.DateTimeFormat('pt-BR')

/** O e-mail já é ASCII, então basta normalizar separadores para virar id. */
function slugify(email: string) {
  return email
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function openCreate() {
  editing.value = null
  formOpen.value = true
}

function openEdit(user: AdminUser) {
  editing.value = user
  formOpen.value = true
}

function save(values: { name: string; email: string; role: AdminUser['role'] }) {
  const current = editing.value

  if (current) {
    users.value = users.value.map((user) =>
      user.id === current.id ? { ...user, ...values } : user,
    )
    toast.success(`${values.name} atualizado`)
    return
  }

  const today = dateFormatter.format(new Date())

  users.value = [
    ...users.value,
    {
      id: slugify(values.email),
      name: values.name,
      email: values.email,
      profileLabel: null,
      profileLevel: null,
      role: values.role,
      active: true,
      since: today,
      history: [{ date: today, description: 'Cadastro criado · avaliação de perfil pendente' }],
    },
  ]
  toast.success(`${values.name} cadastrado`)
}

function askDeactivate(user: AdminUser) {
  target.value = user
  deactivateOpen.value = true
}

function askReactivate(user: AdminUser) {
  target.value = user
  reactivateOpen.value = true
}

function askDelete(user: AdminUser) {
  target.value = user
  deleteOpen.value = true
}

function setActive(active: boolean) {
  const current = target.value

  if (!current) {
    return
  }

  users.value = users.value.map((user) => (user.id === current.id ? { ...user, active } : user))
  toast.success(`${current.name} ${active ? 'reativado' : 'inativado'}`)
}

function remove() {
  const current = target.value

  if (!current) {
    return
  }

  users.value = users.value.filter((user) => user.id !== current.id)
  toast.success(`${current.name} excluído`)
}
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <Cabecalho @novo="openCreate" />

    <Tabela
      :users="users"
      @editar="openEdit"
      @inativar="askDeactivate"
      @reativar="askReactivate"
      @excluir="askDelete"
    />
  </div>

  <FormularioUsuario v-model:open="formOpen" :user="editing" @salvar="save" />

  <ConfirmDialog
    v-model:open="deactivateOpen"
    title="Inativar este usuário?"
    :description="
      target
        ? `${target.name} perde o acesso à plataforma, mas o cadastro e o histórico de avaliações são preservados.`
        : undefined
    "
    confirm-label="Inativar usuário"
    cancel-label="Manter ativo"
    tone="destructive"
    @confirm="setActive(false)"
  />

  <ConfirmDialog
    v-model:open="reactivateOpen"
    title="Reativar este usuário?"
    :description="
      target ? `${target.name} volta a ter acesso à plataforma com o mesmo papel.` : undefined
    "
    confirm-label="Reativar usuário"
    @confirm="setActive(true)"
  />

  <ConfirmDialog
    v-model:open="deleteOpen"
    title="Excluir este usuário?"
    :description="
      target
        ? `O cadastro de ${target.name} e todo o histórico de avaliações são removidos. Esta ação é irreversível — para apenas suspender o acesso, use a inativação.`
        : undefined
    "
    confirm-label="Excluir definitivamente"
    cancel-label="Cancelar"
    tone="destructive"
    @confirm="remove"
  />
</template>
