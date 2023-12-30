<script setup lang="ts">
import VideoCard from '@/components/Cards/VideoCard.vue'
import type { VideoMedia } from '@/types'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { pullVideo, type pullVideoRequest } from '@/utils/video'
import { debounce } from 'lodash-es'
import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded,
  useRoute
} from 'vue-router'
import { getTagsByChannel } from '@/utils/tag'

const videoList = ref<VideoMedia[]>([])
const currentShowNum = ref(0) // not include new loaded

const currentTags = ref<string[]>([])
const currentChannelName = ref<string | undefined>(undefined)
const route = useRoute()
const searchText = ref<string>('')
const refreshChannelTags = (to: RouteLocationNormalized | RouteLocationNormalizedLoaded) => {
  currentChannelName.value = to.params.channelName as string | undefined
  if (currentChannelName.value !== undefined) {
    getTagsByChannel(currentChannelName.value).then((tags) => {
      currentTags.value = tags
    })
  } else {
    currentTags.value = []
  }

  if (to.name === 'search') {
    searchText.value = to.query.search ? to.query.search.toString() : ''
  } else {
    searchText.value = ''
  }
}

onBeforeRouteLeave((to) => {
  refreshChannelTags(to)
})

onBeforeRouteUpdate((to) => {
  refreshChannelTags(to)
})

watch(
  () => currentTags.value,
  (value) => {
    videoList.value = []
    currentShowNum.value = 0
    videoListHeight.value = 0
    loadedNum.value = 0
    isLoadedAll.value = false
    pullVideo({ num: 20, tagsName: value, searchText: searchText.value }).then(
      (res: VideoMedia[]) => {
        videoList.value = res
      }
    )
  }
)

refreshChannelTags(route)

const isLoadedAll = ref(false)
const loadedNum = ref(0)

const home = ref()

const onScroll = () => {
  if (home.value.scrollTop + home.value.clientHeight >= videoListHeight.value) {
    onLoadMore(currentTags.value)
  }
}

const onLoadMore = (tags: string[]) => {
  if (isLoadedAll.value) {
    isLoadedAll.value = false
    pullVideo({ num: 20, tagsName: tags, searchText: searchText.value }).then(
      (res: VideoMedia[]) => {
        res.forEach((e) => {
          videoList.value.push(e)
        })
      }
    )
  }
}

const onLoadedAll = () => {
  if (currentShowNum.value !== 0) {
    isLoadedAll.value = true
  }
  currentShowNum.value = loadedNum.value
  nextTick(() => {
    calculateVideoPositions()
    if (videoListHeight.value < window.innerHeight * 1.5) {
      isLoadedAll.value = false
      pullVideo({ num: 20, tagsName: currentTags.value, searchText: searchText.value }).then(
        (res: VideoMedia[]) => {
          res.forEach((e) => {
            videoList.value.push(e)
          })
        }
      )
    } else {
      // console.log(videoList.value)
      isLoadedAll.value = true
    }
  })
}

const videoListHeight = ref(0)

// let timer
const calculateVideoPositions = () => {
  if (!isLoadedAll.value) {
    return
  }
  const container = document.getElementById('waterfall-scroll-container') as HTMLElement | null
  if (container === null) {
    return
  }
  const containerWidth = container.clientWidth

  const minColumnWidth = 240
  const maxColumnWidth = 450
  const MAX_COLUMNS = 8
  const GUTTER = 16

  const columns = Math.min(Math.floor(containerWidth / (minColumnWidth + GUTTER)), MAX_COLUMNS)
  const columnWidth =
    columns < MAX_COLUMNS
      ? Math.min(
          maxColumnWidth,
          Math.max(minColumnWidth, Math.floor((containerWidth - (columns - 1) * GUTTER) / columns))
        )
      : Math.floor((containerWidth - (MAX_COLUMNS - 1) * GUTTER) / columns)
  const columnHeights = Array(columns).fill(0)
  videoList.value.forEach((video, index) => {
    const columnIndex = columnHeights.indexOf(Math.min(...columnHeights))
    const left = columnIndex * (columnWidth + GUTTER)
    const top = columnHeights[columnIndex]
    video.left = left
    video.top = top

    video.actualWidth = columnWidth
    const cardBody = document.getElementsByClassName('arco-card-body')[index]
    video.actualHeight = (video.height * columnWidth) / video.width + cardBody.clientHeight

    columnHeights[columnIndex] += video.actualHeight + GUTTER
  })

  videoListHeight.value = Math.max(...columnHeights)
}

function resizeEventHandler() {
  if (home.value.scrollTop + home.value.clientHeight >= videoListHeight.value) {
    onLoadMore(currentTags.value)
  }
  calculateVideoPositions()
}

function caller() {
  return debounce(resizeEventHandler, 200)()
}

onMounted(() => {
  window.addEventListener('resize', caller)
})

onUnmounted(() => {
  window.removeEventListener('resize', caller)
})
</script>

<template>
  <div id="home" ref="home" @scroll="onScroll">
    <div id="waterfall-scroll-container">
      <VideoCard
        v-for="(video, index) in videoList"
        v-show="index + 1 <= currentShowNum && currentShowNum >= 5"
        :src="video"
        :key="index"
        @loadeddata="
          (element: HTMLElement) => {
            // video.loaded = true

            if (++loadedNum === videoList.length) {
              onLoadedAll()
            }
            // console.log(loadedNum, videoList.length)
          }
        "
      />

      <div
        class="list-append-area"
        :style="{ top: `${currentShowNum >= 5 ? videoListHeight + 60 : 60}px` }"
      >
        <a-spin class="load-more" dot v-if="!isLoadedAll" :loading="!isLoadedAll" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
