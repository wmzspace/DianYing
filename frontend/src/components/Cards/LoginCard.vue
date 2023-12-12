<script lang="ts" setup>
import { useMainStore } from '@/store/main'
import type { CSSProperties } from 'vue'

const mainStore = useMainStore()
const onLoginOk = () => {}

const onLoginCancel = () => {}

const maskStyle: CSSProperties = {
  background:
    'url(https://p3-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/login-resetpwd-bg.png) 0% 0% / 100% no-repeat rgb(255, 255, 255);'
}
</script>

<template>
  <a-modal id="login-panel" v-model:visible="mainStore.loginModalVisible" :footer="false">
    <template #title>
      <div class="arco-modal-title-text">登录后免费畅享更多功能</div>
      <a-list class="arco-modal-title-desc" action-layout="vertical" :bordered="false">
        <a-list-item>
          点赞评论随心发
          <a-list-item-meta>
            <template #avatar>
              <a-avatar shape="square" :size="15">
                <img alt="avatar" :src="'images/login/heart.png'" /> </a-avatar
            ></template>
          </a-list-item-meta>
        </a-list-item>
        <a-list-item>
          视频个性化推荐
          <a-list-item-meta>
            <template #avatar>
              <a-avatar shape="square" :size="15">
                <img alt="avatar" :src="'images/login/live.png'" /> </a-avatar
            ></template>
          </a-list-item-meta>
        </a-list-item>
        <a-list-item>
          朋友视频一键览
          <a-list-item-meta>
            <template #avatar>
              <a-avatar shape="square" :size="15">
                <img alt="avatar" :src="'images/login/friends.png'" /> </a-avatar
            ></template>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </template>
    <div></div>
  </a-modal>
</template>

<style scoped></style>
