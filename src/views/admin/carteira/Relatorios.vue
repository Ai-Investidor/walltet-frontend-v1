<script setup lang="ts">
import { Button } from '@components/ui/button'
import { Card, CardContent, CardHeader } from '@components/ui/card'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import { PhFileArrowDown, PhFileText } from '@phosphor-icons/vue'
import * as relatoriosService from '@services/relatorios'
import type { ErrorPayload } from '@services/types'
import { competenciaAtual } from '@utils/competencia'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

interface Props {
  carteiraId: string
}

const props = defineProps<Props>()

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'
const FIELD = 'text-paragraph h-10.5 rounded-sm px-3'

const mesReferencia = ref(competenciaAtual())
const comentario = ref('')
const gerando = ref(false)

async function gerar() {
  gerando.value = true

  try {
    const relatorio = await relatoriosService.gerar({
      carteiraId: props.carteiraId,
      mesReferencia: mesReferencia.value,
      comentarioMercado: comentario.value || undefined,
    })
    toast.success(`Relatório de ${relatorio.mesReferencia} gerado (${relatorio.nomeArquivo})`)
    comentario.value = ''
  } catch (err) {
    const payload = err as ErrorPayload
    toast.error(payload.error?.message ?? 'Não foi possível gerar o relatório.')
  } finally {
    gerando.value = false
  }
}
</script>

<template>
  <!--
    A lista "relatórios por competência" com status por versão saiu: não há rota que devolva os
    relatórios de uma carteira específica (GET /relatorios/meus-relatorios não filtra por
    carteiraId, nem devolve esse campo) — ver docs/AUDITORIA-INTEGRACAO.md. O que a API sustenta
    de verdade é o disparo de geração; o arquivo gerado aparece em Relatórios → meus-relatórios
    pro cliente vinculado.
  -->
  <Card :class="CARD_SURFACE">
    <CardHeader class="flex items-center justify-between gap-3 border-b border-border px-4.5 py-3.5">
      <h2 class="text-card-title">
        Gerar relatório mensal
      </h2>
      <PhFileText class="size-4 text-muted-foreground" aria-hidden="true" />
    </CardHeader>

    <CardContent class="flex flex-col gap-4 p-4.5">
      <div class="flex flex-col gap-1.75">
        <label for="relatorio-competencia" class="text-eyebrow text-muted-foreground-faint">
          Competência (AAAA-MM)
        </label>
        <Input id="relatorio-competencia" v-model="mesReferencia" type="text" :class="FIELD" />
      </div>

      <div class="flex flex-col gap-1.75">
        <label for="relatorio-comentario" class="text-eyebrow text-muted-foreground-faint">
          Comentário de mercado (opcional)
        </label>
        <Textarea id="relatorio-comentario" v-model="comentario" class="text-paragraph h-21 rounded-sm px-3 py-2.75" />
      </div>

      <Button type="button" size="lg" :disabled="gerando" class="text-button-sm w-fit gap-2 rounded-sm px-4" @click="gerar">
        <PhFileArrowDown aria-hidden="true" />
        {{ gerando ? 'Gerando…' : 'Gerar relatório' }}
      </Button>

      <p class="text-label text-muted-foreground-faint">
        Requer uma versão publicada para a competência. Limite de 10 gerações por minuto.
      </p>
    </CardContent>
  </Card>
</template>
