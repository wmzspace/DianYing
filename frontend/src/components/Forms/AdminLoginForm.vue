<template>
  <div id="admin-login-form">
    <a-form ref="adminLoginFormRef" :model="form" :scroll-to-first-error="true">
      <a-form-item field="pwd" :rules="pwdRules" feedback :validate-trigger="'change'">
        <a-input
          class="pwd-input"
          v-model.trim="form.pwd"
          placeholder="请输入授权码"
          autocomplete
          :type="'password'"
        >
          <template #prepend>
            <IconLock />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="isRead"
        @keydown.enter="
          () => {
            form.isRead = !form.isRead
          }
        "
      >
        <a-checkbox class="read-checkbox" v-model="form.isRead">
          <span class="login-confirm-info__before-text">同意</span>
          <span class="login-confirm-info__info">管理员协议</span>
        </a-checkbox>
      </a-form-item>
      <a-form-item :no-style="true">
        <div class="confirm-button-container">
          <a-button :disabled="!form.isRead" @click="handleLogin" :loading="isChecking"
            >登录后台</a-button
          >
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

import { Message } from '@arco-design/web-vue'
import { reject } from 'lodash-es'
import { checkEmail } from '@/api/email'
import { useUserStore } from '@/store/user'

const adminLoginFormRef = ref()
const form = reactive({
  pwd: '',
  isRead: false
})

const pwdRules = [
  {
    validator: (value: string | undefined, cb: any) => {
      return new Promise<void>((resolve, reject) => {
        // window.setTimeout(() => {
        // if (!checkTelephone(value)) {
        //   cb()
        // }
        if (value === undefined || value === '') {
          cb('请输入密码')
        } else if (isHandlingSubmit.value) {
          // TODO: 验证密码
          // cb('密码错误')
          // form.pwd = ''
        }
        resolve()
        // }, 2000)
      })
    }
  }
]

const userStore = useUserStore()
const isHandlingSubmit = ref(false)
const isChecking = ref(false)
const handleLogin = () => {
  isHandlingSubmit.value = true
  adminLoginFormRef.value
    .validate()
    .then((res: any) => {
      if (res === undefined) {
        // 表单验证成功
        if (form.pwd === 'root') {
          Message.success('登陆成功：Admin')
          form.pwd = ''
          userStore.adminLogin()
        } else {
          Message.error('授权码错误')
        }
        // isChecking.value = true
      } else {
        if (res.email !== undefined) {
          Message.error({
            id: 'loginForm',
            content: res.email.message
          })
        } else if (res.pwd !== undefined) {
          Message.error({
            id: 'loginForm',
            content: res.pwd.message
          })
        }
      }
    })
    .finally(() => {
      isHandlingSubmit.value = false
    })
  // pwdLoginFormRef.value.setFields({
  //   pwd: {
  //     status: 'error',
  //     message: '手机号格式不正确'
  //   },
  //   pwdCode: {
  //     status: 'error',
  //     message: 'valid post'
  //   }
  // })
}
</script>
