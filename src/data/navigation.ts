// DADOS ESTÁTICOS — trocar por camada dinâmica (service/store/composable) quando a skill existir.
// Assinaturas e tipos são o contrato; não alterar sem atualizar o manifesto.

export type NavigationIcon =
  | 'PhSquaresFour'
  | 'PhChartPie'
  | 'PhFileText'
  | 'PhStack'
  | 'PhUser'
  | 'PhChartBar'
  | 'PhUsers'
  | 'PhSlidersHorizontal'

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
    items: [{ label: 'Relatórios', icon: 'PhFileText', to: '/relatorios', available: true }],
  },
  {
    label: 'Descobrir',
    items: [{ label: 'Carteiras', icon: 'PhStack', to: '/carteiras', available: true }],
  },
  {
    label: 'Conta',
    items: [{ label: 'Minha conta', icon: 'PhUser', to: '/conta', available: true }],
  },
]

// "Ativos" saiu do menu: /admin/ativos não tem rota (backend sem endpoint de catálogo de ativos —
// docs/AUDITORIA-INTEGRACAO.md, achado 4.9).
export const adminNavigationGroups: NavigationGroup[] = [
  {
    label: 'Gestão',
    items: [
      { label: 'Painel', icon: 'PhSquaresFour', to: '/admin', available: true },
      { label: 'Carteiras', icon: 'PhStack', to: '/admin/carteiras', available: true },
      { label: 'Usuários', icon: 'PhUsers', to: '/admin/usuarios', available: true },
    ],
  },
  {
    label: 'Sistema',
    items: [
      {
        label: 'Configurações',
        icon: 'PhSlidersHorizontal',
        to: '/admin/configuracoes',
        available: true,
      },
    ],
  },
]
