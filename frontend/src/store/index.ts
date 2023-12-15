import { createPinia } from 'pinia'
import useAppStore from './app'
import { useUserStore } from './user'
// import useTabBarStore from './modules/tab-bar'

const pinia = createPinia()

export { useAppStore, useUserStore }
export default pinia
