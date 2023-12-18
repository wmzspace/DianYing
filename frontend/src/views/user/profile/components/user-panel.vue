<template>
  <a-card :bordered="false" class="user-panel">
    <a-card-meta>
      <template #avatar>
        <a-upload
          :custom-request="customRequest"
          list-type="picture-card"
          :file-list="fileList"
          :show-upload-button="true"
          :show-file-list="false"
          @change="uploadChange"
          :style="{ cursor: hasPermission ? 'cursor' : 'default' }"
          :disabled="!hasPermission"
        >
          <template #upload-button>
            <a-avatar :size="100" class="info-avatar" v-if="hasPermission">
              <template #trigger-icon>
                <icon-camera />
              </template>
              <img v-if="fileList.length" :src="fileList[0].url" />
              <!--            <img v-if="fileList.length" :src="fileList[0].url" />-->
            </a-avatar>
            <a-avatar :size="100" class="info-avatar" v-else>
              <img v-if="fileList.length" :src="fileList[0].url" />
            </a-avatar>
          </template>
        </a-upload>
      </template>
    </a-card-meta>

    <div class="user-info-content">
      <div class="name">
        <h1>
          {{ userData?.nickname }}
        </h1>
      </div>
      <div class="statistic">
        <div class="statistic-item">
          <div class="label">关注</div>
          <div class="value">14</div>
        </div>
        <a-divider :direction="'vertical'" />
        <div class="statistic-item">
          <div class="label">粉丝</div>
          <div class="value">{{ simplifyNumber(8000, 1, 'CN').string }}</div>
        </div>
        <a-divider :direction="'vertical'" />
        <div class="statistic-item">
          <div class="label">获赞</div>
          <div class="value">{{ simplifyNumber(26000, 1, 'CN').string }}</div>
        </div>
      </div>

      <p class="basic-info">
        <span class="user-id">
          点映号: <span>{{ userData?.id }}</span>
        </span>
        <a-tag color="blue" class="tag">
          <template #icon>
            <a-image :src="'/images/male.svg'" alt="male"></a-image>
          </template>
          <span></span>
          {{ userData && userData.age ? `${userData.age}岁` : '未知' }}
        </a-tag>
        <a-tag color="blue" class="tag">中国·{{ userData?.area }}</a-tag>
      </p>

      <div class="signature-container">
        <div class="signature-inner-container">
          <span class="signature-content">
            {{ userData?.signature }}
          </span>
          <a-tooltip :position="'br'">
            <template #content>
              <span style="white-space: pre"> {{ userData?.signature }}</span>
            </template>
            <div class="load-more" v-if="userData && userData.signature?.length > 0">全部</div>
            <div v-else>暂无个人简介</div>
          </a-tooltip>
        </div>
      </div>
    </div>

    <div class="trust-login-switch" v-if="userStore.userData !== undefined">
      <a-tooltip :position="'bottom'">
        <template #content> 保存登录信息，重进页面免登录</template>
        <icon-info-circle-fill style="cursor: pointer" />
      </a-tooltip>
      <span class="trust-login-switch-title">保存登录信息</span>
      <a-switch
        class="trust-login-switch-button"
        size="small"
        unchecked-color="rgba(255,255,255,0.2)"
        checked-color="rgb(254, 44, 85)"
        v-model:model-value="storedTokenValue"
      />
    </div>
    <!--    userStore.getCurrentUser &&-->
    <!--    (userStore.isAdmin || userStore.getCurrentUserNotAdmin.id === props.userData?.id)-->
    <div class="user-panel-actions">
      <a-button v-if="hasPermission" @click="emit('update:isEditProfile', !props.isEditProfile)"
        >{{ props.isEditProfile ? '退出编辑' : '编辑资料' }}
      </a-button>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { FileItem, RequestOption } from '@arco-design/web-vue/es/upload/interfaces'
import { useUserStore } from '@/store'
import { userUploadApi } from '@/api/user-center'
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface'
import type { User } from '@/store/user'
import { simplifyNumber } from '../../../../utils/tools'
import { Message } from '@arco-design/web-vue'
import type { AjaxResponse } from '@/api'

const props = defineProps<{
  userData: User | undefined
  isEditProfile: boolean
}>()
const emit = defineEmits(['update:isEditProfile', 'change'])
const userStore = useUserStore()
const storedTokenValue = computed({
  get: () => userStore.isStoredToken,
  set: (value) => {
    userStore.setStoreToken(value)
  }
})
const hasPermission = computed(() => userStore.isAdminOrCurUser(props.userData?.id))
const avatarUrl = computed(() => props.userData?.avatar)
const file = ref({
  uid: '-2',
  name: 'avatar.png',
  url: avatarUrl
})

const fileList = ref<FileItem[]>([file.value])

const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
  fileList.value = [fileItem]
}
const customRequest = (options: RequestOption) => {
  // docs: https://axios-http.com/docs/cancellation
  const controller = new AbortController()

  ;(async function requestWrap() {
    const { onProgress, onError, onSuccess, fileItem, name = 'file' } = options
    onProgress(20)
    const formData = new FormData()
    formData.append(name as string, fileItem.file as Blob)
    if (props.userData) {
      formData.append('user_id', props.userData.id.toString())
    }
    const onUploadProgress = (event: ProgressEvent) => {
      let percent
      if (event.total > 0) {
        percent = (event.loaded / event.total) * 100
        // console.log(percent)
        Message.info({
          id: 'uploadAvatar',
          content: `上传中... ${percent.toFixed(0)}%`
        })
      }
      onProgress(parseInt(String(percent), 10), event)
    }

    try {
      // https://github.com/axios/axios/issues/1630
      // https://github.com/nuysoft/Mock/issues/127

      const res = await userUploadApi(
        formData,
        {
          controller,
          onUploadProgress
        },
        'avatar'
      )
        .then((res) => {
          if (res.statusText === 'OK') {
            let ajaxData = res.data as AjaxResponse
            if (ajaxData.ajax_ok) {
              Message.success({
                id: 'uploadAvatar',
                content: ajaxData.ajax_msg
              })
              emit('change')
            } else {
              Message.error({
                id: 'uploadAvatar',
                content: ajaxData.ajax_msg
              })
            }
          } else {
            Message.error({
              id: 'uploadAvatar',
              content: res.statusText
            })
          }
        })
        .catch((e) => {
          Message.error({
            id: 'uploadAvatar',
            content: e.message
          })
        })
      onSuccess(res)
    } catch (error) {
      onError(error)
    }
  })()
  return {
    abort() {
      controller.abort()
    }
  }
}
</script>

<style scoped lang="less">
.arco-card {
  //padding: 14px 0 4px 4px;
  //border-radius: 4px;
  //background: transparent;
}

:deep(.arco-avatar-trigger-icon-button) {
  width: 32px;
  height: 32px;
  line-height: 32px;
  background-color: #e8f3ff;
  //background: transparent;

  .arco-icon-camera {
    margin-top: 8px;
    color: rgb(var(--arcoblue-6));
    font-size: 14px;
  }
}
</style>
