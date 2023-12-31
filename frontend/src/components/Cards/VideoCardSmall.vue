<script setup lang="ts">
import type { VideoMedia } from '@/types'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store/user'
import type { UserRecord } from '@/api/list'

const props = defineProps<{
  video: VideoMedia
}>()

const userStore = useUserStore()

const author = ref<UserRecord | undefined>(undefined)

onMounted(() => {
  userStore.getUserInfoById(props.video.authorId).then((res) => {
    author.value = res
  })
})
</script>

<template>
  <a-list-item action-layout="vertical">
    <template #extra>
      <a
        @click="
          $router.push({
            name: 'videoDetail',
            params: { video_id: props.video.id },
            query: { validate: 'ignore' }
          })
        "
      >
        <div class="image-area">
          <a-image
            alt="related video"
            :src="props.video.cover"
            width="100%"
            height="100%"
            :preview="false"
          />
        </div>
      </a>
    </template>
    <a-list-item-meta>
      <template #title>
        <a
          @click="
            $router.push({
              name: 'videoDetail',
              params: { video_id: props.video.id },
              query: { validate: 'ignore' }
            })
          "
          >{{ props.video.title }}
        </a>
      </template>
    </a-list-item-meta>
    <span class="action"> <IconHeart /> <span>1</span> </span>
    <a class="action-author">{{ author ? author.nickName : '...' }}</a>
  </a-list-item>
</template>

<style scoped></style>
