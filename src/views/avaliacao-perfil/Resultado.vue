<script setup lang="ts">
import { LegalNotice } from '@components/shared/legal-notice'
import { ProfileGauge } from '@components/shared/profile-gauge'
import { Button } from '@components/ui/button'
import { PhArrowRight, PhCheckCircle } from '@phosphor-icons/vue'
import type { ResultadoAvaliacaoDto } from '@services/types'
import { formatDataLonga } from '@utils/format'
import { perfilParaNivel, perfilParaRotulo } from '@utils/perfil'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

interface Props {
  resultado: ResultadoAvaliacaoDto
}

const props = defineProps<Props>()

defineEmits<{ restart: [] }>()

const nivel = computed(() => perfilParaNivel(props.resultado.perfilResultante))
const rotuloPerfil = computed(() => perfilParaRotulo(props.resultado.perfilResultante))
</script>

<template>
  <section class="px-6 py-10">
    <div class="mx-auto flex max-w-[720px] flex-col gap-6">
      <p class="text-table-row text-muted-foreground-faint flex items-center gap-2">
        <PhCheckCircle class="text-success size-4" aria-hidden="true" />
        Avaliação concluída em {{ formatDataLonga(resultado.dataAvaliacao) }}
      </p>

      <div class="flex flex-col gap-2">
        <p class="text-eyebrow text-muted-foreground-faint">
          Resultado
        </p>

        <h1 class="text-page-title">
          <span class="text-foreground">Seu perfil é </span>
          <span class="text-success">{{ rotuloPerfil.toLowerCase() }}</span>
        </h1>

        <p class="text-paragraph text-muted-foreground">
          Pontuação {{ resultado.pontuacaoTotal }} de 100.
          <template v-if="resultado.carteiraRecomendada">
            A carteira abaixo é a recomendada para esse perfil na competência atual.
          </template>
        </p>
      </div>

      <div v-if="resultado.carteiraRecomendada" class="bg-muted border-border-strong flex items-center gap-3.5 rounded-md border p-4">
        <ProfileGauge :level="nivel" tone="success" />

        <p class="text-tag text-success">
          {{ resultado.perfilResultante }}
        </p>

        <p class="text-table-row text-muted-foreground">
          {{ resultado.carteiraRecomendada.descricao ?? resultado.carteiraRecomendada.nome }}
        </p>
      </div>

      <!-- Sem carteira ativa para o perfil calculado ainda — ver docs/AUDITORIA-INTEGRACAO.md §5.3. -->
      <p v-else class="bg-muted border-border-strong rounded-md border p-4 text-paragraph text-muted-foreground">
        Ainda não há uma carteira recomendada ativa para o perfil {{ rotuloPerfil.toLowerCase() }}.
        Assim que a equipe de análise publicar uma, ela aparece automaticamente no seu painel.
      </p>

      <LegalNotice />

      <div class="flex items-center gap-2.5">
        <Button as-child size="lg" class="rounded-sm">
          <RouterLink to="/">
            Ir para o painel
            <PhArrowRight class="size-4" aria-hidden="true" />
          </RouterLink>
        </Button>

        <Button variant="outline" size="lg" class="rounded-sm" @click="$emit('restart')">
          Refazer avaliação
        </Button>
      </div>
    </div>
  </section>
</template>
