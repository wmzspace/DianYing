<template>
  <div class="container" id="user-profile">
    <div class="main-container">
      <!--      <div class="background"></div>-->
      <Breadcrumb :items="['menu.user']" :addition-items="[queryUser?.nickName]" />
      <UserPanel
        :user-data="queryUser"
        v-model:is-edit-profile="isEditProfile"
        @change="refreshUserInfo"
      />
      <div v-if="isEditProfile" class="form-container">
        <BasicInformation @update="refreshUserInfo" />
      </div>
      <div v-else class="videos-container">
        <a-tabs>
          <template #extra>
            <a-input-search
              placeholder="按标题或作者筛选内容"
              v-model.trim="searchText"
              :allow-clear="true"
            />
          </template>
          <a-tab-pane key="1" :title="`作品 ${videoListByAuthor.length}`">
            <div class="video-cards-container">
              <div class="action-bar">{{ tabTitlePrefix }}视频</div>
              <div class="content">
                <ul>
                  <li
                    class="list-item"
                    v-for="(video, index) in querySearch(videoListByAuthor)"
                    :key="index"
                  >
                    <video-card-sm :src="video" />
                  </li>
                </ul>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" title="喜欢">
            <div class="video-cards-container">
              <div class="action-bar">{{ tabTitlePrefix }}喜欢</div>
              <div class="content">
                <ul>
                  <li
                    class="list-item"
                    v-for="(video, index) in querySearch(videosLiked)"
                    :key="index"
                  >
                    <video-card-sm :src="video" />
                  </li>
                </ul>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" title="收藏">
            <div class="video-cards-container">
              <div class="action-bar">{{ tabTitlePrefix }}收藏</div>
              <div class="content">
                <ul>
                  <li
                    class="list-item"
                    v-for="(video, index) in querySearch(videosStarred)"
                    :key="index"
                  >
                    <video-card-sm :src="video" />
                  </li>
                </ul>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="4" title="历史记录">
            <div class="video-cards-container">
              <div class="action-bar">观看历史 (最近30天)</div>
              <div class="content">
                <ul>
                  <li
                    class="list-item"
                    v-for="(video, index) in querySearch(videosPlayed)"
                    :key="index"
                  >
                    <video-card-sm :src="video" />
                  </li>
                </ul>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
        <div
          style="
            color: var(--color-text-t4);
            text-align: center;
            white-space: break-spaces;
            font-size: 12px;
            line-height: 20px;
          "
        >
          <a-spin class="load-more" dot v-if="queryUser === undefined" :loading="true" />
          <span v-else>暂时没有更多了</span>
        </div>
      </div>
    </div>
    <!--    <Breadcrumb :items="['menu.user', 'menu.user.setting']" />-->
    <!--    <a-row style="margin-bottom: 16px">-->
    <!--      <a-col :span="24">-->
    <!--            <UserPanel :user-data="queryUser" />-->
    <!--      </a-col>-->
    <!--    </a-row>-->

    <!--    <a-row class="wrapper">-->
    <!--      <a-col :span="24">-->
    <!--        <a-tabs default-active-key="1" type="rounded" class="edit-tabs">-->
    <!--          <a-tab-pane-->
    <!--            key="1"-->
    <!--            :title="$t('userSetting.tab.basicInformation')"-->
    <!--            style="margin-left: -3%"-->
    <!--          >-->
    <!--            <BasicInformation />-->
    <!--          </a-tab-pane>-->
    <!--          &lt;!&ndash;          <a-tab-pane key="2" :title="$t('userSetting.tab.securitySettings')">&ndash;&gt;-->
    <!--          &lt;!&ndash;            <SecuritySettings />&ndash;&gt;-->
    <!--          &lt;!&ndash;          </a-tab-pane>&ndash;&gt;-->
    <!--        </a-tabs>-->
    <!--      </a-col>-->
    <!--    </a-row>-->
  </div>
</template>

<script lang="ts" setup>
import UserPanel from './components/user-panel.vue'
import { useUserStore } from '@/store'
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'

const props = defineProps<{
  user_id: string
}>()

const isEditProfile = ref(false)

const tabTitlePrefix = computed(() =>
  userStore.getCurrentUser &&
  !userStore.isAdmin &&
  userStore.getCurrentUserNotAdmin.id.toString() === props.user_id
    ? '我的'
    : 'TA的'
)

const searchText = ref('')
const userStore = useUserStore()
const queryUser = ref<UserRecord | undefined>(undefined)

const refreshUserInfo = () => {
  isEditProfile.value = false
  userStore.getUserInfoById(props.user_id).then((user) => {
    queryUser.value = user
  })
}

watch(
  () => userStore.userData,
  () => {
    refreshUserInfo()
  }
)

watch(
  () => props.user_id,
  () => {
    refreshUserInfo()
  }
)

let videoList: VideoMedia[] = reactive([])

const querySearch = (videos: VideoMedia[]) => {
  return videos.filter((v) => v.title.includes(searchText.value))
}

const videoListByAuthor = computed(() =>
  videoList.filter(
    (v) =>
      queryUser.value &&
      v.authorId === queryUser.value.id &&
      (v.status === 'online' || userStore.isAdminOrCurUser(props.user_id))
  )
)

const videosLiked: VideoMedia[] = reactive([])
const videosStarred: VideoMedia[] = reactive([])
const videosPlayed: VideoMedia[] = reactive([])

pullVideo({
  allStatus: 'all'
}).then((videos) => {
  videos.forEach((video) => {
    videoList.push(video)
  })
})

getVideosByUserLikeOrStar(props.user_id, 'like').then((videos) => {
  videosLiked.slice(0)
  videos.forEach((v) => {
    if (v.status === 'online' || userStore.isAdminOrCurUser(props.user_id)) {
      videosLiked.push(v)
    }
  })
})

getVideosByUserLikeOrStar(props.user_id, 'star').then((videos) => {
  videosStarred.slice(0)
  videos.forEach((v) => {
    if (v.status === 'online' || userStore.isAdminOrCurUser(props.user_id)) {
      videosStarred.push(v)
    }
  })
})

getVideosByUserLikeOrStar(props.user_id, 'play').then((videos) => {
  videosPlayed.slice(0)
  videos.forEach((v) => {
    if (v.status === 'online' || userStore.isAdminOrCurUser(props.user_id)) {
      videosPlayed.push(v)
    }
  })
})
refreshUserInfo()

onMounted(() => {})

import VideoCardSm from '@/views/user/profile/components/video-card-sm.vue'
import type { VideoMedia } from '@/types'
import { getVideosByUserLikeOrStar, pullVideo } from '@/utils/video'
import BasicInformation from '@/views/user/profile/components/basic-information.vue'
import type { UserRecord } from '@/api/list'
</script>

<style scoped lang="less">
.video-cards-container {
  .action-bar {
    height: 44px;
    padding: 0;
    display: flex;
    align-items: center;
    font-size: 13px;
    line-height: 21px;
    color: rgba(255, 255, 255, 0.9);
    border-top-color: rgba(255, 255, 255, 0.04);
    border-top-style: solid;
    border-top-width: 0.666667px;
  }

  .content {
    ul {
      flex-wrap: wrap;
      display: flex;
      list-style-type: disc;
      margin: 0;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      width: 100%;
      padding: 0;
      line-height: 0;

      .list-item {
        width: calc(16.66% - 16px);
        padding: 0;
        margin-bottom: 24px;
        margin-right: 16px;
        position: relative;
        user-select: none;
        line-height: 0;
        overflow: hidden;
        list-style: none;
        display: inline-block;
        @media (max-width: 1024px) {
          width: calc(33.33% - 16px);
        }
      }
    }
  }
}

//.container {
//  padding: 0 20px 20px 20px;
//}
//
//.wrapper {
//  padding: 20px 0 0 20px;
//  //min-height: 580px;
//  //background-color: var(--color-bg-2);
//  background-color: rgb(37, 38, 50);
//  //background: transparent;
//  border-radius: 4px;
//}
//
//:deep(.section-title) {
//  margin-top: 0;
//  margin-bottom: 16px;
//  font-size: 14px;
//}
</style>
