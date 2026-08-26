<!--
  Componente desligado do Painel (removido de src/pages/Painel.vue): o gráfico de "Evolução
  patrimonial" depende do patrimônio investido em R$ mês a mês, que não existe em nenhum DTO do
  backend — só composição (%) e rentabilidade (%) existem. Ver docs/AUDITORIA-INTEGRACAO.md §1.1 e
  docs/PROPOSTA-BACKEND-PATRIMONIO.md (proposta enviada pro time de backend). Religar quando/se o
  endpoint existir; a implementação original fica preservada abaixo, comentada.

  <script setup lang="ts">
import { Badge } from '@components/ui/badge'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import { wealthEvolution } from '@data/wallet'
import { PhTrendUp } from '@phosphor-icons/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const CARD_SURFACE = 'gap-0 self-start rounded-lg border py-0 ring-0'
</script>

  <template>
    <Card :class="cn(CARD_SURFACE, props.class)">
      <CardHeader class="flex items-start justify-between gap-3 p-6">
        <div class="flex flex-col gap-1">
          <h2 class="text-card-title">Evolução patrimonial</h2>
          <p class="text-label text-muted-foreground-faint">Últimos 12 meses · R$ mil</p>
        </div>
        <Badge variant="success" class="text-eyebrow gap-1 rounded-sm px-1.5 py-1">
          <PhTrendUp class="size-3" weight="bold" aria-hidden="true" />
          +28,2 %
        </Badge>
      </CardHeader>
      <CardContent class="flex flex-col gap-1.5 px-6 pb-6">
        <div class="flex h-46 items-end gap-1.5" aria-hidden="true">
          <div
            v-for="(point, index) in wealthEvolution"
            :key="index"
            class="w-full rounded-t-sm"
            :class="point.isCurrent ? 'bg-success' : 'bg-muted'"
            :style="{ height: `${point.heightPercent}%` }"
          />
        </div>
        <ul class="flex" aria-hidden="true">
          <li
            v-for="(point, index) in wealthEvolution"
            :key="index"
            class="text-chart-label w-full text-center"
            :class="point.isCurrent ? 'text-success' : 'text-muted-foreground-faint'"
          >
            {{ point.month }}
          </li>
        </ul>
      </CardContent>
    </Card>
  </template>
-->

<template />
