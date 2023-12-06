import '@/scss/app.scss'
// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

// xg player
import 'xgplayer/dist/index.min.css'
// 启用中文
import { I18N } from 'xgplayer'
import ZH from 'xgplayer/es/lang/zh-cn'

I18N.use(ZH)

// arco design vue
import ArcoVue from '@arco-design/web-vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import router from './router'
import LayoutA from '@/layout/LayoutA.vue'

const app = createApp(App)
app
  .use(createPinia())
  .use(router)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .component('layout-a', LayoutA)
  .mount('#app')
