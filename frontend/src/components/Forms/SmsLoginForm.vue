<template>
  <div id="sms-login-form">
    <a-form ref="smsLoginFormRef" :model="form" :scroll-to-first-error="true">
      <a-form-item field="phone" :rules="phoneRules" feedback>
        <a-input
          class="phone-input"
          v-model.trim="form.phone"
          :max-length="11"
          placeholder="手机号"
          :allow-clear="true"
        >
          <!--          <template #prefix>1</template>-->
          <template #prepend>+86</template>
        </a-input>
      </a-form-item>
      <a-form-item field="smsCode" :rules="smsRules" feedback>
        <a-input
          class="captcha-code-input"
          v-model.trim="form.smsCode"
          :max-length="6"
          placeholder="请输入验证码"
        >
          <template #append>
            <a-button
              :type="'text'"
              @click="onGetSmsCode"
              :loading="gettingSmsCode"
              :disabled="getSmsCoolDownCount > 0"
              >{{
                getSmsCoolDownCount <= 0 ? '获取验证码' : `重新获取: ${getSmsCoolDownCount}s`
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
import { ref, reactive, Ref, UnwrapRef, watch } from 'vue'
import { checkTelephone, getCaptchaCode } from '@/api/sms'
import type { GetCaptchaResponse } from '@/api/sms'
import type { ValidatedError, ValidateStatus } from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import { reject } from 'lodash-es'

const onGetSmsCode = () => {
  if (getSmsCoolDownCount.value > 0) {
    return
  }
  gettingSmsCode.value = true
  smsLoginFormRef.value.validateField('phone').then((res) => {
    if (res && res.phone) {
      Message.error({
        id: 'loginForm',
        content: res.phone.message
      })
      gettingSmsCode.value = false
    } else {
      gettingSmsCode.value = true
      getCaptchaCode(form.phone)
        .then((res: GetCaptchaResponse) => {
          getSmsCoolDownCount.value = 60
          let cd = window.setInterval(() => {
            if (--getSmsCoolDownCount.value <= 0) {
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
          gettingSmsCode.value = false
        })
        .finally(() => {
          gettingSmsCode.value = false
        })
    }
  })
}
const gettingSmsCode = ref(false)
// const getSmsCodeBtnText = ref('获取验证码')
const getSmsCoolDownCount = ref(0)

const smsLoginFormRef = ref()
const form = reactive({
  phone: '',
  smsCode: '',
  isRead: false
})

const phoneRules = [
  {
    validator: (value: string, cb) => {
      return new Promise<void>((resolve) => {
        // window.setTimeout(() => {

        if (!checkTelephone(value)) {
          cb('手机号格式不正确')
        }
        resolve()
        // }, 2000)
      })
    }
  }
]
const smsRules = [
  {
    validator: (value: string | undefined, cb) => {
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
          form.smsCode = ''
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
  smsLoginFormRef.value
    .validate()
    .then((res) => {
      if (res === undefined) {
        // 表单验证成功
        console.log('登录验证')
      } else {
        if (res.phone !== undefined) {
          Message.error({
            id: 'loginForm',
            content: res.phone.message
          })
        } else if (res.smsCode !== undefined) {
          Message.error({
            id: 'loginForm',
            content: res.smsCode.message
          })
        }
      }
    })
    .finally(() => {
      isHandlingSubmit.value = false
    })
  // smsLoginFormRef.value.setFields({
  //   phone: {
  //     status: 'error',
  //     message: '手机号格式不正确'
  //   },
  //   smsCode: {
  //     status: 'error',
  //     message: 'valid post'
  //   }
  // })
}
</script>
