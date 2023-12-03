<script setup lang="ts">
import type { ButtonProps } from '@arco-design/web-vue'

const searchButtonProps: ButtonProps = {
  // type: 'dashed',
  long: true
}
</script>

<template>
  <div id="a-header">
    <header>
      <a-input-search
        class="search-bar"
        placeholder="搜索您感兴趣的内容"
        search-button
        :button-props="searchButtonProps"
      >
        <template #button-icon>
          <icon-search :stroke-width="8" :size="15" style="margin-right: -4px" />
        </template>
        <template #button-default> 搜索</template>
      </a-input-search>
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
          <a-trigger :trigger="['click']" :unmount-on-close="false">
            <a-button>
              <a-avatar>
                <img alt="avatar" src="/images/avatar.jpeg" />
              </a-avatar>
            </a-button>
            <template #content>
              <div>
                <a-empty />
              </div>
            </template>
          </a-trigger>
        </a-menu-item>

        <!--        <a-menu-item key="2">Solution</a-menu-item>-->
        <!--        <a-menu-item key="3">Cloud Service</a-menu-item>-->
        <!--        <a-menu-item key="4">Cooperation</a-menu-item>-->
      </a-menu>
    </header>
  </div>
</template>

<style scoped></style>
