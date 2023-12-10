<script setup lang="ts">
import VideoCard from '@/components/Cards/VideoCard.vue'
import type { VideoMedia } from '@/types'
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { pullVideo } from '@/mock'
import { debounce } from 'lodash-es'
import { Message } from '@arco-design/web-vue'

// const actualColumnWidth = ref(300)

// const isLoadedAll = ref(
//   computed(() => {
//     // FIXME currentShowNum.value
//     // return videoList.value.filter((e) => e.loaded).length === videoList.value.length
//
//     for (let i = currentShowNum.value; i < videoList.value.length; i++) {
//       let video = videoList.value[i]
//       if (!video.loaded) {
//         // console.log(i, 'not loaded')
//         return false
//       }
//     }
//     return true
//   })
// )
//
// watch(isLoadedAll, (value, oldValue, onCleanup) => {
//   if (value) {
//     console.log('all videos are loaded')
//     currentShowNum.value = videoList.value.length
//     // calculateVideoPositions()
//     nextTick(() => {
//       calculateVideoPositions()
//     })
//     // calculateVideoPositions()
//     console.log('total num', videoList.value.length)
//   } else {
//     // console.log('loading start')
//   }
// })
const videoList = ref<VideoMedia[]>([])
const currentShowNum = ref(0) // not include new loaded
pullVideo(20).then((res: VideoMedia[]) => {
  videoList.value = res
})
const isLoadedAll = ref(false)
const loadedNum = ref(0)

const home = ref()

const onScroll = () => {
  // console.clear()
  // console.log(home.value.scrollTop + home.value.clientHeight)
  // console.log(videoListHeight.value)
  // if (home.value.scrollTop + home.value.clientHeight >= home.value.scrollHeight) {
  if (home.value.scrollTop + home.value.clientHeight >= videoListHeight.value) {
    onLoadMore()
  }
}

const onLoadMore = () => {
  if (isLoadedAll.value) {
    isLoadedAll.value = false
    console.log('loading more...')
    pullVideo(20).then((res: VideoMedia[]) => {
      res.forEach((e) => {
        videoList.value.push(e)
      })
      // videoList.value.concat(res)
    })
  }
}

const onLoadedAll = () => {
  console.log('loaded all')
  isLoadedAll.value = true
  currentShowNum.value = loadedNum.value
  nextTick(() => {
    calculateVideoPositions()
    if (videoListHeight.value < window.innerHeight * 1.5) {
      console.log('加载完毕，但数量不够')
      // videoList.value.push(...pullVideo(20))
      onLoadMore()
    }
    // Message.clear()
    // Message.info({ content: `更新了20条视频`, position: 'bottom' })
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
    console.log('loading... exit')
    return
  }
  // console.log('position...')
  const container = document.getElementById('waterfall-scroll-container') as HTMLElement
  const containerWidth = container.clientWidth

  // const minColumnWidth = 240
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
    // console.log(index)
    const columnIndex = columnHeights.indexOf(Math.min(...columnHeights))
    const left = columnIndex * (columnWidth + GUTTER)
    const top = columnHeights[columnIndex]
    video.left = left
    video.top = top
    // if (index > currentShowNum.value) {
    // }

    video.actualWidth = columnWidth
    const cardBody = document.getElementsByClassName('arco-card-body')[index]
    // console.log('cardBody', cardBody.clientHeight)
    video.actualHeight = (video.height * columnWidth) / video.width + cardBody.clientHeight
    // const card = container.getElementsByClassName('video-card')[index] as HTMLElement
    // console.log(card.style)
    // columnHeights[columnIndex] += card.clientHeight + GUTTER
    columnHeights[columnIndex] += video.actualHeight + GUTTER
  })

  videoListHeight.value = Math.max(...columnHeights)
  // console.clear()
  // console.log('video list', videoListHeight.value)
  // console.log('body client', document.body.clientHeight)
  // console.log('body scroll', document.body.scrollHeight)
  // console.log('body offset', document.body.offsetHeight)
  // console.log('window inner', window.innerHeight)
  // console.log('window outer', window.outerHeight)
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

// const resizeEventHandler = () => {
//   debounce(calculateVideoPositions, 250)()
// }

// function debounce(fn, wait) {
//   let timer = null
//   return function () {
//     if (timer !== null) {
//       clearTimeout(timer)
//     }
//     timer = setTimeout(fn, wait)
//   }
// }

function resizeEventHandler() {
  if (home.value.scrollTop + home.value.clientHeight >= videoListHeight.value) {
    onLoadMore()
  }
  calculateVideoPositions()
}

function caller() {
  return debounce(resizeEventHandler, 200)()
}
// window.addEventListener('resize', debounce(handle, 1000))

onMounted(() => {
  window.addEventListener('resize', caller)
})

onUnmounted(() => {
  window.removeEventListener('resize', caller)
})
</script>

<template>
  <div id="home" ref="home" @scroll="onScroll">
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
            // console.log('loaded:', videoList.filter((e) => e.loaded).length)
            // console.log(loadedNum, videoList.length)
            if (++loadedNum === videoList.length) {
              onLoadedAll()
            }

            // console.log(videoList)
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

      <div class="list-append-area" :style="{ top: `${videoListHeight + 60}px` }">
        <a-spin class="load-more" dot v-if="!isLoadedAll" :loading="!isLoadedAll" />

        <!--        <a-button-->
        <!--          class="load-more-button"-->
        <!--          :class="{ loading: !isLoadedAll }"-->
        <!--          :type="'primary'"-->
        <!--          @click="onLoadMore"-->
        <!--          :loading="!isLoadedAll"-->
        <!--          >加载更多</a-button-->
        <!--        >-->
      </div>
    </div>
    <!--    </div>-->
  </div>
</template>

<style scoped></style>
