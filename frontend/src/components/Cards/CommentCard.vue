<script setup lang="ts">
import type { Comment } from '@/mock'
import { useUserStore } from '@/store/user'
import { nextTick, ref, watch } from 'vue'
const emit = defineEmits(['reply'])

const userStore = useUserStore()
const props = defineProps<{
  comment: Comment
  // showReply: boolean
  index: number
}>()
const openReply = () => {
  // isReplying.value = true
  // nextTick(() => {
  //   document.getElementById('reply-comment-input')?.getElementsByTagName('input')[0]?.focus()
  // })
  // setTimeout(() => {
  isReplying.value = true
  nextTick(() => {
    document.getElementById('reply-comment-input')?.getElementsByTagName('input')[0]?.focus()
  })
  // }, 1000)
}
const isReplying = ref(false)
const replyCommentContent = ref('')
</script>

<template>
  <a-comment
    align="left"
    :author="userStore.getUserById(props.comment.authorId).name"
    :avatar="userStore.getUserById(props.comment.authorId).avatar"
    :content="props.comment.content"
    :datetime="props.comment.datetime"
    style="margin-bottom: 0; padding-bottom: 0"
  >
    <template #actions>
      <span class="action" @click="openReply" v-if="!isReplying"> <IconMessage /> 回复 </span>
      <span class="action" @click="isReplying = false" v-else> <IconMessage /> 回复中 </span>
      <span class="action"> <IconHeart /> <span>1</span> </span>
      <!--            <span class="action"> <IconHeartFill /> <span>1</span> </span>-->
    </template>

    <!--    :class="{ 'on-reply': showReply }"-->
    <a-comment align="right" avatar="images/avatar.jpeg" class="reply-comment" v-if="isReplying">
      <template #content>
        <a-input
          :placeholder="`回复@19岁带饭冲锋🌈`"
          class="comment-input"
          id="reply-comment-input"
          v-model:model-value="replyCommentContent"
          @focusin="isReplying = true"
          @focusout="isReplying = false"
        >
          <template #suffix
            ><img class="icon-at" src="/images/videoDetails/comment_at.svg" /><img
              class="icon-send"
              src="/images/videoDetails/send_comment.svg"
              v-if="replyCommentContent.length > 0"
          /></template>
        </a-input>
      </template>
    </a-comment>
  </a-comment>
</template>

<style scoped></style>
