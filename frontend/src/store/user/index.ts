import { defineStore } from 'pinia'
import { ref } from 'vue'
import { prefix_url } from '@/api'
import type { AjaxResponse } from '@/api'

import { methods } from '@arco-design/web-vue/es/_utils/date'
import { Message } from '@arco-design/web-vue'
import { useMainStore } from '@/store/main'
import { useRouter } from 'vue-router'

export interface User {
  avatar: string
  id: number
  nickname: string
  register_time: string
  sex: string
  username: string
}
// impo mandert { mande } from 'mande'
// const api = mande('/api/users')

export const guestUser = {
  avatar: prefix_url + 'static/user/avatars/default.jpeg',
  nickname: '未登录'
}
export const adminUser = {
  avatar: prefix_url + 'static/user/avatars/default.jpeg',
  nickname: 'Admin'
}

export const useUserStore = defineStore('user', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => ({
    // userList: [] as User[]
    isAdmin: false,
    userData: undefined as User | undefined
    // ...
  }),
  getters: {
    getCurrentUser: (state) => state.userData as User | undefined,
    getUserById: (state) => {
      return (userId: number) =>
        new Promise<User>((resolve, reject) => {
          fetch(prefix_url + `/user/get?id=${userId}`, {
            method: 'GET'
          }).then((res) => {
            if (res.ok) {
              res.json().then((data: User[]) => {
                resolve(data[0])
              })
            }
          })
        })
    },
    getUserAvatar: (state) =>
      state.userData !== undefined
        ? state.userData.avatar
        : state.isAdmin
          ? adminUser.avatar
          : guestUser.avatar,
    getUserNickname: (state) =>
      state.userData !== undefined
        ? state.userData.nickname
        : state.isAdmin
          ? adminUser.nickname
          : guestUser.nickname
  },
  actions: {
    async userLogin(userId: number | string) {
      if (typeof userId === 'string') {
        userId = parseInt(userId)
      }
      try {
        // this.userData = user
        this.getUserById(userId).then((user) => {
          this.isAdmin = false
          this.userData = user
          localStorage.setItem('currentUser', userId.toString())
          const mainStore = useMainStore()
          mainStore.setLoginVisible(false)
        })

        // this.userData = await api.post({ login, password })
        // showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        // showTooltip(error)
        // 让表单组件显示错误
        return error
      }
    },
    userLogOut() {
      localStorage.removeItem('currentUser')
      location.reload()
    },
    pwdLogin(email: string, pwd: string) {
      return new Promise<User>((resolve, reject) => {
        fetch(prefix_url + `/user/login/pwd?email=${email}&pwd=${pwd}`, {
          method: 'POST'
        })
          .then((res) => {
            if (res.ok) {
              res.json().then((ajaxData: AjaxResponse) => {
                if (ajaxData.ajax_ok) {
                  Message.success({
                    id: 'loginRes',
                    content: ajaxData.ajax_msg
                  })
                  resolve(ajaxData.ajax_data as User)
                } else {
                  reject(ajaxData.ajax_msg)
                }
              })
            } else {
              Message.error(res.statusText)
            }
          })
          .catch((e) => {
            Message.error(e.message)
          })
      })
    },
    adminLogin() {
      this.isAdmin = true
      const mainStore = useMainStore()
      mainStore.setLoginVisible(false)
    },
    checkLogin() {
      return new Promise<User>((resolve, reject) => {
        if (this.userData !== undefined) {
          resolve(this.userData as User)
        } else {
          reject()
        }
      })
    }
  }
})
