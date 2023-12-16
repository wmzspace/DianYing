<script setup lang="ts">
import type { VideoMedia } from '@/types'
import Player, { Events } from 'xgplayer'
import { nextTick, onMounted, ref, watch } from 'vue'
import PresetPlayer from 'xgplayer'

const props = defineProps<{
  src: VideoMedia
}>()

const createPlayer = (video: VideoMedia) => {
  return new Player({
    // id: `video-2`,
    // id: 'video-player-sm',
    el: videoRef.value,
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
    url: video.url,
    height: '100%',
    width: '100%',
    autoplayMuted: true,
    autoplay: true,
    // playsinline: true,
    download: true,
    poster: video.cover,
    closeVideoClick: true
  })
}
const videoRef = ref()
const player = ref<PresetPlayer | undefined>(undefined)
const mouseOver = ref(false)
const coolDown = ref<number>()
const canPlay = ref(false)
const showCover = ref(true)
watch(mouseOver, (value, oldValue, onCleanup) => {
  if (value) {
    canPlay.value = true
    coolDown.value = setTimeout(() => {
      if (canPlay.value) {
        nextTick(() => {
          if (videoRef.value) {
            player.value = createPlayer(props.src)
            player.value.on(Events.LOAD_START, () => {
              clearTimeout(coolDown.value)

              showCover.value = false
            })
            player.value.on(Events.LOADED_DATA, () => {
              if (player.value) {
                player.value.play()
              } else {
                showCover.value = true
                clearTimeout(coolDown.value)
                canPlay.value = false
              }
            })
          }
        })
      }
    }, 100)
  } else {
    if (player.value != undefined) {
      player.value.destroy()
      canPlay.value = false
      showCover.value = true
      clearTimeout(coolDown.value)
    }
  }
})
</script>

<template>
  <a
    class="video-link"
    @click="
      () => {
        $router.push({ name: 'videoDetail', params: { video_id: props.src.id } })
      }
    "
    @mouseenter="
      () => {
        mouseOver = true
      }
    "
    @mouseleave="
      () => {
        mouseOver = false
      }
    "
  >
    <div class="media-container">
      <a-image
        v-if="showCover"
        :src="props.src.cover"
        width="100%"
        height="100%"
        :fit="'cover'"
        :preview-visible="false"
      >
        <template #extra>
          <div class="like-statistic">
            <icon-heart />
            1234
          </div>
        </template>
      </a-image>
      <div v-if="mouseOver" id="video-player-sm" ref="videoRef"></div>
    </div>
    <p class="video-text">{{ props.src.title }}</p>
  </a>
</template>

<style scoped lang="less">
#video-player-sm {
  position: absolute;
  //height: 300px;
  //width: 300px;
}

.video-link {
  width: 100%;
  cursor: pointer;
  transition-property: transform, shadow, background-color;
  transition-duration: 0.35s;
  display: block;
  position: relative;
  overflow: hidden;
  color: inherit;
  text-decoration: none;

  .media-container {
    box-shadow: 0 0 0.5px 0 var(--color-secondary-default);
    padding-bottom: 133%;
    transition-property: border-radius;
    transition-duration: 0.35s;
    transition-delay: 0.5s;
    position: relative;
    overflow: hidden;
    //height: 300px;
    //width: 300px;
    .arco-image {
      width: 100%;
      height: 100%;
      position: absolute;
      overflow: hidden;

      .like-statistic {
        color: #fff;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-family:
          PingFang SC,
          DFPKingGothicGB-Medium,
          sans-serif;
        font-size: 14px;
        font-weight: 500;
        line-height: 22px;
        display: flex;
        position: absolute;
        bottom: 4px;
        left: 8px;

        .arco-icon {
          font-size: 18px;
          margin-right: 5px;
        }
      }
    }
  }

  .video-text {
    height: 44px;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    color: var(--color-text-t1);
    -webkit-box-orient: vertical;
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    line-height: 22px;
    transition-property: margin;
    transition-duration: 0.35s;
    display: -webkit-box;
    overflow: hidden;
  }
}
</style>
