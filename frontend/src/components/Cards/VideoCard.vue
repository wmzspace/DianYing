<template>
  <a-card>
    <template #cover>
      <!--        style="max-height: 400px"-->

      <!--        style="width: 100%; transform: translateY(-20px)"-->
      <!--      TODO: Cover-->
      <!--      <a-image-->
      <!--        :src="props.src.cover"-->
      <!--        :style="{ width: props.src.width, height: props.src.height }"-->
      <!--      ></a-image>-->
      <video
        :src="props.src.url"
        :title="props.src.title"
        style="width: 100%; height: 100%"
        controls
        @mouseover="
          (e) => {
            let video: HTMLVideoElement | null = e.target as HTMLVideoElement | null
            if (video === null) {
              return
            }

            if (video.paused) {
              video.currentTime = 0
              video.play()
              video.controls = true
            }
          }
        "
        @mouseout="
          (e) => {
            let video: HTMLVideoElement | null = e.target as HTMLVideoElement | null
            if (video === null) {
              return
            }
            if (video.played) {
              video.currentTime = 0 // 设置视频播放位置为开头
              video.pause()
              video.controls = false // 隐藏视频控制条
            }
          }
        "
        @loadeddata="
          (e) => {
            let video: HTMLVideoElement | null = e.target as HTMLVideoElement | null
            if (video === null) {
              return
            }
            video.currentTime = 0 // 设置视频播放位置为开头
            video.pause()
            video.controls = false // 隐藏视频控制条
            $emit('loadeddata', (e.target as HTMLElement).parentElement)
          }
        "
      ></video>
      <!--        <img-->
      <!--          :style="{ width: '100%', transform: 'translateY(-20px)' }"-->
      <!--          alt="dessert"-->
      <!--          src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp"-->
      <!--        />-->
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
import { onMounted } from 'vue'

const props = defineProps<{
  src: VideoMedia
  // likes?: number
}>()

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
