<script setup lang="ts">
import type { ButtonProps } from '@arco-design/web-vue'
import { computed, nextTick, onMounted, ref } from 'vue'

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
</script>

<template>
  <div id="a-header">
    <header>
      <a-popover
        position="bottom"
        id="popover-a-search"
        @popup-visible-change="
          (visible) => {
            if (visible) {
              setSearchBarPopWidth()
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
        >
          <template #button-icon>
            <icon-search :stroke-width="8" :size="15" style="margin-right: -4px" />
          </template>
          <template #button-default> 搜索</template>
        </a-input-search>
        <template #content></template>
      </a-popover>

      <a-menu
        mode="horizontal"
        :default-selected-keys="['1']"
        style="background-color: transparent"
        class="nav-menu"
        align="right"
      >
        <a-menu-item disabled>
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
        <a-menu-item disabled>
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
        <a-menu-item disabled>
          <a-trigger :trigger="['click']" :unmount-on-close="false">
            <a-button
              ><p class="nav-text">投稿</p>
              <template #icon>
                <icon-share-external style="color: white; width: 100%; margin: 0" />
              </template>
            </a-button>
            <template #content>
              <div>
                <a-empty />
              </div>
            </template>
          </a-trigger>
        </a-menu-item>
        <a-menu-item disabled>
          <a-popover
            position="br"
            id="popover-a-avatar"
            :trigger="['focus', 'hover']"
            :popup-visible="true"
          >
            <a-button class="button">
              <a-avatar>
                <img alt="avatar" src="/images/avatar.jpeg" />
              </a-avatar>
            </a-button>
            <template #title>
              <div class="profile-header">
                <!--                <div class="basic-info">-->
                <!--                  <a-avatar>-->
                <!--                    <img alt="avatar" src="/images/avatar.jpeg" />-->
                <!--                  </a-avatar>-->
                <div class="name">
                  19岁带饭冲锋🌈
                  <icon-right />
                </div>
                <!--                  <div class="statistic">-->
                <!--                    <span> 关注 <span>10</span></span>-->
                <!--                    <span> 粉丝 <span>8000</span></span>-->
                <!--                  </div>-->
                <div class="trust-login-switch">
                  <span class="trust-login-switch-title">保存登录信息</span>
                  <a-switch
                    class="trust-login-switch-button"
                    size="small"
                    unchecked-color="rgba(255,255,255,0.2)"
                    checked-color="rgb(254, 44, 85)"
                  />
                </div>
                <!--                  </div>-->
              </div>
            </template>
            <template #content>
              <a-list :bordered="false">
                <a-list-item>
                  <a-statistic :value="9" :precision="0">
                    <template #title>
                      <a-image src="/images/my_works.svg" style="margin: 0 auto" />
                    </template>
                    <template #extra>
                      <p>我的作品</p>
                    </template>
                  </a-statistic>
                </a-list-item>
                <a-list-item>
                  <a-statistic :value="1699" :precision="0">
                    <template #title>
                      <a-image src="/images/my_likes.svg" style="margin: 0 auto" />
                    </template>
                    <template #extra>
                      <p>我的喜欢</p>
                    </template>
                  </a-statistic>
                </a-list-item>
                <a-list-item>
                  <a-statistic :value="163" :precision="0">
                    <template #title>
                      <a-image src="/images/my_favorites.svg" style="margin: 0 auto" />
                    </template>
                    <template #extra>
                      <p>我的收藏</p>
                    </template>
                  </a-statistic>
                </a-list-item>
                <a-list-item>
                  <a-statistic :value="30" :precision="0">
                    <template #title>
                      <a-image src="/images/my_histories.svg" style="margin: 0 auto" />
                    </template>
                    <template #suffix><span>天内</span></template>
                    <template #extra>
                      <p>观看历史</p>
                    </template>
                  </a-statistic>
                </a-list-item>
              </a-list>

              <a-divider />
              <a-menu class="profile-menu" :mode="'horizontal'">
                <a-menu-item>
                  <span>切换账号</span>
                </a-menu-item>
                <a-menu-item>
                  <span>退出登录</span>
                </a-menu-item>
                <a-menu-item>
                  <span>创作中心</span>
                </a-menu-item>
                <a-divider direction="vertical" />
                <a-menu-item>
                  <img src="images/theme.svg" align="center" />
                  <span style="opacity: 0.34">换肤</span>
                </a-menu-item>
                <a-menu-item>
                  <img src="images/settings.svg" align="center" />
                  <span style="opacity: 0.34">设置</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-popover>
        </a-menu-item>

        <!--        <a-menu-item key="2">Solution</a-menu-item>-->
        <!--        <a-menu-item key="3">Cloud Service</a-menu-item>-->
        <!--        <a-menu-item key="4">Cooperation</a-menu-item>-->
      </a-menu>
    </header>
  </div>
</template>

<style scoped>
.action {
  display: inline-block;
  padding: 0 4px;
  color: var(--color-text-1);
  line-height: 24px;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.action:hover {
  background: var(--color-fill-3);
}
</style>
