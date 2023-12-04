<template>
  <a-card>
    <template #actions>
      <!--      <span class="icon-hover"> <IconThumbUp /> </span>-->
      <!--      <span class="icon-hover"> <IconShareInternal /> </span>-->
      <span class="icon-hover"> <IconMore /> </span>
    </template>
    <template #cover>
      <div
        style="max-height: 400px"
        :style="{
          // height: props.src.height + 'px'
        }"
      >
        <!--        style="width: 100%; transform: translateY(-20px)"-->
        <video :src="props.src.url" :title="props.src.title" style="width: 100%"></video>
        <!--        <img-->
        <!--          :style="{ width: '100%', transform: 'translateY(-20px)' }"-->
        <!--          alt="dessert"-->
        <!--          src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/a20012a2d4d5b9db43dfc6a01fe508c0.png~tplv-uwbnlip3yd-webp.webp"-->
        <!--        />-->
      </div>
    </template>
    <a-card-meta class="video-title">
      <template #title><p class="video-title">亿万富翁找回儿子</p></template>
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
            </div></a-typography-text
          >
        </div>
      </template>
    </a-card-meta>
  </a-card>
</template>

<script setup lang="ts">
import { IconThumbUp, IconShareInternal, IconMore } from '@arco-design/web-vue/es/icon'
import { VideoMedia } from '@/types'
import * as url from 'url'

const props = defineProps<{
  src: VideoMedia
  // likes?: number
}>()

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
