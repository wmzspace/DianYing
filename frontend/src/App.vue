<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
// 配置布局
const layout = computed(() => 'layout-' + ((route.meta.layout as string) || 'a').toLowerCase())
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
