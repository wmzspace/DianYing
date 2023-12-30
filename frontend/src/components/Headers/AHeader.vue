<script setup lang="ts">
import type { ButtonProps } from '@arco-design/web-vue'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { guestUser, useUserStore } from '@/store/user'
import { useMainStore } from '@/store/main'
import { getVideoInfoAll, getVideosByUserLikeOrStar, pullVideo } from '@/utils/video'
import type { VideoMedia } from '@/types'
import IconCommunity from '@/components/icons/IconCommunity.vue'
import useLoading from '@/hooks/loading'
import type { TableData } from '@arco-design/web-vue/es/table/interface'
import { getRankings } from '@/utils/tools'
import type { VideoRecord } from '@/api/list'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const storedTokenValue = computed({
  get: () => userStore.isStoredToken,
  set: (value) => {
    userStore.setStoreToken(value)
  }
})
const mainStore = useMainStore()
const searchButtonProps: ButtonProps = {
  // type: 'dashed',
  long: true
}

const searchBar = ref()
const setSearchBarPopWidth = () => {
  let searchBarWidth = document.querySelector('#a-header .search-bar')?.clientWidth
  nextTick(() => {
    let searchBarPopover: HTMLElement | null = document.getElementById(
      'popover-a-search'
    ) as HTMLElement | null
    if (searchBarPopover !== null) {
      searchBarPopover.style.width = `${searchBarWidth}px`
    }
  })
}

const handleSwitchUser = () => {
  mainStore.setLoginVisible(true)
}
const handleLogOut = () => {
  userStore.userLogOut()
  // mainStore.setLoginVisible(true)
  // location.reload()
}

const videoLikeNum = ref(0)
const videoStarNum = ref(0)
const videoOwnNum = ref(0)

watch(
  () => userStore.isUserNotAdmin(),
  () => {
    if (userStore.isUserNotAdmin()) {
      getVideosByUserLikeOrStar(userStore.getCurrentUserNotAdmin.id, 'star').then((videos) => {
        videoStarNum.value = videos.length
      })
      getVideosByUserLikeOrStar(userStore.getCurrentUserNotAdmin.id, 'like').then((videos) => {
        videoLikeNum.value = videos.length
      })
      pullVideo().then((videos) => {
        videoOwnNum.value = videos.filter(
          (v) =>
            userStore.getCurrentUserNotAdmin.id &&
            v.authorId === userStore.getCurrentUserNotAdmin.id
        ).length
      })
    }
  }
)

const { loading, setLoading } = useLoading()
const renderList = ref<VideoRecord[]>([])
const rankingArr = computed(() => getRankings(renderList.value.map((e) => e.playCount)))

const refreshSearchContent = () => {
  setLoading(true)
  getVideoInfoAll()
    .then((records) => {
      renderList.value = records
        .filter((record) => record.status === 'online')
        .sort((a, b) => b.playCount - a.playCount)
    })
    .finally(() => {
      setLoading(false)
    })
}

const searchPopVisible = ref(false)

const router = useRouter()

const handleSearch = (value: string) => {
  router.push({ name: 'search', query: { search: value } }).finally(() => {
    searchPopVisible.value = false
  })
}
</script>

<template>
  <div id="a-header">
    <header>
      <a-popover
        v-model:popup-visible="searchPopVisible"
        position="bottom"
        id="popover-a-search"
        :trigger="['hover', 'focus']"
        @popup-visible-change="
          (visible) => {
            if (visible) {
              setSearchBarPopWidth()
              refreshSearchContent()
            }
          }
        "
      >
        <a-input-search
          class="search-bar"
          placeholder="搜索您感兴趣的内容"
          search-button
          :button-props="searchButtonProps"
          ref="searchBar"
          @search="handleSearch"
          @keydown.enter="
            (e: any) => {
              handleSearch(e.target.value)
            }
          "
        >
          <template #button-icon>
            <icon-search :stroke-width="8" :size="15" style="margin-right: -4px" />
          </template>
          <template #button-default> 搜索</template>
        </a-input-search>
        <template #content>
          <div class="search-title">猜你想搜</div>
          <a-divider class="search-bar-divider"></a-divider>
          <div class="search-title">
            点映热点
            <span v-if="loading && renderList.length > 0" style="margin-left: 5px"
              >更新中 <icon-loading /></span
            ><icon-fire v-else />
          </div>
          <a-list class="hot-list" :bordered="false" :split="false">
            <template #empty>
              <div style="padding: 10px 0; color: white">加载中 <icon-loading /></div
            ></template>

            <a-list-item
              v-for="(video, idx) in renderList.slice(0, 5)"
              :key="idx"
              class="hot-item"
              @click="
                () => {
                  $router.push({
                    name: 'videoDetail',
                    params: { video_id: video.videoId },
                    query: { validate: 'ignore' }
                  })
                  searchPopVisible = false
                }
              "
            >
              <a-list-item-meta>
                <template #description>
                  <div class="one-line">
                    <span
                      ><a-tag
                        :color="
                          (() => {
                            switch (rankingArr[idx] - 1) {
                              case 0:
                                return 'red'
                              case 1:
                                return 'orangered'
                              case 2:
                                return 'orange'
                              default:
                                return 'white'
                            }
                          })()
                        "
                        bordered
                        style="background: transparent; margin: 3px 10px 3px 0; font-weight: bold"
                        >Top{{ rankingArr[idx] - 1 }}</a-tag
                      ></span
                    >
                    <span class="hot-title">{{ video.videoTitle }}</span>
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </template>
      </a-popover>

      <a-menu
        mode="horizontal"
        :default-selected-keys="['1']"
        style="background-color: transparent"
        class="nav-menu"
        align="right"
      >
        <a-menu-item disabled v-show="false">
          <a-trigger :trigger="['click']" :unmount-on-close="false">
            <a-button
              ><p class="nav-text">通知</p>
              <template #icon>
                <icon-notification style="color: white; width: 100%; margin: 0" />
              </template>
            </a-button>
            <template #content>
              <div>
                <a-empty />
              </div>
            </template>
          </a-trigger>
        </a-menu-item>
        <a-menu-item disabled v-show="false">
          <a-trigger :trigger="['click']" :unmount-on-close="false">
            <a-button
              ><p class="nav-text">私信</p>
              <template #icon>
                <icon-message style="color: white; width: 100%; margin: 0" />
              </template>
            </a-button>
            <template #content>
              <div>
                <a-empty />
              </div>
            </template>
          </a-trigger>
        </a-menu-item>
        <a-menu-item v-if="userStore.isUserNotAdmin()" disabled>
          <a-button
            @click="
              $router.push({
                name: 'postVideo'
              })
            "
            ><p class="nav-text">投稿</p>
            <template #icon>
              <icon-share-external style="color: white; width: 100%; margin: 0" />
            </template>
          </a-button>
        </a-menu-item>
        <a-menu-item v-if="userStore.isAdmin" disabled>
          <a-button
            @click="
              $router.push({
                name: 'dashboard'
              })
            "
            ><p class="nav-text">管理后台</p>
            <template #icon>
              <icon-command style="color: white; width: 100%; margin: 0" />
            </template>
          </a-button>
        </a-menu-item>
        <a-menu-item disabled>
          <a-popover position="br" id="popover-a-avatar" :trigger="['click', 'hover']">
            <a-button
              class="button"
              v-if="userStore.userData !== undefined || userStore.isAdmin"
              @click="
                () => {
                  if (!userStore.isAdmin) {
                    $router.push({
                      name: 'userProfile',
                      params: { user_id: userStore.getCurrentUserNotAdmin.id }
                    })
                  }
                }
              "
            >
              <a-avatar>
                <img alt="avatar" :src="userStore.getUserAvatar" />
              </a-avatar>
            </a-button>
            <a-button class="header-login-btn" @click="mainStore.setLoginVisible(true)" v-else
              >登录</a-button
            >
            <template #title>
              <div class="profile-header">
                <!--                <div class="basic-info">-->
                <!--                  <a-avatar>-->
                <!--                    <img alt="avatar" src="/images/avatar.jpeg" />-->
                <!--                  </a-avatar>-->
                <div
                  class="name"
                  @click="
                    () => {
                      if (!userStore.isAdmin) {
                        $router.push({
                          name: 'userProfile',
                          params: { user_id: userStore.getCurrentUserNotAdmin.id }
                        })
                      }
                    }
                  "
                  style="cursor: pointer"
                >
                  {{ userStore.getUserNickname }}
                  <icon-right />
                </div>
                <!--                  <div class="statistic">-->
                <!--                    <span> 关注 <span>10</span></span>-->
                <!--                    <span> 粉丝 <span>8000</span></span>-->
                <!--                  </div>-->
                <div
                  class="trust-login-switch"
                  v-if="userStore.isAdmin || userStore.userData !== undefined"
                >
                  <span class="trust-login-switch-title">保存登录信息</span>
                  <a-switch
                    class="trust-login-switch-button"
                    size="small"
                    unchecked-color="rgba(255,255,255,0.2)"
                    checked-color="rgb(254, 44, 85)"
                    v-model:model-value="storedTokenValue"
                  />
                </div>
                <div v-else class="guest-replace-trust-login">登录后可查看喜欢收藏历史</div>
                <!--                  </div>-->
              </div>
            </template>
            <template #content>
              <a-list
                :bordered="false"
                @click="
                  () => {
                    if (!userStore.isAdmin) {
                      $router.push({
                        name: 'userProfile',
                        params: { user_id: userStore.getCurrentUserNotAdmin.id }
                      })
                    }
                  }
                "
                style="cursor: pointer"
              >
                <a-list-item>
                  <a-statistic :value="videoOwnNum" :precision="0">
                    <template #title>
                      <a-image
                        src="/images/my_works.svg"
                        style="margin: 0 auto"
                        :preview-visible="false"
                      />
                    </template>
                    <template #extra>
                      <p>我的作品</p>
                    </template>
                  </a-statistic>
                </a-list-item>
                <a-list-item>
                  <a-statistic :value="videoLikeNum" :precision="0">
                    <template #title>
                      <a-image
                        src="/images/my_likes.svg"
                        style="margin: 0 auto"
                        :preview-visible="false"
                      />
                    </template>
                    <template #extra>
                      <p>我的喜欢</p>
                    </template>
                  </a-statistic>
                </a-list-item>
                <a-list-item>
                  <a-statistic :value="videoStarNum" :precision="0">
                    <template #title>
                      <a-image
                        src="/images/my_favorites.svg"
                        style="margin: 0 auto"
                        :preview-visible="false"
                      />
                    </template>
                    <template #extra>
                      <p>我的收藏</p>
                    </template>
                  </a-statistic>
                </a-list-item>
                <a-list-item>
                  <a-statistic :value="30" :precision="0">
                    <template #title>
                      <a-image
                        src="/images/my_histories.svg"
                        style="margin: 0 auto"
                        :preview-visible="false"
                      />
                    </template>
                    <template #suffix><span>天内</span></template>
                    <template #extra>
                      <p>观看历史</p>
                    </template>
                  </a-statistic>
                </a-list-item>
              </a-list>

              <a-divider />
              <a-space class="profile-menu" v-if="userStore.isAdmin || userStore.getCurrentUser">
                <a-menu class="profile-menu-left" :mode="'horizontal'">
                  <a-menu-item @click="handleSwitchUser">
                    <span>切换账号</span>
                  </a-menu-item>
                  <a-menu-item @click="handleLogOut">
                    <span>退出登录</span>
                  </a-menu-item>
                  <a-menu-item v-if="userStore.isAdmin" @click="$router.replace('/admin')">
                    <span>登录后台</span>
                  </a-menu-item>
                </a-menu>
                <a-divider direction="vertical" :mode="'horizontal'" />
                <a-menu class="profile-menu-right">
                  <a-menu-item disabled>
                    <img src="/images/theme.svg" align="center" />
                    <span style="opacity: 0.34">换肤</span>
                  </a-menu-item>
                  <a-menu-item disabled>
                    <img src="/images/settings.svg" align="center" />
                    <span style="opacity: 0.34">设置</span>
                  </a-menu-item></a-menu
                >
              </a-space>
            </template>
          </a-popover>
        </a-menu-item>
      </a-menu>
    </header>
  </div>
</template>

<style scoped lang="scss"></style>
