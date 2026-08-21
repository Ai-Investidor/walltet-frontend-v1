import type { App } from 'vue'
import { bootLenis } from './lenis'
import { bootRipple } from './ripple'
import { bootRouter } from './router'

const boots: Array<(app: App) => void> = [bootRouter, bootLenis, bootRipple]

export function registerBoots(app: App): void {
  for (const boot of boots) {
    boot(app)
  }
}
