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
      <div
        style="width: 100%; height: 100%"
        @click="handleClickVideoCard"
        @mouseenter="
          () => {
            mouseOver = true
          }
        "
        @mouseleave="handleMouseLeave"
      >
        <a-image
          :src="props.src.cover"
          :class="{ animated: isAnimated }"
          :title="props.src.title"
          :height="'100%'"
          :width="'100%'"
          v-if="showCover"
          :preview-visible="false"
          :show-loader="true"
        >
        </a-image>
        <div v-if="mouseOver" ref="videoRefHome"></div>

        <!--        <video-->
        <!--          v-if="showVideo || props.src.cover == undefined"-->
        <!--          @click="router.push(`/video/${props.src.id}`)"-->
        <!--          :src="props.src.url"-->
        <!--          :title="props.src.title"-->
        <!--          style="width: 100%; height: 100%; z-index: 9"-->
        <!--          controls-->
        <!--          muted-->
        <!--        ></video>-->
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
              <div class="name">{{ author ? author.nickName : '...' }}</div>
              <div class="time-diff">·{{ getTimeDiffUntilNow(props.src.publishTime) }}</div>
            </div>
          </a-typography-text>
        </div>
      </template>
    </a-card-meta>
    <template #actions>
      <span class="icon-hover"> <IconMore /> </span>
    </template>
  </a-card>
</template>

<script setup lang="ts">
import { IconMore } from '@arco-design/web-vue/es/icon'
import type { VideoMedia } from '@/types'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/store/user'
import { getTimeDiffUntilNow } from '@/utils/tools'
import PresetPlayer, { Events } from 'xgplayer'
import Player from 'xgplayer'
import type { UserRecord } from '@/api/list'
import { useRouter } from 'vue-router'
onMounted(() => {
  onLoadedImageData()
})
const router = useRouter()
const handleClickVideoCard = () => {
  router.push({
    name: 'videoDetail',
    params: { video_id: props.src.id },
    query: { validate: 'ignore' }
  })
}

const emit = defineEmits(['loadeddata'])
const videoRefHome = ref()
const player = ref<PresetPlayer | undefined>(undefined)
const mouseOver = ref(false)
const coolDown = ref<number>()
const canPlay = ref(false)
const showCover = ref(true)
const props = defineProps<{
  src: VideoMedia
}>()
const handleMouseLeave = () => {
  mouseOver.value = false
}
const userStore = useUserStore()
const author = ref<UserRecord | undefined>(undefined)

userStore.getUserInfoById(props.src.authorId).then((user) => {
  author.value = user
})

const isAnimated = ref(false)

const onLoadedImageData = () => {
  emit('loadeddata')
}

watch(mouseOver, (value) => {
  if (value) {
    isAnimated.value = true

    canPlay.value = true
    coolDown.value = setTimeout(() => {
      if (canPlay.value) {
        nextTick(() => {
          if (videoRefHome.value) {
            player.value = createPlayer(props.src)
            player.value.on(Events.LOAD_START, () => {
              // isAnimated.value = false
              clearTimeout(coolDown.value)
              showCover.value = false
            })
            player.value.on(Events.LOADED_DATA, () => {
              isAnimated.value = false
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
    isAnimated.value = false
    if (player.value != undefined) {
      player.value.destroy()
      canPlay.value = false
      showCover.value = true
      clearTimeout(coolDown.value)
    }
  }
})

const createPlayer = (video: VideoMedia) => {
  return new Player({
    // id: `video-2`,
    // id: 'video-player-sm',
    el: videoRefHome.value,
    lang: 'zh',
    // url: 'https://www.wmzspace.space/web2_cwk2/videos/3.mp4',
    // plugins: [Danmu],
    loop: true,
    controls: false,
    dynamicBg: {
      disable: false
    },

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
    poster: video.cover,
    closeVideoClick: true,
    closeVideoDblclick: true,
    disableProgress: true,
    ignores: [
      'time',
      'definition',
      'fullscreen',
      'i18n',
      'play',
      'poster',
      'progress',
      'replay',
      'volume'
    ]
  })
}
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
