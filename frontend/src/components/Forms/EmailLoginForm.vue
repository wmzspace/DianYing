<template>
  <div id="email-login-form">
    <a-form ref="emailLoginFormRef" :model="form" :scroll-to-first-error="true">
      <a-form-item field="email" :rules="phoneRules" feedback>
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
      <a-form-item field="emailCode" :rules="emailRules" feedback>
        <a-input
          class="captcha-code-input"
          v-model.trim="form.emailCode"
          :max-length="6"
          placeholder="请输入验证码"
        >
          <template #append>
            <a-button
              :type="'text'"
              @click="onGetEmailCode"
              :loading="gettingEmailCode"
              :disabled="getEmailCoolDownCount > 0"
              >{{
                getEmailCoolDownCount <= 0 ? '获取验证码' : `重新获取: ${getEmailCoolDownCount}s`
              }}</a-button
            >
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="isRead">
        <a-checkbox class="read-checkbox" v-model="form.isRead">
          <span class="login-confirm-info__before-text">同意</span>
          <span class="login-confirm-info__info">用户协议</span>
        </a-checkbox>
      </a-form-item>
      <a-form-item :no-style="true">
        <div class="confirm-button-container">
          <a-button :disabled="!form.isRead" @click="handleClick">登录</a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { checkEmail, getCaptchaCode } from '@/api/email'
import type { GetCaptchaResponse } from '@/api/email'
import type { ValidatedError, ValidateStatus } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import { reject } from 'lodash-es'

const onGetEmailCode = () => {
  if (getEmailCoolDownCount.value > 0) {
    return
  }
  gettingEmailCode.value = true
  emailLoginFormRef.value.validateField('email').then((res: any) => {
    if (res && res.email) {
      Message.error({
        id: 'loginForm',
        content: res.email.message
      })
      gettingEmailCode.value = false
    } else {
      gettingEmailCode.value = true
      getCaptchaCode(parseInt(form.email))
        .then((res: GetCaptchaResponse) => {
          getEmailCoolDownCount.value = 60
          let cd = window.setInterval(() => {
            if (--getEmailCoolDownCount.value <= 0) {
              clearInterval(cd)
            }
          }, 1000)

          console.log(res)
          Message.info({
            id: 'loginForm',
            content: '验证码发送成功'
          })
        })
        .catch((e) => {
          console.error(e)
          gettingEmailCode.value = false
        })
        .finally(() => {
          gettingEmailCode.value = false
        })
    }
  })
}
const gettingEmailCode = ref(false)
// const getEmailCodeBtnText = ref('获取验证码')
const getEmailCoolDownCount = ref(0)

const emailLoginFormRef = ref()
const form = reactive({
  email: '',
  emailCode: '',
  isRead: false
})

const phoneRules = [
  {
    validator: (value: string, cb: any) => {
      return new Promise<void>((resolve) => {
        // window.setTimeout(() => {

        if (!checkEmail(value)) {
          cb('邮箱格式不正确')
        }
        resolve()
        // }, 2000)
      })
    }
  }
]
const emailRules = [
  {
    validator: (value: string | undefined, cb: any) => {
      return new Promise<void>((resolve, reject) => {
        // window.setTimeout(() => {
        // if (!checkTelephone(value)) {
        //   cb()
        // }
        if (value === undefined || value === '') {
          cb('请输入验证码')
        } else if (value.length != 6) {
          cb('验证码格式不正确')
        } else if (isHandlingSubmit.value) {
          cb('验证码错误')
          form.emailCode = ''
        }
        resolve()
        // }, 2000)
      })
    }
  }
]
const isHandlingSubmit = ref(false)
const handleClick = () => {
  isHandlingSubmit.value = true
  emailLoginFormRef.value
    .validate()
    .then((res: any) => {
      if (res === undefined) {
        // 表单验证成功
        console.log('登录验证')
      } else {
        if (res.email !== undefined) {
          Message.error({
            id: 'loginForm',
            content: res.email.message
          })
        } else if (res.emailCode !== undefined) {
          Message.error({
            id: 'loginForm',
            content: res.emailCode.message
          })
        }
      }
    })
    .finally(() => {
      isHandlingSubmit.value = false
    })
  // emailLoginFormRef.value.setFields({
  //   email: {
  //     status: 'error',
  //     message: '手机号格式不正确'
  //   },
  //   emailCode: {
  //     status: 'error',
  //     message: 'valid post'
  //   }
  // })
}
</script>
