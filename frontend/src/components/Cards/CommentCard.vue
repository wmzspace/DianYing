<script setup lang="ts">
import type { Comment } from '@/utils/comment'
import { useUserStore } from '@/store/user'
import type { User } from '@/store/user'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import {
  deleteComment,
  getCommentLikeUsersByCommentId,
  getCommentsByVideoIdOrParent,
  likeCommentOrNot,
  postComment
} from '@/utils/comment'
import { getTimeDiffUntilNow } from '@/utils/tools'
import type { VideoMedia } from '@/types'
import { Message } from '@arco-design/web-vue'
const emit = defineEmits(['refresh'])

const userStore = useUserStore()
const props = defineProps<{
  comment: Comment
  index: number
  video: VideoMedia | undefined
}>()
const openReply = () => {
  isReplying.value = true
  nextTick(() => {
    document.getElementById('reply-comment-input')?.getElementsByTagName('input')[0]?.focus()
  })
}
const isReplying = ref(false)
const author = ref<User | undefined>(undefined)
const refreshUserInfo = () => {
  userStore.getUserById(props.comment.authorId).then((user) => {
    author.value = user
  })
}

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
    likeCommentOrNot(props.comment.id, userStore.getCurrentUser.id, !isLiked.value).then(() => {
      refreshCommentLike()
    })
    isLiked.value = !isLiked.value
  }
}

const commentContentShowAll = ref(false)
const replyCommentContent = ref('')

//  TODO: auto focus on comment after post
// const focusCommentId = ref<number | undefined>(undefined)
// watch(focusCommentId, (value) => {
//   if (value !== undefined) {
//   } else {
//   }
// })

const onPostReplyComment = () => {
  if (replyCommentContent.value.length <= 0) {
    // Message.info('评论内容异常')
    return
  }
  if (author.value !== undefined) {
    postComment(
      userStore.getCurrentUser.id,
      replyCommentContent.value,
      undefined,
      props.comment.id
    ).then((commentId) => {
      if (commentId !== undefined) {
        refreshUserInfo()
        refreshChildrenComments()
        // focusCommentId.value = commentId
        replyCommentContent.value = ''
        isReplying.value = false
      } else {
        refreshUserInfo()
        refreshChildrenComments()
      }
      emit('refresh')
    })
  }
}

const processDeleteComment = ref(false)
const onDeleteComment = () => {
  if (processDeleteComment.value) {
    Message.clear()
    Message.info('点击频率太快')
    return
  }
  processDeleteComment.value = true
  deleteComment(props.comment.id).then((success) => {
    // if (success) {
    //   refreshChildrenComments()
    // }
    processDeleteComment.value = false
    refreshUserInfo()
    // refreshChildrenComments()
    emit('refresh')
  })
}

const childrenComments = reactive<Comment[]>([])
const refreshChildrenComments = () => {
  getCommentsByVideoIdOrParent(undefined, props.comment.id).then((res) => {
    childrenComments.splice(0)
    res.reverse().forEach((e) => {
      childrenComments.push(e)
    })
  })
}
onMounted(() => {
  refreshUserInfo()
  refreshCommentLike()
  refreshChildrenComments()
})
</script>

<template>
  <a-comment
    align="left"
    :author="author?.nickname"
    :avatar="author?.avatar"
    :datetime="getTimeDiffUntilNow(props.comment.publishTime)"
    style="margin-bottom: 0; padding-bottom: 0"
  >
    <template #content>
      <div
        class="comment-content-text-container"
        :class="{ 'show-all': commentContentShowAll }"
        @click="commentContentShowAll = true"
      >
        {{ props.comment.content }}
      </div>
    </template>

    <template #actions>
      <span class="action" @click="openReply" v-if="!isReplying"> <IconMessage /> 回复 </span>
      <span class="action" @click="isReplying = false" v-else> <IconMessage /> 回复中 </span>
      <span class="action" @click="handleClickLike">
        <span class="like-icon"><IconHeartFill v-if="isLiked" /><IconHeart v-else /></span>
        <span>{{ commentLikeShowNum }}</span>
      </span>
      <span
        class="action"
        @click="onDeleteComment"
        v-if="
          props.comment.authorId === userStore.getCurrentUser.id ||
          props.video?.authorId === userStore.getCurrentUser.id
        "
      >
        <IconDelete /> 删除
      </span>
    </template>

    <!--    New comment input-->
    <a-comment
      align="right"
      :avatar="userStore.getCurrentUser.avatar"
      class="reply-comment"
      v-if="isReplying"
    >
      <template #content>
        <a-input
          :placeholder="`回复 @${author?.nickname}`"
          class="comment-input"
          id="reply-comment-input"
          v-model.trim="replyCommentContent"
          :max-length="400"
          @focusin="isReplying = true"
          @focusout="isReplying = false"
          @pressEnter="onPostReplyComment"
        >
          <template #suffix
            ><img class="icon-at" src="/images/videoDetails/comment_at.svg" /><img
              class="icon-send"
              src="/images/videoDetails/send_comment.svg"
              v-if="replyCommentContent.length > 0"
              @click="onPostReplyComment"
          /></template>
        </a-input>
      </template>
    </a-comment>
    <!--    New comment input-->

    <!--    Children Comment-->
    <CommentCard
      v-for="(comment, index) in childrenComments"
      :index="index"
      :comment="comment"
      :key="index"
      :video="props.video"
      @refresh="emit('refresh')"
    />
    <!--    Children Comment-->
  </a-comment>
</template>

<style scoped></style>
