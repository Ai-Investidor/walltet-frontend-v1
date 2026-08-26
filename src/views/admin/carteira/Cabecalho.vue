<script setup lang="ts">
import { PhArrowLeft } from '@phosphor-icons/vue'
import type { CarteiraDetalheDto } from '@services/types'
import { formatCompetenciaLonga } from '@utils/competencia'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

interface Props {
  carteira: CarteiraDetalheDto
}

const props = defineProps<Props>()

// "N investidores vinculados" saiu: sem endpoint (docs/AUDITORIA-INTEGRACAO.md, achado 4.1).
const meta = computed(() => {
  const itens = [
    `Perfil-alvo: ${props.carteira.perfilAlvo}`,
    props.carteira.ativa ? 'Ativa' : 'Inativa',
  ]

  if (props.carteira.versaoAtual) {
    itens.push(`Vigente: ${formatCompetenciaLonga(props.carteira.versaoAtual.mesReferencia)}`)
  }

  return itens
})
</script>

<template>
  <header class="flex flex-col gap-2">
    <RouterLink
      to="/admin/carteiras"
      class="text-eyebrow flex w-fit items-center gap-1.5 text-muted-foreground-faint hover:text-foreground"
    >
      <PhArrowLeft class="size-3.5" aria-hidden="true" />
      Carteiras
    </RouterLink>

    <h1 class="text-page-title text-foreground">
      {{ carteira.nome }}
    </h1>

    <ul class="flex flex-wrap gap-x-4 gap-y-1">
      <li v-for="item in meta" :key="item" class="text-label text-muted-foreground">
        {{ item }}
      </li>
    </ul>
  </header>
</template>
