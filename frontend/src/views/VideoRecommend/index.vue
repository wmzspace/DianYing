<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { VideoMedia } from '@/types'
import {
  getVideoActionUsersByVideoId,
  getVideoInfoById,
  likeOrStarVideoOrNot,
  pullVideo
} from '@/utils/video'
import PresetPlayer from 'xgplayer'
import Player from 'xgplayer'
import { getTimeDiffUntilNow } from '@/utils/tools'
import type { VideoRecord } from '@/api/list'
import useLoading from '@/hooks/loading'
import { before, debounce } from 'lodash-es'
import { useUserStore } from '@/store'
import { useMainStore } from '@/store/main'
import { useRouter } from 'vue-router'
import _ from 'lodash'
import { Message } from '@arco-design/web-vue'

const currentPlayIndex = ref(0)
const videoList = ref<VideoRecord[]>([])

const loadingObject = useLoading()
const setLoadingVideo = loadingObject.setLoading
const loadingVideo = loadingObject.loading
const players = ref<PresetPlayer[]>([])

const createPlay = (video: VideoRecord) => {
  nextTick(() => {
    const videoElement = document.getElementById('sliderVideo') as HTMLElement | null
    if (videoElement === null) {
      return
    }

    players.value.forEach((player) => {
      player.destroy()
    })

    players.value[0] = new Player({
      el: videoElement.querySelector('.basePlayerContainer') as HTMLElement,
      url: video.url,
      width: '100%',
      height: '100%',
      playNext: {
        urlList: videoList.value.map((v) => v.url)
      },
      autoplay: true,
      autoplayMuted: true,
      // fluid: true,
      dynamicBg: {
        disable: false
      },
      lang: 'zh-cn',
      closeInactive: true,
      marginControls: true,
      cssFullscreen: false
    })
  })
}

const handlePlayPrev = () => {
  if (currentPlayIndex.value > 0) {
    canHandleSwitch.value = false
    currentPlayIndex.value -= 1
    createPlay(videoList.value[currentPlayIndex.value])
    refreshVideoLikeAndStar()
    nextAfterLoad.value = false
    nextTick(() => {
      adjustHeight(true)
    })
  }
}

const nextAfterLoad = ref(false)
const handlePlayNext = () => {
  if (
    !canHandleSwitch.value ||
    (loadingVideo.value && currentPlayIndex.value >= videoList.value.length - 1)
  ) {
    return
  }

  canHandleSwitch.value = false
  if (currentPlayIndex.value < videoList.value.length - 1) {
    currentPlayIndex.value += 1
    createPlay(videoList.value[currentPlayIndex.value])
    refreshVideoLikeAndStar()
  } else {
    Message.loading({
      id: 'loadMore',
      content: '加载中...'
    })
    nextAfterLoad.value = true
    getMoreVideos(5).then(() => {
      Message.success({
        id: 'loadMore',
        content: '更新成功'
      })
      if (nextAfterLoad.value) {
        handlePlayNext()
      }
    })
  }
  nextTick(() => {
    adjustHeight(true)
  })
}

const canHandleSwitch = ref(false)
const handleWheel = (event: WheelEvent) => {
  if (canHandleSwitch.value) {
    const delta = Math.sign(event.deltaY)
    if (delta > 0) {
      if (!loadingVideo.value || currentPlayIndex.value < videoList.value.length - 1) {
        handlePlayNext()
      }
    } else if (delta < 0) {
      if (currentPlayIndex.value > 0) {
        handlePlayPrev()
      }
    }
  }
}

const userStore = useUserStore()
watch(
  () => userStore.userData,
  () => {
    refreshVideoLikeAndStar()
  }
)

const mainStore = useMainStore()
const isProcessLike = ref(false)
const isProcessStar = ref(false)
const currentVideo = computed(() => videoList.value[currentPlayIndex.value])
const isLiked = ref(false)
const isStarred = ref(false)

const videoLikeShowNum = ref(0)
const videoStarShowNum = ref(0)
const refreshVideoLikeAndStar = () => {
  getVideoActionUsersByVideoId(currentVideo.value.videoId, 'like').then((users) => {
    // videoLikeUsers.splice(0)
    videoLikeShowNum.value = 0
    isLiked.value = false
    users.forEach((userId) => {
      if (userStore.getCurrentUser && userId === userStore.getCurrentUser.id) {
        isLiked.value = true
      }
      videoLikeShowNum.value++
      // videoLikeUsers.push(userId)
    })
    setTimeout(() => {
      isProcessLike.value = false
    }, 1000)
  })
  getVideoActionUsersByVideoId(currentVideo.value.videoId, 'star').then((users) => {
    // videoStarUsers.splice(0)
    videoStarShowNum.value = 0
    isStarred.value = false
    users.forEach((userId) => {
      if (userStore.getCurrentUser && userId === userStore.getCurrentUser.id) {
        isStarred.value = true
      }
      videoStarShowNum.value++
      // videoStarUsers.push(user)
    })
    setTimeout(() => {
      isProcessStar.value = false
    }, 1000)
  })
}

const handleClickLike = (videoId: number | string) => {
  userStore
    .checkLogin()
    .then((user) => {
      if (isProcessLike.value) {
        debounce(() => {
          isProcessLike.value = false
        }, 3000)
      } else {
        isProcessLike.value = true
        likeOrStarVideoOrNot(videoId, user.id, !isLiked.value, 'like').then(() => {
          refreshVideoLikeAndStar()
        })
        isLiked.value = !isLiked.value
      }
    })
    .catch(() => {
      mainStore.setLoginVisible(true)
    })
}
const handleClickStar = (videoId: number | string) => {
  userStore
    .checkLogin()
    .then((user) => {
      if (isProcessStar.value) {
        debounce(() => {
          isProcessStar.value = false
        }, 3000)
      } else {
        isProcessStar.value = true
        likeOrStarVideoOrNot(videoId, user.id, !isStarred.value, 'star').then(() => {
          refreshVideoLikeAndStar()
        })
        isStarred.value = !isStarred.value
      }
    })
    .catch(() => {
      mainStore.setLoginVisible(true)
    })
}

const router = useRouter()
const handleClickAvatar = (authorId: number) => {
  console.log(authorId)
  router.push({
    name: 'userProfile',
    params: { user_id: authorId }
  })
}

const slideList = ref()

const parentHeight = ref(0)

const getMoreVideos = (num: number) =>
  new Promise<void>((resolve, reject) => {
    setLoadingVideo(true)
    pullVideo({ num: num }).then((res: VideoMedia[]) => {
      const newVideos: VideoRecord[] = []
      res.forEach((v) => {
        getVideoInfoById(v.id).then((record) => {
          newVideos.push(record)
          if (newVideos.length >= res.length) {
            _.shuffle(newVideos).forEach((video) => {
              videoList.value.push(video)
            })
            nextTick(() => {
              setLoadingVideo(false)
              createPlay(videoList.value[currentPlayIndex.value])
              refreshVideoLikeAndStar()
              resolve()
            })
          }
        })
      })
    })
  })

const adjustHeight = (animation: boolean) => {
  parentHeight.value = slideList.value.offsetHeight
  nextTick(() => {
    const sliderVideo = document.getElementById('sliderVideo') as HTMLElement | null
    if (sliderVideo !== null) {
      slideList.value.style['transition-duration'] = animation ? '250ms' : '0ms'
      slideList.value.style.transform = `translate3d(0px, -${sliderVideo.parentElement?.offsetTop}px, 0px)`
    }
    setTimeout(() => {
      canHandleSwitch.value = true
    }, 500)
  })
}

const resizeEventHandler = () => {
  adjustHeight(false)
}

getMoreVideos(2).then(() => {
  resizeEventHandler()
})

onMounted(() => {
  // resizeEventHandler()
  window.addEventListener('resize', resizeEventHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeEventHandler)
})
</script>

<template>
  <div id="recommend-out-switch-btn">
    <div class="xgplayer-playswitch-tab">
      <div
        class="xgplayer-playswitch-prev"
        :class="{ disabled: currentPlayIndex === 0 }"
        @click="handlePlayPrev"
      >
        <a-image :preview-visible="false" src="/images/recommend/prev.svg"></a-image>
      </div>
      <div
        class="xgplayer-playswitch-next"
        :class="{ disabled: loadingVideo && currentPlayIndex >= videoList.length - 1 }"
        @click="handlePlayNext"
      >
        <a-image :preview-visible="false" src="/images/recommend/next.svg"></a-image>
      </div>
    </div>
  </div>
  <div id="slide-list" @wheel.passive="handleWheel">
    <div class="outer-container">
      <div class="slide-list-container" ref="slideList">
        <div
          class="page-recommend-container"
          v-for="(video, idx) in videoList"
          :key="idx"
          :style="{
            height: `${parentHeight}px`
          }"
        >
          <div class="feed-video" :id="idx === currentPlayIndex ? 'sliderVideo' : undefined">
            <div class="playerContainer">
              <div class="slider-video">
                <div class="basePlayerContainer">
                  <div class="video-info-container">
                    <div class="video-info-container-inner">
                      <div :id="idx === currentPlayIndex ? 'video-info-wrap' : undefined">
                        <div class="video-info-detail">
                          <a-row class="account">
                            <div class="account-name">
                              <span>{{ videoList[idx].authorName }}</span>
                            </div>
                            <div class="video-create-time">
                              <span>· {{ getTimeDiffUntilNow(videoList[idx].publishTime) }}</span>
                            </div>
                          </a-row>
                          <div class="title">
                            <div class="title-container">
                              <div class="title-inner-container">
                                <div class="title-content">
                                  <span>{{ videoList[idx].videoTitle }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="video-action-holder">
                    <div class="video-action-outer-container">
                      <div class="video-action-inner-container">
                        <div class="video-action-item">
                          <div class="video-action-avatar">
                            <a @click="handleClickAvatar(video.authorId)"
                              ><a-avatar :image-url="video.authorAvatar" :size="40"></a-avatar
                            ></a>
                          </div>
                        </div>
                        <div class="video-action-item">
                          <div class="video-action-others">
                            <div class="video-action-icon" @click="handleClickLike(video.videoId)">
                              <a-image
                                :width="45"
                                :height="45"
                                :src="
                                  isLiked
                                    ? '/images/videoDetails/video_detail_liked.svg'
                                    : '/images/videoDetails/video_detail_like.svg'
                                "
                                :preview-visible="false"
                              ></a-image>
                            </div>
                            <div class="video-action-statistic">{{ videoLikeShowNum }}</div>
                          </div>
                        </div>
                        <div class="video-action-item">
                          <div class="video-action-others">
                            <div class="video-action-icon" @click="handleClickStar(video.videoId)">
                              <a-image
                                :width="45"
                                :height="45"
                                :src="
                                  isStarred
                                    ? '/images/videoDetails/starred.svg'
                                    : '/images/videoDetails/star.svg'
                                "
                                :preview-visible="false"
                              ></a-image>
                            </div>
                            <div class="video-action-statistic">{{ videoStarShowNum }}</div>
                          </div>
                        </div>
                        <div class="video-action-item">
                          <div class="video-action-others">
                            <div
                              class="video-action-icon"
                              @click="
                                $router.push({
                                  name: 'videoDetail',
                                  params: { video_id: video.videoId },
                                  query: { validate: 'ignore' }
                                })
                              "
                            >
                              <a-image
                                :width="45"
                                :height="45"
                                src="/images/videoDetails/comment.svg"
                                :preview-visible="false"
                              ></a-image>
                            </div>
                            <div class="video-action-statistic">
                              {{ video.commentCount }}
                            </div>
                          </div>
                        </div>
                        <div
                          class="video-action-item"
                          @click="
                            $router.push({
                              name: 'videoDetail',
                              params: { video_id: video.videoId },
                              query: { validate: 'ignore' }
                            })
                          "
                        >
                          <div class="video-action-others">
                            <div class="video-action-icon">
                              <a-image
                                :width="45"
                                :height="45"
                                src="/images/videoDetails/more.svg"
                                :preview-visible="false"
                              ></a-image>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a-spin
          class="load-more"
          dot
          v-if="loadingVideo"
          :loading="loadingVideo"
          style="margin: auto"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'VideoRecommend'
}
</script>

<style scoped lang="less"></style>
