import { registerBoots } from '@boot/index'
import { createApp } from 'vue'
import App from './App.vue'

import 'vue-sonner/style.css'
import './assets/index.css'

const app = createApp(App)
registerBoots(app)
app.mount('#app')
