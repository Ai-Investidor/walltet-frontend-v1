<script setup lang="ts">
import { PageHeader } from '@components/shared/page-header'
import { Button } from '@components/ui/button'
import { PhPlus } from '@phosphor-icons/vue'
import { toast } from 'vue-sonner'
</script>

<template>
  <PageHeader
    eyebrow="Gestão"
    title="Ativos"
    description="Cadastro de ativos e contexto da classe selecionada. Inativar um ativo preserva o histórico nas carteiras já publicadas."
  >
    <template #action>
      <Button
        type="button"
        size="lg"
        class="text-button-sm gap-2.5 rounded-sm px-4"
        @click="toast.info('O cadastro de ativos entra na próxima etapa.')"
      >
        <PhPlus class="size-4" aria-hidden="true" />
        Novo ativo
      </Button>
    </template>
  </PageHeader>
</template>
