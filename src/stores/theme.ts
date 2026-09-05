import { useDark, useToggle } from '@vueuse/core'
import { defineStore } from 'pinia'

/**
 * Tema claro/escuro da aplicação — única fonte de verdade sobre a aparência.
 *
 * `useDark` alterna a classe `dark` no `<html>` e persiste a escolha em
 * `localStorage` (`vueuse-color-scheme`: `auto` | `light` | `dark`). Enquanto o
 * valor for `auto`, segue o `prefers-color-scheme` do sistema; o primeiro
 * `alternar()` fixa a preferência. O flash no primeiro paint é evitado pelo
 * script inline em `index.html`, que lê a mesma chave.
 */
export const useThemeStore = defineStore('theme', () => {
  const escuro = useDark()
  const alternar = useToggle(escuro)

  return {
    escuro,
    alternar,
  }
})
