import { useAuthStore } from '@stores/auth'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string | ((route: RouteLocationNormalizedLoaded) => string)
    /** Default `true` — ver guard abaixo. Só as rotas explicitamente listadas ficam públicas. */
    public?: boolean
    requiresAdmin?: boolean
    /** Rota pública que não faz sentido pra quem já está logado (login, criar conta). */
    redirectIfAuthenticated?: boolean
  }
}

// /recuperar-senha, /recuperar-senha/link-enviado e /admin/ativos saíram do catálogo de rotas:
// o backend não tem endpoint pra nenhuma das duas áreas (docs/AUDITORIA-INTEGRACAO.md, achados
// "Fluxos sem endpoint algum no backend" nº 1 e 2). Os arquivos de página/view continuam no
// repositório, só não estão mais alcançáveis pela navegação.
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
    meta: { requiresAdmin: true },
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
        path: 'carteiras/:id',
        name: 'admin-carteira',
        component: () => import('@pages/admin/Carteira.vue'),
        meta: { title: 'Carteira' },
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
    meta: { title: 'Entrar', public: true, redirectIfAuthenticated: true },
  },
  {
    path: '/criar-conta',
    name: 'criar-conta',
    component: () => import('@pages/CriarConta.vue'),
    meta: { title: 'Criar conta', public: true, redirectIfAuthenticated: true },
  },
  {
    path: '/403',
    name: 'acesso-restrito',
    component: () => import('@pages/AcessoRestrito.vue'),
    meta: { title: 'Acesso restrito', public: true },
  },
  {
    path: '/404',
    name: 'nao-encontrada',
    component: () => import('@pages/NaoEncontrada.vue'),
    meta: { title: 'Página não encontrada', public: true },
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

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // `GET /auth/me` só precisa ser chamado uma vez por carga da aplicação; navegações seguintes
  // reaproveitam o estado já resolvido da store.
  if (!auth.carregado) {
    await auth.carregarSessao()
  }

  const isPublic = to.matched.some((record) => record.meta.public)

  if (isPublic) {
    // Login/criar-conta não fazem sentido pra quem já está logado — manda pro painel.
    const redirectIfAuthenticated = to.matched.some((record) => record.meta.redirectIfAuthenticated)

    if (redirectIfAuthenticated && auth.isAuthenticated) {
      return { name: 'painel' }
    }

    return true
  }

  if (!auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)

  if (requiresAdmin && !auth.isAdmin) {
    return { name: 'acesso-restrito' }
  }

  return true
})
