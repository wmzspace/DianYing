<script setup lang="ts">
import { onBeforeRouteUpdate, RouterView, useRoute } from 'vue-router'
import { computed, onBeforeMount, onMounted } from 'vue'
import { adminUser, useUserStore } from '@/store/user/'
import LoginCard from '@/components/Cards/LoginCard.vue'
import { useMainStore } from '@/store/main'
// import { useUserStore } from '@/store'
// import { useStore } from '@/store'

const route = useRoute()
// 配置布局
const layout = computed(() => 'layout-' + ((route.meta.layout as string) || 'a').toLowerCase())

const mainStore = useMainStore()
const userStore = useUserStore()
import useLocale from '@/hooks/locale'
import enUS from '@arco-design/web-vue/es/locale/lang/en-us'
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn'
import { Message } from '@arco-design/web-vue'

const { currentLocale } = useLocale()
const locale = computed(() => {
  switch (currentLocale.value) {
    case 'zh-CN':
      return zhCN
    case 'en-US':
      return enUS
    default:
      return enUS
  }
})

onBeforeMount(() => {
  const storedUser = localStorage.getItem('currentUser') as string | null
  if (storedUser === null) {
    // no storedUser
    userStore.isStoredToken = false
  } else if (storedUser === adminUser.nickname) {
    // storedUser is admin nickname
    userStore.isStoredToken = true
    userStore.adminLogin()
  } else {
    // storedUser is userId
    userStore.isStoredToken = true
    userStore.userLogin(storedUser)
  }
})

// onBeforeRouteUpdate(() => {
//
// })

onMounted(() => {
  document.documentElement.style.height = `${window.innerHeight}px`
  window.addEventListener('resize', () => {
    document.documentElement.style.height = `${window.innerHeight}px`
  })
  const firstTime = localStorage.getItem('firstTime')
  if (firstTime == null) {
    mainStore.setLoginVisible(true)
    localStorage.setItem('firstTime', 'true')
  }
})
</script>

<template>
  <!-- Component Library Config Provider-->
  <a-config-provider :locale="locale">
    <!--    Layout & Router View-->

    <component :is="layout">
      <!--      <router-view />-->
    </component>
    <!--    Layout & Router View-->
    <LoginCard />
  </a-config-provider>
  <!-- Component Library Config Provider-->

  <!--    <header>-->
  <!--      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />-->
  <!--      <div class="wrapper">-->
  <!--        <HelloWorld msg="You did it!" />-->
  <!--        <nav>-->
  <!--          <RouterLink to="/">Home</RouterLink>-->
  <!--          <RouterLink to="/about">About</RouterLink>-->
  <!--        </nav>-->
  <!--      </div>-->
  <!--    </header>-->
  <!--  <div class="test">-->
  <!--    <RouterView />-->
  <!--  </div>-->
</template>

<style>
:root {
  --color-primary: #fe2c55;
  --color-primary-hover: rgba(var(--primary-600), 1);
  --color-primary-active: rgba(var(--primary-700), 1);
  --color-primary-disable: rgba(var(--primary-100), 0.4);
  --color-primary-default: rgba(var(--primary-500), 1);
  --color-secondary-default: rgba(var(--neutral-100), 0.08);
  --color-secondary-hover: rgba(var(--neutral-100), 0.12);
  --color-secondary-active: rgba(var(--neutral-100), 0.16);
  --color-secondary-disable: rgba(var(--neutral-100), 0.04);
  --color-tertiary-default: rgba(var(--white), 0);
  --color-tertiary-hover: rgba(var(--white), 0.04);
  --color-tertiary-active: rgba(var(--white), 0.08);
  --color-tertiary-disable: rgba(var(--white), 0);
  --color-bg-b0: rgba(var(--neutral-950), 1);
  --color-bg-b1: rgba(var(--neutral-900), 1);
  --color-bg-b2: rgba(var(--neutral-800), 1);
  --color-bg-b3: rgba(var(--neutral-700), 1);
  --color-bg-nav: rgba(var(--neutral-1000), 1);
  --color-bg-toast: rgba(var(--neutral-800), 1);
  --color-bg-b1-white: rgba(var(--neutral-900), 1);
  --color-bg-b2-white: rgba(var(--neutral-800), 1);
  --color-bg-b3-white: rgba(var(--neutral-700), 1);
  --color-fill-hover: rgba(var(--neutral-100), 0.08);
  --color-fill-press: rgba(var(--neutral-100), 0.12);
  --color-fill-tag: rgba(var(--primary-500), 0.12);
  --color-fill-tag-grey: rgba(var(--white), 0.15);
  --color-fill-live: linear-gradient(131.17deg, #ff1764 0%, #ed3495 94.15%);
  --color-fill-hot: linear-gradient(268.09deg, #f01b5b 6.38%, #ff5a44 59.9%, #ff9113 91.68%);
  --color-text-t0: rgba(var(--white), 1);
  --color-text-t1: rgba(var(--white), 0.9);
  --color-text-t2: rgba(var(--white), 0.75);
  --color-text-t3: rgba(var(--white), 0.5);
  --color-text-t4: rgba(var(--white), 0.34);
  --color-text-t5: rgba(var(--white), 0.34);
  --color-text-t3-im: rgba(var(--white), 0.3);
  --color-text-live: #8ce7ff;
  --color-line-l1: rgba(var(--white), 0.2);
  --color-line-l2: rgba(var(--white), 0.16);
  --color-line-l3: rgba(var(--white), 0.04);
  --color-mask-m1: rgba(var(--black), 0.9);
  --color-mask-m2: rgba(var(--black), 0.2);
  --color-mask-m3: rgba(var(--black), 0.85);
  --color-link-yellow: rgba(var(--yellow-500), 1);
  --color-semantic-success: rgba(var(--green-500), 1);
  --color-semantic-danger: rgba(var(--orange-red-500), 1);
  --color-semantic-warning: rgba(var(--orange-500), 1);
  --color-const-text-white: rgba(var(--white), 1);
  --color-const-text-black: rgba(var(--black), 1);
  --color-const-text-primary: rgba(var(--neutral-950), 1);
  --color-const-text-white90: rgba(var(--white), 0.9);
  --color-const-text-white75: rgba(var(--white), 0.75);
  --color-const-text-white60: rgba(var(--white), 0.6);
  --color-const-text-white34: rgba(var(--white), 0.34);
  --color-const-bg-white: rgba(var(--white), 1);
  --color-const-bg-white30: rgba(var(--white), 0.3);
  --color-const-line-white: rgba(var(--white), 1);
  --color-const-line-white4: rgba(var(--white), 0.04);
  --color-const-line-white8: rgba(var(--white), 0.08);
  --color-const-line-white12: rgba(var(--white), 0.12);
  --color-shadow1: rgba(0, 0, 0, 0.6);
  --color-shadow2: rgba(0, 0, 0, 0.9);
  --shadow-1: 0 0 24px rgba(0, 0, 0, 0.4);
  --shadow-2: 0 0 24px rgba(0, 0, 0, 0.7);
  --mask3: rgba(0, 0, 0, 0.6);
  --color-page-none-bg: rgba(22, 23, 34, 0);
  --color-logo: #fff;
  --logo-url: url(//lf3-cdn-tos.bytegoofy.com/obj/goofy/ies/douyin_web/media/logo-horizont-dark.68c22817059ee9a7.svg)
    no-repeat;

  --logo-small-url: url(//lf3-cdn-tos.bytegoofy.com/obj/goofy/ies/douyin_web/media/logo-horizontal-small-dark.04fa81ed0b1d6d5e.svg)
    no-repeat;

  --logo-transparent-url: url(//lf3-cdn-tos.bytegoofy.com/obj/goofy/ies/douyin_web/media/logo-horizont-dark.68c22817059ee9a7.svg)
    no-repeat;
  --icon-close: url(//p3-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/icon-close-dark.svg);
  --color-xigua-tab-bg: rgba(255, 255, 255, 0.08);
  --color-xigua-categoryTab-color: rgba(255, 255, 255, 0.75);
  --color-xigua-tab-color: rgba(255, 255, 255, 0.75);
  --color-bg-rs: #292b35;
  --color-primary-disabled: rgba(var(--primary-100), 0.4);
  --color-success: rgba(var(--green-500), 1);
  --color-danger: rgba(var(--orange-red-500), 1);
  --color-warning: rgba(var(--orange-500), 1);
  --overlay-bg: rgba(var(--neutral-100), 0.08);
  --overlay-bg-hover: rgba(var(--neutral-100), 0.12);
  --overlay-bg-active: rgba(var(--neutral-100), 0.16);
  --overlay-bg-disabled: rgba(var(--neutral-100), 0.04);
  --color-text-0: rgba(var(--white), 0.9);
  --color-text-1: rgba(var(--white), 0.75);
  --color-text-2: rgba(var(--white), 0.5);
  --color-text-3: rgba(var(--white), 0.34);
  --color-text-4: rgba(var(--white), 0.34);
  --color-text-0-hover: rgba(var(--white), 1);
  --color-border: rgba(var(--white), 0.2);
  --mask1: rgba(var(--black), 0.9);
  --mask2: rgba(var(--black), 0.9);
  --mask-video: rgba(var(--black), 0.2);
  --color-card-border: rgba(var(--white), 0.16);
  --color-bg-0: rgba(var(--neutral-900), 1);
  --color-bg-1: rgba(var(--neutral-800), 1);
  --color-bg-2: rgba(var(--neutral-700), 1);
  --color-bg-3: rgba(var(--neutral-700), 1);
  --color-navigation-bg: rgba(var(--neutral-1000), 1);
  --color-page-bg: rgba(var(--neutral-950), 1);
  --color-anti-white: rgba(var(--white), 1);
  --color-bg-panel-drawer: rgba(var(--neutral-800), 1);
  --color-bg-skeleton-stroke: rgba(var(--white), 0.04);
  --card-bg-0: rgba(var(--neutral-900), 1);
  --card-bg-0-hover: rgba(var(--neutral-800), 1);
  --color-bg-guide: #1d1e2b;
  --linear-gradient-bg-1: linear-gradient(
    90deg,
    rgba(252, 252, 252, 0.06) 0%,
    rgba(246, 246, 246, 0) 100%
  );
  --linear-gradient-bg-top: linear-gradient(90deg, #323f5a, rgba(50, 63, 90, 0) 100%);
  --linear-gradient-bg-num: linear-gradient(90deg, #403a3a, rgba(64, 58, 58, 0) 100%);
}
</style>
