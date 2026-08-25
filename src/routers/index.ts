import { adminWallets } from '@data/admin'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string | ((route: RouteLocationNormalizedLoaded) => string)
  }
}

const routes = [
  {
    path: '/',
    component: () => import('@layouts/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'painel',
        component: () => import('@pages/Painel.vue'),
        meta: { title: 'Painel' },
      },
      {
        path: 'carteira',
        name: 'carteira',
        component: () => import('@pages/Carteira.vue'),
        meta: { title: 'Minha carteira' },
      },
      {
        path: 'relatorios',
        name: 'relatorios',
        component: () => import('@pages/Relatorios.vue'),
        meta: { title: 'Relatórios' },
      },
      {
        path: 'carteiras',
        name: 'carteiras',
        component: () => import('@pages/Carteiras.vue'),
        meta: { title: 'Carteiras' },
      },
      {
        path: 'conta',
        name: 'conta',
        component: () => import('@pages/Conta.vue'),
        meta: { title: 'Minha conta' },
      },
    ],
  },
  {
    path: '/admin',
    component: () => import('@layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'admin-painel',
        component: () => import('@pages/admin/Painel.vue'),
        meta: { title: 'Painel administrativo' },
      },
      {
        path: 'carteiras',
        name: 'admin-carteiras',
        component: () => import('@pages/admin/Carteiras.vue'),
        meta: { title: 'Carteiras' },
      },
      {
        path: 'carteiras/:slug',
        name: 'admin-carteira',
        component: () => import('@pages/admin/Carteira.vue'),
        meta: {
          title: (route: RouteLocationNormalizedLoaded) =>
            adminWallets.find((wallet) => wallet.slug === route.params.slug)?.name ?? 'Carteira',
        },
      },
      {
        path: 'ativos',
        name: 'admin-ativos',
        component: () => import('@pages/admin/Ativos.vue'),
        meta: { title: 'Ativos' },
      },
      {
        path: 'usuarios',
        name: 'admin-usuarios',
        component: () => import('@pages/admin/Usuarios.vue'),
        meta: { title: 'Usuários' },
      },
      {
        path: 'configuracoes',
        name: 'admin-configuracoes',
        component: () => import('@pages/admin/Configuracoes.vue'),
        meta: { title: 'Configurações' },
      },
    ],
  },
  {
    path: '/avaliacao-perfil',
    name: 'avaliacao-perfil',
    component: () => import('@pages/AvaliacaoPerfil.vue'),
    meta: { title: 'Avaliação de perfil' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
