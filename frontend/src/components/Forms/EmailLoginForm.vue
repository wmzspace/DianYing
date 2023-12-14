<template>
  <div id="email-login-form">
    <a-form ref="emailLoginFormRef" :model="form" :scroll-to-first-error="true">
      <a-form-item field="email" :rules="emailRules" feedback>
        <a-input
          class="email-input"
          v-model.trim="form.email"
          placeholder="邮箱"
          :allow-clear="true"
        >
          <!--          <template #prefix>1</template>-->
          <template #prepend>
            <IconEmail />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="code" :rules="codeRules" feedback>
        <a-input
          class="captcha-code-input"
          v-model.trim="form.code"
          :max-length="6"
          placeholder="输入六位数验证码"
        >
          <template #append>
            <a-button
              :type="'text'"
              @click="onGetCode"
              :loading="gettingCode"
              :disabled="getCodeCoolDownCount > 0"
              :class="{
                'cool-down': getCodeCoolDownCount > 0
              }"
              >{{ getCodeCoolDownCount <= 0 ? '获取验证码' : `重新获取 ${getCodeCoolDownCount}s` }}
            </a-button>
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
          <a-button
            :disabled="!form.isRead"
            @click="handleClick"
            :loading="isHandlingSubmit || isValidatingCode"
            >注册 / 登录</a-button
          >
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { checkCaptchaCode, checkEmail, getCaptchaCode, validateCaptchaCode } from '@/api/email'
import type { GetCaptchaResponse } from '@/api/email'
import type { ValidatedError, ValidateStatus } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import { reject } from 'lodash-es'
import { useUserStore } from '@/store/user'

const onGetCode = () => {
  if (getCodeCoolDownCount.value > 0) {
    return
  }
  gettingCode.value = true
  emailLoginFormRef.value.validateField('email').then((res: any) => {
    if (res && res.email) {
      Message.error({
        id: 'loginForm',
        content: res.email.message
      })
      gettingCode.value = false
    } else {
      gettingCode.value = true
      getCaptchaCode(form.email)
        .then(() => {
          getCodeCoolDownCount.value = 15
          let cd = window.setInterval(() => {
            if (--getCodeCoolDownCount.value <= 0) {
              clearInterval(cd)
            }
          }, 1000)
          // console.log(res)
          // Message.info({
          //   id: 'loginForm',
          //   content: '验证码发送成功'
          // })
        })
        .catch((msg) => {
          Message.error({
            id: 'loginRes',
            content: msg
          })
          gettingCode.value = false
        })
        .finally(() => {
          gettingCode.value = false
        })
    }
  })
}
const gettingCode = ref(false)
// const getCodeBtnText = ref('获取验证码')
const getCodeCoolDownCount = ref(0)

const emailLoginFormRef = ref()
const form = reactive({
  email: '',
  code: '',
  isRead: false
})

const emailRules = [
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
const codeRules = [
  {
    validator: (value: string | undefined, cb: any) => {
      return new Promise<void>((resolve, reject) => {
        // window.setTimeout(() => {
        // if (!checkTeleemail(value)) {
        //   cb()
        // }
        if (value === undefined || value === '') {
          cb('请输入验证码')
        } else if (!checkCaptchaCode(value)) {
          cb('验证码应为六位数字')
        } else if (isHandlingSubmit.value) {
          // cb('验证码错误')
          // form.code = ''
        }
        resolve()
        // }, 2000)
      })
    }
  }
]

const userStore = useUserStore()

const isHandlingSubmit = ref(false)
const isValidatingCode = ref(false)
const handleClick = () => {
  isHandlingSubmit.value = true
  emailLoginFormRef.value
    .validate()
    .then((res: any) => {
      if (res === undefined) {
        // 表单验证成功, 进行登录验证
        isValidatingCode.value = true
        validateCaptchaCode(form.email, form.code)
          .then((userId) => {
            // 登录成功
            userStore.userLogin(userId)
          })
          .catch((msg) => {
            Message.error({
              id: 'loginRes',
              content: msg
            })
          })
          .finally(() => {
            isValidatingCode.value = false
          })
      } else {
        if (res.email !== undefined) {
          Message.error({
            id: 'loginForm',
            content: res.email.message
          })
        } else if (res.code !== undefined) {
          Message.error({
            id: 'loginForm',
            content: res.code.message
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
  //   code: {
  //     status: 'error',
  //     message: 'valid post'
  //   }
  // })
}
</script>
