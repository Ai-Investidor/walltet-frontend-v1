// DADOS ESTÁTICOS — trocar por camada dinâmica (service/store/composable) quando a skill existir.
// Assinaturas e tipos são o contrato; não alterar sem atualizar o manifesto.

export type NavigationIcon = 'PhSquaresFour' | 'PhChartPie' | 'PhFileText' | 'PhStack' | 'PhUser'

export interface NavigationItem {
  label: string
  icon: NavigationIcon
  to: string
  available: boolean
}

export interface NavigationGroup {
  label: string
  items: NavigationItem[]
}

export const navigationGroups: NavigationGroup[] = [
  {
    label: 'Principal',
    items: [
      { label: 'Painel', icon: 'PhSquaresFour', to: '/', available: true },
      { label: 'Minha carteira', icon: 'PhChartPie', to: '/carteira', available: true },
    ],
  },
  {
    label: 'Documentos',
    items: [{ label: 'Relatórios', icon: 'PhFileText', to: '/relatorios', available: false }],
  },
  {
    label: 'Descobrir',
    items: [{ label: 'Carteiras', icon: 'PhStack', to: '/carteiras', available: false }],
  },
  {
    label: 'Conta',
    items: [{ label: 'Minha conta', icon: 'PhUser', to: '/conta', available: false }],
  },
]
