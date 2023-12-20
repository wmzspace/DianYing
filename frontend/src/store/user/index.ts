import { defineStore } from 'pinia'
import { ref } from 'vue'
import { prefix_url } from '@/api'
import type { AjaxResponse } from '@/api'

import { methods } from '@arco-design/web-vue/es/_utils/date'
import { Message } from '@arco-design/web-vue'
import { useMainStore } from '@/store/main'
import { useRouter } from 'vue-router'
import router from '@/router'
import type { UserRecord } from '@/api/list'
import { reject } from 'lodash-es'

export interface User {
  avatar: string
  id: number
  nickname: string
  register_time: string
  area: string
  gender: string
  age: number
  email: string
  username: string
  signature: string
}
// impo mandert { mande } from 'mande'
// const api = mande('/api/users')

export const guestUser = {
  avatar: prefix_url + 'static/user/avatars/default.jpeg',
  nickname: '未登录'
}
export const adminUser = {
  avatar: prefix_url + 'static/user/avatars/admin-blue.png',
  nickname: 'Admin'
}

export const useUserStore = defineStore('user', {
  // 推荐使用 完整类型推断的箭头函数
  state: () => ({
    // userList: [] as User[]
    isAdmin: false,
    userData: undefined as User | undefined,
    isStoredToken: false
    // ...
  }),
  getters: {
    isAdminOrCurUser: (state) => (userId?: number) => {
      return state.isAdmin || (state.userData && state.userData.id === userId)
    },
    isUserNotAdmin: (state) => () => {
      return state.userData && !state.isAdmin
    },

    // 表示已登录
    getCurrentUser: (state) => state.userData as User | undefined,

    // 表示登录的普通用户
    getCurrentUserNotAdmin: (state) => {
      // assert(!state.isAdmin, 'Is admin') // FIXME: getCurrentUserNotAdmin
      return state.userData as User
    },
    getUserById: (state) => {
      return (userId: number | string | undefined) =>
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
    // getUserInfo: ()=>
    //   (userId:number|string)=>
    //     new Promise<UserRecord>((resolve,reject)=>{
    //       fetch(prefix_url.concat("user/info"))
    //     })
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
    async userLogin(userId: number | string, needRefresh?: boolean) {
      if (typeof userId === 'string') {
        userId = parseInt(userId)
      }
      try {
        // this.userData = user
        this.getUserById(userId).then((user) => {
          this.isAdmin = false
          this.userData = user
          // localStorage.setItem('currentUser', userId.toString())
          this.setStoreToken(true)
          const mainStore = useMainStore()
          mainStore.setLoginVisible(false)
          if (needRefresh) {
            // location.reload()
          }
          if (mainStore.goToPost) {
            router.push({ name: 'postVideo' })
            mainStore.setGoToPost(false)
          }
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
      this.isAdmin = false
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
      this.userData = undefined
      this.setStoreToken(true)
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
    },
    setStoreToken(toStore: boolean) {
      if (toStore) {
        localStorage.setItem(
          'currentUser',
          this.isAdmin ? adminUser.nickname : this.getCurrentUserNotAdmin.id.toString()
        )
        this.isStoredToken = true
      } else {
        localStorage.removeItem('currentUser')
        this.isStoredToken = false
      }
    }
  }
})
