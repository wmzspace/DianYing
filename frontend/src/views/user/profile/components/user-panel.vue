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
        >
          <template #upload-button>
            <a-avatar :size="100" class="info-avatar">
              <template #trigger-icon>
                <icon-camera />
              </template>
              <img v-if="fileList.length" :src="fileList[0].url" />
              <!--            <img v-if="fileList.length" :src="fileList[0].url" />-->
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
          20岁
        </a-tag>
        <a-tag color="blue" class="tag">四川·成都</a-tag>
      </p>

      <div class="signature-container">
        <div class="signature-inner-container">
          <!--          TODO: 最长展示 25 字数-->
          <span class="signature-content">
            心之所向，便是阳光 🌈 喜欢摄影、唱歌，@向阳花木 👈
          </span>
          <a-tooltip :position="'br'">
            <template #content>
              <div>心之所向，便是阳光 🌈</div>
              <div>喜欢摄影、唱歌，@向阳花木 👈</div>
              <div>谢谢你长得这么好看还关注我❤️</div>
            </template>
            <div class="load-more">更多</div>
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

    <div class="user-panel-actions">
      <a-button
        v-if="
          userStore.getCurrentUser &&
          (userStore.isAdmin || userStore.getCurrentUserNotAdmin.id === props.userData?.id)
        "
        >编辑资料</a-button
      >
    </div>
    <!--      <a-descriptions-->
    <!--        :data="renderData"-->
    <!--        :column="2"-->
    <!--        align="right"-->
    <!--        layout="inline-horizontal"-->
    <!--        :label-style="{-->
    <!--          width: '140px',-->
    <!--          fontWeight: 'normal',-->
    <!--          // color: 'rgb(var(&#45;&#45;gray-8))'-->
    <!--          color: 'rgba(var(&#45;&#45;white), 0.9)'-->
    <!--        }"-->
    <!--        :value-style="{-->
    <!--          width: '200px',-->
    <!--          paddingLeft: '8px',-->
    <!--          textAlign: 'left',-->
    <!--          color: 'rgba(var(&#45;&#45;white), 0.5)'-->
    <!--        }"-->
    <!--      >-->
    <!--        <template #label="{ label }">{{ $t(label) }} :</template>-->
    <!--        <template #value="{ value, data }">-->
    <!--          <a-tag v-if="data.label === 'userSetting.label.certification'" color="green" size="small">-->
    <!--            已认证-->
    <!--          </a-tag>-->
    <!--          <span v-else>{{ value }}</span>-->
    <!--        </template>-->
    <!--      </a-descriptions>-->
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

const props = defineProps<{
  userData: User | undefined
}>()

const userStore = useUserStore()
const storedTokenValue = computed({
  get: () => userStore.isStoredToken,
  set: (value) => {
    userStore.setStoreToken(value)
  }
})
const avatarUrl = computed(() => props.userData?.avatar)
const file = ref({
  uid: '-2',
  name: 'avatar.png',
  url: avatarUrl
})
// const file = computed({
//   get: () => {
//     return
//   },
//   set: () => {}
// })
const renderData = computed(() => {
  return [
    {
      label: 'userSetting.label.name',
      value: props.userData?.nickname
    },
    // {
    //   label: 'userSetting.label.certification',
    //   value: userStore.certification
    // },
    {
      label: 'userSetting.label.accountId',
      value: props.userData?.id
    },
    {
      label: 'userSetting.label.email',
      value: props.userData?.email
    },
    {
      label: 'userSetting.label.registrationDate',
      value: props.userData?.register_time
    }
  ] as DescData[]
})

// const renderData = reactive([
//   {
//     label: 'userSetting.label.name',
//     value: props.userData?.nickname
//   },
//   // {
//   //   label: 'userSetting.label.certification',
//   //   value: userStore.certification
//   // },
//   {
//     label: 'userSetting.label.accountId',
//     value: props.userData?.id
//   },
//   {
//     label: 'userSetting.label.email',
//     value: props.userData?.email
//   },
//   {
//     label: 'userSetting.label.registrationDate',
//     value: props.userData?.register_time
//   }
// ] as DescData[])
const fileList = ref<FileItem[]>([file.value])
// const fileList = computed<FileItem[]>({
//   get: () => {
//     return [file.value]
//   },
//   set: () => {}
// })
const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
  fileList.value = [fileItem]
  // fileList.value = [fileItem]
  // file.value = fileItem
}
const customRequest = (options: RequestOption) => {
  // docs: https://axios-http.com/docs/cancellation
  const controller = new AbortController()

  ;(async function requestWrap() {
    const { onProgress, onError, onSuccess, fileItem, name = 'file' } = options
    onProgress(20)
    const formData = new FormData()
    formData.append(name as string, fileItem.file as Blob)
    const onUploadProgress = (event: ProgressEvent) => {
      let percent
      if (event.total > 0) {
        percent = (event.loaded / event.total) * 100
      }
      onProgress(parseInt(String(percent), 10), event)
    }

    try {
      // https://github.com/axios/axios/issues/1630
      // https://github.com/nuysoft/Mock/issues/127

      const res = await userUploadApi(formData, {
        controller,
        onUploadProgress
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
