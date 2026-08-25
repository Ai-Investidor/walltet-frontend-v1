<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'
import type { ConfirmTone } from '.'

interface Props {
  title: string
  description?: string
  confirmLabel: string
  cancelLabel?: string
  /** `destructive` tinge a ação de vermelho; use em exclusão e inativação. */
  tone?: ConfirmTone
  /** Trava a confirmação enquanto o conteúdo do slot não estiver válido. */
  confirmDisabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  cancelLabel: 'Cancelar',
  tone: 'default',
  confirmDisabled: false,
})

const emit = defineEmits<{
  confirm: []
}>()

const open = defineModel<boolean>('open', { required: true })

const TONE_ACTION: Record<ConfirmTone, string> = {
  default: '',
  destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
}
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogContent
      data-slot="confirm-dialog"
      :class="cn('gap-0 rounded-lg p-0 sm:max-w-115', props.class)"
    >
      <!-- O header do kit é um grid com place-items-start: sem o stretch, o slot
           encolhe para o conteúdo e desalinha da descrição. -->
      <AlertDialogHeader class="gap-3 p-5 [&>*]:w-full">
        <AlertDialogTitle class="text-subtitle">
          {{ props.title }}
        </AlertDialogTitle>

        <AlertDialogDescription
          v-if="props.description"
          class="text-paragraph-strong font-normal text-muted-foreground"
        >
          {{ props.description }}
        </AlertDialogDescription>

        <slot />
      </AlertDialogHeader>

      <AlertDialogFooter class="flex-row gap-3 border-t border-border px-5 py-4">
        <AlertDialogAction
          :class="cn('text-button-sm h-9 gap-2.5 rounded-sm px-4', TONE_ACTION[props.tone])"
          :disabled="props.confirmDisabled"
          @click="emit('confirm')"
        >
          <slot name="confirm-icon" />
          {{ props.confirmLabel }}
        </AlertDialogAction>

        <AlertDialogCancel class="text-button-sm h-9 rounded-sm border-foreground px-4">
          {{ props.cancelLabel }}
        </AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
