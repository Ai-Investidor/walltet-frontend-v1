<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import type { AdminWalletAsset } from '@data/admin'
import { walletDetail } from '@data/admin'
import Cabecalho from '@views/admin/carteira/Cabecalho.vue'
import Composicao from '@views/admin/carteira/Composicao.vue'
import Edicao from '@views/admin/carteira/Edicao.vue'
import Relatorios from '@views/admin/carteira/Relatorios.vue'
import Rentabilidade from '@views/admin/carteira/Rentabilidade.vue'
import Revisao from '@views/admin/carteira/Revisao.vue'
import Versoes from '@views/admin/carteira/Versoes.vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

const route = useRoute()

const TABS = [
  { value: 'composicao', label: 'Composição' },
  { value: 'versoes', label: 'Versões' },
  { value: 'rentabilidade', label: 'Rentabilidade' },
  { value: 'relatorios', label: 'Relatórios' },
]

const TAB_LIST =
  'h-auto w-full justify-start gap-0 rounded-none border-b border-border bg-transparent p-0 group-data-horizontal/tabs:h-auto'

const TAB_TRIGGER =
  'text-card-title h-auto flex-none rounded-none px-3.5 py-2.5 text-muted-foreground-faint dark:text-muted-foreground-faint after:bg-success group-data-horizontal/tabs:after:bottom-0'

/** Etapas do rebalanceamento dentro da aba Composição. */
type Stage = 'composicao' | 'edicao' | 'revisao'

const activeTab = ref('composicao')

// A tabela de carteiras abre a edição direto pelo lápis (`?modo=edicao`).
const stage = ref<Stage>(route.query.modo === 'edicao' ? 'edicao' : 'composicao')

// Cópia local do rascunho: o stepper da edição altera os pesos e a revisão
// precisa enxergar exatamente os mesmos valores.
const draft = ref<AdminWalletAsset[]>(walletDetail.draftAssets.map((asset) => ({ ...asset })))

const draftTotal = computed(() => draft.value.reduce((sum, asset) => sum + asset.weightPercent, 0))

function openEdit() {
  activeTab.value = 'composicao'
  stage.value = 'edicao'
}

function publish() {
  stage.value = 'composicao'
  activeTab.value = 'versoes'
  toast.success(`Versão de ${walletDetail.draftCompetence} publicada`)
}
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <Cabecalho />

    <Tabs v-model="activeTab" class="gap-8">
      <TabsList variant="line" :class="TAB_LIST">
        <TabsTrigger v-for="tab in TABS" :key="tab.value" :value="tab.value" :class="TAB_TRIGGER">
          {{ tab.label }}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="composicao">
        <Composicao
          v-if="stage === 'composicao'"
          :draft-total="draftTotal"
          @edit="stage = 'edicao'"
        />

        <Edicao
          v-else-if="stage === 'edicao'"
          v-model="draft"
          @exit="stage = 'composicao'"
          @review="stage = 'revisao'"
        />

        <Revisao v-else :assets="draft" @back="stage = 'edicao'" @publish="publish" />
      </TabsContent>

      <TabsContent value="versoes">
        <Versoes @edit="openEdit" />
      </TabsContent>

      <TabsContent value="rentabilidade">
        <Rentabilidade />
      </TabsContent>

      <TabsContent value="relatorios">
        <Relatorios />
      </TabsContent>
    </Tabs>
  </div>
</template>
