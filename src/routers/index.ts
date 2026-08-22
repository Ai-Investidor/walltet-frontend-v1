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
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
