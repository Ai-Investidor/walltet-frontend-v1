<script setup lang="ts">
import { PageHeader } from '@components/shared/page-header'
import { Button } from '@components/ui/button'
import { PhPlus } from '@phosphor-icons/vue'

const emit = defineEmits<{
  novo: []
}>()
</script>

<template>
  <PageHeader
    eyebrow="Gestão"
    title="Usuários"
    description="240 investidores e 3 analistas. Clique em um nome para ver dados, perfil e histórico de avaliações."
  >
    <template #action>
      <Button
        type="button"
        size="lg"
        class="text-button-sm gap-2.5 rounded-sm px-4"
        @click="emit('novo')"
      >
        <PhPlus class="size-4" aria-hidden="true" />
        Novo usuário
      </Button>
    </template>
  </PageHeader>
</template>
