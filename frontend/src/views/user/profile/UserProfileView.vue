<template>
  <div class="container" id="user-profile">
    <div class="main-container">
      <!--      <div class="background"></div>-->
      <Breadcrumb :items="['menu.user']" :addition-items="[queryUser?.nickname]" />
      <UserPanel :user-data="queryUser" />
      <div class="videos-container">
        <a-tabs>
          <template #extra>
            <a-input-search placeholder="搜索你发布的内容" />
          </template>
          <a-tab-pane key="1" title="作品 11"><VideoCards /></a-tab-pane>
          <a-tab-pane key="2" title="喜欢">喜欢</a-tab-pane>
          <a-tab-pane key="3" title="收藏"> Content of Tab Panel 3 </a-tab-pane>
        </a-tabs>
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
import { ref } from 'vue'
import type { User } from '@/store/user'

const props = defineProps<{
  user_id: string
}>()
const userStore = useUserStore()
const queryUser = ref<User | undefined>(undefined)

userStore.getUserById(props.user_id).then((user) => {
  queryUser.value = user
})
import BasicInformation from './components/basic-information.vue'
import SecuritySettings from './components/security-settings.vue'
import VideoCards from '@/views/user/profile/components/video-cards.vue'
// import Certification from './components/certification.vue'
</script>

<style scoped lang="less">
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
