<script setup lang="ts">
import VideoCard from '@/components/Cards/VideoCard.vue'
import type { VideoMedia } from '@/types'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { pullVideo, videos } from '@/mock'
import { debounce } from 'lodash-es'

// const actualColumnWidth = ref(300)
const videoList = ref<VideoMedia[]>([])
const currentShowNum = ref(0)

videoList.value = pullVideo(5)
const isLoadedAll = computed(() => {
  for (let video of videoList.value) {
    if (!video.loaded) {
      return false
    }
  }
  return true
})

watch(isLoadedAll, (value, oldValue, onCleanup) => {
  if (value) {
    currentShowNum.value = videoList.value.length
    calculateVideoPositions()
    nextTick(() => {
      calculateVideoPositions()
    })
  }
})

const onLoadMore = () => {
  console.log('load more')
  pullVideo(5).forEach((e) => {
    videoList.value.push(e)
  })
}

// watch(videoList, () => {
//   if (videoList.value.length < 20) {
//     debounce(calculateVideoPositions, 1000)()
//   } else {
//     calculateVideoPositions()
//   }
// })

const videoListHeight = ref(0)

// let timer
const calculateVideoPositions = () => {
  if (!isLoadedAll.value) {
    return
  }

  const containerWidth = (document.getElementById('waterfall-scroll-container') as HTMLElement)
    .clientWidth
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
    console.log(index)
    const columnIndex = columnHeights.indexOf(Math.min(...columnHeights))
    const left = columnIndex * (columnWidth + GUTTER)
    const top = columnHeights[columnIndex]
    video.left = left
    video.top = top
    video.actualWidth = columnWidth
    if (video.height && video.width) {
      video.actualHeight =
        (video.height * columnWidth) / video.width +
        document.getElementsByClassName('arco-card-body')[index].clientHeight
    }
    columnHeights[columnIndex] +=
      document.getElementsByClassName('video-card')[index].clientHeight + GUTTER
  })

  videoListHeight.value = Math.max(...columnHeights)
}

// function resizeHandler(func: Function, delay: number) {
//   let timerId: number
//
//   return function () {
//     clearTimeout(timerId)
//
//     timerId = setTimeout(() => {
//       func.apply(arguments)
//       console.log(arguments)
//     }, delay)
//   }
// }

const resizeEventHandler = () => {
  debounce(calculateVideoPositions, 250)()
}

onMounted(() => {
  window.addEventListener('resize', resizeEventHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeEventHandler)
})
</script>

<template>
  <div id="home">
    <!--    <div style="flex-grow: 1; position: relative; width: 100%">-->

    <div id="waterfall-scroll-container">
      <!--        v-show="isLoadedAll"-->
      <VideoCard
        v-for="(video, index) in videoList"
        v-show="index + 1 <= currentShowNum"
        :src="video"
        :key="index"
        @loadeddata="
          (element: HTMLElement) => {
            video.loaded = true
            // loadedNum++
            // if (loadedNum > 20) {
            //   debounce(calculateVideoPositions, 0)()
            // }
            // element: <video>
            // video.width = element.clientWidth
            // video.height = element.clientHeight
            // console.log(video.height, element.clientHeight)
            // console.log(video.width, element.clientWidth)
          }
        "
      />
      <a-spin dot v-if="!isLoadedAll" />
      <div class="list-append-area" :style="{ top: `${videoListHeight + 50}px` }">
        <a-button
          class="load-more-button"
          :type="'outline'"
          @click="onLoadMore"
          :loading="!isLoadedAll"
          >加载更多</a-button
        >
      </div>
    </div>
    <!--    </div>-->
  </div>
</template>

<style scoped></style>
