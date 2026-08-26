<script setup lang="ts">
import { StatusBadge } from '@components/admin/status-badge'
import { ProfileGauge } from '@components/shared/profile-gauge'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import { Input } from '@components/ui/input'
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
import type { AdminUser } from '@data/admin'
import { adminUsers } from '@data/admin'
import { PhMagnifyingGlass, PhProhibit, PhX } from '@phosphor-icons/vue'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const HEAD_CELL = 'text-eyebrow text-muted-foreground-faint h-auto px-4.5 py-2.5'
const BODY_CELL = 'px-4.5 py-3'
const DATA_TILE = 'bg-card flex flex-col gap-1 p-3.5'

const COLUMNS = [
  { label: 'Usuário', width: '' },
  { label: 'Perfil', width: 'w-[110px]' },
  { label: 'Papel', width: 'w-[100px]' },
  { label: 'Status', width: 'w-[110px]' },
  { label: 'Desde', width: 'w-[110px]' },
]

const search = ref('')
const selectedUser = ref<AdminUser | null>(null)

const visibleUsers = computed(() => {
  const term = search.value.trim().toLocaleLowerCase('pt-BR')

  if (!term) {
    return adminUsers
  }

  return adminUsers.filter(
    (user) =>
      user.name.toLocaleLowerCase('pt-BR').includes(term) ||
      user.email.toLocaleLowerCase('pt-BR').includes(term),
  )
})

function gaugeLabel(user: AdminUser) {
  return `Perfil ${user.profileLabel?.toLocaleLowerCase('pt-BR')}, nível ${user.profileLevel} de 4`
}

function openUser(user: AdminUser) {
  selectedUser.value = user
}
</script>

<template>
  <section class="flex flex-col gap-6" aria-label="Usuários cadastrados">
    <div class="relative w-105">
      <PhMagnifyingGlass
        class="absolute top-1/2 left-3.25 size-4 -translate-y-1/2 text-muted-foreground-faint"
        aria-hidden="true"
      />

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
          Usuários da plataforma, com perfil de investidor, papel e situação do cadastro.
        </TableCaption>

        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <TableHead
              v-for="column in COLUMNS"
              :key="column.label"
              scope="col"
              :class="[HEAD_CELL, column.width]"
            >
              {{ column.label }}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableEmpty v-if="!visibleUsers.length" :colspan="COLUMNS.length">
            Nenhum usuário encontrado para "{{ search }}".
          </TableEmpty>

          <TableRow v-for="user in visibleUsers" :key="user.id">
            <TableCell :class="BODY_CELL">
              <button type="button" class="block text-left" @click="openUser(user)">
                <span class="text-paragraph-strong block hover:text-success">{{ user.name }}</span>
                <span class="text-label block text-muted-foreground-faint">{{ user.email }}</span>
              </button>
            </TableCell>

            <TableCell :class="BODY_CELL">
              <span v-if="user.profileLevel" class="flex items-center gap-2">
                <ProfileGauge :level="user.profileLevel" :label="gaugeLabel(user)" />
                <span class="text-tag-sm text-muted-foreground">{{ user.profileLabel }}</span>
              </span>
              <span v-else class="text-tag-sm text-muted-foreground">—</span>
            </TableCell>

            <TableCell :class="[BODY_CELL, 'text-label text-muted-foreground']">
              {{ user.role }}
            </TableCell>

            <TableCell :class="BODY_CELL">
              <StatusBadge :tone="user.active ? 'success' : 'warning'">
                {{ user.active ? 'Ativo' : 'Inativo' }}
              </StatusBadge>
            </TableCell>

            <TableCell :class="[BODY_CELL, 'text-label text-muted-foreground-faint tabular-nums']">
              {{ user.since }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>

    <Sheet :open="Boolean(selectedUser)" @update:open="selectedUser = null">
      <SheetContent
        v-if="selectedUser"
        side="right"
        :show-close-button="false"
        class="gap-0 p-0 data-[side=right]:w-115! data-[side=right]:sm:max-w-115!"
      >
        <SheetHeader
          class="flex-row items-start justify-between gap-3.5 border-b border-border p-5"
        >
          <div class="flex flex-col gap-0.75">
            <SheetTitle class="text-subtitle-strong">
              {{ selectedUser.name }}
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
          <dl class="bg-border grid grid-cols-2 gap-px overflow-hidden rounded-md border">
            <div :class="DATA_TILE">
              <dt class="text-eyebrow text-muted-foreground-faint">Papel</dt>
              <dd class="text-paragraph-strong">{{ selectedUser.role }}</dd>
            </div>

            <div :class="DATA_TILE">
              <dt class="text-eyebrow text-muted-foreground-faint">Status</dt>
              <dd class="text-paragraph-strong">{{ selectedUser.active ? 'Ativo' : 'Inativo' }}</dd>
            </div>

            <div :class="DATA_TILE">
              <dt class="text-eyebrow text-muted-foreground-faint">Cadastro</dt>
              <dd class="text-paragraph-strong tabular-nums">{{ selectedUser.since }}</dd>
            </div>

            <div :class="DATA_TILE">
              <dt class="text-eyebrow text-muted-foreground-faint">Perfil</dt>
              <dd class="flex items-center gap-2">
                <template v-if="selectedUser.profileLevel">
                  <ProfileGauge
                    :level="selectedUser.profileLevel"
                    :label="gaugeLabel(selectedUser)"
                  />
                  <span class="text-tag-sm">{{ selectedUser.profileLabel }}</span>
                </template>
                <span v-else class="text-tag-sm text-muted-foreground">—</span>
              </dd>
            </div>
          </dl>

          <div class="flex flex-col gap-3">
            <h3 id="historico-suitability" class="text-eyebrow text-muted-foreground-faint">
              Histórico de suitability
            </h3>

            <ol class="flex flex-col" aria-labelledby="historico-suitability">
              <li
                v-for="(entry, index) in selectedUser.history"
                :key="entry.date"
                class="flex gap-3"
              >
                <span class="flex flex-col items-center gap-1 pt-1.25" aria-hidden="true">
                  <span class="size-1.75 shrink-0 rounded-full bg-success" />
                  <span
                    v-if="index < selectedUser.history.length - 1"
                    class="w-px flex-1 bg-border"
                  />
                </span>

                <div class="flex flex-col gap-0.5 pb-3.5">
                  <p class="text-meta tabular-nums">
                    {{ entry.date }}
                  </p>
                  <p class="text-label text-muted-foreground">
                    {{ entry.description }}
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div class="flex gap-3 border-t border-border-strong pt-3.5">
            <Button
              type="button"
              variant="outline"
              size="lg"
              class="text-button-sm rounded-sm border-foreground px-4"
              @click="toast.info('A edição de papel e status entra na próxima etapa.')"
            >
              Editar papel e status
            </Button>

            <Button
              type="button"
              variant="outline"
              size="lg"
              class="text-button-sm gap-2 rounded-sm border-warning px-4 text-warning hover:bg-warning/10 hover:text-warning"
              @click="toast.warning('Inativação exige confirmação')"
            >
              <PhProhibit class="size-3.5" aria-hidden="true" />
              Inativar usuário
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </section>
</template>
