<script setup lang="ts">
import {
  getVideoActionUsersByVideoId,
  getVideoById,
  likeOrStarVideoOrNot,
  pullVideo
} from '@/utils/video'
import type { Comment } from '@/utils/comment'
import {
  getCommentLikeUsersByCommentId,
  getCommentsByVideoIdOrParent,
  likeCommentOrNot,
  postComment
} from '@/utils/comment'
import { nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
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
const comments: (Comment | undefined)[] = reactive([])

let relatedList: VideoMedia[] = reactive([])

const video = ref<VideoMedia | undefined>(undefined)
const author = ref<User | undefined>(undefined)
const player = ref<Player | undefined>(undefined)
getVideoById(props.video_id).then((res: VideoMedia | undefined) => {
  video.value = _.cloneDeep(res)
})

// const CommentCardRefs = ref()
const focusComment = (
  finder: CommentFinder,
  root_comment: HTMLElement | undefined
): HTMLElement | undefined => {
  // if (finder === undefined) {
  //   return
  // }
  // console.log(root_comment)
  // console.log(finder)
  if (root_comment === undefined) {
    let firstElement: HTMLElement | null = document.querySelector('.comment-item')
    // console.log(firstElement)
    if (firstElement === null) {
      return undefined
    }

    let childNodes = (firstElement.parentNode as HTMLElement).children
    let siblingsArray = Array.from(childNodes) as HTMLElement[]
    let commentElements = siblingsArray.filter((sibling) => {
      return sibling.classList.contains('comment-item')
    })
    // .querySelectorAll('~ .comment-item')[finder.index]
    // console.log('commentElements', commentElements)
    return focusComment(finder.children as CommentFinder, commentElements[finder.index])
  }
  if (finder.children === undefined) {
    return root_comment.getElementsByClassName('comment-item')[finder.index] as HTMLElement
  }
  // nextTick(() => {

  let childrenElements = root_comment.getElementsByClassName('comment-item')[finder.index]
  return focusComment(finder.children, childrenElements as HTMLElement)

  // nextTick(() => {
  // })
  // let target = comments[i]
  // target.scrollIntoView({ behavior: 'smooth' })
  // .scrollIntoView({ behavior: 'smooth' })
  // console.log(comments[i])
  // target.classList.add('animated')
  // setTimeout(() => {
  // target.classList.remove('animated')
  // }, 1000)
  // })
}

const refreshRootCommentList = (focusIndex?: CommentFinder) => {
  comments.splice(0)
  getCommentsByVideoIdOrParent(parseInt(props.video_id), undefined).then((res) => {
    comments.splice(0)
    // setTimeout(() => {
    res.reverse().forEach((e) => {
      comments.push(e)
      // }, 1000)
    })
    if (focusIndex !== undefined) {
      // console.log(commentElements[0])
      return
      // setTimeout(() => {
      //   let targetParent = focusComment(focusIndex, undefined)
      //   if (targetParent !== undefined) {
      //     let childNodes = targetParent.querySelectorAll('.comment-item')
      //     // console.log('parent', targetParent)
      //     // console.log('children', childNodes)
      //     // let commentElements = childNodes.querySelector()
      //     let target = childNodes[0]
      //     // console.log(target)
      //     target.scrollIntoView({ behavior: 'smooth' })
      //     target.classList.add('animated')
      //     setTimeout(() => {
      //       if (target !== undefined) {
      //         target.classList.remove('animated')
      //       }
      //     }, 1000)
      //   }
      //
      //   // target.scrollIntoView({ behavior: 'smooth' })
      // }, 5000)
    }
  })
}

watch(video, (value) => {
  if (value !== undefined) {
    userStore.getUserById(value.authorId).then((user) => {
      author.value = user
    })
    videoLikeShowNum.value = 0
    isLiked.value = false
    videoStarShowNum.value = 0
    isStarred.value = false
    refreshVideoLikeAndStar()
    isProcessStar.value = false
    isProcessLike.value = false
    refreshRootCommentList()
    relatedList.splice(0)

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
  // 在组件挂载后，可以访问子组件的 $refs 属性

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
    ).then((comment) => {
      newCommentContent.value = ''
      refreshRootCommentList()
    })
  }
}

interface CommentFinder {
  children?: CommentFinder
  index: number
}

const onRefreshComment = (object: CommentFinder) => {
  refreshRootCommentList(object)
}

const isLiked = ref(false)
const isProcessLike = ref(true)
const videoLikeUsers = reactive<User[]>([])
const videoLikeShowNum = ref(0)

const isStarred = ref(false)
const isProcessStar = ref(true)
const videoStarUsers = reactive<User[]>([])
const videoStarShowNum = ref(0)

const refreshVideoLikeAndStar = () => {
  getVideoActionUsersByVideoId(parseInt(props.video_id), 'like').then((users) => {
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
    setTimeout(() => {
      isProcessLike.value = false
    }, 1000)
  })
  getVideoActionUsersByVideoId(parseInt(props.video_id), 'star').then((users) => {
    videoStarUsers.splice(0)
    videoStarShowNum.value = 0
    isStarred.value = false
    users.forEach((user) => {
      if (user.id === userStore.getCurrentUser.id) {
        isStarred.value = true
      }
      videoStarShowNum.value++
      videoStarUsers.push(user)
    })
    setTimeout(() => {
      isProcessStar.value = false
    }, 1000)
  })
}

const handleClickLike = () => {
  if (isProcessLike.value) {
    debounce(() => {
      isProcessLike.value = false
    }, 3000)
  } else {
    isProcessLike.value = true
    likeOrStarVideoOrNot(
      parseInt(props.video_id),
      userStore.getCurrentUser.id,
      !isLiked.value,
      'like'
    ).then(() => {
      refreshVideoLikeAndStar()
    })
    isLiked.value = !isLiked.value
  }
}
const handleClickStar = () => {
  if (isProcessStar.value) {
    debounce(() => {
      isProcessStar.value = false
    }, 3000)
  } else {
    isProcessStar.value = true
    likeOrStarVideoOrNot(
      parseInt(props.video_id),
      userStore.getCurrentUser.id,
      !isStarred.value,
      'star'
    ).then(() => {
      refreshVideoLikeAndStar()
    })
    isStarred.value = !isStarred.value
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
              <a-list-item @click="handleClickStar" class="star-action">
                <span class="star-icon"><IconStarFill v-if="isStarred" /><IconStar v-else /></span>
                <span>{{ videoStarShowNum }}</span>
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
            :image-url="author?.avatar"
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
            v-for="(comment, index) in comments.filter((e) => e !== undefined)"
            :comment="comment as Comment"
            :key="index"
            :index="index"
            :video="video"
            @delete="
              (index) => {
                delete comments[index]
              }
            "
            @refresh="
              (object) => {
                onRefreshComment(object)
              }
            "
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
