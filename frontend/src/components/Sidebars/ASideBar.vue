<script setup lang="ts"></script>

<template>
  <div class="menu-demo border">
    <a-menu mode="vertical" :default-selected-keys="['1']" style="width: min-content">
      <a-menu-item key="0" style="padding: 0; /*margin-right: 38px;*/ margin-right: 0" disabled>
        <div
          class="logo"
          style="
            /*width: min-content;*/
            /*width: 80px;*/
            margin: 10px 0 10px 10px;
            border: thin solid red;
            /*width: 100%;*/
            color: white;
            border-radius: 2px;
            /*background-color: transparent !important;*/
            /*background-color: var(--color-fill-3);*/
            /*cursor: text;*/
          "
        ></div>
      </a-menu-item>
      <a-menu-item key="1">首页</a-menu-item>
      <a-menu-item key="2">推荐</a-menu-item>
      <a-menu-item key="3">关注</a-menu-item>
      <a-menu-item key="4">朋友</a-menu-item>
      <a-menu-item key="5">我的</a-menu-item>
    </a-menu>
  </div>
</template>

<style scoped lang="scss"></style>
