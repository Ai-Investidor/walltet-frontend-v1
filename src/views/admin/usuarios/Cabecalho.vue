<script setup lang="ts">
import { PageHeader } from '@components/shared/page-header'
import { Button } from '@components/ui/button'
import { PhPlus } from '@phosphor-icons/vue'

const emit = defineEmits<{ novo: [] }>()
</script>
<template>
  <PageHeader eyebrow="Administração" title="Usuários" description="Cadastre pessoas, ajuste permissões e gerencie o acesso à plataforma.">
    <template #action><Button @click="emit('novo')"><PhPlus aria-hidden="true" />Novo usuário</Button></template>
  </PageHeader>
</template>
