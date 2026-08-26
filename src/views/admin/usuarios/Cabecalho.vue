<script setup lang="ts">
import { PageHeader } from '@components/shared/page-header'
</script>

<template>
  <!--
    "Novo usuário" saiu: não existe POST /usuarios — o único jeito de um usuário nascer é o
    próprio auto-cadastro em /criar-conta (sempre perfil "cliente"). Ver
    docs/AUDITORIA-INTEGRACAO.md, achado 4.3.
  -->
  <PageHeader
    eyebrow="Gestão"
    title="Usuários"
    description="Clique em um usuário para ver dados, papel e situação do cadastro."
  />
</template>
