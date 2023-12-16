<script setup lang="ts">
import VideoCard from '@/components/Cards/VideoCard.vue'
import { reactive, ref } from 'vue'
import type { VideoMedia } from '@/types'
import { getVideoById, pullVideo } from '@/utils/video'
import VideoCardSm from '@/views/user/profile/components/video-card-sm.vue'
import Player from 'xgplayer'

let videoList: VideoMedia[] = reactive([])

pullVideo(5).then((videos) => {
  videos.forEach((video) => {
    videoList.push(video)
  })
})
pullVideo(5).then((videos) => {
  videos.forEach((video) => {
    videoList.push(video)
  })
})
pullVideo(5).then((videos) => {
  videos.forEach((video) => {
    videoList.push(video)
  })
})
// pullVideo(10).then((videos) => {
//   videos.forEach((video) => {
//     videoList.push(video)
//   })
// })
</script>

<template>
  <div class="video-cards-container">
    <div class="action-bar">视频</div>
    <div class="content">
      <ul>
        <li class="list-item" v-for="(video, index) in videoList" :key="index">
          <video-card-sm :src="video" />
        </li>
      </ul>
      <!--      <video-card v-for="(video, index) in videoList" :src="video" :key="index" />-->
    </div>
  </div>
</template>

<style scoped lang="less">
.video-cards-container {
  .action-bar {
    height: 44px;
    padding: 0px;
    //border-top: thin solid red;
    display: flex;
    align-items: center;
    font-size: 13px;
    line-height: 21px;
    color: rgba(255, 255, 255, 0.9);
    border-top-color: rgba(255, 255, 255, 0.04);
    border-top-style: solid;
    border-top-width: 0.666667px;
  }

  .content {
    ul {
      flex-wrap: wrap;
      display: flex;
      list-style-type: disc;
      margin: 0;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      //padding-inline-start: 40px;
      width: 100%;
      padding: 0;
      line-height: 0;

      .list-item {
        width: calc(16.66% - 16px);
        padding: 0;
        margin-bottom: 24px;
        margin-right: 16px;
        position: relative;
        user-select: none;
        line-height: 0;
        overflow: hidden;
        list-style: none;
        display: inline-block;
        @media (max-width: 1024px) {
          width: calc(33.33% - 16px);
        }
      }
    }
  }
}
</style>
