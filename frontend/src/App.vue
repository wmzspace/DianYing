<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user/'
import LoginCard from '@/components/Cards/LoginCard.vue'
import { useMainStore } from '@/store/main'
// import { useUserStore } from '@/store'
// import { useStore } from '@/store'

const route = useRoute()
// 配置布局
const layout = computed(() => 'layout-' + ((route.meta.layout as string) || 'a').toLowerCase())

const mainStore = useMainStore()
const userStore = useUserStore()

onMounted(() => {
  document.documentElement.style.height = `${window.innerHeight}px`
  window.addEventListener('resize', () => {
    document.documentElement.style.height = `${window.innerHeight}px`
  })
  userStore.isAdmin = true

  // const storedUser = localStorage.getItem('currentUser') as string | null
  // console.log(storedUser)
  // if (storedUser === null) {
  //   //TODO
  //   mainStore.setLoginVisible(true)
  // } else {
  //   userStore.userLogin(storedUser)
  // }
})
</script>

<template>
  <!-- Component Library Config Provider-->
  <a-config-provider>
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
