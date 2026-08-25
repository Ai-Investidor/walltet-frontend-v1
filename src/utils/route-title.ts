import type { RouteLocationNormalizedLoaded } from 'vue-router'

/**
 * Título exibido na barra superior. A rota declara uma string fixa ou, quando o
 * título depende dos parâmetros (nome da carteira aberta), uma função da rota.
 */
export function resolveRouteTitle(route: RouteLocationNormalizedLoaded) {
  const { title } = route.meta

  return typeof title === 'function' ? title(route) : (title ?? '')
}
