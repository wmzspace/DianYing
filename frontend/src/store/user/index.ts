import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: number
  name: string
  avatar: string
}
// TODO
// impo mandert { mande } from 'mande'
// const api = mande('/api/users')

export const useUserStore = defineStore('user', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => ({
    // userList: [] as User[]
    userData: {} as User
    // ...
  }),
  getters: {
    getCurrentUser: (state) => state.userData,
    getUserById: (state) => {
      return (userId) => {
        return state.userData
        // return state.users.find((user) => user.id === userId)
      }
    }
  },
  actions: {
    async userLogin(user: User) {
      try {
        this.userData = user
        // this.userData = await api.post({ login, password })
        // showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        // showTooltip(error)
        // 让表单组件显示错误
        return error
      }
    }
    // async registerUser(user: User) {
    //   try {
    //     this.userList.push(user)
    //     // this.userData = await api.post({ login, password })
    //     // showTooltip(`Welcome back ${this.userData.name}!`)
    //   } catch (error) {
    //     // showTooltip(error)
    //     // 让表单组件显示错误
    //     return error
    //   }
    // }
  }
})
