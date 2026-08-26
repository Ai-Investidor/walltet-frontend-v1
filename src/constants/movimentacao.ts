import {
  PhArrowDown,
  PhArrowDownRight,
  PhArrowUp,
  PhArrowUpRight,
  PhMinus,
} from '@phosphor-icons/vue'
import type { Movimentacao } from '@utils/movimentacao'
import type { Component } from 'vue'

/** Ícone, cor e rótulo de cada movimentação — compartilhado por toda tela que lista ativos de
 * uma carteira (Painel, Carteira do cliente, Composição do admin). */
export interface MovimentacaoPresentation {
  icon: Component
  tone: 'text-success' | 'text-warning' | 'text-muted-foreground-faint'
  label: string
}

export const MOVIMENTACAO_PRESENTATION: Record<Movimentacao, MovimentacaoPresentation> = {
  manter: { icon: PhMinus, tone: 'text-muted-foreground-faint', label: 'MANTER' },
  entrou: { icon: PhArrowDownRight, tone: 'text-success', label: 'ENTROU' },
  saiu: { icon: PhArrowUpRight, tone: 'text-warning', label: 'SAIU' },
  aumentou: { icon: PhArrowUp, tone: 'text-success', label: 'AUMENTOU' },
  reduziu: { icon: PhArrowDown, tone: 'text-warning', label: 'REDUZIU' },
}
