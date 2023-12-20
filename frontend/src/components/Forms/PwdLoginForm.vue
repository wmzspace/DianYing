<template>
  <div id="pwd-login-form">
    <a-form ref="pwdLoginFormRef" :model="form" :scroll-to-first-error="true">
      <a-form-item field="email" :rules="emailRules" feedback>
        <a-input
          class="email-input"
          v-model.trim="form.email"
          placeholder="邮箱"
          :allow-clear="true"
        >
          <!--          <template #prefix>1</template>-->
          <template #prepend><IconEmail /></template>
        </a-input>
      </a-form-item>
      <a-form-item field="pwd" :rules="pwdRules" feedback :validate-trigger="'change'">
        <a-input
          class="pwd-input"
          v-model.trim="form.pwd"
          placeholder="请输入密码"
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
          <span class="login-confirm-info__info">用户协议</span>
        </a-checkbox>
      </a-form-item>
      <a-form-item :no-style="true">
        <div class="confirm-button-container">
          <a-button :disabled="!form.isRead" @click="handleLogin" :loading="isChecking"
            >登录</a-button
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

const pwdLoginFormRef = ref()
const form = reactive({
  email: '',
  pwd: '',
  isRead: false
})
const emailRules = [
  {
    validator: (value: string | undefined, cb: any) => {
      return new Promise<void>((resolve, reject) => {
        // window.setTimeout(() => {
        // if (!checkTelephone(value)) {
        //   cb()
        // }
        if (value === undefined || value === '') {
          cb('请输入邮箱')
        } else if (!checkEmail(value)) {
          cb('邮箱格式不正确')
        } else if (isHandlingSubmit.value) {
          // TODO: 邮箱后端验证
          // cb('密码错误')
          // form.pwd = ''
        }
        resolve()
        // }, 2000)
      })
    }
  }
]

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
        } else if (value.length < 6) {
          cb('密码长度应不少于六位')
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
  pwdLoginFormRef.value
    .validate()
    .then((res: any) => {
      if (res === undefined) {
        // 表单验证成功
        isChecking.value = true
        userStore
          .pwdLogin(form.email, form.pwd)
          .then((user) => {
            console.log('success:', user)
            userStore.userLogin(user.id, true)
          })
          .catch((msg) => {
            Message.error({
              id: 'loginRes',
              content: msg
            })
          })
          .finally(() => {
            isChecking.value = false
          })
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
