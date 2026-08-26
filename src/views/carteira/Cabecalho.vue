<script setup lang="ts">
import type { CarteiraDetalheDto } from '@services/types'
import { formatCompetenciaLonga } from '@utils/competencia'
import { computed } from 'vue'

interface Props {
  carteira: CarteiraDetalheDto
}

const props = defineProps<Props>()

const competencia = computed(() =>
  props.carteira.versaoAtual
    ? formatCompetenciaLonga(props.carteira.versaoAtual.mesReferencia)
    : null,
)
</script>

<template>
  <header class="flex flex-col gap-2">
    <p class="text-eyebrow text-muted-foreground-faint">
      Minha carteira<template v-if="competencia"> · {{ competencia }}</template>
    </p>

    <h1 class="text-page-title text-foreground">
      {{ carteira.nome }}
    </h1>

    <p class="text-paragraph text-muted-foreground mt-1 max-w-[460px]">
      Composição, movimentações do mês e rentabilidade comparada aos
      benchmarks. Todos os dados seguem a competência vigente da carteira.
    </p>
  </header>
</template>
