<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@components/ui/alert-dialog'
import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { Label } from '@components/ui/label'
import { useAuthStore } from '@stores/auth'
import { computed, reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

/**
 * Modal bloqueante de consentimento LGPD (Privacy by Design) — aparece sempre que
 * `auth.termosPendentes` não estiver vazio (checagem proativa após login/boot, ver
 * `stores/auth.ts`). Não tem `x` nem fecha em Escape/clique fora: o backend
 * (`LgpdConsentGuard`) bloqueia toda rota protegida enquanto um termo obrigatório não for
 * aceito, então deixar fechar sem responder só empurraria o mesmo bloqueio pra um 403 sem
 * explicação nenhuma na tela.
 */
const auth = useAuthStore()

/** `id do termo -> checkbox marcado`. Todos nascem desmarcados — opt-in explícito, nunca
 * pré-marcado (obrigatório incluso: o usuário precisa marcar para poder continuar). */
const respostas = reactive<Record<string, boolean>>({})

watch(
  () => auth.termosPendentes,
  (termos) => {
    for (const termo of termos) {
      if (!(termo.id in respostas)) {
        respostas[termo.id] = false
      }
    }
  },
  { immediate: true, deep: true },
)

const termosObrigatorios = computed(() => auth.termosPendentes.filter((t) => t.obrigatorio))
const termosOpcionais = computed(() => auth.termosPendentes.filter((t) => !t.obrigatorio))

const podeContinuar = computed(() => termosObrigatorios.value.every((t) => respostas[t.id]))

const enviando = ref(false)

async function continuar(): Promise<void> {
  if (!podeContinuar.value) {
    return
  }

  enviando.value = true

  try {
    for (const termo of auth.termosPendentes) {
      await auth.responderConsentimento(termo.id, respostas[termo.id] ?? false)
    }
  } catch {
    toast.error('Não foi possível registrar seu consentimento agora. Tente novamente.')
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <AlertDialog :open="auth.temTermosPendentes">
    <AlertDialogContent
      data-slot="lgpd-consent-modal"
      class="max-w-[calc(100%-2rem)] gap-5 sm:max-w-110"
      @escape-key-down.prevent
      @pointer-down-outside.prevent
      @interact-outside.prevent
    >
      <AlertDialogHeader class="gap-2">
        <AlertDialogTitle class="text-subtitle">
          Sua privacidade
        </AlertDialogTitle>
        <AlertDialogDescription class="text-paragraph text-muted-foreground">
          Antes de continuar, precisamos que você revise os termos abaixo.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div class="flex max-h-[50vh] flex-col gap-4 overflow-y-auto pr-1">
        <div
          v-for="termo in termosObrigatorios"
          :key="termo.id"
          class="flex flex-col gap-2 rounded-sm border border-border p-3.5"
        >
          <p class="text-label text-muted-foreground">
            {{ termo.conteudoResumido }}
          </p>
          <div class="flex items-center gap-2">
            <Checkbox :id="`termo-${termo.id}`" v-model="respostas[termo.id]" />
            <Label :for="`termo-${termo.id}`" class="text-paragraph">
              Li e aceito este termo (obrigatório)
            </Label>
          </div>
        </div>

        <div
          v-for="termo in termosOpcionais"
          :key="termo.id"
          class="flex flex-col gap-2 rounded-sm border border-border p-3.5"
        >
          <p class="text-label text-muted-foreground">
            {{ termo.conteudoResumido }}
          </p>
          <div class="flex items-center gap-2">
            <Checkbox :id="`termo-${termo.id}`" v-model="respostas[termo.id]" />
            <Label :for="`termo-${termo.id}`" class="text-paragraph">
              Aceito receber comunicações (opcional — pode mudar depois na Central de Privacidade)
            </Label>
          </div>
        </div>
      </div>

      <AlertDialogFooter>
        <Button
          type="button"
          size="lg"
          class="text-button-sm w-full rounded-sm"
          :disabled="!podeContinuar || enviando"
          @click="continuar"
        >
          {{ enviando ? 'Salvando…' : 'Continuar' }}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
