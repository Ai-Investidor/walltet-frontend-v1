import { createPinia } from 'pinia'
import type { App } from 'vue'

export function bootPinia(app: App): void {
  app.use(createPinia())
}
