<script setup lang="ts">
import { ConfirmDialog } from '@components/admin/confirm-dialog'
import { Button } from '@components/ui/button'
import { PhDownloadSimple, PhTrash } from '@phosphor-icons/vue'
import * as lgpdService from '@services/lgpd'
import type { ConsentimentoResponseDto } from '@services/types'
import { useAuthStore } from '@stores/auth'
import { formatDataLonga } from '@utils/format'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

const CARD_CLASS = 'bg-card flex flex-col rounded-lg border border-border'
const CARD_HEADER_CLASS = 'text-card-title border-b border-border px-4.5 py-3'

const auth = useAuthStore()
const router = useRouter()

const consentimentos = ref<ConsentimentoResponseDto[] | null>(null)
const carregando = ref(true)
const erro = ref('')

onMounted(async () => {
  try {
    const dados = await lgpdService.meusDados()
    consentimentos.value = dados.consentimentos
  } catch {
    erro.value = 'Não foi possível carregar seus dados de privacidade agora.'
  } finally {
    carregando.value = false
  }
})

function statusConsentimento(consentimento: ConsentimentoResponseDto): string {
  if (consentimento.dataRevogacao) {
    return 'Revogado'
  }
  return consentimento.consentiu ? 'Aceito' : 'Recusado'
}

const revogandoId = ref<string | null>(null)

async function revogar(consentimento: ConsentimentoResponseDto): Promise<void> {
  revogandoId.value = consentimento.termoId
  try {
    await lgpdService.revogar(consentimento.termoId)
    const dados = await lgpdService.meusDados()
    consentimentos.value = dados.consentimentos
    toast.success('Consentimento revogado.')
  } catch {
    toast.error('Não foi possível revogar agora. Tente novamente.')
  } finally {
    revogandoId.value = null
  }
}

const baixando = ref(false)

async function baixarMeusDados(): Promise<void> {
  baixando.value = true

  try {
    const dados = await lgpdService.meusDados()
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `meus-dados-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  } catch {
    toast.error('Não foi possível gerar o arquivo agora. Tente novamente.')
  } finally {
    baixando.value = false
  }
}

const exclusaoOpen = ref(false)
const excluindo = ref(false)

async function confirmarExclusao(): Promise<void> {
  excluindo.value = true

  try {
    await lgpdService.solicitarExclusao()
    toast.success('Sua conta foi anonimizada. Você será desconectado agora.')
    await auth.logout()
    router.push({ name: 'login' })
  } catch {
    toast.error('Não foi possível concluir a exclusão agora. Tente novamente.')
    excluindo.value = false
  }
}
</script>

<template>
  <section :class="CARD_CLASS" aria-labelledby="conta-privacidade-titulo">
    <h2 id="conta-privacidade-titulo" :class="CARD_HEADER_CLASS">
      Central de Privacidade
    </h2>

    <div class="flex flex-col gap-4 p-4.5 max-sm:gap-3 max-sm:p-3.5">
      <p v-if="carregando" class="text-paragraph text-muted-foreground">
        Carregando…
      </p>
      <p v-else-if="erro" role="alert" class="text-paragraph text-destructive">
        {{ erro }}
      </p>

      <template v-else>
        <div v-if="consentimentos && consentimentos.length > 0" class="flex flex-col gap-2">
          <p class="text-eyebrow text-muted-foreground-faint">
            Seus consentimentos
          </p>
          <ul class="flex flex-col gap-2">
            <li
              v-for="consentimento in consentimentos"
              :key="consentimento.id"
              class="flex items-center justify-between gap-3 rounded-sm border border-border px-3.5 py-2.5 max-sm:flex-col max-sm:items-start"
            >
              <div class="flex flex-col gap-0.5">
                <span class="text-table-row">{{ consentimento.tipo }} · v{{ consentimento.versaoTermo }}</span>
                <span class="text-label text-muted-foreground">
                  {{ statusConsentimento(consentimento) }} em {{ formatDataLonga(consentimento.dataConsentimento) }}
                </span>
              </div>

              <Button
                v-if="!consentimento.obrigatorio && consentimento.consentiu && !consentimento.dataRevogacao"
                type="button"
                variant="outline"
                size="sm"
                class="text-button-sm rounded-sm"
                :disabled="revogandoId === consentimento.termoId"
                @click="revogar(consentimento)"
              >
                {{ revogandoId === consentimento.termoId ? 'Revogando…' : 'Revogar' }}
              </Button>
            </li>
          </ul>
        </div>

        <p v-else class="text-paragraph text-muted-foreground">
          Nenhum consentimento registrado ainda.
        </p>

        <div class="flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            class="text-button-sm rounded-sm border-border-strong px-4"
            :disabled="baixando"
            @click="baixarMeusDados"
          >
            <PhDownloadSimple class="size-4" aria-hidden="true" />
            {{ baixando ? 'Gerando…' : 'Baixar meus dados' }}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            class="text-button-sm text-destructive rounded-sm border-destructive/40 px-4"
            @click="exclusaoOpen = true"
          >
            <PhTrash class="size-4" aria-hidden="true" />
            Solicitar exclusão da conta
          </Button>

          <ConfirmDialog
            v-model:open="exclusaoOpen"
            title="Excluir sua conta"
            description="Seus dados pessoais (nome, e-mail) serão anonimizados de forma irreversível e você perderá o acesso permanentemente. Seu histórico de avaliações e carteiras é mantido por obrigação regulatória, mas deixa de ser identificável como seu."
            confirm-label="Sim, excluir minha conta"
            tone="destructive"
            :confirm-disabled="excluindo"
            @confirm="confirmarExclusao"
          >
            <template #confirm-icon>
              <PhTrash class="size-4" aria-hidden="true" />
            </template>
          </ConfirmDialog>
        </div>
      </template>
    </div>
  </section>
</template>
