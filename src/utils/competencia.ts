// `mesReferencia` do backend é sempre "YYYY-MM" (INTEGRATION_PROMPT.md §1). As telas precisam de
// rótulos em português — ver docs/AUDITORIA-INTEGRACAO.md §1.2.

const MESES_ABREVIADOS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
]

function parse(mesReferencia: string): { ano: number; mes: number } {
  const [ano, mes] = mesReferencia.split('-').map(Number)
  return { ano, mes: mes - 1 }
}

const formatadorLongo = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** "2026-08" → "Agosto 2026" */
export function formatCompetenciaLonga(mesReferencia: string): string {
  const { ano, mes } = parse(mesReferencia)
  const rotulo = formatadorLongo.format(new Date(Date.UTC(ano, mes, 1)))
  return rotulo.charAt(0).toUpperCase() + rotulo.slice(1)
}

/** "2026-08" → "Ago/26" */
export function formatCompetenciaCurta(mesReferencia: string): string {
  const { ano, mes } = parse(mesReferencia)
  return `${MESES_ABREVIADOS[mes]}/${String(ano).slice(-2)}`
}

/** Competência do mês corrente no formato "YYYY-MM", em UTC. */
export function competenciaAtual(): string {
  const hoje = new Date()
  return `${hoje.getUTCFullYear()}-${String(hoje.getUTCMonth() + 1).padStart(2, '0')}`
}
