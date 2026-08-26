<script setup lang="ts">
import type { DashboardInvestidorResponseDto, MovimentacoesResponseDto } from '@services/types'
import { formatCompetenciaLonga } from '@utils/competencia'
import { computed } from 'vue'

interface Props {
  dashboard: DashboardInvestidorResponseDto
  movimentacoes: MovimentacoesResponseDto | null
}

const props = defineProps<Props>()

const competenciaLonga = computed(() =>
  props.movimentacoes ? formatCompetenciaLonga(props.movimentacoes.mesReferencia) : null,
)

// "Trocou N ativo(s) e ajustou M peso(s)" é derivado das 4 listas de MovimentacoesResponseDto —
// não existe pronto na API (docs/AUDITORIA-INTEGRACAO.md, achado wallet.ts:Movement[]).
const resumoRevisao = computed(() => {
  const mov = props.movimentacoes?.movimentacoes

  if (!mov) {
    return null
  }

  const trocas = mov.entradas.length + mov.saidas.length
  const ajustes = mov.alteracoes.length

  const partes: string[] = []
  if (trocas > 0) {
    partes.push(`trocou ${trocas} ativo${trocas === 1 ? '' : 's'}`)
  }
  if (ajustes > 0) {
    partes.push(`ajustou ${ajustes} peso${ajustes === 1 ? '' : 's'}`)
  }

  if (partes.length === 0) {
    return 'manteve a composição sem alterações'
  }

  return partes.join(' e ')
})
</script>

<template>
  <header class="flex min-w-0 flex-1 flex-col gap-2">
    <p class="text-eyebrow text-muted-foreground-faint">
      Painel do investidor<template v-if="competenciaLonga"> · {{ competenciaLonga }}</template>
    </p>

    <h1 v-if="dashboard.carteira" class="text-page-title text-foreground">
      {{ dashboard.carteira.nome }}
    </h1>
    <h1 v-else class="text-page-title text-foreground">
      Complete sua avaliação de perfil
    </h1>

    <p v-if="dashboard.carteira && resumoRevisao" class="text-paragraph text-muted-foreground mt-1 max-w-[460px]">
      A revisão de {{ competenciaLonga }} {{ resumoRevisao }}. O relatório completo do mês está
      disponível para download.
    </p>
    <p v-else-if="!dashboard.carteira" class="text-paragraph text-muted-foreground mt-1 max-w-[460px]">
      Responda a avaliação de perfil para receber a carteira recomendada para você.
    </p>
  </header>

  <!--
    "Patrimônio total" (card em R$, com variação % no ano) saiu do cabeçalho: o backend não tem
    nenhum dado de patrimônio investido, só composição e rentabilidade percentuais — ver
    docs/AUDITORIA-INTEGRACAO.md §1.1 e docs/PROPOSTA-BACKEND-PATRIMONIO.md (proposta enviada pro
    time de backend). Religar quando/se o endpoint existir. Script original precisava de:
    import { Badge } from '@components/ui/badge'
    import { totalWealth } from '@data/wallet'
    import { PhTrendUp } from '@phosphor-icons/vue'

    <div class="bg-card w-90 shrink-0 rounded-lg border p-5.5 max-lg:w-full">
      <p class="text-eyebrow text-muted-foreground-faint">Patrimônio total</p>
      <p class="text-metric-md text-foreground mt-3.5">{{ totalWealth.value }}</p>
      <div class="mt-3.5 flex items-center gap-2.5">
        <Badge variant="success" class="text-eyebrow gap-1.25 rounded-sm px-2 py-1">
          <PhTrendUp class="size-3.25" weight="bold" aria-hidden="true" />
          {{ totalWealth.changePercent }}
        </Badge>
        <p class="text-label text-muted-foreground-faint">{{ totalWealth.changeLabel }}</p>
      </div>
    </div>
  -->
</template>
