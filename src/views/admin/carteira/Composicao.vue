<script setup lang="ts">
import { StatusBadge } from '@components/admin/status-badge'
import { AllocationBar } from '@components/shared/allocation-bar'
import { Card } from '@components/ui/card'
import { AssetRow } from '@components/wallet/asset-row'
import { MOVIMENTACAO_PRESENTATION } from '@constants/movimentacao'
import type { CarteiraDetalheDto } from '@services/types'
import { agruparPorClasse, TONS_ALOCACAO_BARE } from '@utils/alocacao'
import { formatCompetenciaLonga } from '@utils/competencia'
import { formatPercent } from '@utils/format'
import { rotuloMovimentacao, statusParaMovimentacao } from '@utils/movimentacao'
import { computed } from 'vue'

interface Props {
  carteira: CarteiraDetalheDto
}

const props = defineProps<Props>()

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const itens = computed(() => props.carteira.versaoAtual?.itens ?? [])
const total = computed(() => itens.value.reduce((soma, item) => soma + item.pesoPercentual, 0))

const allocation = computed(() =>
  agruparPorClasse(itens.value).map((fatia, index) => ({
    ...fatia,
    tone: TONS_ALOCACAO_BARE[index % TONS_ALOCACAO_BARE.length],
  })),
)
</script>

<template>
  <!--
    O rebalanceamento (rascunho de nova versão, adicionar/remover ativo, revisar e publicar) saiu
    desta aba: POST /carteiras/:id/versoes exige `ativoId` por item, e não existe nenhuma rota de
    catálogo de ativos no backend pra alimentar esse seletor — ver docs/AUDITORIA-INTEGRACAO.md,
    achado 4.9. Os componentes Edicao.vue, Revisao.vue e AdicionarAtivo.vue continuam no
    repositório, comentados, prontos pra religar quando esse endpoint existir.
  -->
  <section class="flex flex-col gap-5" aria-label="Composição da carteira">
    <Card v-if="carteira.versaoAtual" :class="CARD_SURFACE">
      <div class="flex items-center justify-between gap-3 px-4.5 py-4">
        <h2 id="versao-vigente" class="text-card-title">
          Versão vigente · {{ formatCompetenciaLonga(carteira.versaoAtual.mesReferencia) }}
        </h2>

        <StatusBadge :tone="carteira.versaoAtual.publicada ? 'success' : 'warning'" dot>
          {{ carteira.versaoAtual.publicada ? 'Publicada' : 'Rascunho' }}
        </StatusBadge>
      </div>

      <div class="flex flex-col gap-2.5 border-b border-border-strong px-4.5 pb-4">
        <h3 class="text-eyebrow text-muted-foreground-faint">
          Alocação por classe
        </h3>

        <AllocationBar :slices="allocation" legend />
      </div>

      <ul aria-labelledby="versao-vigente">
        <AssetRow
          v-for="item in itens"
          :key="item.id"
          :code="item.tickerCodigo.slice(0, 2).toUpperCase()"
          :name="item.nomeAtivo"
          :detail="item.classeAtivo ?? '—'"
          :icon="MOVIMENTACAO_PRESENTATION[statusParaMovimentacao(item.statusMovimentacao)].icon"
          :tone="MOVIMENTACAO_PRESENTATION[statusParaMovimentacao(item.statusMovimentacao)].tone"
          :label="rotuloMovimentacao(statusParaMovimentacao(item.statusMovimentacao))"
          :value="formatPercent(item.pesoPercentual)"
          class="px-4.5 py-3"
        />
      </ul>

      <div class="flex items-center justify-between gap-3 border-t border-border-strong bg-muted px-4.5 py-3.5">
        <span class="text-tag-sm text-muted-foreground">Total</span>
        <span class="text-card-title tabular-nums">{{ formatPercent(total) }}</span>
      </div>
    </Card>

    <p v-else class="text-paragraph text-muted-foreground">
      Esta carteira ainda não tem uma versão publicada.
    </p>
  </section>
</template>
