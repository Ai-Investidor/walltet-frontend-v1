<script setup lang="ts">
import { Card } from '@components/ui/card'
import { PhArrowRight, PhCheckCircle, PhCircle } from '@phosphor-icons/vue'
import type { AdminDashboardResponseDto } from '@services/types'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { cn } from '@/libs/utils'

interface Props {
  dashboard: AdminDashboardResponseDto
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

// `GET /dashboard/admin` só devolve totais da competência (versões publicadas, relatórios
// gerados), não uma lista de pendências por carteira — o checklist granular do design original
// exigiria um GET por carteira que a API não tem hoje (docs/AUDITORIA-INTEGRACAO.md, achado 4.10).
// Este card mostra o que a API sustenta: o resumo do fechamento, com atalho pra tela de carteiras.
const itens = computed(() => {
  const f = props.dashboard.fechamentoMesAtual

  return [
    {
      title: 'Versões publicadas',
      done: f.versoesPublicadas,
      total: props.dashboard.carteirasAtivas,
    },
    {
      title: 'Relatórios gerados',
      done: f.relatoriosGerados,
      total: props.dashboard.carteirasAtivas,
    },
  ]
})
</script>

<template>
  <Card :class="cn(CARD_SURFACE, props.class)">
    <div class="flex items-center justify-between gap-3 border-b border-border px-4.5 py-3.5">
      <h2 id="checklist-fechamento" class="text-card-title">
        Status do fechamento
      </h2>

      <p class="text-label text-muted-foreground-faint">
        Competência {{ dashboard.fechamentoMesAtual.mesReferencia }}
      </p>
    </div>

    <ul aria-labelledby="checklist-fechamento">
      <li v-for="item in itens" :key="item.title" class="border-border not-last:border-b">
        <RouterLink
          to="/admin/carteiras"
          class="flex items-center gap-3.5 px-4.5 py-3.5 transition-colors hover:bg-muted/50"
        >
          <component
            :is="item.done >= item.total ? PhCheckCircle : PhCircle"
            class="size-4.5 shrink-0"
            :class="item.done >= item.total ? 'text-success' : 'text-muted-foreground-faint'"
            aria-hidden="true"
          />

          <div class="min-w-0 flex-1">
            <p class="text-paragraph-strong truncate">
              {{ item.title }}
            </p>
            <p class="text-label truncate text-muted-foreground-faint">
              Carteiras → Composição
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
