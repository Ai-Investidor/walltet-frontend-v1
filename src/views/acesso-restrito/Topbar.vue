<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <header
    class="bg-card border-border flex h-14 w-full shrink-0 items-center justify-between gap-3 border-b px-5"
  >
    <div class="flex items-center gap-2.5">
      <div class="bg-foreground flex size-6.5 items-center justify-center rounded-sm">
        <span class="text-eyebrow text-background" aria-hidden="true">AI</span>
      </div>
      <span class="text-card-title">AI Invest</span>
    </div>

    <RouterLink
      to="/login"
      class="text-topbar-meta text-muted-foreground hover:text-foreground transition-colors"
    >
      Sair
    </RouterLink>
  </header>
</template>
