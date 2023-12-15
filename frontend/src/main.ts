import '@/scss/app.scss'
// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Message } from '@arco-design/web-vue'
import App from './App.vue'

// xg player
// import { SimplePlayer } from 'xgplayer'
// import Player from 'xgplayer'
// import defaultPreset from 'xgplayer/es/presets/default'
// import 'xgplayer/dist/index.min.css'
//
// SimplePlayer.defaultPreset = defaultPreset
// Player.defaultPreset = defaultPreset
import globalComponents from '@/components'

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
import LayoutB from '@/layout/LayoutB.vue'
import i18n from '@/locale'

const app = createApp(App)
app
  .use(createPinia())
  .use(router)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .use(i18n)
  .use(globalComponents)
  .component('layout-a', LayoutA)
  .component('layout-b', LayoutB)
  .mount('#app')
Message._context = app._context
