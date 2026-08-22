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

export interface RevisionNote {
  title: string
  body: string
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
