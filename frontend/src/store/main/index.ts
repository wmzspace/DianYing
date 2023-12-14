import { defineStore } from 'pinia'
import type { User } from '@/store/user'

export const useMainStore = defineStore('main', {
  state: () => ({
    // userList: [] as User[]
    // ...
    loginModalVisible: false
  }),
  getters: {},
  actions: {
    setLoginVisible(visible: boolean) {
      this.loginModalVisible = visible
    }
  }
})
