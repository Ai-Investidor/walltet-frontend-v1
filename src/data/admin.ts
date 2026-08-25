// DADOS ESTÁTICOS — trocar por camada dinâmica (service/store/composable) quando a skill existir.
// Assinaturas e tipos são o contrato; não alterar sem atualizar o manifesto.

import type { ProfileLevel } from '@components/shared/profile-gauge'

// --- Painel -----------------------------------------------------------------

export interface AdminKpi {
  label: string
  value: string
  note: string
}

export interface ChecklistItem {
  title: string
  /** Caminho na interface que resolve a pendência (ex.: "Carteiras → Composição"). */
  destination: string
  done: number
  total: number
}

export interface ProfileDistribution {
  label: string
  count: number
  tone: 'data-1' | 'data-2' | 'data-3' | 'data-4'
}

export const adminKpis: AdminKpi[] = [
  {
    label: 'Investidores ativos',
    value: '240',
    note: '60 conservadores · 110 moderados',
  },
  { label: 'Carteiras ativas', value: '4', note: 'Uma por perfil' },
  { label: 'Versões em rascunho', value: '1', note: 'Setembro 2026' },
  { label: 'Relatórios de agosto', value: '3 de 4', note: 'Falta a carteira sofisticada' },
]

export const closingChecklist: ChecklistItem[] = [
  {
    title: 'Rebalancear carteiras de setembro',
    destination: 'Carteiras → Composição',
    done: 2,
    total: 4,
  },
  { title: 'Revisar e publicar versões', destination: 'Carteiras → Versões', done: 0, total: 4 },
  {
    title: 'Lançar rentabilidade de agosto',
    destination: 'Carteiras → Rentabilidade',
    done: 4,
    total: 4,
  },
  { title: 'Gerar relatórios de agosto', destination: 'Carteiras → Relatórios', done: 3, total: 4 },
]

export const profileDistribution: ProfileDistribution[] = [
  { label: 'Conservador', count: 60, tone: 'data-1' },
  { label: 'Moderado', count: 110, tone: 'data-2' },
  { label: 'Arrojado', count: 55, tone: 'data-3' },
  { label: 'Sofisticado', count: 15, tone: 'data-4' },
]

// --- Carteiras --------------------------------------------------------------

export interface AdminWallet {
  slug: string
  name: string
  profileLabel: string
  profileLevel: ProfileLevel
  assetCount: number
  investors: number
}

export const adminWallets: AdminWallet[] = [
  {
    slug: 'conservadora-patrimonial',
    name: 'Carteira Conservadora Patrimonial',
    profileLabel: 'CONSERVADOR',
    profileLevel: 1,
    assetCount: 5,
    investors: 60,
  },
  {
    slug: 'moderada-estrategica',
    name: 'Carteira Moderada Estratégica',
    profileLabel: 'MODERADO',
    profileLevel: 2,
    assetCount: 4,
    investors: 110,
  },
  {
    slug: 'arrojada-multimercado',
    name: 'Carteira Arrojada Multimercado',
    profileLabel: 'ARROJADO',
    profileLevel: 3,
    assetCount: 7,
    investors: 55,
  },
  {
    slug: 'sofisticada-global',
    name: 'Carteira Sofisticada Global',
    profileLabel: 'SOFISTICADO',
    profileLevel: 4,
    assetCount: 9,
    investors: 15,
  },
]

// --- Carteira: composição, edição e revisão ---------------------------------

/** Movimentação do ativo entre a versão vigente e a versão em edição. */
export type AssetMovement = 'hold' | 'in' | 'out' | 'increase' | 'decrease'

export interface AdminAllocationClass {
  label: string
  percent: number
  tone: 'data-1' | 'data-2' | 'data-3'
}

export interface AdminWalletAsset {
  /** Iniciais exibidas no chip à esquerda da linha (ex.: "TD"). */
  code: string
  name: string
  className: string
  movement: AssetMovement
  weightPercent: number
}

export interface WalletDetail {
  slug: string
  name: string
  profileLabel: string
  investors: number
  currentCompetence: string
  draftCompetence: string
  allocation: AdminAllocationClass[]
  /** Ativos da versão publicada — leitura, sem edição. */
  publishedAssets: AdminWalletAsset[]
  /** Ativos do rascunho em edição — a soma dos pesos pode não fechar 100 %. */
  draftAssets: AdminWalletAsset[]
  /** Ativos da versão vigente que saem no rascunho. */
  removedAssets: string[]
}

export const walletDetail: WalletDetail = {
  slug: 'moderada-estrategica',
  name: 'Carteira Moderada Estratégica',
  profileLabel: 'Moderado',
  investors: 110,
  currentCompetence: 'Agosto 2026',
  draftCompetence: 'Setembro 2026',
  allocation: [
    { label: 'Renda Fixa', percent: 30, tone: 'data-1' },
    { label: 'Ações BR', percent: 50, tone: 'data-2' },
    { label: 'FII', percent: 20, tone: 'data-3' },
  ],
  publishedAssets: [
    {
      code: 'TD',
      name: 'Tesouro IPCA+ 2035',
      className: 'Renda Fixa',
      movement: 'hold',
      weightPercent: 30,
    },
    {
      code: 'VL',
      name: 'VALE3',
      className: 'Ações BR · Mineração',
      movement: 'hold',
      weightPercent: 20,
    },
    {
      code: 'BB',
      name: 'BBDC4',
      className: 'Ações BR · Bancos',
      movement: 'hold',
      weightPercent: 30,
    },
    { code: 'MX', name: 'MXRF11', className: 'FII · Papel', movement: 'in', weightPercent: 20 },
  ],
  draftAssets: [
    {
      code: 'TD',
      name: 'Tesouro IPCA+ 2035',
      className: 'Renda Fixa',
      movement: 'increase',
      weightPercent: 38.5,
    },
    {
      code: 'IT',
      name: 'ITUB4',
      className: 'Ações BR · Bancos',
      movement: 'in',
      weightPercent: 40,
    },
    { code: 'MX', name: 'MXRF11', className: 'FII · Papel', movement: 'hold', weightPercent: 20 },
  ],
  removedAssets: ['BBDC4', 'VALE3'],
}

// --- Carteira: versões ------------------------------------------------------

export type VersionStatus = 'published' | 'draft'

export interface WalletVersion {
  competence: string
  status: VersionStatus
  assetCount: number
  /** Data de publicação já formatada; vazio enquanto a versão for rascunho. */
  publishedAt: string
}

export const walletVersions: WalletVersion[] = [
  { competence: 'Setembro 2026', status: 'draft', assetCount: 3, publishedAt: '' },
  { competence: 'Agosto 2026', status: 'published', assetCount: 4, publishedAt: '01/08/2026' },
  { competence: 'Julho 2026', status: 'published', assetCount: 4, publishedAt: '01/07/2026' },
  { competence: 'Junho 2026', status: 'published', assetCount: 5, publishedAt: '01/06/2026' },
]

// --- Carteira: rentabilidade ------------------------------------------------

export interface ProfitabilityRow {
  competence: string
  wallet: number
  cdi: number
  ibovespa: number
  percentOfCdi: number
}

export const walletProfitability: ProfitabilityRow[] = [
  { competence: 'Agosto 2026', wallet: 1.85, cdi: 0.87, ibovespa: 2.1, percentOfCdi: 212.6 },
  { competence: 'Julho 2026', wallet: 1.35, cdi: 0.86, ibovespa: 2.2, percentOfCdi: 157.0 },
  { competence: 'Junho 2026', wallet: -0.1, cdi: 0.84, ibovespa: -1.8, percentOfCdi: -11.9 },
  { competence: 'Maio 2026', wallet: 1.25, cdi: 0.85, ibovespa: 1.4, percentOfCdi: 147.1 },
]

/** Valores pré-preenchidos do drawer de lançamento da competência aberta. */
export const profitabilityDraft = {
  competence: '2026-09',
  wallet: 1.72,
  cdi: 0.84,
  ibovespa: 1.1,
}

// --- Carteira: relatórios ---------------------------------------------------

export interface WalletReport {
  competence: string
  /** Vazio quando o relatório da competência ainda não foi gerado. */
  generatedAt: string
  sizeLabel: string
}

export const walletReports: WalletReport[] = [
  { competence: 'Setembro 2026', generatedAt: '', sizeLabel: '' },
  { competence: 'Agosto 2026', generatedAt: '01/09/2026', sizeLabel: '471 KB' },
  { competence: 'Julho 2026', generatedAt: '01/08/2026', sizeLabel: '463 KB' },
  { competence: 'Junho 2026', generatedAt: '01/07/2026', sizeLabel: '455 KB' },
]

// --- Ativos -----------------------------------------------------------------

export interface AssetClass {
  label: string
  description: string
  averageWeightPercent: number
}

export interface CatalogAsset {
  code: string
  ticker: string
  name: string
  className: string
  walletCount: number
  active: boolean
  /** Justificativa registrada na inativação; vazia enquanto o ativo estiver ativo. */
  deactivationReason?: string
}

/** Rótulos das classes, na ordem do catálogo — alimenta os seletores de formulário. */
export const assetClassLabels = ['Renda Fixa', 'Ações BR', 'FII']

export const assetClasses: AssetClass[] = [
  {
    label: 'Renda Fixa',
    description: 'Títulos públicos e privados indexados à inflação ou ao CDI.',
    averageWeightPercent: 32.5,
  },
  {
    label: 'Ações BR',
    description: 'Ações listadas na B3, selecionadas por liquidez e governança.',
    averageWeightPercent: 40,
  },
  {
    label: 'FII',
    description: 'Fundos imobiliários de papel e de tijolo com distribuição mensal.',
    averageWeightPercent: 20,
  },
]

export const catalogAssets: CatalogAsset[] = [
  {
    code: 'IT',
    ticker: 'ITUB4',
    name: 'Itaú Unibanco PN',
    className: 'Ações BR',
    walletCount: 2,
    active: true,
  },
  {
    code: 'VL',
    ticker: 'VALE3',
    name: 'Vale ON',
    className: 'Ações BR',
    walletCount: 2,
    active: true,
  },
  {
    code: 'BB',
    ticker: 'BBDC4',
    name: 'Bradesco PN',
    className: 'Ações BR',
    walletCount: 1,
    active: true,
  },
  {
    code: 'PT',
    ticker: 'PETR4',
    name: 'Petrobras PN',
    className: 'Ações BR',
    walletCount: 0,
    active: false,
  },
  {
    code: 'TD',
    ticker: 'Tesouro IPCA+ 2035',
    name: 'Tesouro Direto · IPCA+',
    className: 'Renda Fixa',
    walletCount: 3,
    active: true,
  },
  {
    code: 'TS',
    ticker: 'Tesouro Selic 2029',
    name: 'Tesouro Direto · Selic',
    className: 'Renda Fixa',
    walletCount: 1,
    active: true,
  },
  {
    code: 'MX',
    ticker: 'MXRF11',
    name: 'Maxi Renda FII',
    className: 'FII',
    walletCount: 2,
    active: true,
  },
]

// --- Usuários ---------------------------------------------------------------

export interface SuitabilityEntry {
  date: string
  description: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  /** `null` para papéis sem avaliação de suitability (analista). */
  profileLabel: string | null
  profileLevel: ProfileLevel | null
  role: 'Cliente' | 'Analista'
  active: boolean
  since: string
  history: SuitabilityEntry[]
}

export const userRoles: AdminUser['role'][] = ['Cliente', 'Analista']

export const adminUsers: AdminUser[] = [
  {
    id: 'ana-paula-silva',
    name: 'Ana Paula Silva',
    email: 'ana.silva@email.com',
    profileLabel: 'MODERADO',
    profileLevel: 2,
    role: 'Cliente',
    active: true,
    since: '12/02/2026',
    history: [
      { date: '19/08/2026', description: 'Avaliação concluída · 42 pontos · MODERADO' },
      { date: '14/02/2026', description: 'Avaliação concluída · 38 pontos · MODERADO' },
      {
        date: '12/02/2026',
        description: 'Cadastro criado e primeira avaliação · 22 pontos · CONSERVADOR',
      },
    ],
  },
  {
    id: 'carlos-menezes',
    name: 'Carlos Menezes',
    email: 'carlos.menezes@email.com',
    profileLabel: 'ARROJADO',
    profileLevel: 3,
    role: 'Cliente',
    active: true,
    since: '03/01/2026',
    history: [
      { date: '05/07/2026', description: 'Avaliação concluída · 63 pontos · ARROJADO' },
      {
        date: '03/01/2026',
        description: 'Cadastro criado e primeira avaliação · 58 pontos · ARROJADO',
      },
    ],
  },
  {
    id: 'beatriz-lorenzo',
    name: 'Beatriz Lorenzo',
    email: 'beatriz.l@email.com',
    profileLabel: 'CONSERVADOR',
    profileLevel: 1,
    role: 'Cliente',
    active: true,
    since: '22/11/2025',
    history: [
      {
        date: '22/11/2025',
        description: 'Cadastro criado e primeira avaliação · 18 pontos · CONSERVADOR',
      },
    ],
  },
  {
    id: 'rafael-duarte',
    name: 'Rafael Duarte',
    email: 'rafael.duarte@aiinvest.com.br',
    profileLabel: null,
    profileLevel: null,
    role: 'Analista',
    active: true,
    since: '01/09/2025',
    history: [{ date: '01/09/2025', description: 'Cadastro criado com papel de analista' }],
  },
  {
    id: 'helena-prado',
    name: 'Helena Prado',
    email: 'helena.prado@email.com',
    profileLabel: 'SOFISTICADO',
    profileLevel: 4,
    role: 'Cliente',
    active: false,
    since: '14/07/2025',
    history: [
      { date: '02/03/2026', description: 'Cadastro inativado a pedido do investidor' },
      {
        date: '14/07/2025',
        description: 'Cadastro criado e primeira avaliação · 88 pontos · SOFISTICADO',
      },
    ],
  },
]

// --- Configurações ----------------------------------------------------------

export interface SuitabilityRange {
  label: string
  min: number
  max: number
  tone: 'data-1' | 'data-2' | 'data-3' | 'data-4'
}

export const suitabilityRanges: SuitabilityRange[] = [
  { label: 'Conservador', min: 0, max: 25, tone: 'data-1' },
  { label: 'Moderado', min: 26, max: 50, tone: 'data-2' },
  { label: 'Arrojado', min: 51, max: 75, tone: 'data-3' },
  { label: 'Sofisticado', min: 76, max: 100, tone: 'data-4' },
]

/** Perfis disponíveis para seleção — as faixas de suitability são a fonte da lista. */
export const profileLabels = suitabilityRanges.map((range) => range.label)
