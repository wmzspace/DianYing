<template>
  <a-card>
    <template #cover>
      <a-image
        v-if="!isPlaying && props.src.cover !== undefined"
        :src="props.src.cover"
        :title="props.src.title"
        width="100%"
        style="z-index: 10"
        @mouseover="
          (e: Event) => {
            let video = (e.target as HTMLVideoElement).parentElement?.parentElement?.querySelector(
              'video'
            ) as HTMLVideoElement | null
            playVideo(video)
          }
        "
        @mouseout="
          (e: Event) => {
            let video = (e.target as HTMLVideoElement).parentElement?.parentElement?.querySelector(
              'video'
            ) as HTMLVideoElement | null
            stopVideo(video)
          }
        "
      >
      </a-image>
      <video
        v-show="isPlaying || props.src.cover == undefined"
        :src="props.src.url"
        :title="props.src.title"
        style="width: 100%; height: 100%; z-index: 9"
        controls
        muted
        @mouseover="
          (e) => {
            playVideo(e.target as HTMLVideoElement | null)
          }
        "
        @mouseout="
          (e) => {
            stopVideo(e.target as HTMLVideoElement | null)
          }
        "
        @loadeddata="onLoadedData"
        @play="onPlayVideo"
      ></video>
    </template>
    <a-card-meta>
      <template #title
        ><p class="video-title">{{ props.src.title }}</p></template
      >
      <!--      <template #description> </template>-->
      <template #avatar>
        <div :style="{ display: 'flex', alignItems: 'center', color: '#1D2129' }">
          <a-avatar
            :size="24"
            :image-url="'/images/avatar.jpeg'"
            :style="{ marginRight: '8px' }"
          ></a-avatar>
          <a-typography-text>
            <div class="video-meta">
              <span>19岁带饭冲锋</span>
              <span>·</span>
              <span>1天前</span>
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
</template>

<script setup lang="ts">
import { IconThumbUp, IconShareInternal, IconMore } from '@arco-design/web-vue/es/icon'
import type { VideoMedia } from '@/types'
import { onMounted, ref } from 'vue'
const emit = defineEmits(['loadeddata'])

const props = defineProps<{
  src: VideoMedia
  // likes?: number
}>()

const isPlaying = ref(false)

const onPlayVideo = (e: Event) => {
  console.log('play!')
  isPlaying.value = true
}

const stopVideo = (e: HTMLVideoElement | null) => {
  let video = e
  if (video === null) {
    return
  }
  if (video.played) {
    video.currentTime = 0 // 设置视频播放位置为开头
    video.pause()
    video.controls = false // 隐藏视频控制条
  }
  isPlaying.value = false
}
const playVideo = (e: HTMLVideoElement | null) => {
  let video = e
  if (video === null) {
    return
  }

  if (video.paused) {
    video.currentTime = 0
    video.play()
    video.controls = true
  }

  isPlaying.value = true
}

const onLoadedData = (e: Event) => {
  let video: HTMLVideoElement | null = e.target as HTMLVideoElement | null
  if (video === null) {
    return
  }
  video.currentTime = 0 // 设置视频播放位置为开头
  video.pause()
  video.controls = false // 隐藏视频控制条
  emit('loadeddata', (e.target as HTMLElement).parentElement)
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
<style scoped>
.icon-hover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.1s;
}

.icon-hover:hover {
  background-color: rgb(var(--gray-2));
}
</style>
