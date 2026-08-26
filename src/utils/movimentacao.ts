import type { StatusMovimentacao } from '@services/types'

// `StatusMovimentacao` do backend tem 5 valores; o tipo estático antigo (`Asset['trend']`) só
// tinha 3 e perdia a distinção "entrou" vs. "aumentou" — ver docs/AUDITORIA-INTEGRACAO.md,
// achado de wallet.ts:Asset.trend. `Movimentacao` é o tipo de UI unificado usado por toda view que
// desenha o selo de movimentação de um ativo; cada view mapeia `Movimentacao` pro próprio par
// ícone/tom (o ícone é `Component`, então fica de fora deste arquivo, que não importa Vue).
export type Movimentacao = 'entrou' | 'saiu' | 'aumentou' | 'reduziu' | 'manter'

const MOVIMENTACAO_POR_STATUS: Record<StatusMovimentacao, Movimentacao> = {
  ENTROU: 'entrou',
  SAIU: 'saiu',
  AUMENTOU: 'aumentou',
  REDUZIU: 'reduziu',
  MANTER: 'manter',
}

export function statusParaMovimentacao(status: StatusMovimentacao): Movimentacao {
  return MOVIMENTACAO_POR_STATUS[status]
}

const ROTULO_POR_MOVIMENTACAO: Record<Movimentacao, string> = {
  entrou: 'Entrou',
  saiu: 'Saiu',
  aumentou: 'Aumentou',
  reduziu: 'Reduziu',
  manter: 'Manter',
}

export function rotuloMovimentacao(movimentacao: Movimentacao): string {
  return ROTULO_POR_MOVIMENTACAO[movimentacao]
}
