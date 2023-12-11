<template>
  <a-card
    v-show="props.src.loaded"
    class="video-card"
    :style="{
      position: 'absolute',
      top: `${props.src.top}px`,
      left: `${props.src.left}px`,
      width: `${props.src.actualWidth}px`,
      height: `${props.src.actualHeight}px`
    }"
  >
    <template #cover>
      <div style="width: 100%; height: 100%">
        <a-image
          v-if="!isPlaying"
          :src="props.src.cover"
          :class="{ animated: isAnimated }"
          :title="props.src.title"
          @click="router.push(`/video/${props.src.id}`)"
          :height="'100%'"
          :width="'100%'"
          :fit="'cover'"
          style="z-index: 8"
          @loadstart="onstartLoadedImageData"
          @load="onLoadedImageData"
          @mouseover="onMouseOver"
          @mouseout="onMouseOutImage"
        >
        </a-image>
        <!--            @mouseover="-->
        <!--              (e) => {-->
        <!--                playVideo(e.target as HTMLVideoElement | null)-->
        <!--              }-->
        <!--            "-->
        <video
          v-if="showVideo || props.src.cover == undefined"
          @click="router.push(`/video/${props.src.id}`)"
          :src="props.src.url"
          :title="props.src.title"
          style="width: 100%; height: 100%; z-index: 9"
          controls
          muted
          @mouseout="onMouseOutVideo"
          @loadstart="onStartLoadVideoData"
          @loadeddata="onLoadedVideoData"
          @play="onPlay"
        ></video>
        <!--            @play="onPlayVideo"-->
      </div>
    </template>
    <a-card-meta>
      <template #title>
        <div class="video-title">
          <a>{{ props.src.title }}</a>
        </div></template
      >
      <!--      <template #description> </template>-->
      <template #avatar>
        <div :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
          <a-avatar
            :size="24"
            :image-url="author?.avatar"
            :style="{ marginRight: '8px' }"
          ></a-avatar>
          <a-typography-text>
            <div class="video-meta">
              <div class="name">{{ author ? author.nickname : '...' }}</div>
              <div class="time-diff">·{{ getTimeDiffUntilNow(props.src.publishTime) }}</div>
            </div>
          </a-typography-text>
        </div>
      </template>
    </a-card-meta>
    <template #actions>
      <!--      <span class="icon-hover"> <IconThumbUp /> </span>-->
      <!--      <span class="icon-hover"> <IconShareInternal /> </span>-->
      <span class="icon-hover"> <IconMore /> </span>
    </template>
  </a-card>
  <!--  <a-space></a-space>-->
  <!--  <div>-->
  <!--  <a-skeleton :loading="!isLoaded" animation>-->
  <!--    <a-space direction="vertical" size="large">-->
  <!--      <a-skeleton-line :rows="1" />-->
  <!--      <a-skeleton-shape />-->
  <!--    </a-space>-->
  <!--  </a-skeleton>-->
  <!--  </div>-->
</template>

<script setup lang="ts">
import { IconThumbUp, IconShareInternal, IconMore } from '@arco-design/web-vue/es/icon'
import type { VideoMedia } from '@/types'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import type { User } from '@/store/user'
import { getTimeDiffUntilNow } from '@/utils/tools'

const emit = defineEmits(['loadeddata'])
const showVideo = ref(false)
const props = defineProps<{
  src: VideoMedia
  // likes?: number
}>()

const userStore = useUserStore()
const author = ref<User | undefined>(undefined)
userStore.getUserById(props.src.authorId).then((user) => {
  author.value = user
})
const router = useRouter()

const isPlaying = ref(false)
const isAnimated = ref(false)
// const isLoaded = ref(false)

// const onPlayVideo = (e: Event) => {
//   console.log('play!')
//   isPlaying.value = true
// }
let timeout: any

const onMouseOver = (e: Event) => {
  showVideo.value = true
}

const onMouseOutVideo = (e: Event) => {
  // console.log('mouseout video')
  clearTimeout(timeout)
  let video = (e.target as HTMLVideoElement).parentElement?.parentElement?.querySelector(
    'video'
  ) as HTMLVideoElement | null
  stopVideo(video)
  isAnimated.value = false
}

const onMouseOutImage = (e: Event) => {
  // console.log('mouseout image')

  clearTimeout(timeout)
  let video = (e.target as HTMLVideoElement).parentElement?.parentElement?.querySelector(
    'video'
  ) as HTMLVideoElement | null
  stopVideo(video)
  isAnimated.value = false
  // showVideo = false
  // isPlaying = false
}

const stopVideo = (e: HTMLVideoElement | null) => {
  let video = e
  if (video === null) {
    return
  }
  if (isPlaying.value) {
    video.currentTime = 0 // 设置视频播放位置为开头
    video.pause()
    video.controls = false // 隐藏视频控制条
  }
  showVideo.value = false
  isPlaying.value = false
}
const playVideo = (e: HTMLVideoElement | null) => {
  if (e === null) {
    return
  }
  let video = e as HTMLVideoElement

  if (!isPlaying.value && showVideo.value) {
    video.currentTime = 0
    video.play().catch((e) => {
      console.log(isPlaying.value)
      console.log(e)
      isPlaying.value = false
      showVideo.value = false
      video.pause()
    })
    video.controls = true
    // isAnimated.value = true
  } else {
    showVideo.value = false
    isPlaying.value = false
  }
}

const isLoadedImage = ref(false)
// const isLoadedVideo = ref(false)
// const isLoadedAll = computed(() => isLoadedImage.value || props.src.cover === undefined)

// const parentElement = ref<HTMLElement | null>(null)

// watch(isLoadedAll, (value, oldValue, onCleanup) => {
//   if (value) {
//     // console.log('video loaded all')
//     emit('loadeddata', parentElement.value)
//     emit('loadeddata', parentElement.value)
//   }
// })
const videoElement = ref<HTMLVideoElement | null>(null)

const onstartLoadedImageData = () => {
  console.log('loading image')
}

const onLoadedImageData = () => {
  isLoadedImage.value = true
  console.log('loaded image')
  // if (isLoadedVideo.value) {
  emit('loadeddata')
  // emit('loadeddata', (e.target as HTMLElement).parentElement)
  // }
}
const onStartLoadVideoData = (e: Event) => {
  console.log('start loading')
  let video: HTMLVideoElement | null = e.target as HTMLVideoElement | null
  if (video === null) {
    return
  }
  isAnimated.value = true

  videoElement.value = video
  video.controls = true
}

const onPlay = () => {
  isPlaying.value = true
}

const onLoadedVideoData = (e: Event) => {
  console.log('loaded video')
  // let video: HTMLVideoElement | null = e.target as HTMLVideoElement | null
  // if (video === null) {
  //   return
  // }
  if (videoElement.value) {
    videoElement.value.currentTime = 0 // 设置视频播放位置为开头
  }

  if (showVideo.value && !isPlaying.value) {
    timeout = setTimeout(() => {
      playVideo(videoElement.value)
    }, 500)
  }
  // isLoadedVideo.value = true
  // parentElement.value = (e.target as HTMLElement).parentElement
  // if (isLoadedImage.value) {
  // emit('loadeddata', (e.target as HTMLElement).parentElement)
  // }
  // @loadeddata="
  //   (element: HTMLElement) => {
  //     // element: <video>
  //     video.width = element.clientWidth
  //     video.height = element.clientHeight
  //     calculateVideoPositions()
  //   }
  //   "

  // element: <video>
  // const originVideo = props.src
  // originVideo.width = (e.target as HTMLElement).parentElement?.clientWidth
  // originVideo.height = (e.target as HTMLElement).parentElement?.clientHeight
  // calculateVideoPositions()

  // let img = (e.target as HTMLVideoElement).parentElement?.parentElement?.querySelector(
  //   'img'
  // ) as HTMLElement
  // console.log(video.clientWidth)
  // img.style.width = `${video.clientWidth}px`
  // img.style.height = `${video.clientHeight}px`
}

// onMounted(() => {
//   video.addEventListener('loadeddata', () => {
//     console.log('Video is loaded and ready to play')
//     // 执行你想要在视频加载完成后进行的操作
//   })
// })

// export default {
//   components: { IconThumbUp, IconShareInternal, IconMore }
// }
</script>
<style scoped lang="scss">
//.icon-hover {
//  display: flex;
//  align-items: center;
//  justify-content: center;
//  width: 24px;
//  height: 24px;
//  border-radius: 50%;
//  transition: all 0.1s;
//}
//
//.icon-hover:hover {
//  background-color: rgb(var(--gray-2));
//}
</style>
