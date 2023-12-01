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
            border-radius: 2px;
            /*background-color: transparent !important;*/
            /*background-color: var(--color-fill-3);*/
            /*cursor: text;*/
          "
        />
      </a-menu-item>
      <a-menu-item key="1">Home</a-menu-item>
      <a-menu-item key="2">Solution</a-menu-item>
      <a-menu-item key="3">Cloud Service</a-menu-item>
      <a-menu-item key="4">Cooperation</a-menu-item>
    </a-menu>
  </div>
</template>

<style scoped lang="scss">
.menu-demo {
  box-sizing: border-box;
  //width: 100%;
  height: 100%;
  width: min-content;
  * {
    background-color: transparent !important;
  }

  //padding: 40px;
  //background-color: var(--color-neutral-2);
}
</style>
