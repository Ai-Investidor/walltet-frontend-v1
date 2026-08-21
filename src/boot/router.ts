import { router } from '@routers/index'
import type { App } from 'vue'

export function bootRouter(app: App): void {
  app.use(router)
}
