import { createRouter, createWebHistory } from 'vue-router'

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
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
