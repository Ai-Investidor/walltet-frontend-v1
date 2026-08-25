<script setup lang="ts">
import { KpiCard } from '@components/wallet/kpi-card'
import { adminKpis } from '@data/admin'
</script>

<template>
  <ul
    class="bg-border grid grid-cols-4 gap-px overflow-hidden rounded-lg border"
    aria-label="Indicadores do fechamento"
  >
    <KpiCard
      v-for="kpi in adminKpis"
      :key="kpi.label"
      :label="kpi.label"
      :value="kpi.value"
      :note="kpi.note"
      tone="neutral"
    />
  </ul>
</template>
