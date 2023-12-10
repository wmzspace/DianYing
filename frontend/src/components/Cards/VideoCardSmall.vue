<script setup lang="ts">
import type { VideoMedia } from '@/types'
import { onMounted, ref } from 'vue'
import type { User } from '@/store/user'
import { useUserStore } from '@/store/user'
import _ from 'lodash'

const props = defineProps<{
  video: VideoMedia
}>()

const userStore = useUserStore()

const author = ref<User | undefined>(undefined)

onMounted(() => {
  userStore.getUserById(props.video.authorId).then((res) => {
    author.value = res
  })
})
</script>

<template>
  <a-list-item action-layout="vertical">
    <template #extra>
      <router-link :to="`/video/${props.video.id}`">
        <div class="image-area">
          <a-image
            alt="related video"
            :src="props.video.cover"
            width="100%"
            height="100%"
            :preview="false"
          />
        </div>
      </router-link>
    </template>
    <a-list-item-meta>
      <template #title>
        <router-link :to="`/video/${props.video.id}`">{{ props.video.title }} </router-link>
      </template>
    </a-list-item-meta>
    <span class="action"> <IconHeart /> <span>1</span> </span>
    <a class="action-author">{{ author ? author.nickname : '...' }}</a>
  </a-list-item>
</template>

<style scoped></style>
