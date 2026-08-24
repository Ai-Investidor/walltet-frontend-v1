<script setup lang="ts">
import { KpiCard } from '@components/wallet/kpi-card'
import { kpis } from '@data/wallet'
</script>

<template>
  <ul
    class="bg-border grid grid-cols-6 gap-px overflow-hidden rounded-lg border max-2xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1"
  >
    <KpiCard
      v-for="kpi in kpis"
      :key="kpi.label"
      :label="kpi.label"
      :value="kpi.value"
      :note="kpi.note"
      :tone="kpi.tone"
    />
  </ul>
</template>
