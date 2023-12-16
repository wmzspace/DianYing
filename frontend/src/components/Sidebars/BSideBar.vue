<template>
  <!--  <div class="logo border-4">-->
  <!--    &lt;!&ndash;    <div><a class="logo-img"></a></div>&ndash;&gt;-->
  <!--    后台管理系统-->
  <!--  </div>-->
  <a-menu :defaultOpenKeys="['1']" :defaultSelectedKeys="['0_1']" @menuItemClick="onClickMenuItem">
    <a-menu-item key="0_1">
      <IconHome />
      首页
    </a-menu-item>
    <a-menu-item key="0_2">
      <IconCalendar />
      Menu 2
    </a-menu-item>
    <a-sub-menu key="1">
      <template #title>
        <span><IconCalendar />Navigation 1</span>
      </template>
      <a-menu-item key="1_1">Menu 1</a-menu-item>
      <a-menu-item key="1_2">Menu 2</a-menu-item>
      <a-sub-menu key="2" title="Navigation 2">
        <a-menu-item key="2_1">Menu 1</a-menu-item>
        <a-menu-item key="2_2">Menu 2</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="3" title="Navigation 3">
        <a-menu-item key="3_1">Menu 1</a-menu-item>
        <a-menu-item key="3_2">Menu 2</a-menu-item>
        <a-menu-item key="3_3">Menu 3</a-menu-item>
      </a-sub-menu>
    </a-sub-menu>
  </a-menu>
</template>
<script setup lang="ts">
import { Message } from '@arco-design/web-vue'

const onClickMenuItem = (key: string) => {
  Message.info({ content: `You select ${key}`, showIcon: true })
}
</script>
