<script setup lang="ts">
import { ConfirmDialog } from '@components/admin/confirm-dialog'
import type { CatalogAsset } from '@data/admin'
import { catalogAssets } from '@data/admin'
import Cabecalho from '@views/admin/ativos/Cabecalho.vue'
import ClasseSelecionada from '@views/admin/ativos/ClasseSelecionada.vue'
import DialogoInativacao from '@views/admin/ativos/DialogoInativacao.vue'
import Filtros from '@views/admin/ativos/Filtros.vue'
import FormularioAtivo from '@views/admin/ativos/FormularioAtivo.vue'
import Tabela from '@views/admin/ativos/Tabela.vue'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

// Cópia local do catálogo: cadastro, edição e inativação acontecem aqui até a
// camada dinâmica existir.
const assets = ref<CatalogAsset[]>(catalogAssets.map((asset) => ({ ...asset })))

// A classe filtrada governa a tabela e o painel de contexto — por isso vive na página.
const activeClass = ref('Ações BR')

const formOpen = ref(false)
const deactivateOpen = ref(false)
const reactivateOpen = ref(false)

/** Ativo em foco no formulário; `null` significa cadastro novo. */
const editing = ref<CatalogAsset | null>(null)
/** Ativo alvo da mudança de status. */
const target = ref<CatalogAsset | null>(null)

function openCreate() {
  editing.value = null
  formOpen.value = true
}

function openEdit(asset: CatalogAsset) {
  editing.value = asset
  formOpen.value = true
}

function save(asset: CatalogAsset) {
  const current = editing.value

  if (current) {
    assets.value = assets.value.map((item) => (item.ticker === current.ticker ? asset : item))
    toast.success(`${asset.ticker} atualizado`)
    return
  }

  assets.value = [...assets.value, asset]
  activeClass.value = asset.className
  toast.success(`${asset.ticker} cadastrado`)
}

function askDeactivate(asset: CatalogAsset) {
  target.value = asset
  deactivateOpen.value = true
}

function askReactivate(asset: CatalogAsset) {
  target.value = asset
  reactivateOpen.value = true
}

function deactivate(motivo: string) {
  const current = target.value

  if (!current) {
    return
  }

  assets.value = assets.value.map((item) =>
    item.ticker === current.ticker ? { ...item, active: false, deactivationReason: motivo } : item,
  )
  toast.success(`${current.ticker} inativado`)
}

function reactivate() {
  const current = target.value

  if (!current) {
    return
  }

  assets.value = assets.value.map((item) =>
    item.ticker === current.ticker
      ? { ...item, active: true, deactivationReason: undefined }
      : item,
  )
  toast.success(`${current.ticker} reativado`)
}
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <Cabecalho @novo="openCreate" />
    <Filtros v-model="activeClass" />

    <Tabela
      :assets="assets"
      :active-class="activeClass"
      @editar="openEdit"
      @inativar="askDeactivate"
      @reativar="askReactivate"
    />

    <ClasseSelecionada :assets="assets" :active-class="activeClass" />
  </div>

  <FormularioAtivo v-model:open="formOpen" :asset="editing" @salvar="save" />

  <DialogoInativacao v-model:open="deactivateOpen" :asset="target" @confirmar="deactivate" />

  <ConfirmDialog
    v-model:open="reactivateOpen"
    title="Reativar este ativo?"
    :description="
      target
        ? `${target.ticker} volta a ficar disponível para entrar em novas versões de carteira.`
        : undefined
    "
    confirm-label="Reativar ativo"
    @confirm="reactivate"
  />
</template>
