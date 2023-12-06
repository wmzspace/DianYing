<script setup lang="ts">
import { getVideoById } from '@/mock'
import { onMounted } from 'vue'
import { Events } from 'xgplayer'
import Player from 'xgplayer'

const props = defineProps<{
  videoId: string
}>()
const video = getVideoById(props.videoId)

onMounted(() => {
  let player = new Player({
    // id: `video-2`,
    id: `video-${video.id}`,
    // url: 'https://www.wmzspace.space/web2_cwk2/videos/3.mp4',
    url: video.url,
    height: '100%',
    autoplayMuted: true,
    autoplay: true,
    width: '100%'
  })

  // player.on(Events.AUTOPLAY_PREVENTED, () => {
  //   console.log('autoplay was prevented!!')
  // })
  //
  player.on(Events.AUTOPLAY_STARTED, () => {
    console.log('autoplay success!!')
  })
})
</script>

<template>
  <div id="video-detail">
    <div class="leftContainer">
      <div class="video-detail-container">
        <div :id="`video-${video.id}`"></div>
      </div>
      <div class="detail-video-info">
        <div class="detail-video-title">
          {{ video.title }}
        </div>
        <div class="detail-video-actions">
          <a-list class="detail-video-actions-left" :bordered="false">
            <a-list-item>
              <icon-heart-fill />
              <span>1</span>
            </a-list-item>
          </a-list>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
