<script lang="ts" setup>
import { useMainStore } from '@/store/main'
import SmsLoginForm from '@/components/Forms/EmailLoginForm.vue'
import PwdLoginForm from '@/components/Forms/PwdLoginForm.vue'
import AdminLoginForm from '@/components/Forms/AdminLoginForm.vue'

const mainStore = useMainStore()
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
    <a-tabs :type="'line'" :size="'medium'" id="login-container" :lazy-load="false" :justify="true">
      <a-tab-pane key="1" title="验证码登录"><SmsLoginForm /></a-tab-pane>
      <a-tab-pane key="2" title="密码登录"><PwdLoginForm /></a-tab-pane>
      <a-tab-pane key="3" title="管理员登录"><AdminLoginForm /></a-tab-pane>
    </a-tabs>
    <div></div>
  </a-modal>
</template>

<style scoped></style>
