import type { AssetMovement } from '@data/admin'
import {
  PhArrowDown,
  PhArrowDownRight,
  PhArrowUp,
  PhArrowUpRight,
  PhMinus,
} from '@phosphor-icons/vue'
import type { Component } from 'vue'

/** Ícone, cor e rótulo de cada movimentação — compartilhado por composição, edição e revisão. */
export interface MovementPresentation {
  icon: Component
  tone: 'text-success' | 'text-warning' | 'text-muted-foreground-faint'
  label: string
}

export const ASSET_MOVEMENT: Record<AssetMovement, MovementPresentation> = {
  hold: { icon: PhMinus, tone: 'text-muted-foreground-faint', label: 'MANTER' },
  in: { icon: PhArrowDownRight, tone: 'text-success', label: 'ENTROU' },
  out: { icon: PhArrowUpRight, tone: 'text-warning', label: 'SAIU' },
  increase: { icon: PhArrowUp, tone: 'text-success', label: 'AUMENTOU' },
  decrease: { icon: PhArrowDown, tone: 'text-warning', label: 'REDUZIU' },
}
