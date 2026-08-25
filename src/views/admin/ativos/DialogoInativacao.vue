<script setup lang="ts">
import { ConfirmDialog } from '@components/admin/confirm-dialog'
import { Textarea } from '@components/ui/textarea'
import type { CatalogAsset } from '@data/admin'
import { PhWarning } from '@phosphor-icons/vue'
import { computed, ref, watch } from 'vue'

interface Props {
  asset: CatalogAsset | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  confirmar: [motivo: string]
}>()

const open = defineModel<boolean>('open', { required: true })

/** Mínimo que torna o motivo auditável depois. */
const MIN_LENGTH = 10

const reason = ref('')

// Cada abertura começa com o campo limpo.
watch(open, (isOpen) => {
  if (isOpen) {
    reason.value = ''
  }
})

const trimmed = computed(() => reason.value.trim())

const isValid = computed(() => trimmed.value.length >= MIN_LENGTH)
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Inativar este ativo?"
    :description="
      props.asset
        ? `${props.asset.ticker} deixa de aparecer para novas versões de carteira. As versões já publicadas preservam o histórico.`
        : undefined
    "
    confirm-label="Inativar ativo"
    cancel-label="Manter ativo"
    tone="destructive"
    :confirm-disabled="!isValid"
    @confirm="emit('confirmar', trimmed)"
  >
    <div class="flex flex-col gap-1.75">
      <label for="motivo-inativacao" class="text-eyebrow text-muted-foreground-faint">
        Motivo da inativação
      </label>

      <Textarea
        id="motivo-inativacao"
        v-model="reason"
        class="text-paragraph h-21 rounded-sm px-3 py-2.75"
        placeholder="Descreva por que o ativo está saindo do catálogo"
      />

      <p
        v-if="!isValid"
        class="text-label flex items-center gap-1.5 text-warning"
        role="status"
      >
        <PhWarning class="size-3.5 shrink-0" aria-hidden="true" />
        O motivo precisa de ao menos {{ MIN_LENGTH }} caracteres.
      </p>
    </div>
  </ConfirmDialog>
</template>
