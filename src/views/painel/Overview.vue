<script setup lang="ts">
import { kpis } from '@data/wallet'
</script>

<template>
  <section class="flex flex-col gap-6">
    <header class="flex flex-col gap-2">
      <p class="text-eyebrow text-muted-foreground-faint">
        Painel do investidor · Agosto 2026
      </p>

      <h1 class="text-page-title text-foreground">
        Sua carteira foi revisada em agosto
      </h1>

      <p class="text-paragraph text-muted-foreground mt-1 max-w-[460px]">
        A revisão de agosto trocou um ativo e ajustou dois pesos. O relatório
        completo do mês está disponível para download.
      </p>
    </header>

    <ul
      class="bg-border grid grid-cols-4 gap-px overflow-hidden rounded-lg border max-lg:grid-cols-2 max-sm:grid-cols-1"
    >
      <li
        v-for="kpi in kpis"
        :key="kpi.label"
        class="bg-card flex flex-col gap-2 p-5"
      >
        <p class="text-eyebrow text-muted-foreground-faint">
          {{ kpi.label }}
        </p>

        <p
          class="text-metric"
          :class="kpi.tone === 'positive' ? 'text-success' : 'text-foreground'"
        >
          {{ kpi.value }}
        </p>

        <p class="text-label text-muted-foreground">
          {{ kpi.note }}
        </p>
      </li>
    </ul>
  </section>
</template>
