<template>
  <a-layout id="layout-b">
    <a-layout-header>
      <BHeader />
    </a-layout-header>

    <a-layout>
      <a-layout-sider
        theme="light"
        breakpoint="lg"
        collapsible
        :collapsed="collapsed"
        @collapse="setCollapsed"
      >
        <BSideBar
      /></a-layout-sider>

      <a-layout class="layout-content" :style="paddingStyle">
        <!--        <a-breadcrumb :style="{ margin: '16px 0' }">-->
        <!--          <a-breadcrumb-item>Home</a-breadcrumb-item>-->
        <!--          <a-breadcrumb-item>List</a-breadcrumb-item>-->
        <!--          <a-breadcrumb-item>App</a-breadcrumb-item>-->
        <!--        </a-breadcrumb>-->
        <!--        <a-tabs-->
        <!--          class="top-tabs"-->
        <!--          type="card-gutter"-->
        <!--          :editable="true"-->
        <!--          @add="handleAdd"-->
        <!--          @delete="handleDelete"-->
        <!--          auto-switch-->
        <!--        >-->
        <!--          <a-tab-pane-->
        <!--            v-for="(item, index) of data"-->
        <!--            :key="item.key"-->
        <!--            :title="item.title"-->
        <!--          ></a-tab-pane>-->
        <!--        </a-tabs>-->
        <RouterView />
        <!--        <a-layout-content>Content</a-layout-content>-->
        <!--        <a-layout-footer>Footer</a-layout-footer>-->
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script setup lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import BSideBar from '@/components/Sidebars/BSideBar.vue'
import BHeader from '@/components/Headers/BHeader.vue'
import { useAppStore } from '@/store'
import { onBeforeRouteUpdate } from 'vue-router'
const appStore = useAppStore()
const isInit = ref(false)
// const onCollapse = (val, type) => {
//   const content = type === 'responsive' ? '触发响应式收缩' : '点击触发收缩'
//   Message.info({
//     content,
//     duration: 2000
//   })
//   collapsed.value = val
// }
const navbarHeight = `60px` // $nav-size-height
const navbar = computed(() => appStore.navbar)
const renderMenu = computed(() => appStore.menu && !appStore.topMenu)
const hideMenu = computed(() => appStore.hideMenu)
const footer = computed(() => appStore.footer)
const menuWidth = computed(() => {
  return appStore.menuCollapse ? 68 : appStore.menuWidth
})
const collapsed = computed(() => {
  return appStore.menuCollapse
})
const paddingStyle = computed(() => {
  const paddingLeft =
    renderMenu.value && !hideMenu.value ? { paddingLeft: `${menuWidth.value}px` } : {}
  const paddingTop = navbar.value ? { paddingTop: navbarHeight } : {}
  return { ...paddingLeft, ...paddingTop }
})
const setCollapsed = (val: boolean) => {
  if (!isInit.value) return // for page initialization menu state problem
  appStore.updateSettings({ menuCollapse: val })
}

const data = ref([
  {
    key: '1',
    title: 'Menu 1',
    content: 'Content of Tab Panel 1'
  }
])
const count = ref(5)
const handleAdd = () => {
  const number = count.value++
  data.value = data.value.concat({
    key: `${number}`,
    title: `New Tab ${number}`,
    content: `Content of New Tab Panel ${number}`
  })
}
const handleDelete = (key) => {
  data.value = data.value.filter((item) => item.key !== key)
}

onMounted(() => {
  isInit.value = true
})
</script>
<style scoped lang="scss"></style>
