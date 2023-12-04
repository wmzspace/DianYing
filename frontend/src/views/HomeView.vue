<script setup lang="ts">
import VideoCard from '@/components/Cards/VideoCard.vue'
import type { VideoMedia } from '@/types'
const videos: VideoMedia[] = [
  {
    id: 1,
    title: '测试标题',
    url: '/videos/1.mp4',
    height: 600
  }
]
</script>

<template>
  <!--  <main>HelloWorld</main>-->
  <!--  <div style="width: 100px; height: 100px; background-color: white">123</div>-->
  <div id="home">
    <div style="flex-grow: 1; position: relative; width: 100%">
      <div id="waterfall-scroll-container">
        <VideoCard class="video-card" :src="videos[0]" />
        <VideoCard class="video-card" :src="videos[0]" />
        <VideoCard class="video-card" :src="videos[0]" />
        <VideoCard class="video-card" :src="videos[0]" />
        <!--        <VideoCard class="video-card" />-->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
