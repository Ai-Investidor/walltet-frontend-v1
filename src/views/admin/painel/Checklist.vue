<script setup lang="ts">
import { Card } from '@components/ui/card'
import { closingChecklist } from '@data/admin'
import { PhArrowRight, PhCheckCircle, PhCircle } from '@phosphor-icons/vue'
import type { HTMLAttributes } from 'vue'
import { RouterLink } from 'vue-router'
import { cn } from '@/libs/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

/** Toda pendência é resolvida dentro de Carteiras — o destino indica só a aba. */
const CHECKLIST_TARGET = '/admin/carteiras'
</script>

<template>
  <Card :class="cn(CARD_SURFACE, props.class)">
    <div class="flex items-center justify-between gap-3 border-b border-border px-4.5 py-3.5">
      <h2 id="checklist-fechamento" class="text-card-title">
        Checklist de fechamento
      </h2>

      <p class="text-label text-muted-foreground-faint">
        Competência 2026-09
      </p>
    </div>

    <ul aria-labelledby="checklist-fechamento">
      <li v-for="item in closingChecklist" :key="item.title" class="border-border not-last:border-b">
        <RouterLink
          :to="CHECKLIST_TARGET"
          class="flex items-center gap-3.5 px-4.5 py-3.5 transition-colors hover:bg-muted/50"
        >
          <component
            :is="item.done === item.total ? PhCheckCircle : PhCircle"
            class="size-4.5 shrink-0"
            :class="item.done === item.total ? 'text-success' : 'text-muted-foreground-faint'"
            aria-hidden="true"
          />

          <div class="min-w-0 flex-1">
            <p class="text-paragraph-strong truncate">
              {{ item.title }}
            </p>
            <p class="text-label truncate text-muted-foreground-faint">
              {{ item.destination }}
            </p>
          </div>

          <span class="text-meta w-15 shrink-0 text-muted-foreground tabular-nums">
            {{ item.done }} de {{ item.total }}
          </span>

          <PhArrowRight class="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </RouterLink>
      </li>
    </ul>
  </Card>
</template>
