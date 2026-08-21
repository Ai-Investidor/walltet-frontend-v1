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
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
