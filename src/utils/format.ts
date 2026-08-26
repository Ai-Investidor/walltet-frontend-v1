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

const dataCurtaFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

const dataLongaFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** ISO 8601 → "01/09/2026". */
export function formatDataCurta(iso: string) {
  return dataCurtaFormatter.format(new Date(iso))
}

/** ISO 8601 → "1 de setembro de 2026". */
export function formatDataLonga(iso: string) {
  return dataLongaFormatter.format(new Date(iso))
}

const UNIDADES_BYTES = ['B', 'KB', 'MB', 'GB']

/** 482304 → "471 KB" — mesma escala de `tamanhoBytes` devolvido pelo backend. */
export function formatBytes(bytes: number) {
  if (bytes <= 0) {
    return '0 B'
  }

  const grandeza = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNIDADES_BYTES.length - 1)
  const valor = bytes / 1024 ** grandeza

  return `${grandeza === 0 ? valor : valor.toFixed(0)} ${UNIDADES_BYTES[grandeza]}`
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
