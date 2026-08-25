<script setup lang="ts">
import { ProfileGauge } from '@components/shared/profile-gauge'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import type { AdminWallet } from '@data/admin'
import { adminWallets } from '@data/admin'
import { PhArrowRight, PhPencilSimple } from '@phosphor-icons/vue'
import { RouterLink } from 'vue-router'

/** Card do design: papel com borda de 1px e raio de 8px, sem o ring e o padding vertical do kit. */
const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'

const HEAD_CELL = 'text-eyebrow text-muted-foreground-faint h-auto px-4.5 py-2.5'
const BODY_CELL = 'px-4.5 py-3'
const ICON_ACTION = 'size-7.5 rounded-sm border-border'

const COLUMNS = [
  { label: 'Carteira', width: '' },
  { label: 'Perfil-alvo', width: 'w-[110px]' },
  { label: 'Ativos', width: 'w-[100px]' },
  { label: 'Investidores', width: 'w-[110px]' },
  { label: 'Ações', width: 'w-[110px]' },
]

function walletPath(wallet: AdminWallet) {
  return `/admin/carteiras/${wallet.slug}`
}

function gaugeLabel(wallet: AdminWallet) {
  return `Perfil-alvo ${wallet.profileLabel.toLocaleLowerCase('pt-BR')}, nível ${wallet.profileLevel} de 4`
}
</script>

<template>
  <Card :class="CARD_SURFACE">
    <Table>
      <TableCaption class="sr-only">
        Carteiras recomendadas ativas, com perfil-alvo, número de ativos e investidores vinculados.
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
        <TableRow v-for="wallet in adminWallets" :key="wallet.slug">
          <TableCell :class="BODY_CELL">
            <RouterLink :to="walletPath(wallet)" class="text-paragraph-strong hover:text-success">
              {{ wallet.name }}
            </RouterLink>
          </TableCell>

          <TableCell :class="BODY_CELL">
            <span class="flex items-center gap-2">
              <ProfileGauge :level="wallet.profileLevel" :label="gaugeLabel(wallet)" />
              <span class="text-tag-sm text-muted-foreground">{{ wallet.profileLabel }}</span>
            </span>
          </TableCell>

          <TableCell :class="[BODY_CELL, 'text-table-value']">
            {{ wallet.assetCount }} ativos
          </TableCell>

          <TableCell :class="[BODY_CELL, 'text-table-value tabular-nums']">
            {{ wallet.investors }}
          </TableCell>

          <TableCell :class="BODY_CELL">
            <span class="flex justify-end gap-2">
              <Button
                as-child
                variant="outline"
                size="icon-sm"
                :class="ICON_ACTION"
                :aria-label="`Editar composição da ${wallet.name}`"
              >
                <RouterLink :to="{ path: walletPath(wallet), query: { modo: 'edicao' } }">
                  <PhPencilSimple class="size-3.5" aria-hidden="true" />
                </RouterLink>
              </Button>

              <Button
                as-child
                variant="outline"
                size="icon-sm"
                :class="ICON_ACTION"
                :aria-label="`Abrir ${wallet.name}`"
              >
                <RouterLink :to="walletPath(wallet)">
                  <PhArrowRight class="size-3.5" aria-hidden="true" />
                </RouterLink>
              </Button>
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Card>
</template>
