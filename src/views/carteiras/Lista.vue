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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { PhArrowRight, PhCircleNotch, PhWarning, PhX } from '@phosphor-icons/vue'
import * as carteirasService from '@services/carteiras'
import type { CarteiraDetalheDto } from '@services/types'
import { useAuthStore } from '@stores/auth'
import { agruparPorClasse, TONS_ALOCACAO } from '@utils/alocacao'
import { formatPercent } from '@utils/format'
import { perfilParaNivel } from '@utils/perfil'
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const ALL_PROFILES = 'TODOS OS PERFIS'

const auth = useAuthStore()

const carteiras = ref<CarteiraDetalheDto[]>([])
const carregando = ref(true)
const erro = ref('')

onMounted(async () => {
  try {
    const pagina = await carteirasService.listar({ pageSize: 100 })
    // A listagem devolve só os metadados (`CarteiraResponseDto`) — a composição pra alimentar a
    // prévia de alocação de cada card vem de um detalhe por carteira. A quantidade de carteiras
    // ativas é pequena (uma por perfil), então buscar tudo em paralelo é barato.
    carteiras.value = await Promise.all(
      pagina.items.map((item) => carteirasService.detalhar(item.id)),
    )
  } catch {
    erro.value = 'Não foi possível carregar as carteiras recomendadas agora.'
  } finally {
    carregando.value = false
  }
})

const activeFilter = ref(ALL_PROFILES)

const profileFilters = computed(() => [
  ALL_PROFILES,
  ...Array.from(new Set(carteiras.value.map((wallet) => wallet.perfilAlvo))),
])

const visibleWallets = computed(() =>
  activeFilter.value === ALL_PROFILES
    ? carteiras.value
    : carteiras.value.filter((wallet) => wallet.perfilAlvo === activeFilter.value),
)

function isOwn(wallet: CarteiraDetalheDto) {
  return wallet.id === auth.usuario?.carteiraVinculada?.id
}

function allocationPreview(wallet: CarteiraDetalheDto) {
  return agruparPorClasse(wallet.versaoAtual?.itens ?? []).map((fatia, index) => ({
    ...fatia,
    tone: TONS_ALOCACAO[index % TONS_ALOCACAO.length],
  }))
}

function metaLabel(wallet: CarteiraDetalheDto) {
  const total = wallet.versaoAtual?.itens.length ?? 0
  const contagem = `${total} ${total === 1 ? 'ativo' : 'ativos'}`
  return isOwn(wallet) ? `${contagem} · sua carteira` : contagem
}

function gaugeLabel(wallet: CarteiraDetalheDto) {
  const nivel = perfilParaNivel(wallet.perfilAlvo)
  return `Perfil ${wallet.perfilAlvo.toLowerCase()}, nível ${nivel} de 4`
}

function formatPercentSlice(value: number) {
  return formatPercent(value)
}

const ownWallet = computed(() => carteiras.value.find(isOwn) ?? null)

const selectedAllocation = ref<string | null>(null)
function highlightAllocation(label: string | null) {
  selectedAllocation.value = label
}

const drawerOpen = ref(false)
const selectedWallet = ref<CarteiraDetalheDto | null>(null)

function openComposicao(wallet: CarteiraDetalheDto) {
  selectedWallet.value = wallet
  drawerOpen.value = true
}

const ACTION_CLASS = 'text-button-sm hover:border-border-strong gap-2.5 rounded-sm px-6'
</script>

<template>
  <section class="flex flex-col gap-6" aria-label="Carteiras recomendadas por perfil">
    <p v-if="carregando" class="text-paragraph text-muted-foreground flex items-center gap-2">
      <PhCircleNotch class="size-4 animate-spin" aria-hidden="true" />
      Carregando carteiras…
    </p>

    <p v-else-if="erro" role="alert" class="text-paragraph text-destructive">
      {{ erro }}
    </p>

    <template v-else>
      <div class="flex flex-wrap gap-2.5" role="group" aria-label="Filtrar carteiras por perfil">
        <button
          v-for="filter in profileFilters"
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

      <TooltipProvider>
        <ul class="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <li
            v-for="wallet in visibleWallets"
            :key="wallet.id"
            data-slot="wallet-card"
            class="bg-card flex flex-col gap-4 rounded-lg border border-border p-5"
          >
            <div class="flex items-center justify-between gap-3">
              <ProfileGauge
                :level="perfilParaNivel(wallet.perfilAlvo)"
                :tone="isOwn(wallet) ? 'success' : 'neutral'"
                :label="gaugeLabel(wallet)"
              />

              <p class="text-eyebrow" :class="isOwn(wallet) ? 'text-success' : 'text-muted-foreground'">
                {{ wallet.perfilAlvo }}
              </p>
            </div>

            <div class="flex flex-col gap-1.5">
              <h2 class="text-card-title">
                {{ wallet.nome }}
              </h2>

              <p class="text-label text-muted-foreground">
                {{ wallet.descricao ?? 'Sem descrição cadastrada.' }}
              </p>
            </div>

            <div v-if="wallet.versaoAtual" class="flex h-2.5 overflow-hidden rounded-sm">
              <Tooltip v-for="slice in allocationPreview(wallet)" :key="slice.label">
                <TooltipTrigger as-child>
                  <button
                    type="button"
                    class="h-full transition-colors hover:bg-success focus-visible:bg-success"
                    :class="slice.tone"
                    :style="{ width: `${slice.percent}%` }"
                    :aria-label="`${slice.label} ${formatPercentSlice(slice.percent)}`"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  {{ slice.label }} {{ formatPercentSlice(slice.percent) }}
                </TooltipContent>
              </Tooltip>
            </div>
            <p v-else class="text-label text-muted-foreground-faint">
              Sem versão publicada ainda.
            </p>

            <div class="flex flex-col gap-4 border-t border-border pt-4">
              <p class="text-label text-muted-foreground">
                {{ metaLabel(wallet) }}
              </p>

              <div class="flex justify-end">
                <Button type="button" variant="outline" size="lg" :class="ACTION_CLASS" @click="openComposicao(wallet)">
                  Ver composição
                  <PhArrowRight class="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </li>
        </ul>
      </TooltipProvider>

      <Sheet v-model:open="drawerOpen">
        <SheetContent
          v-if="selectedWallet"
          side="right"
          :show-close-button="false"
          class="gap-0 p-0 data-[side=right]:w-175! data-[side=right]:sm:max-w-175!"
        >
          <SheetHeader class="flex-row items-start justify-between gap-3.5 border-b border-border p-8">
            <div class="flex flex-col gap-1">
              <p v-if="selectedWallet.versaoAtual" class="text-eyebrow text-muted-foreground-faint">
                Composição vigente
              </p>
              <SheetTitle class="text-card-title text-base">
                {{ selectedWallet.nome }}
              </SheetTitle>
            </div>

            <SheetClose as-child>
              <Button variant="outline" size="icon-lg" class="rounded-sm" aria-label="Fechar composição">
                <PhX class="size-3.5" aria-hidden="true" />
              </Button>
            </SheetClose>
          </SheetHeader>

          <div class="flex flex-col gap-6 overflow-y-auto p-8">
            <div v-if="!isOwn(selectedWallet) && ownWallet" class="flex gap-2.5 rounded-md border border-border-strong bg-muted p-3.5">
              <PhWarning class="size-4 shrink-0 text-warning" aria-hidden="true" />
              <p class="text-label text-muted-foreground">
                Esta não é a carteira recomendada para o seu perfil. A recomendação atual é a
                {{ ownWallet.nome }}.
              </p>
            </div>

            <template v-if="selectedWallet.versaoAtual">
              <div class="flex flex-col gap-2.5">
                <h3 class="text-eyebrow text-muted-foreground-faint">
                  Alocação por classe
                </h3>

                <div class="flex h-2.5 overflow-hidden rounded-sm">
                  <button
                    v-for="slice in allocationPreview(selectedWallet)"
                    :key="slice.label"
                    type="button"
                    class="h-full transition-colors"
                    :class="selectedAllocation === slice.label ? 'bg-success' : slice.tone"
                    :style="{ width: `${slice.percent}%` }"
                    :aria-label="`${slice.label} ${formatPercentSlice(slice.percent)}`"
                    @mouseenter="highlightAllocation(slice.label)"
                    @mouseleave="highlightAllocation(null)"
                    @focus="highlightAllocation(slice.label)"
                    @blur="highlightAllocation(null)"
                  />
                </div>

                <ul class="flex flex-wrap gap-x-3.5 gap-y-1">
                  <li
                    v-for="slice in allocationPreview(selectedWallet)"
                    :key="slice.label"
                    class="text-label"
                    :class="selectedAllocation === slice.label ? 'text-success' : 'text-muted-foreground'"
                  >
                    {{ slice.label }} {{ formatPercentSlice(slice.percent) }}
                  </li>
                </ul>
              </div>

              <div class="overflow-hidden rounded-lg border border-border">
                <p class="text-eyebrow border-b border-border p-3.5 text-muted-foreground-faint">
                  Composição · {{ selectedWallet.versaoAtual.itens.length }} ativos
                </p>

                <ul>
                  <li
                    v-for="item in selectedWallet.versaoAtual.itens"
                    :key="item.id"
                    class="not-last:border-b flex items-center gap-3 border-border p-3.5"
                  >
                    <span
                      class="text-eyebrow flex h-7.5 w-8.5 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground"
                      aria-hidden="true"
                    >
                      {{ item.tickerCodigo.slice(0, 2).toUpperCase() }}
                    </span>

                    <div class="min-w-0 flex-1">
                      <p class="text-paragraph truncate">
                        {{ item.nomeAtivo }}
                      </p>
                      <p class="text-label truncate text-muted-foreground">
                        {{ item.classeAtivo ?? '—' }}
                      </p>
                    </div>

                    <span class="text-card-title shrink-0 tabular-nums">
                      {{ formatPercent(item.pesoPercentual) }}
                    </span>
                  </li>
                </ul>
              </div>
            </template>
            <p v-else class="text-paragraph text-muted-foreground">
              Esta carteira ainda não tem uma versão publicada.
            </p>

            <p class="text-paragraph text-muted-foreground">
              {{ selectedWallet.descricao }} A composição é revisada mensalmente pela equipe de
              análise.
            </p>

            <LegalNotice />
          </div>

          <SheetFooter v-if="!isOwn(selectedWallet)" class="flex-row justify-end border-t border-border p-8">
            <Button as-child type="button" size="lg" class="rounded-sm">
              <RouterLink to="/avaliacao-perfil">
                Refazer avaliação de perfil
                <PhArrowRight class="size-4" aria-hidden="true" />
              </RouterLink>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </template>
  </section>
</template>
