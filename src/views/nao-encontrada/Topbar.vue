<script setup lang="ts">
import { BrandLogo } from '@components/shared/brand-logo'
import { RouterLink } from 'vue-router'
</script>

<template>
  <header
    class="bg-card border-border flex h-14 w-full shrink-0 items-center justify-between gap-3 border-b px-5"
  >
    <BrandLogo class="h-9" />

    <RouterLink
      to="/login"
      class="text-topbar-meta text-muted-foreground hover:text-foreground transition-colors"
    >
      Sair
    </RouterLink>
  </header>
</template>
