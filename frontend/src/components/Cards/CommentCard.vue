<script setup lang="ts">
import type { Comment } from '@/mock'
import { useUserStore } from '@/store/user'
import type { User } from '@/store/user'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import { getCommentLikeUsersByCommentId, likeCommentOrNot } from '@/mock'
import { Message } from '@arco-design/web-vue'
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
const author = ref<User | undefined>(undefined)

userStore.getUserById(props.comment.authorId).then((user) => {
  author.value = user
})

const isLiked = ref(false)
const isProcessLike = ref(true)
const commentLikeUsers = reactive<User[]>([])
const commentLikeShowNum = ref(0)

const refreshCommentLike = () => {
  getCommentLikeUsersByCommentId(props.comment.id).then((users) => {
    commentLikeUsers.splice(0)
    commentLikeShowNum.value = 0
    isLiked.value = false
    users.forEach((user) => {
      if (user.id === userStore.getCurrentUser.id) {
        isLiked.value = true
      }
      commentLikeShowNum.value++
      commentLikeUsers.push(user)
    })
    isProcessLike.value = false
  })
}

const handleClickLike = () => {
  if (isProcessLike.value) {
    // Message.info('点击太频繁')
  } else {
    // commentLikeShowNum.value += isLiked.value ? -1 : 1
    likeCommentOrNot(props.comment.id, userStore.getCurrentUser.id, !isLiked.value).then(() => {
      refreshCommentLike()
    })
    isLiked.value = !isLiked.value
  }
}

const replyCommentContent = ref('')

onMounted(() => {
  refreshCommentLike()
})
</script>

<template>
  <a-comment
    align="left"
    :author="author?.nickname"
    :avatar="author?.avatar"
    :content="props.comment.content"
    :datetime="props.comment.publishTime"
    style="margin-bottom: 0; padding-bottom: 0"
  >
    <template #actions>
      <span class="action" @click="openReply" v-if="!isReplying"> <IconMessage /> 回复 </span>
      <span class="action" @click="isReplying = false" v-else> <IconMessage /> 回复中 </span>
      <span class="action" @click="handleClickLike">
        <span class="like-icon"><IconHeartFill v-if="isLiked" /><IconHeart v-else /></span>
        <span>{{ commentLikeShowNum }}</span>
      </span>
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
