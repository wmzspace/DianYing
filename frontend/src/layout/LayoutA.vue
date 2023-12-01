<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ASideBar from '@/components/Sidebars/ASideBar.vue'
const route = useRoute()
const layoutClass = computed(() => route.meta.layoutClass)
</script>

<template>
  <div class="main-background">
    <a-layout class="layout-a" id="layout-a">
      <!-- Main Sidebar -->
      <ASideBar></ASideBar>
      <!-- / Main Sidebar -->
    </a-layout>
  </div>
</template>

<style scoped></style>
