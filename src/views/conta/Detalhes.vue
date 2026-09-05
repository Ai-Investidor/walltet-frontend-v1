<script setup lang="ts">
import { ProfileGauge } from '@components/shared/profile-gauge'
import { Button } from '@components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import { Input } from '@components/ui/input'
import { PhPencilSimple } from '@phosphor-icons/vue'
import { useAuthStore } from '@stores/auth'
import { perfilParaNivel } from '@utils/perfil'
import { toTypedSchema } from '@vee-validate/zod'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'
import * as z from 'zod'

const auth = useAuthStore()

const CARD_CLASS = 'bg-card flex flex-col rounded-lg border border-border'
const CARD_HEADER_CLASS = 'text-card-title border-b border-border px-4.5 py-3'
/** Campo do formulário: mesma altura/raio usados nos formulários do admin. */
const FIELD_CLASS = 'text-paragraph h-10.5 w-full rounded-sm px-3'

interface AccountField {
  label: string
  value: string
  /** Rótulo mais curto pra versão mobile (ver mesmo padrão em KpiCard). */
  labelMobile?: string
}

// "Cliente desde" saiu: `AuthMeResponseDto` não tem `criadoEm` (docs/AUDITORIA-INTEGRACAO.md §3).
const accountFields = computed<AccountField[]>(() => [
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

const editarOpen = ref(false)
const salvando = ref(false)

const editarSchema = toTypedSchema(
  z.object({
    nome: z
      .string({ message: 'Informe o nome' })
      .trim()
      .min(3, 'O nome precisa ter ao menos 3 caracteres'),
    email: z.string({ message: 'Informe o e-mail' }).trim().email('Informe um e-mail válido'),
  }),
)

const initialValues = computed(() => ({
  nome: auth.usuario?.nome ?? '',
  email: auth.usuario?.email ?? '',
}))

async function onSubmit(values: Record<string, unknown>): Promise<void> {
  salvando.value = true

  try {
    await auth.atualizarConta({
      nome: String(values.nome),
      email: String(values.email),
    })
    toast.success('Dados da conta atualizados')
    editarOpen.value = false
  } catch {
    toast.error('Não foi possível salvar as alterações agora.')
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <div class="grid grid-cols-[1.35fr_1fr] items-start gap-6 max-md:grid-cols-1 max-sm:gap-5">
    <section :class="CARD_CLASS" aria-labelledby="conta-dados-titulo">
      <div :class="`${CARD_HEADER_CLASS} flex items-center justify-between gap-3`">
        <h2 id="conta-dados-titulo">
          Dados
        </h2>

        <Dialog v-model:open="editarOpen">
          <DialogTrigger as-child>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              class="rounded-sm"
              aria-label="Editar dados da conta"
            >
              <PhPencilSimple class="size-4" aria-hidden="true" />
            </Button>
          </DialogTrigger>

          <DialogContent class="gap-5">
            <DialogHeader>
              <DialogTitle>Editar dados da conta</DialogTitle>
              <DialogDescription>
                Atualize seu nome e e-mail. As alterações valem para os próximos acessos.
              </DialogDescription>
            </DialogHeader>

            <Form
              :validation-schema="editarSchema"
              :initial-values="initialValues"
              class="flex flex-col gap-4"
              @submit="onSubmit"
            >
              <FormField v-slot="{ componentField }" name="nome">
                <FormItem class="gap-1.75">
                  <FormLabel class="text-eyebrow text-muted-foreground-faint">
                    Nome
                  </FormLabel>
                  <FormControl>
                    <Input type="text" autocomplete="name" :class="FIELD_CLASS" v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="email">
                <FormItem class="gap-1.75">
                  <FormLabel class="text-eyebrow text-muted-foreground-faint">
                    E-mail
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      inputmode="email"
                      autocomplete="email"
                      :class="FIELD_CLASS"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <DialogFooter class="mt-1">
                <DialogClose as-child>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    class="text-button-sm rounded-sm border-foreground px-4"
                  >
                    Cancelar
                  </Button>
                </DialogClose>

                <Button
                  type="submit"
                  size="lg"
                  :disabled="salvando"
                  class="text-button-sm rounded-sm px-4"
                >
                  {{ salvando ? 'Salvando…' : 'Salvar alterações' }}
                </Button>
              </DialogFooter>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

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
        A carteira vinculada é definida pela nossa equipe. Para trocar, fale com o suporte.
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
