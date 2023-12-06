<script setup lang="ts">
import VideoCard from '@/components/Cards/VideoCard.vue'
import type { VideoMedia } from '@/types'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { videos } from '@/mock'
import { debounce } from 'lodash-es'

// const actualColumnWidth = ref(300)

// let timer
const calculateVideoPositions = () => {
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

  videos.forEach((video, index) => {
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
  debounce(calculateVideoPositions, 1000)
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
      <VideoCard
        v-for="(video, index) in videos"
        :src="video"
        :key="index"
        @loadeddata="
          (element: HTMLElement) => {
            // element: <video>
            // video.width = element.clientWidth
            // video.height = element.clientHeight
            // console.log(video.height, element.clientHeight)
            // console.log(video.width, element.clientWidth)
            debounce(calculateVideoPositions, 100)()
          }
        "
      />
    </div>
    <!--    </div>-->
  </div>
</template>

<style scoped></style>
