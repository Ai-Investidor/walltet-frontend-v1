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
  {
    path: '/login',
    name: 'login',
    component: () => import('@pages/Login.vue'),
    meta: { title: 'Entrar' },
  },
  {
    path: '/criar-conta',
    name: 'criar-conta',
    component: () => import('@pages/CriarConta.vue'),
    meta: { title: 'Criar conta' },
  },
  {
    path: '/recuperar-senha',
    name: 'recuperar-senha',
    component: () => import('@pages/RecuperarSenha.vue'),
    meta: { title: 'Recuperar senha' },
  },
  // {
  //   path: '/recuperar-senha/link-enviado',
  //   name: 'link-enviado',
  //   component: () => import('@pages/LinkEnviado.vue'),
  //   meta: { title: 'Link enviado' },
  // },
  {
    path: '/403',
    name: 'acesso-restrito',
    component: () => import('@pages/AcessoRestrito.vue'),
    meta: { title: 'Acesso restrito' },
  },
  {
    path: '/404',
    name: 'nao-encontrada',
    component: () => import('@pages/NaoEncontrada.vue'),
    meta: { title: 'Página não encontrada' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'nao-encontrada' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
