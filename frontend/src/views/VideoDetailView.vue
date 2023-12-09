<script setup lang="ts">
import { comments, getVideoById, videos } from '@/mock'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import PresetPlayer, { Events } from 'xgplayer'
import Danmu from 'xgplayer/es/plugins/danmu'
import type { IDanmuConfig } from 'xgplayer/es/plugins/danmu'
import Player from 'xgplayer'
import { debounce } from 'lodash-es'
import type { DanMuProps, VideoMedia } from '@/types'
import { useUserStore } from '@/store/user/'
import {
  isNavigationFailure,
  NavigationFailureType,
  onBeforeRouteUpdate,
  useRoute,
  useRouter
} from 'vue-router'
import type { IUrl } from 'xgplayer/es/player'
import CommentCard from '@/components/Cards/CommentCard.vue'
// import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const props = defineProps<{
  video_id: string
}>()
// const props = defineProps(['video_id'])

let video = getVideoById(props.video_id)
let player: Player
const calculateContainerPositions = () => {
  let playerContainer = document.getElementById('video-player')?.parentElement as HTMLElement
  let width = 0
  width = playerContainer.clientWidth
  if (width > 0) {
    console.log(`放大倍数:${width / video.width}`)
    if (video.height >= video.width) {
      // ;(playerContainer as HTMLElement).style.height = `70vh`
      ;(playerContainer as HTMLElement).classList.add('vh-70')
      // ;(playerContainer as HTMLElement).style.height = `${width / 1.5}px`
    } else {
      ;(playerContainer as HTMLElement).classList.remove('vh-70')
      ;(playerContainer as HTMLElement).style.height = `${(width / video.width) * video.height}px`
    }
  }
}

const resizeEventHandler = () => {
  debounce(calculateContainerPositions, 250)()
}

const createPlayer = (video: VideoMedia) => {
  return new Player({
    // id: `video-2`,
    id: 'video-player',
    lang: 'zh',
    // url: 'https://www.wmzspace.space/web2_cwk2/videos/3.mp4',
    // plugins: [Danmu],
    loop: true,
    dynamicBg: {
      disable: false
    },
    screenShot: true, //显示截图按钮
    videoAttributes: {
      crossOrigin: 'anonymous'
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
    autoplay: true,
    // playsinline: true,
    download: true
  })
}

onBeforeRouteUpdate((to, from, next) => {
  // console.log(to, from)
  video = getVideoById(to.params['video_id'][0])
  player.destroy()
  player = createPlayer(video)
  next((vm) => {
    console.log(vm)
    // vm.$
  })
})
onMounted(() => {
  player = createPlayer(video)
  // player.on(Events.AUTOPLAY_PREVENTED, () => {
  //   console.log('autoplay was prevented!!')
  // })
  //
  player.on(Events.LOADED_DATA, calculateContainerPositions)

  player.on(Events.AUTOPLAY_STARTED, () => {
    console.log('autoplay success!!')
  })
  window.addEventListener('resize', resizeEventHandler)
})

onUnmounted(() => {
  console.log('leave detail view')

  window.removeEventListener('resize', resizeEventHandler)
})

const currentReplyKey = ref(-1)
const newCommentContent = ref<string>('')
</script>

<template>
  <div id="video-detail">
    <!--    mainContainer-->
    <div class="mainContainer">
      <!--      leftContainer-->
      <!--      <div class="leftContainer">-->
      <!--        videoContainer-->
      <div class="videoContainer">
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
      <!--        videoContainer-->

      <!--      relatedInfoContainer-->
      <div class="relatedInfoContainer">
        <div class="user-info">
          <a-avatar
            :size="60"
            :image-url="'/images/avatar.jpeg'"
            :style="{ marginRight: '8px' }"
          ></a-avatar>
          <div class="basic-info">
            <div class="text-info">
              <a-link class="name">
                <span> 19岁带饭冲锋🌈 </span>
              </a-link>
              <!--          <icon-right />-->
              <div class="statistic">
                <span class="title"> 粉丝</span> <span class="number">8000</span>
                <span class="title"> 获赞</span> <span class="number">2.6万</span>
              </div>
            </div>
            <a-button class="follow-button">关注</a-button>
          </div>
        </div>
        <div class="related-video">
          <div class="cover-age-title-container">
            <h2>推荐视频</h2>
          </div>
          <a-list class="video-list">
            <a-list-item
              v-for="(relatedVideo, idx) in videos.splice(0, 10)"
              :key="idx"
              action-layout="vertical"
            >
              <template #extra>
                <router-link :to="`/video/${relatedVideo.id}`">
                  <div class="image-area">
                    <a-image
                      alt="related video"
                      :src="relatedVideo.cover"
                      width="100%"
                      height="100%"
                      :preview="false"
                    />
                  </div>
                </router-link>
              </template>
              <a-list-item-meta>
                <template #title>
                  <router-link :to="`/video/${relatedVideo.id}`"
                    >{{ relatedVideo.title }}
                  </router-link>
                </template>
              </a-list-item-meta>
              <!--            <template #actions>-->
              <span class="action"> <IconHeart /> <span>1</span> </span>
              <a class="action-author">{{ userStore.getUserById(relatedVideo.authorId).name }}</a>
              <!--                        </template>-->
            </a-list-item>
          </a-list>
        </div>
      </div>
      <!--      relatedInfoContainer-->

      <!--      commentContainer-->
      <div class="commentContainer">
        <div class="detail-comment-divider">
          <span class="comment-title">全部评论</span>
          <a-divider />
        </div>

        <div class="new-comment">
          <a-row :wrap="false">
            <a-avatar>
              <img alt="avatar" src="/images/avatar.jpeg" />
            </a-avatar>

            <a-input
              placeholder="留下你的精彩评论吧"
              class="comment-input"
              v-model:model-value="newCommentContent"
            >
              <template #suffix>
                <img class="icon-at" src="/images/videoDetails/comment_at.svg" />
                <img
                  class="icon-send"
                  src="/images/videoDetails/send_comment.svg"
                  v-if="newCommentContent.length > 0"
              /></template>
            </a-input>
          </a-row>
        </div>

        <div class="usually-search">
          大家都在搜：<a class="usually-search-topic"
            ><span class="usually-search-topic-text">亿万富翁找回儿子</span>
            <img class="usually-search-icon" src="images/videoDetails/usually_search.svg" />
          </a>
        </div>

        <div class="comments-list">
          <!--            :showReply="currentReplyKey === index"-->
          <!--            @reply="-->
          <!--              (index_) => {-->
          <!--                // currentReplyKey = index_-->
          <!--              }-->
          <!--            "-->
          <CommentCard
            v-for="(comment, index) in comments.filter((e) => e.parentId === -1)"
            :comment="comment"
            :key="index"
            :index="index"
          />
          <p class="comments-list-append">暂时没有更多评论</p>
        </div>
      </div>
      <!--      commentContainer-->
      <!--      </div>-->
      <!--      leftContainer-->
    </div>
    <!--    mainContainer-->
    <!--    footerContainer-->
    <footer class="footerContainer">
      <div class="content">wmzspace</div>
    </footer>
    <!--    footerContainer-->
  </div>
</template>

<style scoped></style>
