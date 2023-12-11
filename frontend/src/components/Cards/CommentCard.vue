<script setup lang="ts">
import type { Comment } from '@/utils/comment'
import { useUserStore } from '@/store/user'
import type { User } from '@/store/user'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'
import {
  getCommentLikeUsersByCommentId,
  getCommentsByVideoIdOrParent,
  likeCommentOrNot,
  postComment
} from '@/utils/comment'
import { getTimeDiffUntilNow } from '@/utils/tools'
import type { VideoMedia } from '@/types'
const emit = defineEmits(['reply'])

const userStore = useUserStore()
const props = defineProps<{
  comment: Comment
  // showReply: boolean
  index: number
  video: VideoMedia | undefined
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
    // commentLikeShowNum.value += isLiked.value ? -1 : 1
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
      emit('reply')
    })
  }
}

const onDeleteComment = () => {
  // TODO: delete comment
}

const childrenComments = reactive<Comment[]>([])
const refreshChildrenComments = () => {
  getCommentsByVideoIdOrParent(undefined, props.comment.id).then((res) => {
    // console.log(props.comment.id)
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
      @reply="emit('reply')"
    />
    <!--    Children Comment-->
  </a-comment>
</template>

<style scoped></style>
