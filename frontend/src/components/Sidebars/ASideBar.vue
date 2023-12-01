<script setup lang="ts"></script>

<template>
  <div class="menu-demo">
    <a-menu mode="vertical" :default-selected-keys="['1']" style="width: min-content">
      <a-menu-item key="0" style="padding: 0; /*margin-right: 38px;*/ margin-right: 0" disabled>
        <div
          class="logo"
          style="
            /*width: min-content;*/
            /*width: 80px;*/
            width: 100%;
            height: 30px;
            border-radius: 2px;
            background: var(--color-fill-3);
            cursor: text;
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
  width: 100%;
  * {
    background-color: transparent !important;
  }
  //padding: 40px;
  //background-color: var(--color-neutral-2);
}
</style>
