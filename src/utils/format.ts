/** Percentual de composição — 2 casas, sem sinal forçado (ex.: "30,00 %"). */
const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Rentabilidade — 2 casas com sinal sempre visível (ex.: "+1,85 %", "-0,10 %"). */
const signedPercentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'always',
})

/** Proporção sobre benchmark — 1 casa, sinal só quando negativo (ex.: "212,6 %"). */
const ratioFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

/** Nome do mês por extenso, sem o "de" do formato longo do Intl (ex.: "agosto"). */
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long' })

export function formatPercent(value: number) {
  return `${percentFormatter.format(value)} %`
}

export function formatSignedPercent(value: number) {
  return `${signedPercentFormatter.format(value)} %`
}

export function formatRatio(value: number) {
  return `${ratioFormatter.format(value)} %`
}

/** Competência (mês/ano) — ex.: "Agosto 2026". */
export function formatCompetence(date: Date) {
  const month = monthFormatter.format(date)
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`
}

/** Últimas `count` competências, da mais recente à mais antiga, a partir do mês vigente. */
export function generateCompetenceOptions(count = 12, from = new Date()) {
  return Array.from({ length: count }, (_, index) =>
    formatCompetence(new Date(from.getFullYear(), from.getMonth() - index, 1)),
  )
}
