<script setup lang="ts">
// import { Icon } from '@arco-design/web-vue'
//
// const IconFont = Icon.addFromIconFontCn({
//   src: 'https://at.alicdn.com/t/font_180975_ue66sq60vyd.js'
// })
</script>

<template>
  <div id="a-side-bar">
    <div class="logo">
      <div><a class="logo-img"></a></div>
    </div>
    <a-menu mode="vertical" :default-selected-keys="['1']" class="nav-menu">
      <a-menu-item key="1">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>首页</span></div>
        </a>
      </a-menu-item>
      <a-menu-item key="2">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>推荐</span></div>
        </a>
      </a-menu-item>
      <a-menu-item key="3">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>关注</span></div>
        </a></a-menu-item
      >
      <a-menu-item key="4">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>朋友</span></div>
        </a></a-menu-item
      >
      <a-menu-item key="5">
        <a class="nav-a">
          <div class="nav-icon"></div>
          <div class="nav-text"><span>我的</span></div>
        </a></a-menu-item
      >
    </a-menu>
  </div>
</template>
