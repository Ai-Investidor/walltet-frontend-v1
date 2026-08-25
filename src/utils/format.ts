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

export function formatPercent(value: number) {
  return `${percentFormatter.format(value)} %`
}

export function formatSignedPercent(value: number) {
  return `${signedPercentFormatter.format(value)} %`
}

export function formatRatio(value: number) {
  return `${ratioFormatter.format(value)} %`
}
