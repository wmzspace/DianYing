<template>
  <div id="sms-login-form">
    <a-form ref="smsLoginFormRef" :model="form">
      <a-form-item field="name" :rules="rules">
        <a-input class="phone-input" v-model="form.name" placeholder="手机号">
          <!--          <template #prefix>1</template>-->
          <template #prepend>+86</template>
        </a-input>
      </a-form-item>
      <a-form-item field="post">
        <a-input class="captcha-code-input" v-model="form.post" placeholder="请输入验证码" />
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
import { ref, reactive } from 'vue'

const smsLoginFormRef = ref()
const form = reactive({
  name: '',
  post: '',
  isRead: false
})
const rules = [
  {
    validator: (value, cb) => {
      return new Promise<void>((resolve) => {
        window.setTimeout(() => {
          if (value !== 'admin') {
            cb('name must be admin')
          }
          resolve()
        }, 2000)
      })
    }
  }
]
const handleClick = () => {
  smsLoginFormRef.value.setFields({
    name: {
      status: 'error',
      message: 'async name error'
    },
    post: {
      status: 'error',
      message: 'valid post'
    }
  })
}
</script>
