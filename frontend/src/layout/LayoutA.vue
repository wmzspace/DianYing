<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ASideBar from '@/components/Sidebars/ASideBar.vue'
import AHeader from '@/components/Headers/AHeader.vue'

const route = useRoute()
const layoutClass = computed(() => route.meta.layoutClass)
</script>

<template>
  <div class="main-background">
    <a-layout
      class="layout-a border-1"
      id="layout-a"
      style="--container-background: linear-gradient(180deg, #060716 80%, #06071600)"
    >
      <!-- Main Sidebar -->
      <a-layout-sider class="border-3">
        <ASideBar />
      </a-layout-sider>
      <!-- / Main Sidebar -->

      <!-- Layout Content -->
      <!--      <a-layout>-->
      <!-- Layout Header's Conditionally Fixed Wrapper -->
      <!--        <DashboardHeader-->
      <!--          :sidebarCollapsed="sidebarCollapsed"-->
      <!--          :navbarFixed="navbarFixed"-->
      <!--          v-model:notifications-data="notificationsData"-->
      <!--          @toggleSettingsDrawer="toggleSettingsDrawer"-->
      <!--          @toggleSidebar="toggleSidebar"-->
      <!--        ></DashboardHeader>-->
      <!-- / Layout Header's Conditionally Fixed Wrapper -->

      <!-- Page Content -->
      <a-layout class="border-1" id="layout-a-right">
        <a-layout-header class="border-2">
          <AHeader />
        </a-layout-header>
        <a-layout-content>
          <router-view />
        </a-layout-content>
      </a-layout>
      <!-- / Page Content -->

      <!-- Layout Footer -->
      <!--        <DashboardFooter></DashboardFooter>-->
      <!-- / Layout Footer -->

      <!-- Floating Action Button For Toggling Settings Drawer -->
      <!--        <a-float-button-group trigger="hover" type="primary" :style="{ right: '24px' }">-->
      <!--          <a-float-button title="查看教程" @click="store.dispatch('changeTourOpen', true)">-->
      <!--            <template #icon> <CustomerServiceOutlined /> </template-->
      <!--          ></a-float-button>-->
      <!--          <a-float-button title="添加账单记录" @click="store.state.newInvoiceVisible = true">-->
      <!--            <template #icon>-->
      <!--              <FormOutlined />-->
      <!--            </template>-->
      <!--          </a-float-button>-->
      <!--        </a-float-button-group>-->
      <!-- / Floating Action Button For Toggling Settings Drawer -->

      <!-- Sidebar Overlay -->
      <!--        <div-->
      <!--          class="sidebar-overlay"-->
      <!--          @click="sidebarCollapsed = true"-->
      <!--          v-show="!sidebarCollapsed"-->
      <!--        ></div>-->
      <!-- / Sidebar Overlay -->
      <!--      </a-layout>-->
      <!-- / Layout Content -->
    </a-layout>
  </div>
</template>

<style scoped></style>
