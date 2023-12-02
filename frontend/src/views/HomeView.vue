<script setup lang="ts">
import VideoCard from '@/components/Cards/VideoCard.vue'
</script>

<template>
  <!--  <main>HelloWorld</main>-->
  <!--  <div style="width: 100px; height: 100px; background-color: white">123</div>-->
  <div id="home">
    <div style="flex-grow: 1; position: relative; width: 100%">
      <div id="waterfall-scroll-container">
        <VideoCard class="video-card" />
        <VideoCard class="video-card" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
