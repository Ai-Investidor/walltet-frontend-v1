<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header
    class="bg-card border-border flex h-14 w-full shrink-0 items-center justify-between gap-3 border-b px-5"
  >
    <span class="text-card-title text-foreground">AI Invest</span>

    <RouterLink
      to="/"
      class="text-topbar-meta text-muted-foreground hover:text-foreground transition-colors"
    >
      Sair
    </RouterLink>
  </header>
</template>
