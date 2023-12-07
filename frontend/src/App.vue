<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user/'
// import { useUserStore } from '@/store'
// import { useStore } from '@/store'

const route = useRoute()
// 配置布局
const layout = computed(() => 'layout-' + ((route.meta.layout as string) || 'a').toLowerCase())

onMounted(() => {
  const store = useUserStore()
  store.userLogin({
    id: 1,
    name: '19岁带饭冲锋🌈',
    avatar: 'images/avatar.jpeg'
  })
})
</script>

<template>
  <!-- Component Library Config Provider-->
  <a-config-provider>
    <!--    Layout & Router View-->
    <component :is="layout">
      <RouterView />
    </component>
    <!--    Layout & Router View-->
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
