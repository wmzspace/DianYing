<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import type { VideoMedia } from '@/types'
import { pullVideo } from '@/utils/video'
import PresetPlayer from 'xgplayer'
import Player from 'xgplayer'

const currentPlayIndex = ref(0)
const videoList = ref<VideoMedia[]>([])
pullVideo({ num: 5 }).then((res: VideoMedia[]) => {
  videoList.value = res
})

const player = ref<PresetPlayer | undefined>(undefined)

onMounted(() => {
  watch(videoList, () => {
    if (videoList.value.length > 0) {
      const video = videoList.value[currentPlayIndex.value]
      nextTick(() => {
        player.value = new Player({
          el: (document.getElementById('sliderVideo') as HTMLElement).querySelector(
            '.basePlayerContainer'
          ) as HTMLElement,
          url: video.url,
          width: video.width,
          height: video.height,
          playNext: {
            urlList: [video.url, video.url]
          },
          fluid: true,
          dynamicBg: {
            disable: false
          },
          fitVideoSize: 'fixed'
          // fitVideoSize: 'fixHeight'
        })
      })
    }
  })
})
</script>

<template>
  <div id="slide-list">
    <div class="outer-container">
      <div class="slide-list-container">
        <div class="page-recommend-container">
          <div
            v-for="(video, idx) in videoList"
            :key="idx"
            class="feed-video"
            :id="idx === currentPlayIndex ? 'sliderVideo' : undefined"
          >
            <div class="playerContainer">
              <div class="slider-video">
                <div class="basePlayerContainer"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'VideoRecommend'
}
</script>

<style scoped lang="less"></style>
