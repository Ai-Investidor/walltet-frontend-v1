import type { CarteiraItemDetalheDto } from '@services/types'

export interface FatiaAlocacao {
  label: string
  percent: number
}

/**
 * Agrupa os itens de uma versão de carteira por classe de ativo, somando o peso. `classeAtivo` é
 * opcional no backend (ver docs/AUDITORIA-INTEGRACAO.md) — itens sem classe caem em "Outros".
 * Usado por toda tela que desenha a barra de alocação por classe.
 */
export function agruparPorClasse(itens: CarteiraItemDetalheDto[]): FatiaAlocacao[] {
  const totais = new Map<string, number>()

  for (const item of itens) {
    const classe = item.classeAtivo ?? 'Outros'
    totais.set(classe, (totais.get(classe) ?? 0) + item.pesoPercentual)
  }

  return Array.from(totais.entries()).map(([label, percent]) => ({ label, percent }))
}

/** Classe utilitária pronta — usada onde a fatia aplica o tom direto como `class` (barra manual
 * com hover, sem passar pelo componente `AllocationBar`). */
export const TONS_ALOCACAO = ['bg-data-1', 'bg-data-2', 'bg-data-3', 'bg-data-4'] as const

/** Nome do tom sem o prefixo `bg-` — o que `AllocationSlice['tone']` (`@components/shared/allocation-bar`)
 * espera, já que o próprio componente resolve a classe internamente. */
export const TONS_ALOCACAO_BARE = ['data-1', 'data-2', 'data-3', 'data-4'] as const
