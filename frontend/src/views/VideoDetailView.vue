<script setup lang="ts">
import { getVideoById, videos } from '@/mock'
import { onMounted, onUnmounted } from 'vue'
import PresetPlayer, { Events } from 'xgplayer'
import Danmu from 'xgplayer/es/plugins/danmu'
import type { IDanmuConfig } from 'xgplayer/es/plugins/danmu'
import Player from 'xgplayer'
import { debounce } from 'lodash-es'
import type { DanMuProps } from '@/types'

const props = defineProps<{
  videoId: string
}>()
const video = getVideoById(props.videoId)

const calculateContainerPositions = () => {
  let playerContainer = document.getElementById('video-player')?.parentElement as HTMLElement
  let width = 0
  width = playerContainer.clientWidth
  if (width > 0) {
    console.log(`放大倍数:${width / video.width}`)
    if (video.height >= video.width) {
      ;(playerContainer as HTMLElement).style.height = `70vh`
      // ;(playerContainer as HTMLElement).style.height = `${width / 1.5}px`
    } else {
      ;(playerContainer as HTMLElement).style.height = `${(width / video.width) * video.height}px`
    }
  }
}

const resizeEventHandler = () => {
  debounce(calculateContainerPositions, 250)()
}

onMounted(() => {
  let player = new Player({
    // id: `video-2`,
    id: 'video-player',
    lang: 'zh',
    // url: 'https://www.wmzspace.space/web2_cwk2/videos/3.mp4',
    plugins: [Danmu],
    loop: true,
    dynamicBg: {
      disable: false
    },
    fitVideoSize: video.width > video.height ? 'fixed' : 'fixHeight',
    videoFillMode: video.width > video.height ? 'cover' : undefined,
    danmu: {
      comments: [
        //弹幕数组
        {
          duration: 15000, //弹幕持续显示时间,毫秒(最低为5000毫秒)
          id: '1', //弹幕id，需唯一
          start: 3000, //弹幕出现时间，毫秒
          prior: true, //该条弹幕优先显示，默认false
          color: true, //该条弹幕为彩色弹幕，默认false
          txt: '长弹幕长弹幕长弹幕长弹幕长弹幕长弹幕长弹幕长弹幕长弹幕长弹幕', //弹幕文字内容
          style: {
            //弹幕自定义样式
            color: '#ff9500',
            fontSize: '20px',
            border: 'solid 1px #ff9500',
            borderRadius: '50px',
            padding: '5px 11px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          },
          mode: 'top' //显示模式，top顶部居中，bottom底部居中，scroll滚动，默认为scroll
          // el: DOM //直接传入一个自定义的DOM元素作为弹幕，使用该项的话会忽略所提供的txt
          // eventListeners: [{ //支持自定义DOM设置DOM监听事件
          //   event: 'click',
          //   listener: function (e) {
          //     console.log('click')
          //   },
          //   useCapture: false,
          // }]
        }
      ]
    },
    url: video.url,
    height: '100%',
    width: '100%',
    autoplayMuted: true,
    autoplay: false,
    // playsinline: true,
    download: true
  })

  // player.on(Events.AUTOPLAY_PREVENTED, () => {
  //   console.log('autoplay was prevented!!')
  // })
  //
  player.on(Events.LOADED_DATA, resizeEventHandler)

  player.on(Events.AUTOPLAY_STARTED, () => {
    console.log('autoplay success!!')
  })
  window.addEventListener('resize', resizeEventHandler)
})

onUnmounted(() => {
  console.log('leave detail view')
  window.removeEventListener('resize', resizeEventHandler)
})
</script>

<template>
  <div id="video-detail">
    <div class="leftContainer">
      <div class="video-detail-container">
        <div id="video-player"></div>
      </div>
      <div class="detail-video-info">
        <div class="detail-video-title">
          {{ video.title }}
        </div>
        <div class="detail-video-actions">
          <a-list class="detail-video-actions-left" :bordered="false">
            <a-list-item>
              <icon-heart-fill />
              <span>1.0万</span>
            </a-list-item>
            <a-list-item>
              <icon-message />
              <span>323</span>
            </a-list-item>
            <a-list-item>
              <icon-star-fill />
              <span>683</span>
            </a-list-item>
          </a-list>
          <div class="detail-video-actions-right">
            <div class="report">
              <icon-exclamation-circle />
              <span>举报</span>
            </div>
            <div class="publish-time">
              <span>发布时间：</span>
              <span>2023-12-03 01:07</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
