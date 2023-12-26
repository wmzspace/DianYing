import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    // userList: [] as User[]
    // ...
    loginModalVisible: false,
    goToPost: false
  }),
  getters: {},
  actions: {
    setLoginVisible(visible: boolean) {
      this.loginModalVisible = visible
    },
    setGoToPost(goto: boolean) {
      this.loginModalVisible = goto
      this.goToPost = goto
    }
  }
})
