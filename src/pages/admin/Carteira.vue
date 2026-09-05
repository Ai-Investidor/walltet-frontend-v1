<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import * as carteirasService from '@services/carteiras'
import type { CarteiraDetalheDto, CarteiraVersaoResumoDto } from '@services/types'
import Cabecalho from '@views/admin/carteira/Cabecalho.vue'
import Composicao from '@views/admin/carteira/Composicao.vue'
import Relatorios from '@views/admin/carteira/Relatorios.vue'
import Rentabilidade from '@views/admin/carteira/Rentabilidade.vue'
import Versoes from '@views/admin/carteira/Versoes.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const carteiraId = route.params.id as string

const TABS = [
  { value: 'composicao', label: 'Composição' },
  { value: 'versoes', label: 'Versões' },
  { value: 'rentabilidade', label: 'Rentabilidade' },
  { value: 'relatorios', label: 'Relatórios' },
]

const TAB_LIST =
  'h-auto w-full justify-start gap-0 rounded-none border-b border-border bg-transparent p-0 group-data-horizontal/tabs:h-auto max-sm:overflow-x-auto'

const TAB_TRIGGER =
  'text-card-title h-auto flex-none rounded-none px-3.5 py-2.5 text-muted-foreground-faint dark:text-muted-foreground-faint after:bg-success group-data-horizontal/tabs:after:bottom-0 max-sm:px-3'

const activeTab = ref('composicao')

const carteira = ref<CarteiraDetalheDto | null>(null)
const versoes = ref<CarteiraVersaoResumoDto[]>([])
const carregando = ref(true)
const erro = ref('')

onMounted(async () => {
  try {
    const [detalhe, listaVersoes] = await Promise.all([
      carteirasService.detalhar(carteiraId),
      carteirasService.listarVersoes(carteiraId, { pageSize: 100 }),
    ])
    carteira.value = detalhe
    versoes.value = listaVersoes.items
    route.meta.title = detalhe.nome
  } catch {
    erro.value = 'Não foi possível carregar esta carteira agora.'
  } finally {
    carregando.value = false
  }
})
</script>

<template>
  <div class="flex flex-col gap-8 p-8 max-sm:gap-5 max-sm:px-4 max-sm:py-5">
    <p v-if="carregando" class="text-paragraph text-muted-foreground">
      Carregando carteira…
    </p>

    <p v-else-if="erro" role="alert" class="text-paragraph text-destructive">
      {{ erro }}
    </p>

    <template v-else-if="carteira">
      <Cabecalho :carteira="carteira" />

      <Tabs v-model="activeTab" class="gap-8 max-sm:gap-5">
        <TabsList variant="line" :class="TAB_LIST">
          <TabsTrigger v-for="tab in TABS" :key="tab.value" :value="tab.value" :class="TAB_TRIGGER">
            {{ tab.label }}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="composicao">
          <Composicao :carteira="carteira" />
        </TabsContent>

        <TabsContent value="versoes">
          <Versoes :versoes="versoes" />
        </TabsContent>

        <TabsContent value="rentabilidade">
          <Rentabilidade :carteira-id="carteiraId" />
        </TabsContent>

        <TabsContent value="relatorios">
          <Relatorios :carteira-id="carteiraId" />
        </TabsContent>
      </Tabs>
    </template>
  </div>
</template>
