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
    const isLoginCall = error.config?.url?.includes('/auth/login')

    // 401 → sessão expirada/revogada: limpa a sessão local e manda pro login (§2.3). Evita loop
    // quando a própria chamada com erro já era a de login. Imports dinâmicos pra não criar
    // dependência circular estática: routers/index.ts importa a store, que importa os serviços,
    // que importam este arquivo — importar `router`/`useAuthStore` no topo daria um ciclo
    // (boot/http.ts → routers/index.ts → stores/auth.ts → services/auth.ts →
    // boot/http.ts) que quebrava o guard de rota no dev server.
    if (code === 'UNAUTHORIZED' && !isLoginCall) {
      const [{ useAuthStore }, { router }] = await Promise.all([
        import('@stores/auth'),
        import('@routers/index'),
      ])
      useAuthStore().clearSession()

      if (router.currentRoute.value.name !== 'login') {
        router.push({ name: 'login' })
      }
    }

    return Promise.reject(error.response?.data ?? error)
  },
)
