<script setup lang="ts">
import { ProfileGauge } from '@components/shared/profile-gauge'
import { Button } from '@components/ui/button'
import { Card } from '@components/ui/card'
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
import { PhArrowRight } from '@phosphor-icons/vue'
import type { CarteiraDetalheDto } from '@services/types'
import { perfilParaNivel } from '@utils/perfil'
import { RouterLink } from 'vue-router'

interface Props {
  carteiras: CarteiraDetalheDto[]
}

defineProps<Props>()

const CARD_SURFACE = 'gap-0 rounded-lg border py-0 ring-0'
const HEAD_CELL = 'text-eyebrow text-muted-foreground-faint h-auto px-4.5 py-2.5'
const BODY_CELL = 'px-4.5 py-3'
const ICON_ACTION = 'size-7.5 rounded-sm border-border'

// A coluna "Investidores" saiu: não existe rota que devolva investidores por carteira
// (docs/AUDITORIA-INTEGRACAO.md, achado 4.1).
const COLUMNS = [
  { label: 'Carteira', width: '' },
  { label: 'Perfil-alvo', width: 'w-[110px]' },
  { label: 'Ativos', width: 'w-[100px]' },
  { label: 'Ações', width: 'w-[110px]' },
]

function walletPath(wallet: CarteiraDetalheDto) {
  return `/admin/carteiras/${wallet.id}`
}

function gaugeLabel(wallet: CarteiraDetalheDto) {
  const nivel = perfilParaNivel(wallet.perfilAlvo)
  return `Perfil-alvo ${wallet.perfilAlvo.toLowerCase()}, nível ${nivel} de 4`
}
</script>

<template>
  <Card :class="CARD_SURFACE">
    <Table class="max-sm:hidden">
      <TableCaption class="sr-only">
        Carteiras recomendadas, com perfil-alvo e número de ativos na versão vigente.
      </TableCaption>

      <TableHeader>
        <TableRow class="hover:bg-transparent">
          <TableHead v-for="column in COLUMNS" :key="column.label" scope="col" :class="[HEAD_CELL, column.width]">
            {{ column.label }}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableEmpty v-if="carteiras.length === 0" :colspan="COLUMNS.length">
          Nenhuma carteira cadastrada ainda.
        </TableEmpty>

        <TableRow v-for="wallet in carteiras" :key="wallet.id">
          <TableCell :class="BODY_CELL">
            <RouterLink :to="walletPath(wallet)" class="text-paragraph-strong hover:text-success">
              {{ wallet.nome }}
            </RouterLink>
          </TableCell>

          <TableCell :class="BODY_CELL">
            <span class="flex items-center gap-2">
              <ProfileGauge :level="perfilParaNivel(wallet.perfilAlvo)" :label="gaugeLabel(wallet)" />
              <span class="text-tag-sm text-muted-foreground">{{ wallet.perfilAlvo }}</span>
            </span>
          </TableCell>

          <TableCell :class="[BODY_CELL, 'text-table-value']">
            {{ wallet.versaoAtual?.itens.length ?? 0 }} ativos
          </TableCell>

          <TableCell :class="BODY_CELL">
            <span class="flex justify-end gap-2">
              <Button as-child variant="outline" size="icon-sm" :class="ICON_ACTION" :aria-label="`Abrir ${wallet.nome}`">
                <RouterLink :to="walletPath(wallet)">
                  <PhArrowRight class="size-3.5" aria-hidden="true" />
                </RouterLink>
              </Button>
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <ul class="hidden max-sm:block" aria-label="Carteiras recomendadas, com perfil-alvo e número de ativos na versão vigente">
      <li v-if="carteiras.length === 0" class="text-paragraph text-muted-foreground p-4">
        Nenhuma carteira cadastrada ainda.
      </li>

      <li
        v-for="wallet in carteiras"
        :key="wallet.id"
        class="border-border not-last:border-b flex flex-col gap-3 p-4"
      >
        <div class="flex items-center justify-between gap-2.5">
          <span class="flex items-center gap-2">
            <ProfileGauge :level="perfilParaNivel(wallet.perfilAlvo)" :label="gaugeLabel(wallet)" />
            <span class="text-tag-sm text-muted-foreground">{{ wallet.perfilAlvo }}</span>
          </span>

          <Button as-child variant="outline" size="icon-sm" :class="ICON_ACTION" :aria-label="`Abrir ${wallet.nome}`">
            <RouterLink :to="walletPath(wallet)">
              <PhArrowRight class="size-3.5" aria-hidden="true" />
            </RouterLink>
          </Button>
        </div>

        <RouterLink :to="walletPath(wallet)" class="text-card-title hover:text-success">
          {{ wallet.nome }}
        </RouterLink>

        <p class="text-label text-muted-foreground border-border border-t pt-2.5">
          {{ wallet.versaoAtual?.itens.length ?? 0 }} ativos
        </p>
      </li>
    </ul>
  </Card>
</template>
