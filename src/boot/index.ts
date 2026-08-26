import type { App } from 'vue'
import { bootLenis } from './lenis'
import { bootPinia } from './pinia'
import { bootRipple } from './ripple'
import { bootRouter } from './router'

// Pinia entra antes do router: o guard de navegação (@routers/index) lê a store de sessão.
const boots: Array<(app: App) => void> = [bootPinia, bootRouter, bootLenis, bootRipple]

export function registerBoots(app: App): void {
  for (const boot of boots) {
    boot(app)
  }
}
