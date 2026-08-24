<script setup lang="ts">
import { Badge } from '@components/ui/badge'
import { totalWealth } from '@data/wallet'
import { PhTrendUp } from '@phosphor-icons/vue'
</script>

<template>
  <div class="flex items-start justify-between gap-12 max-lg:flex-col max-lg:gap-6">
    <header class="flex min-w-0 flex-1 flex-col gap-2">
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

    <div class="bg-card w-90 shrink-0 rounded-lg border p-5.5 max-lg:w-full">
      <p class="text-eyebrow text-muted-foreground-faint">
        Patrimônio total
      </p>

      <p class="text-metric-md text-foreground mt-3.5">
        {{ totalWealth.value }}
      </p>

      <div class="mt-3.5 flex items-center gap-2.5">
        <Badge variant="success" class="text-eyebrow gap-1.25 rounded-sm px-2 py-1">
          <PhTrendUp class="size-3.25" weight="bold" aria-hidden="true" />
          {{ totalWealth.changePercent }}
        </Badge>

        <p class="text-label text-muted-foreground-faint">
          {{ totalWealth.changeLabel }}
        </p>
      </div>
    </div>
  </div>
</template>
