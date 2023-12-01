import '@/scss/app.scss'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ArcoVue from '@arco-design/web-vue'
import App from './App.vue'
import '@arco-design/web-vue/dist/arco.css'
import router from './router'
import LayoutA from '@/layout/LayoutA.vue'

const app = createApp(App)

app.use(createPinia()).use(router).use(ArcoVue).component('layout-a', LayoutA).mount('#app')
