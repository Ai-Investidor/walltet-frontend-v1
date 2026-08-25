<script setup lang="ts">
import { walletDetail } from '@data/admin'
import { PhArrowLeft } from '@phosphor-icons/vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const meta = computed(() => [
  `Perfil-alvo: ${walletDetail.profileLabel}`,
  `${walletDetail.investors} investidores vinculados`,
  `Vigente: ${walletDetail.currentCompetence}`,
  `Em edição: ${walletDetail.draftCompetence}`,
])
</script>

<template>
  <header class="flex flex-col gap-2">
    <RouterLink
      to="/admin/carteiras"
      class="text-eyebrow flex w-fit items-center gap-1.5 text-muted-foreground-faint hover:text-foreground"
    >
      <PhArrowLeft class="size-3.5" aria-hidden="true" />
      Carteiras
    </RouterLink>

    <h1 class="text-page-title text-foreground">
      {{ walletDetail.name }}
    </h1>

    <ul class="flex flex-wrap gap-x-4 gap-y-1">
      <li v-for="item in meta" :key="item" class="text-label text-muted-foreground">
        {{ item }}
      </li>
    </ul>
  </header>
</template>
