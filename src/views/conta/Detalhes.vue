<script setup lang="ts">
import { ProfileGauge } from '@components/shared/profile-gauge'
import { Button } from '@components/ui/button'
import { useAuthStore } from '@stores/auth'
import { perfilParaNivel } from '@utils/perfil'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const auth = useAuthStore()

const CARD_CLASS = 'bg-card flex flex-col rounded-lg border border-border'
const CARD_HEADER_CLASS = 'text-card-title border-b border-border px-4.5 py-3'

// "Cliente desde" saiu: `AuthMeResponseDto` não tem `criadoEm` (docs/AUDITORIA-INTEGRACAO.md §3).
const accountFields = computed(() => [
  { label: 'Nome', value: auth.usuario?.nome ?? '—' },
  { label: 'E-mail', value: auth.usuario?.email ?? '—' },
  { label: 'Carteira vinculada', value: auth.usuario?.carteiraVinculada?.nome ?? 'Nenhuma ainda' },
])

const nivel = computed(() =>
  auth.usuario?.perfilInvestidor ? perfilParaNivel(auth.usuario.perfilInvestidor) : null,
)

const gaugeLabel = computed(() =>
  auth.usuario?.perfilInvestidor && nivel.value
    ? `Perfil ${auth.usuario.perfilInvestidor.toLowerCase()}, nível ${nivel.value} de 4`
    : undefined,
)
</script>

<template>
  <div class="grid grid-cols-[1.35fr_1fr] items-start gap-6 max-md:grid-cols-1 max-sm:gap-5">
    <section :class="CARD_CLASS" aria-labelledby="conta-dados-titulo">
      <h2 id="conta-dados-titulo" :class="CARD_HEADER_CLASS">
        Dados
      </h2>

      <dl>
        <div
          v-for="field in accountFields"
          :key="field.label"
          class="flex items-center justify-between gap-4 border-b border-border px-4.5 py-3 max-sm:flex-col max-sm:items-start max-sm:gap-1 max-sm:px-3.5 max-sm:py-2.5"
        >
          <dt class="text-eyebrow text-muted-foreground">
            <span v-if="field.labelMobile" class="max-sm:hidden">{{ field.label }}</span>
            <span v-if="field.labelMobile" class="hidden max-sm:inline">{{ field.labelMobile }}</span>
            <template v-if="!field.labelMobile">{{ field.label }}</template>
          </dt>
          <dd class="text-table-row text-right max-sm:text-left">
            {{ field.value }}
          </dd>
        </div>
      </dl>

      <p class="text-label px-4.5 py-3 text-muted-foreground max-sm:px-3.5 max-sm:py-2.5">
        Para alterar nome ou e-mail, escreva para suporte@aiinvest.com.br.
      </p>
    </section>

    <section :class="CARD_CLASS" aria-labelledby="conta-perfil-titulo">
      <h2 id="conta-perfil-titulo" :class="CARD_HEADER_CLASS">
        Perfil de investidor
      </h2>

      <div v-if="auth.usuario?.perfilInvestidor && nivel" class="flex flex-col items-start gap-4 p-4.5 max-sm:gap-2.5 max-sm:p-3.5">
        <div class="flex items-center gap-2.5">
          <ProfileGauge :level="nivel" tone="success" :label="gaugeLabel" />

          <p class="text-tag text-success">
            {{ auth.usuario.perfilInvestidor }}
          </p>
        </div>

        <Button as-child type="button" variant="outline" class="text-button-sm rounded-sm border-border-strong px-4">
          <RouterLink to="/avaliacao-perfil">
            Refazer avaliação
          </RouterLink>
        </Button>
      </div>

      <div v-else class="flex flex-col items-start gap-4 p-4.5 max-sm:gap-2.5 max-sm:p-3.5">
        <p class="text-table-row text-muted-foreground">
          Você ainda não fez a avaliação de perfil.
        </p>
        <Button as-child type="button" class="text-button-sm rounded-sm px-4">
          <RouterLink to="/avaliacao-perfil">
            Fazer avaliação
          </RouterLink>
        </Button>
      </div>

      <!--
        Histórico de avaliações (data, pontuação, perfil por linha) saiu: não existe rota que um
        cliente logado possa chamar para ver o próprio histórico ou a pontuação/data da última
        avaliação — GET /usuarios/:id/historico-suitability é admin-only, e AuthMeResponseDto só
        tem o perfil atual. Ver docs/AUDITORIA-INTEGRACAO.md §3.3.
      -->
    </section>
  </div>
</template>
