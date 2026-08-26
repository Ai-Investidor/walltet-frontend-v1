<script setup lang="ts">
import { ConfirmDialog } from '@components/admin/confirm-dialog'
import { StatusBadge } from '@components/admin/status-badge'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { Input } from '@components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { PhArrowCounterClockwise, PhMagnifyingGlass, PhProhibit, PhX } from '@phosphor-icons/vue'
import type {
  ErrorPayload,
  PerfilUsuario,
  ResultadoAvaliacaoDto,
  UsuarioListagemDto,
} from '@services/types'
import * as usuariosService from '@services/usuarios'
import { formatDataCurta } from '@utils/format'
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'

interface Props {
  usuarios: UsuarioListagemDto[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  buscar: [termo: string]
  atualizado: []
}>()

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'
const HEAD_CELL = 'text-eyebrow text-muted-foreground-faint h-auto px-4.5 py-2.5'
const BODY_CELL = 'px-4.5 py-3'
const FIELD = 'text-paragraph h-10.5 w-full rounded-sm px-3'

// A coluna "Perfil" (investidor) saiu: `UsuarioListagemDto` não traz `perfilInvestidor` — só
// `GET /auth/me` (do próprio usuário) e o resultado da avaliação têm esse dado. Ver
// docs/AUDITORIA-INTEGRACAO.md.
const COLUMNS = [
  { label: 'Usuário', width: '' },
  { label: 'Papel', width: 'w-[110px]' },
  { label: 'Status', width: 'w-[110px]' },
  { label: 'Desde', width: 'w-[110px]' },
]

const search = ref('')
let debounceHandle: ReturnType<typeof setTimeout> | undefined

watch(search, (termo) => {
  clearTimeout(debounceHandle)
  debounceHandle = setTimeout(() => emit('buscar', termo), 300)
})

const selectedId = ref<string | null>(null)
const selectedUser = computed(
  () => props.usuarios.find((user) => user.id === selectedId.value) ?? null,
)

const historico = ref<ResultadoAvaliacaoDto[] | null>(null)
const historicoErro = ref(false)

watch(selectedUser, async (user) => {
  historico.value = null
  historicoErro.value = false

  if (!user) {
    return
  }

  try {
    historico.value = await usuariosService.historicoSuitability(user.id)
  } catch {
    historicoErro.value = true
  }
})

const perfilEmEdicao = ref<PerfilUsuario | null>(null)
watch(selectedUser, (user) => {
  perfilEmEdicao.value = user?.perfil ?? null
})

const salvandoPerfil = ref(false)
const confirmInativarOpen = ref(false)

async function salvarPerfil() {
  if (
    !selectedUser.value ||
    !perfilEmEdicao.value ||
    perfilEmEdicao.value === selectedUser.value.perfil
  ) {
    return
  }

  salvandoPerfil.value = true
  try {
    await usuariosService.atualizar(selectedUser.value.id, { perfil: perfilEmEdicao.value })
    toast.success('Papel atualizado')
    emit('atualizado')
  } catch (err) {
    const payload = err as ErrorPayload
    toast.error(payload.error?.message ?? 'Não foi possível atualizar o papel.')
    perfilEmEdicao.value = selectedUser.value.perfil
  } finally {
    salvandoPerfil.value = false
  }
}

async function alternarStatus() {
  if (!selectedUser.value) {
    return
  }

  const novoStatus = !selectedUser.value.ativo

  try {
    await usuariosService.atualizar(selectedUser.value.id, { ativo: novoStatus })
    toast.success(novoStatus ? 'Usuário reativado' : 'Usuário inativado')
    selectedId.value = null
    emit('atualizado')
  } catch (err) {
    const payload = err as ErrorPayload
    toast.error(payload.error?.message ?? 'Não foi possível atualizar o status.')
  }
}

function pedirInativacao() {
  confirmInativarOpen.value = true
}
</script>

<template>
  <section class="flex flex-col gap-6" aria-label="Usuários cadastrados">
    <div class="relative w-105">
      <PhMagnifyingGlass class="absolute top-1/2 left-3.25 size-4 -translate-y-1/2 text-muted-foreground-faint" aria-hidden="true" />
      <Input
        v-model="search"
        type="search"
        class="h-10.5 rounded-sm pr-3 pl-9.5"
        placeholder="Buscar por nome ou e-mail"
        aria-label="Buscar usuário por nome ou e-mail"
      />
    </div>

    <Card :class="CARD_SURFACE">
      <Table>
        <TableCaption class="sr-only">
          Usuários da plataforma, com papel e situação do cadastro.
        </TableCaption>

        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead v-for="column in COLUMNS" :key="column.label" scope="col" :class="[HEAD_CELL, column.width]">
              {{ column.label }}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableEmpty v-if="!usuarios.length" :colspan="COLUMNS.length">
            Nenhum usuário encontrado{{ search ? ` para "${search}"` : '' }}.
          </TableEmpty>

          <TableRow v-for="user in usuarios" :key="user.id">
            <TableCell :class="BODY_CELL">
              <button type="button" class="block text-left" @click="selectedId = user.id">
                <span class="text-paragraph-strong block hover:text-success">{{ user.nome }}</span>
                <span class="text-label block text-muted-foreground-faint">{{ user.email }}</span>
              </button>
            </TableCell>

            <TableCell :class="[BODY_CELL, 'text-label text-muted-foreground']">
              {{ user.perfil === 'admin' ? 'Admin' : 'Cliente' }}
            </TableCell>

            <TableCell :class="BODY_CELL">
              <StatusBadge :tone="user.ativo ? 'success' : 'warning'">
                {{ user.ativo ? 'Ativo' : 'Inativo' }}
              </StatusBadge>
            </TableCell>

            <TableCell :class="[BODY_CELL, 'text-label text-muted-foreground-faint tabular-nums']">
              {{ formatDataCurta(user.criadoEm) }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <Sheet :open="Boolean(selectedUser)" @update:open="selectedId = null">
      <SheetContent v-if="selectedUser" side="right" :show-close-button="false" class="gap-0 p-0 data-[side=right]:w-115! data-[side=right]:sm:max-w-115!">
        <SheetHeader class="flex-row items-start justify-between gap-3.5 border-b border-border p-5">
          <div class="flex flex-col gap-0.75">
            <SheetTitle class="text-subtitle-strong">
              {{ selectedUser.nome }}
            </SheetTitle>
            <SheetDescription class="text-label text-muted-foreground-faint">
              {{ selectedUser.email }}
            </SheetDescription>
          </div>

          <SheetClose as-child>
            <Button variant="outline" size="icon-lg" class="rounded-sm" aria-label="Fechar cadastro">
              <PhX class="size-3.5" aria-hidden="true" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div class="flex flex-col gap-5 overflow-y-auto p-5">
          <div class="flex flex-col gap-1.75">
            <label for="usuario-papel" class="text-eyebrow text-muted-foreground-faint">Papel</label>
            <div class="flex gap-2">
              <Select v-model="perfilEmEdicao">
                <SelectTrigger id="usuario-papel" :class="FIELD">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                size="lg"
                :disabled="salvandoPerfil || perfilEmEdicao === selectedUser.perfil"
                class="text-button-sm shrink-0 rounded-sm px-4"
                @click="salvarPerfil"
              >
                Salvar
              </Button>
            </div>
          </div>

          <dl class="bg-border grid grid-cols-2 gap-px overflow-hidden rounded-md border">
            <div class="bg-card flex flex-col gap-1 p-3.5">
              <dt class="text-eyebrow text-muted-foreground-faint">Status</dt>
              <dd class="text-paragraph-strong">{{ selectedUser.ativo ? 'Ativo' : 'Inativo' }}</dd>
            </div>
            <div class="bg-card flex flex-col gap-1 p-3.5">
              <dt class="text-eyebrow text-muted-foreground-faint">Cadastro</dt>
              <dd class="text-paragraph-strong tabular-nums">{{ formatDataCurta(selectedUser.criadoEm) }}</dd>
            </div>
          </dl>

          <div class="flex flex-col gap-3">
            <h3 id="historico-suitability" class="text-eyebrow text-muted-foreground-faint">
              Histórico de suitability
            </h3>

            <p v-if="historicoErro" class="text-label text-muted-foreground-faint">
              Histórico indisponível no momento.
            </p>
            <p v-else-if="historico === null" class="text-label text-muted-foreground-faint">
              Carregando…
            </p>
            <p v-else-if="historico.length === 0" class="text-label text-muted-foreground-faint">
              Nenhuma avaliação registrada.
            </p>
            <ol v-else class="flex flex-col" aria-labelledby="historico-suitability">
              <li v-for="entry in historico" :key="entry.id" class="flex gap-3 pb-3.5">
                <span class="flex flex-col items-center gap-1 pt-1.25" aria-hidden="true">
                  <span class="size-1.75 shrink-0 rounded-full bg-success" />
                </span>
                <div class="flex flex-col gap-0.5">
                  <p class="text-meta tabular-nums">{{ formatDataCurta(entry.dataAvaliacao) }}</p>
                  <p class="text-label text-muted-foreground">
                    {{ entry.pontuacaoTotal }} pontos · {{ entry.perfilResultante }}
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div class="flex flex-wrap gap-3 border-t border-border-strong pt-3.5">
            <Button
              v-if="selectedUser.ativo"
              type="button"
              variant="outline"
              size="lg"
              class="text-button-xs gap-2 rounded-sm border-warning px-3.5 text-warning hover:bg-warning/10 hover:text-warning"
              @click="pedirInativacao"
            >
              <PhProhibit aria-hidden="true" />
              Inativar usuário
            </Button>

            <Button
              v-else
              type="button"
              variant="outline"
              size="lg"
              class="text-button-xs gap-2 rounded-sm border-success px-3.5 text-success hover:bg-success/10 hover:text-success"
              @click="alternarStatus"
            >
              <PhArrowCounterClockwise aria-hidden="true" />
              Reativar usuário
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>

    <ConfirmDialog
      v-model:open="confirmInativarOpen"
      title="Inativar este usuário?"
      :description="selectedUser ? `${selectedUser.nome} perde o acesso à plataforma. O cadastro é preservado.` : undefined"
      confirm-label="Inativar usuário"
      cancel-label="Manter ativo"
      tone="destructive"
      @confirm="alternarStatus"
    />
  </section>
</template>
