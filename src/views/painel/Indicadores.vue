<script setup lang="ts">
import { KpiCard } from '@components/wallet/kpi-card'
import { kpis } from '@data/wallet'
</script>

<template>
  <ul
    class="bg-border flex gap-px overflow-x-auto rounded-lg border max-sm:grid max-sm:grid-cols-1 max-sm:overflow-visible"
  >
    <KpiCard
      v-for="kpi in kpis"
      :key="kpi.label"
      :label="kpi.label"
      :value="kpi.value"
      :note="kpi.note"
      :tone="kpi.tone"
      class="min-w-55 flex-1 shrink-0"
    />
  </ul>
</template>
