<template>
  <div id="upload-preview" style="max-width: 100%"></div>
  <p v-if="isUploaded" style="margin: 10px 0 0 0">
    <span v-if="uploadVideoFormData.width >= uploadVideoFormData.height">
      <span>横版 </span>
      <a-image :src="'/images/admin/upload/horizontal.png'" style="transform: translateY(-1px)"
    /></span>
    <span v-else>
      <span>竖版 </span>
      <a-image :src="'/images/admin/upload/vertical.png'" style="transform: translateY(-1px)"
    /></span>

    <span style="margin-right: 10px">
      视频尺寸: {{ uploadVideoFormData.width }}*{{ uploadVideoFormData.height }}</span
    >
  </p>
  <!--  {{ videoUrl }}-->
  <a-upload
    :list-type="'text'"
    :custom-request="customRequest"
    :file-list="fileList"
    :show-upload-button="true"
    :show-file-list="true"
    :on-before-remove="handleRemove"
    @change="uploadChange"
    class="wrapper"
    :limit="1"
    ref="videoUploadRef"
  >
    <template #upload-button>
      <div
        style="
          background-color: var(--color-fill-2);
          color: var(--color-text-1);
          border: 1px dashed var(--color-fill-4);
          height: 158px;
          width: 380px;
          border-radius: 2px;
          line-height: 158px;
          text-align: center;
        "
      >
        <div>
          拖入文件或
          <span style="color: #3370ff"> 点此上传</span>
        </div>
      </div>
    </template>
    <template #cancel-icon>
      <span @click="handleCancel"><icon-pause /></span>
    </template>
  </a-upload>

  <!--  <div style="width: 100%; height: 100%; border: thick solid red">-->

  <!--  </div>-->
  <a-button type="primary" @click="onNextClick" :disabled="!isUploaded" style="margin-top: 10px">
    {{ $t('stepForm.button.next') }}
  </a-button>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import type { FormInstance } from '@arco-design/web-vue/es/form'
import type { VideoUploadFormModel1 } from '@/api/form'
import type { FileItem, RequestOption } from '@arco-design/web-vue/es/upload/interfaces'
import { Message } from '@arco-design/web-vue'
import { userUploadApi } from '@/api/user-center'
import type { AjaxResponse } from '@/api'
import { useUserStore } from '@/store'
import axios from 'axios'
import type { DanMuProps, VideoMedia } from '@/types'
import Player, { Events } from 'xgplayer'
import type PresetPlayer from 'xgplayer'

// export interface UploadVideoForm {
//   authorId: number
//   url: string
//   // cover: string
//   height: number
//   width: number
//   cover: string
// }

const uploadVideoFormData = ref<VideoUploadFormModel1>({
  url: '',
  authorId: -1,
  height: -1,
  width: -1,
  cover: ''
})

const videoUploadRef = ref()
const handleCancel = () => {
  source.cancel('取消上传')
  videoUploadRef.value.abort(fileList.value[0])
  fileList.value = []
}

const handleRemove = async () => {
  source.cancel('取消上传')
  videoUploadRef.value.abort(fileList.value[0])
  fileList.value = []
  return new Promise<boolean>((resolve, reject) => {
    resolve(true)
  }).finally(() => {
    location.reload()
  })
}

const userStore = useUserStore()
const emits = defineEmits(['changeStep'])
const videoUrl = ref<string | undefined>(undefined)

const CancelToken = axios.CancelToken
const source = CancelToken.source()
const cancelToken = source.token
const isUploaded = ref(false)

const player = ref<PresetPlayer | undefined>(undefined)
interface VideoUploadResponse {
  videoPath: string
  coverPath: string
}

const customRequest = (options: RequestOption) => {
  // docs: https://axios-http.com/docs/cancellation
  const controller = new AbortController()
  isUploaded.value = false
  ;(async function requestWrap() {
    const { onProgress, onError, onSuccess, fileItem, name = 'file' } = options
    onProgress(20)
    const formData = new FormData()
    formData.append(name as string, fileItem.file as Blob)
    if (userStore.getCurrentUserNotAdmin.id) {
      formData.append('user_id', userStore.getCurrentUserNotAdmin.id.toString())
    }
    const onUploadProgress = (event: ProgressEvent) => {
      let percent
      if (event.total > 0) {
        percent = (event.loaded / event.total) * 100
        // console.log(percent)
        Message.info({
          id: 'uploadVideo',
          content: `上传中... ${percent.toFixed(0)}%`
        })
      }
      onProgress(parseInt(String(percent), 10), event)
    }

    try {
      // https://github.com/axios/axios/issues/1630
      // https://github.com/nuysoft/Mock/issues/127
      isUploaded.value = false
      const res = await userUploadApi(
        formData,
        {
          controller,
          onUploadProgress,
          cancelToken
        },
        'video'
      ).then((res) => {
        if (res.status === 200) {
          let ajaxData = res.data as AjaxResponse
          if (ajaxData.ajax_ok) {
            Message.success({
              id: 'uploadVideo',
              content: ajaxData.ajax_msg
            })
            onSuccess(ajaxData.ajax_msg)
            // isUploaded.value = true
            const resData = ajaxData.ajax_data as VideoUploadResponse
            videoUrl.value = resData.videoPath
            uploadVideoFormData.value.cover = resData.coverPath
            player.value?.destroy()
            player.value = createPlayer(videoUrl.value)
            player.value.on(Events.LOADED_DATA, () => {
              uploadVideoFormData.value.authorId = userStore.getCurrentUserNotAdmin.id
              uploadVideoFormData.value.width = player.value?._videoWidth
              uploadVideoFormData.value.height = player.value?._videoHeight
              uploadVideoFormData.value.url = videoUrl.value as string
              isUploaded.value = true
            })
            // player.value.on(Events.READY, function () {
            //   const firstFrame = player.value?.emit('screenShot')
            //   // console.log(firstFrame)
            //   // 处理第一帧图片
            // })
            // emit('change')
          } else {
            Message.error({
              id: 'uploadVideo',
              content: ajaxData.ajax_msg
            })
            onError(ajaxData.ajax_msg)
          }
        } else {
          Message.error({
            id: 'uploadVideo',
            content: res.statusText
          })
        }
      })
    } catch (error: any) {
      Message.error({
        id: 'uploadVideo',
        content: error.message
      })
      onError(error)
      location.reload()
    }
  })()
  return {
    abort() {
      controller.abort()
    }
  }
}

const fileList = ref<FileItem[]>([])

const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
  fileList.value = [fileItem]
}

// export interface uploadUrl {
//   url: string
// }
const onNextClick = async () => {
  // const res = await formRef.value?.validate()
  // if (!res) {
  if (
    uploadVideoFormData.value.authorId === -1 ||
    uploadVideoFormData.value.width === -1 ||
    uploadVideoFormData.value.height === -1 ||
    uploadVideoFormData.value.url.length <= 0
  ) {
    Message.error('文件异常，请重新上传')
    location.reload()
  }
  emits('changeStep', 'forward', { ...uploadVideoFormData.value })
  // }
}
const createPlayer = (url: string) => {
  return new Player({
    // id: `video-2`,
    // id: 'video-player-sm',
    id: 'upload-preview',
    lang: 'zh',
    // url: 'https://www.wmzspace.space/web2_cwk2/videos/3.mp4',
    // plugins: [Danmu],
    loop: true,
    controlls: false,
    dynamicBg: {
      disable: false
    },
    screenShot: true, //显示截图按钮
    videoAttributes: {
      crossOrigin: 'anonymous'
    },
    // fitVideoSize: video.width > video.height ? 'fixed' : 'fixHeight',
    // videoFillMode: video.width > video.height ? 'cover' : undefined,
    url: url,
    autoplayMuted: true,
    autoplay: true,
    // playsinline: true,
    download: true,
    closeVideoClick: true
  })
}
</script>

<style scoped lang="less">
.container {
  padding: 20px;
  .keep-margin {
    margin-bottom: 20px;
  }
}

.wrapper {
  margin: 30px 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  //padding: 0px 0 32px 0;
  background-color: var(--color-bg-2);
  height: 100%;
}

.steps {
  margin-bottom: 36px;
}

.form {
  width: 500px;
}

.form-content {
  padding: 8px 50px 0 30px;
}
</style>
