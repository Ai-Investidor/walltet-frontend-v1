// DADOS ESTÁTICOS — trocar por camada dinâmica (service/store/composable) quando a skill existir.
// Assinaturas e tipos são o contrato; não alterar sem atualizar o manifesto.

export interface Kpi {
  label: string
  value: string
  note: string
  tone: 'positive' | 'neutral'
}

export interface AllocationClass {
  label: string
  percent: number
  tone: 'data-1' | 'data-2' | 'data-3'
}

export interface Asset {
  code: string
  name: string
  className: string
  trend: 'up' | 'down' | 'flat'
  trendLabel: string
  weightPercent: number
}

export interface Movement {
  id: string
  name: string
  direction: 'in' | 'out' | 'increase' | 'decrease'
  label: string
}

export interface Report {
  title: string
  generatedAt: string
  sizeLabel: string
}

export interface ReportArchiveGroup {
  year: string
  reports: Report[]
}

export interface RevisionNote {
  title: string
  body: string
}

export interface RecommendedWallet {
  slug: string
  profileLabel: string
  profileLevel: 1 | 2 | 3 | 4
  name: string
  description: string
  allocationPreview: AllocationClass[]
  meta: string
  isOwn: boolean
  to?: string
}

export interface MovementDetail {
  code: string
  name: string
  detail: string
  direction: 'in' | 'out' | 'increase' | 'decrease' | 'hold'
  label: string
  value: string
}

export interface MovementGroup {
  kind: 'in' | 'out' | 'reweight' | 'hold'
  title: string
  items: MovementDetail[]
}

export interface PerformanceRow {
  competencia: string
  carteira: number
  cdi: number
  ibovespa: number
  percentOfCdi: number
}

export const kpis: Kpi[] = [
  {
    label: 'Rentabilidade do mês',
    value: '+1,85 %',
    note: 'CDI do mês: +0,87 %',
    tone: 'positive',
  },
  {
    label: 'Acumulado no ano',
    value: '+8,42 %',
    note: 'CDI no ano: +6,80 %',
    tone: 'positive',
  },
  {
    label: '% do CDI no ano',
    value: '212,6 %',
    note: 'Carteira sobre o CDI',
    tone: 'neutral',
  },
  {
    label: 'Ativos na carteira',
    value: '4',
    note: 'Revisada em 01/08/2026',
    tone: 'neutral',
  },
]

export const allocation: AllocationClass[] = [
  { label: 'Renda Fixa', percent: 30, tone: 'data-1' },
  { label: 'Ações BR', percent: 50, tone: 'data-2' },
  { label: 'FII', percent: 20, tone: 'data-3' },
]

export const assets: Asset[] = [
  {
    code: 'TD',
    name: 'Tesouro IPCA+ 2035',
    className: 'Renda Fixa',
    trend: 'up',
    trendLabel: 'Aumentou',
    weightPercent: 30,
  },
  {
    code: 'VL',
    name: 'VALE3',
    className: 'Ações BR · Mineração',
    trend: 'down',
    trendLabel: 'Reduziu',
    weightPercent: 20,
  },
  {
    code: 'BB',
    name: 'BBDC4',
    className: 'Ações BR · Bancos',
    trend: 'flat',
    trendLabel: 'Manter',
    weightPercent: 30,
  },
  {
    code: 'MX',
    name: 'MXRF11',
    className: 'FII · Papel',
    trend: 'up',
    trendLabel: 'Entrou',
    weightPercent: 20,
  },
]

export const movements: Movement[] = [
  { id: 'mxrf11-entrou', name: 'MXRF11', direction: 'in', label: 'Entrou' },
  { id: 'petr4-saiu', name: 'PETR4', direction: 'out', label: 'Saiu' },
  {
    id: 'tesouro-ipca-2035-aumentou',
    name: 'Tesouro IPCA+ 2035',
    direction: 'increase',
    label: 'Aumentou',
  },
  { id: 'vale3-reduziu', name: 'VALE3', direction: 'decrease', label: 'Reduziu' },
]

export const lastReport: Report = {
  title: 'Relatório de Performance — Agosto/2026',
  generatedAt: '01/09/2026',
  sizeLabel: '471 KB',
}

export const revisionNote: RevisionNote = {
  title: 'Justificativa da revisão de agosto',
  body: 'A entrada de MXRF11 substitui a posição em PETR4, encerrada após a mudança de política de distribuição. O peso em Tesouro IPCA+ 2035 subiu de 25% para 30% para sustentar a parcela indexada à inflação, e VALE3 caiu de 25% para 20% por concentração setorial. A carteira segue dentro da faixa de risco do perfil moderado.',
}

export const recommendedWallets: RecommendedWallet[] = [
  {
    slug: 'conservador',
    profileLabel: 'CONSERVADOR',
    profileLevel: 1,
    name: 'Carteira Conservadora Patrimonial',
    description: 'Preservação de capital com indexação à inflação e liquidez alta.',
    allocationPreview: [
      { label: 'Renda Fixa', percent: 85, tone: 'data-1' },
      { label: 'FII', percent: 10, tone: 'data-2' },
      { label: 'Ações BR', percent: 5, tone: 'data-3' },
    ],
    meta: '5 ativos · Renda Fixa 85 %',
    isOwn: false,
  },
  {
    slug: 'moderado',
    profileLabel: 'MODERADO',
    profileLevel: 2,
    name: 'Carteira Moderada Estratégica',
    description: 'Núcleo em renda fixa com parcela em ações e fundos imobiliários.',
    allocationPreview: [
      { label: 'Renda Fixa', percent: 30, tone: 'data-1' },
      { label: 'Ações BR', percent: 50, tone: 'data-2' },
      { label: 'FII', percent: 20, tone: 'data-3' },
    ],
    meta: '4 ativos · sua carteira',
    isOwn: true,
    to: '/carteira',
  },
  {
    slug: 'arrojado',
    profileLabel: 'ARROJADO',
    profileLevel: 3,
    name: 'Carteira Arrojada Multimercado',
    description: 'Maior exposição a renda variável e multimercado, oscilação alta.',
    allocationPreview: [
      { label: 'Renda Fixa', percent: 20, tone: 'data-1' },
      { label: 'Ações BR', percent: 55, tone: 'data-2' },
      { label: 'Multimercado', percent: 25, tone: 'data-3' },
    ],
    meta: '7 ativos · Ações BR 55 %',
    isOwn: false,
  },
  {
    slug: 'sofisticado',
    profileLabel: 'SOFISTICADO',
    profileLevel: 4,
    name: 'Carteira Sofisticada Global',
    description: 'Renda variável global, câmbio e ativos alternativos.',
    allocationPreview: [
      { label: 'Renda Fixa', percent: 10, tone: 'data-1' },
      { label: 'Renda Variável Global', percent: 45, tone: 'data-2' },
      { label: 'Alternativos', percent: 45, tone: 'data-3' },
    ],
    meta: '9 ativos · Global 45 %',
    isOwn: false,
  },
]

export const performanceIndicators: Kpi[] = [
  {
    label: 'Mês',
    value: '+1,85 %',
    note: 'CDI +0,87 % · Ibov +2,10 %',
    tone: 'positive',
  },
  {
    label: 'No ano',
    value: '+8,42 %',
    note: 'CDI +6,80 %',
    tone: 'positive',
  },
  {
    label: '% do CDI',
    value: '212,6 %',
    note: 'Acumulado de 2026',
    tone: 'neutral',
  },
  {
    label: 'Meses positivos',
    value: '11 de 12',
    note: 'Últimos 12 meses',
    tone: 'neutral',
  },
]

export const performanceHistory: PerformanceRow[] = [
  { competencia: 'Ago/26', carteira: 1.85, cdi: 0.87, ibovespa: 2.1, percentOfCdi: 212.6 },
  { competencia: 'Jul/26', carteira: 1.35, cdi: 0.86, ibovespa: 2.2, percentOfCdi: 157.0 },
  { competencia: 'Jun/26', carteira: -0.1, cdi: 0.84, ibovespa: -1.8, percentOfCdi: -11.9 },
  { competencia: 'Mai/26', carteira: 1.25, cdi: 0.85, ibovespa: 1.4, percentOfCdi: 147.1 },
  { competencia: 'Abr/26', carteira: 1.1, cdi: 0.83, ibovespa: 0.9, percentOfCdi: 132.5 },
  { competencia: 'Mar/26', carteira: 1.4, cdi: 0.86, ibovespa: 2.8, percentOfCdi: 162.8 },
  { competencia: 'Fev/26', carteira: 0.3, cdi: 0.84, ibovespa: -2.4, percentOfCdi: 35.7 },
  { competencia: 'Jan/26', carteira: 2.0, cdi: 0.85, ibovespa: 1.6, percentOfCdi: 235.3 },
  { competencia: 'Dez/25', carteira: 1.42, cdi: 0.84, ibovespa: 3.1, percentOfCdi: 169.0 },
  { competencia: 'Nov/25', carteira: 0.65, cdi: 0.79, ibovespa: 0.4, percentOfCdi: 82.3 },
  { competencia: 'Out/25', carteira: 1.1, cdi: 0.82, ibovespa: -1.2, percentOfCdi: 134.1 },
  { competencia: 'Set/25', carteira: 0.72, cdi: 0.8, ibovespa: 1.9, percentOfCdi: 90.0 },
]

export const movementGroups: MovementGroup[] = [
  {
    kind: 'in',
    title: 'Entradas',
    items: [
      {
        code: 'MX',
        name: 'MXRF11',
        detail: 'FII · Papel',
        direction: 'in',
        label: 'ENTROU',
        value: '20,00 %',
      },
    ],
  },
  {
    kind: 'out',
    title: 'Saídas',
    items: [
      {
        code: 'PT',
        name: 'PETR4',
        detail: 'Ações BR · Petróleo',
        direction: 'out',
        label: 'SAIU',
        value: '−15,00 p.p.',
      },
    ],
  },
  {
    kind: 'reweight',
    title: 'Alterações de peso',
    items: [
      {
        code: 'TD',
        name: 'Tesouro IPCA+ 2035',
        detail: '25,00 % → 30,00 %',
        direction: 'increase',
        label: 'AUMENTOU',
        value: '+5,00 p.p.',
      },
      {
        code: 'VL',
        name: 'VALE3',
        detail: '25,00 % → 20,00 %',
        direction: 'decrease',
        label: 'REDUZIU',
        value: '−5,00 p.p.',
      },
    ],
  },
  {
    kind: 'hold',
    title: 'Mantidos',
    items: [
      {
        code: 'BB',
        name: 'BBDC4',
        detail: 'Ações BR · Bancos',
        direction: 'hold',
        label: 'MANTER',
        value: '30,00 %',
      },
    ],
  },
]

export const reportArchive: ReportArchiveGroup[] = [
  {
    year: '2026',
    reports: [
      {
        title: 'Relatório de Performance — Agosto/2026',
        generatedAt: '01/09/2026',
        sizeLabel: '471 KB',
      },
      {
        title: 'Relatório de Performance — Julho/2026',
        generatedAt: '01/08/2026',
        sizeLabel: '463 KB',
      },
      {
        title: 'Relatório de Performance — Junho/2026',
        generatedAt: '01/07/2026',
        sizeLabel: '455 KB',
      },
      {
        title: 'Relatório de Performance — Maio/2026',
        generatedAt: '01/06/2026',
        sizeLabel: '448 KB',
      },
    ],
  },
  {
    year: '2025',
    reports: [
      {
        title: 'Relatório de Performance — Dezembro/2025',
        generatedAt: '02/01/2026',
        sizeLabel: '441 KB',
      },
      {
        title: 'Relatório de Performance — Novembro/2025',
        generatedAt: '01/12/2025',
        sizeLabel: '437 KB',
      },
    ],
  },
]
