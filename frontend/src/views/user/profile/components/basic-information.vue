<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
    @keydown.enter="validate"
  >
    <a-form-item
      field="email"
      :label="$t('userSetting.basicInfo.form.label.email')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.email.required')
        }
      ]"
    >
      <a-input
        v-model="formData.email"
        :placeholder="$t('userSetting.basicInfo.placeholder.email')"
      />
    </a-form-item>
    <a-form-item
      field="password"
      :label="$t('userSetting.basicInfo.form.label.password')"
      :rules="[
        // {
        //   required: true,
        //   message: $t('userSetting.form.error.password.required')
        // },
        {
          minLength: 6,
          message: $t('userSetting.form.error.password.minLength')
        }
      ]"
    >
      <a-input
        v-model="formData.password"
        :placeholder="$t('userSetting.basicInfo.placeholder.password')"
      />
    </a-form-item>
    <a-form-item
      field="nickname"
      :label="$t('userSetting.basicInfo.form.label.nickname')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.nickname.required')
        }
      ]"
    >
      <a-input
        v-model="formData.nickname"
        :placeholder="$t('userSetting.basicInfo.placeholder.nickname')"
      />
    </a-form-item>
    <a-form-item
      field="gender"
      :label="$t('userSetting.basicInfo.form.label.gender')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.gender.required')
        }
      ]"
    >
      <a-select
        v-model="formData.gender"
        :placeholder="$t('userSetting.basicInfo.placeholder.gender')"
      >
        <a-option value="male">男</a-option>
        <a-option value="female">女</a-option>
      </a-select>
    </a-form-item>
    <a-form-item
      field="age"
      :label="$t('userSetting.basicInfo.form.label.age')"
      :rules="[
        // {
        //   required: true,
        //   message: $t('userSetting.form.error.age.required')
        // }
      ]"
    >
      <a-input-number
        :precision="0"
        :min="0"
        v-model="formData.age"
        :placeholder="$t('userSetting.basicInfo.placeholder.age')"
      />
    </a-form-item>
    <a-form-item
      field="area"
      :label="$t('userSetting.basicInfo.form.label.area')"
      :rules="[
        {
          required: true,
          message: $t('userSetting.form.error.area.required')
        }
      ]"
    >
      <a-cascader
        v-model="formData.area"
        :placeholder="$t('userSetting.basicInfo.placeholder.area')"
        :options="areas"
        allow-clear
      />
    </a-form-item>
    <a-form-item
      field="signature"
      :label="$t('userSetting.basicInfo.form.label.signature')"
      :rules="[
        {
          maxLength: 100,
          message: $t('userSetting.form.error.signature.maxLength')
        }
      ]"
      row-class="keep-margin"
    >
      <a-textarea
        :max-length="100"
        :show-word-limit="true"
        :allow-clear="true"
        :auto-size="{
          minRows: 3
        }"
        v-model="formData.signature"
        :placeholder="$t('userSetting.basicInfo.placeholder.signature')"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" class="save" @click="validate" :loading="submitLoading">
          {{ $t('userSetting.save') }}
        </a-button>
        <a-button type="secondary" class="reset" @click="reset">
          {{ $t('userSetting.reset') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { type FormInstance } from '@arco-design/web-vue/es/form'
import { type BasicInfoModel } from '@/api/user-center'
import { type User, useUserStore } from '@/store/user'
import { useRoute } from 'vue-router'
import { areas } from '@/views/user/profile/mock'
import { type AjaxResponse, prefix_url } from '@/api'
import { Message } from '@arco-design/web-vue'
import useLoading from '@/hooks/loading'

const userStore = useUserStore()
const route = useRoute()
userStore.getUserById(route.params.user_id as string).then((user) => {
  formData.value.email = user.email
  formData.value.nickname = user.nickname
  formData.value.age = user.age
  formData.value.gender = user.gender
  formData.value.area = user.area
  formData.value.signature = user.signature
})

const formRef = ref<FormInstance>()
const formData = ref<BasicInfoModel>({
  id: route.params.user_id as string,
  email: '',
  nickname: '',
  gender: '',
  area: '',
  age: 0,
  signature: '',
  password: ''
})

const submitLoadingObject = useLoading()
const submitLoading = submitLoadingObject.loading
const setSubmitLoading = submitLoadingObject.setLoading
const validate = async () => {
  const res = await formRef.value?.validate()
  if (!res) {
    if (submitLoading.value) {
      Message.info({
        id: 'updateUser',
        content: '点击频率太快'
      })
      return
    }
    setSubmitLoading(true)
    fetch(prefix_url.concat('user/update'), {
      method: 'POST',
      body: JSON.stringify(formData.value),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success({
                id: 'updateUser',
                content: ajaxData.ajax_msg
              })
              emit('update')
            } else {
              Message.error({
                id: 'updateUser',
                content: ajaxData.ajax_msg
              })
            }
          })
        } else {
          Message.error({
            id: 'updateUser',
            content: res.statusText
          })
        }
      })
      .catch((e) => {
        Message.error({
          id: 'updateUser',
          content: e.message
        })
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }
}
const reset = async () => {
  await formRef.value?.resetFields()
}

const emit = defineEmits(['update'])
</script>

<style scoped lang="less">
.form {
  width: 540px;
  margin: 0 auto;
}

.arco-btn {
  &.save {
    background: #fe2c55;
    color: rgba(255, 255, 255, 1);

    &:disabled {
      background: rgba(255, 194, 198, 0.4);
    }
  }

  &.reset {
    color: rgba(255, 255, 255, 0.5);
    background: rgb(60, 62, 73);

    &:hover {
      background: rgba(60, 62, 73, 0.5);
    }
  }
}
</style>
