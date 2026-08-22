<script setup lang="ts">
import { ProfileGauge } from '@components/shared/profile-gauge'
import { Button } from '@components/ui/button'
import type { AllocationClass } from '@data/wallet'
import { recommendedWallets } from '@data/wallet'
import { PhArrowRight } from '@phosphor-icons/vue'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

/** Rótulo do filtro neutro — único literal de filtro; os demais vêm dos dados. */
const ALL_PROFILES = 'TODOS OS PERFIS'

const PROFILE_FILTERS = [ALL_PROFILES, ...recommendedWallets.map((wallet) => wallet.profileLabel)]

const activeFilter = ref(ALL_PROFILES)

const visibleWallets = computed(() =>
  activeFilter.value === ALL_PROFILES
    ? recommendedWallets
    : recommendedWallets.filter((wallet) => wallet.profileLabel === activeFilter.value),
)

const ALLOCATION_TONE: Record<AllocationClass['tone'], string> = {
  'data-1': 'bg-data-1',
  'data-2': 'bg-data-2',
  'data-3': 'bg-data-3',
}

const ACTION_CLASS = 'text-button-sm hover:border-border-strong gap-2.5 rounded-sm px-6'

function gaugeLabel(profileLabel: string, profileLevel: number) {
  return `Perfil ${profileLabel.toLocaleLowerCase('pt-BR')}, nível ${profileLevel} de 4`
}

function allocationLabel(allocation: AllocationClass[]) {
  return allocation.map((slice) => `${slice.label} ${slice.percent} %`).join(', ')
}
</script>

<template>
  <section class="flex flex-col gap-6" aria-label="Carteiras recomendadas por perfil">
    <div class="flex flex-wrap gap-2.5" role="group" aria-label="Filtrar carteiras por perfil">
      <button
        v-for="filter in PROFILE_FILTERS"
        :key="filter"
        type="button"
        :aria-pressed="filter === activeFilter"
        :class="[
          'text-eyebrow rounded-md border px-4 py-2.5 transition-colors',
          filter === activeFilter
            ? 'border-foreground bg-foreground text-background'
            : 'bg-card text-muted-foreground hover:border-border-strong',
        ]"
        @click="activeFilter = filter"
      >
        {{ filter }}
      </button>
    </div>

    <ul class="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
      <li
        v-for="wallet in visibleWallets"
        :key="wallet.slug"
        data-slot="wallet-card"
        class="bg-card flex flex-col gap-4 rounded-lg border border-border p-5"
      >
        <div class="flex items-center justify-between gap-3">
          <ProfileGauge
            :level="wallet.profileLevel"
            :tone="wallet.isOwn ? 'success' : 'neutral'"
            :label="gaugeLabel(wallet.profileLabel, wallet.profileLevel)"
          />

          <p class="text-eyebrow" :class="wallet.isOwn ? 'text-success' : 'text-muted-foreground'">
            {{ wallet.profileLabel }}
          </p>
        </div>

        <div class="flex flex-col gap-1.5">
          <h2 class="text-card-title">
            {{ wallet.name }}
          </h2>

          <p class="text-label text-muted-foreground">
            {{ wallet.description }}
          </p>
        </div>

        <div
          class="flex h-2.5 overflow-hidden rounded-sm"
          role="img"
          :aria-label="allocationLabel(wallet.allocationPreview)"
        >
          <span
            v-for="slice in wallet.allocationPreview"
            :key="slice.label"
            class="h-full"
            :class="ALLOCATION_TONE[slice.tone]"
            :style="{ width: `${slice.percent}%` }"
          />
        </div>

        <div class="flex flex-col gap-4 border-t border-border pt-4">
          <p class="text-label text-muted-foreground">
            {{ wallet.meta }}
          </p>

          <div class="flex justify-end">
            <Button v-if="wallet.to" as-child variant="outline" size="lg" :class="ACTION_CLASS">
              <RouterLink :to="wallet.to">
                Ver composição
                <PhArrowRight class="size-4" aria-hidden="true" />
              </RouterLink>
            </Button>

            <Button
              v-else
              type="button"
              variant="outline"
              size="lg"
              aria-disabled="true"
              :title="`Composição de ${wallet.name} ainda não está disponível`"
              :class="[ACTION_CLASS, 'cursor-not-allowed opacity-50']"
              @click.prevent
            >
              Ver composição
              <PhArrowRight class="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>
