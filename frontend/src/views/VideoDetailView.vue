<script setup lang="ts">
import { getVideoById, getVideoLikeUsersByVideoId, likeVideoOrNot, pullVideo } from '@/utils/video'
import type { Comment } from '@/utils/comment'
import {
  getCommentLikeUsersByCommentId,
  getCommentsByVideoIdOrParent,
  likeCommentOrNot,
  postComment
} from '@/utils/comment'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { Events } from 'xgplayer'
import Player from 'xgplayer'
import { debounce } from 'lodash-es'
import type { VideoMedia } from '@/types'
import { useUserStore } from '@/store/user/'
import type { User } from '@/store/user/'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import CommentCard from '@/components/Cards/CommentCard.vue'
import _ from 'lodash'
import VideoCardSmall from '@/components/Cards/VideoCardSmall.vue'

const userStore = useUserStore()
const props = defineProps<{
  video_id: string
}>()
const comments: Comment[] = reactive([])

let relatedList: VideoMedia[] = reactive([])

const video = ref<VideoMedia | undefined>(undefined)
const author = ref<User | undefined>(undefined)
const player = ref<Player | undefined>(undefined)
getVideoById(props.video_id).then((res: VideoMedia | undefined) => {
  video.value = _.cloneDeep(res)
})

const refreshRootCommentList = () => {
  comments.splice(0)
  getCommentsByVideoIdOrParent(parseInt(props.video_id), undefined).then((res) => {
    comments.splice(0)
    setTimeout(() => {
      res.reverse().forEach((e) => {
        comments.push(e)
      }, 1000)
    })
  })
}

watch(video, (value) => {
  if (value !== undefined) {
    userStore.getUserById(value.authorId).then((user) => {
      author.value = user
    })
    videoLikeShowNum.value = 0
    isLiked.value = false
    refreshVideoLike()
    refreshRootCommentList()
    pullVideo(10).then((res) => {
      relatedList.splice(0)
      res.forEach((e) => {
        relatedList.push(e)
      })
    })
    player.value?.destroy()
    player.value = createPlayer(value)
    player.value.on(Events.LOADED_DATA, calculateContainerPositions)
    player.value.on(Events.AUTOPLAY_STARTED, () => {
      console.log('autoplay success!!')
    })
  }
})
const calculateContainerPositions = () => {
  if (video.value === undefined) {
    return
  }
  let playerContainer = document.getElementById('video-player')?.parentElement as HTMLElement
  let width = 0
  width = playerContainer.clientWidth
  if (width > 0) {
    if (video.value.height >= video.value.width) {
      ;(playerContainer as HTMLElement).classList.add('vh-70')
    } else {
      ;(playerContainer as HTMLElement).classList.remove('vh-70')
      ;(playerContainer as HTMLElement).style.height = `${
        (width / video.value.width) * video.value.height
      }px`
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
  getVideoById(to.params['video_id'][0]).then((res: VideoMedia | undefined) => {
    video.value = _.cloneDeep(res)
  })
  next((vm) => {
    console.log(vm)
    // vm.$
  })
})
onMounted(() => {
  // player.on(Events.AUTOPLAY_PREVENTED, () => {
  //   console.log('autoplay was prevented!!')
  // })
  //

  window.addEventListener('resize', resizeEventHandler)
})

onUnmounted(() => {
  console.log('leave detail view')

  window.removeEventListener('resize', resizeEventHandler)
})

const newCommentContent = ref<string>('')
const onPostNewComment = () => {
  if (newCommentContent.value.length <= 0) {
    // Message.info('评论内容异常')
    return
  }
  if (author.value !== undefined && video.value !== undefined) {
    postComment(
      userStore.getCurrentUser.id,
      newCommentContent.value,
      video.value.id,
      undefined
    ).then((commentId) => {
      refreshRootCommentList()
      newCommentContent.value = ''
    })
  }
}

const onRefreshComment = () => {
  refreshRootCommentList()
}

const isLiked = ref(false)
const isProcessLike = ref(true)
const videoLikeUsers = reactive<User[]>([])
const videoLikeShowNum = ref(0)

const refreshVideoLike = () => {
  getVideoLikeUsersByVideoId(parseInt(props.video_id)).then((users) => {
    videoLikeUsers.splice(0)
    videoLikeShowNum.value = 0
    isLiked.value = false
    users.forEach((user) => {
      if (user.id === userStore.getCurrentUser.id) {
        isLiked.value = true
      }
      videoLikeShowNum.value++
      videoLikeUsers.push(user)
    })
    isProcessLike.value = false
  })
}

const handleClickLike = () => {
  if (isProcessLike.value) {
    // Message.info('点击太频繁')
  } else {
    likeVideoOrNot(parseInt(props.video_id), userStore.getCurrentUser.id, !isLiked.value).then(
      () => {
        refreshVideoLike()
      }
    )
    isLiked.value = !isLiked.value
  }
}
</script>

<template>
  <div id="video-detail">
    <!--    mainContainer-->
    <div class="mainContainer">
      <!--        videoContainer-->
      <div class="videoContainer">
        <div class="video-detail-container">
          <div id="video-player"></div>
        </div>
        <div class="detail-video-info">
          <div class="detail-video-title">
            {{ video?.title }}
          </div>
          <div class="detail-video-actions">
            <a-list class="detail-video-actions-left" :bordered="false">
              <a-list-item @click="handleClickLike" class="like-action">
                <span class="like-icon"><IconHeartFill v-if="isLiked" /><IconHeart v-else /></span>
                <span>{{ videoLikeShowNum }}</span>
              </a-list-item>
              <a-list-item>
                <icon-message />
                <span>323</span>
              </a-list-item>
              <a-list-item class="star-action">
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
                <span> {{ video ? author?.nickname : '...' }} </span>
              </a-link>
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
            <VideoCardSmall
              v-for="(relatedVideo, idx) in relatedList"
              :key="idx"
              :video="relatedVideo"
            >
            </VideoCardSmall>
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
              v-model:model-value.trim="newCommentContent"
              :max-length="400"
              @pressEnter="onPostNewComment"
            >
              <template #suffix>
                <img class="icon-at" src="/images/videoDetails/comment_at.svg" />
                <img
                  class="icon-send"
                  src="/images/videoDetails/send_comment.svg"
                  @click="onPostNewComment"
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
          <CommentCard
            v-for="(comment, index) in comments"
            :comment="comment"
            :key="index"
            :index="index"
            :video="video"
            @refresh="onRefreshComment"
          >
          </CommentCard>
          <p class="comments-list-append">暂时没有更多评论</p>
        </div>
      </div>
      <!--      commentContainer-->
    </div>
    <!--    mainContainer-->
    <!--    footerContainer-->
    <!--    <footer class="footerContainer">-->
    <!--      <div class="content">wmzspace</div>-->
    <!--    </footer>-->
    <!--    footerContainer-->
  </div>
</template>

<style scoped></style>
