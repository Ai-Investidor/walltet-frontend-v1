<script setup lang="ts">
import { ALL_CLASSES } from '@constants/asset-class'
import { assetClasses } from '@data/admin'
import { PhFunnel } from '@phosphor-icons/vue'
import { computed } from 'vue'

const activeClass = defineModel<string>({ required: true })

const filters = computed(() => [ALL_CLASSES, ...assetClasses.map((item) => item.label)])
</script>

<template>
  <div class="flex items-center gap-3" role="group" aria-label="Filtrar ativos por classe">
    <p class="text-eyebrow flex items-center gap-2 text-muted-foreground-faint">
      <PhFunnel class="size-3.5" aria-hidden="true" />
      Classe
    </p>

    <button
      v-for="filter in filters"
      :key="filter"
      type="button"
      :aria-pressed="filter === activeClass"
      class="text-chip rounded-sm border px-3 py-1.5 transition-colors"
      :class="
        filter === activeClass
          ? 'border-foreground bg-foreground text-background'
          : 'border-border text-muted-foreground hover:border-border-strong'
      "
      @click="activeClass = filter"
    >
      {{ filter }}
    </button>
  </div>
</template>
