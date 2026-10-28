import { API_URL } from '@config/env'
import axios, { type AxiosError } from 'axios'
import type { ErrorPayload } from '@services/types'

// Fluxo de cookie (INTEGRATION_PROMPT.md §1): `withCredentials` é obrigatório pro cookie HttpOnly
// `access_token` ir/voltar. O backend já libera CORS com `credentials: true` refletindo a origem.
export const http = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorPayload>) => {
    const code = error.response?.data?.error?.code
    const url = error.config?.url ?? ''
    // `/auth/me` é a sonda de sessão do guard na carga inicial: o 401 de visitante é esperado e o
    // próprio guard decide o destino (rota pública passa; privada vai pro login com `?redirect=`).
    const isSessionProbe = url.includes('/auth/login') || url.endsWith('/auth/me')

    // 401 → sessão expirada/revogada: limpa a sessão local e manda pro login (§2.3). Evita loop
    // quando a própria chamada com erro já era a de login. Imports dinâmicos pra não criar
    // dependência circular estática: routers/index.ts importa a store, que importa os serviços,
    // que importam este arquivo — importar `router`/`useAuthStore` no topo daria um ciclo
    // (boot/http.ts → routers/index.ts → stores/auth.ts → services/auth.ts →
    // boot/http.ts) que quebrava o guard de rota no dev server.
    if (code === 'UNAUTHORIZED' && !isSessionProbe) {
      const [{ useAuthStore }, { router }] = await Promise.all([
        import('@stores/auth'),
        import('@routers/index'),
      ])
      useAuthStore().clearSession()

      const atual = router.currentRoute.value
      const isPublic = atual.matched.some((route) => route.meta.public)
      if (!isPublic && atual.name !== 'login') {
        router.push({ name: 'login', query: { redirect: atual.fullPath } })
      }
    }

    return Promise.reject(error.response?.data ?? error)
  },
)
