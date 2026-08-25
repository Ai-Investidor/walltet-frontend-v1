<script setup lang="ts">
import { LegalNotice } from '@components/shared/legal-notice'
import { ProfileGauge } from '@components/shared/profile-gauge'
import { Button } from '@components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet'
import type { AllocationClass, RecommendedWallet } from '@data/wallet'
import { recommendedWallets } from '@data/wallet'
import { PhArrowRight, PhWarning, PhX } from '@phosphor-icons/vue'
import { computed, ref } from 'vue'

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

const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatPercent(value: number) {
  return `${percentFormatter.format(value)} %`
}

const ownWallet = computed(() => recommendedWallets.find((wallet) => wallet.isOwn))

const drawerOpen = ref(false)
const selectedWallet = ref<RecommendedWallet | null>(null)

function openComposicao(wallet: RecommendedWallet) {
  selectedWallet.value = wallet
  drawerOpen.value = true
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
            <Button
              type="button"
              variant="outline"
              size="lg"
              :class="ACTION_CLASS"
              @click="openComposicao(wallet)"
            >
              Ver composição
              <PhArrowRight class="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </li>
    </ul>

    <Sheet v-model:open="drawerOpen">
      <SheetContent
        v-if="selectedWallet"
        side="right"
        :show-close-button="false"
        class="gap-0 p-0 data-[side=right]:w-175! data-[side=right]:sm:max-w-175!"
      >
        <SheetHeader class="flex-row items-start justify-between gap-3.5 border-b border-border p-8">
          <div class="flex flex-col gap-1">
            <p class="text-eyebrow text-muted-foreground-faint">
              Composição de agosto 2026
            </p>
            <SheetTitle class="text-card-title text-base">
              {{ selectedWallet.name }}
            </SheetTitle>
          </div>

          <SheetClose as-child>
            <Button variant="outline" size="icon-lg" class="rounded-sm" aria-label="Fechar composição">
              <PhX class="size-3.5" aria-hidden="true" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div class="flex flex-col gap-6 overflow-y-auto p-8">
          <div
            v-if="!selectedWallet.isOwn && ownWallet"
            class="flex gap-2.5 rounded-md border border-border-strong bg-muted p-3.5"
          >
            <PhWarning class="size-4 shrink-0 text-warning" aria-hidden="true" />
            <p class="text-label text-muted-foreground">
              Esta não é a carteira recomendada para o seu perfil. A recomendação atual é a
              {{ ownWallet.name }}.
            </p>
          </div>

          <div class="flex flex-col gap-2.5">
            <h3 class="text-eyebrow text-muted-foreground-faint">
              Alocação por classe
            </h3>

            <div
              class="flex h-2.5 overflow-hidden rounded-sm"
              role="img"
              :aria-label="allocationLabel(selectedWallet.allocationPreview)"
            >
              <span
                v-for="slice in selectedWallet.allocationPreview"
                :key="slice.label"
                class="h-full"
                :class="ALLOCATION_TONE[slice.tone]"
                :style="{ width: `${slice.percent}%` }"
              />
            </div>

            <ul class="flex flex-wrap gap-x-3.5 gap-y-1">
              <li
                v-for="slice in selectedWallet.allocationPreview"
                :key="slice.label"
                class="text-label text-muted-foreground"
              >
                {{ slice.label }} {{ formatPercent(slice.percent) }}
              </li>
            </ul>
          </div>

          <div class="overflow-hidden rounded-lg border border-border">
            <p class="text-eyebrow border-b border-border p-3.5 text-muted-foreground-faint">
              Composição · {{ selectedWallet.composicao.length }} ativos
            </p>

            <ul>
              <li
                v-for="asset in selectedWallet.composicao"
                :key="asset.code"
                class="not-last:border-b flex items-center gap-3 border-border p-3.5"
              >
                <span
                  class="text-eyebrow flex h-7.5 w-8.5 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground"
                  aria-hidden="true"
                >
                  {{ asset.code }}
                </span>

                <div class="min-w-0 flex-1">
                  <p class="text-paragraph truncate">
                    {{ asset.name }}
                  </p>
                  <p class="text-label truncate text-muted-foreground">
                    {{ asset.className }}
                  </p>
                </div>

                <span class="text-card-title shrink-0 tabular-nums">
                  {{ formatPercent(asset.weightPercent) }}
                </span>
              </li>
            </ul>
          </div>

          <p class="text-paragraph text-muted-foreground">
            {{ selectedWallet.description }} A composição é revisada mensalmente pela equipe de
            análise e publicada no primeiro dia útil do mês.
          </p>

          <LegalNotice />
        </div>

        <SheetFooter class="flex-row justify-end border-t border-border p-8">
          <Button type="button" size="lg" class="rounded-sm">
            Usar carteira
            <PhArrowRight class="size-4" aria-hidden="true" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </section>
</template>
