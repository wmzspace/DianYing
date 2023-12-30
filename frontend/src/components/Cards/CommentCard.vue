<script setup lang="ts">
import type { Comment } from '@/utils/comment'
import { useUserStore } from '@/store/user'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
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
import { useMainStore } from '@/store/main'
import type { UserRecord, VideoRecord } from '@/api/list'

const emit = defineEmits(['refresh', 'change'])

const userStore = useUserStore()
const props = defineProps<{
  comment: Comment
  index: any
  video: VideoRecord | undefined
}>()

const openReply = () => {
  isReplying.value = true
  nextTick(() => {
    document.getElementById('reply-comment-input')?.getElementsByTagName('input')[0]?.focus()
  })
}
const isReplying = ref(false)
// const author = ref<UserRecord | undefined>(undefined)
// const isLoadingUser = ref(true)
// const isLoadingUser = ref(false)
// const refreshUserInfo = () => {
//   userStore
//     .getUserInfoById(props.comment.authorId)
//     .then((user) => {
//       author.value = user
//     })
//     .catch(() => {
//       emitRefresh(true)
//     })
// }

const isLiked = ref(false)
const isProcessLike = ref(true)
const commentLikeShowNum = ref(0)

const mainStore = useMainStore()
const refreshCommentLike = () => {
  isProcessLike.value = true
  getCommentLikeUsersByCommentId(props.comment.id)
    .then((users) => {
      commentLikeShowNum.value = 0
      isLiked.value = false
      users.forEach((userId) => {
        if (userStore.getCurrentUser && userId === userStore.getCurrentUser.id) {
          isLiked.value = true
        }
        commentLikeShowNum.value++
      })
    })
    .catch(() => {
      emitRefresh(true)
    })
    .finally(() => {
      isProcessLike.value = false
    })
}

const handleClickLike = () => {
  userStore
    .checkLogin()
    .then((user) => {
      if (isProcessLike.value) {
        //
      } else {
        likeCommentOrNot(props.comment.id, user.id, !isLiked.value)
          .then(() => {
            refreshCommentLike()
          })
          .catch(() => {
            emitRefresh(true)
          })
        isLiked.value = !isLiked.value
      }
    })
    .catch(() => {
      mainStore.setLoginVisible(true)
    })
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

const isProcessReplyComment = ref(false)
const onPostReplyComment = () => {
  userStore
    .checkLogin()
    .then((user) => {
      if (replyCommentContent.value.length <= 0 || isProcessReplyComment.value) {
        return
      }
      if (props.video !== undefined) {
        // FIXME:(author.value !== undefined)
        isProcessReplyComment.value = true
        postComment(user.id, replyCommentContent.value, undefined, props.comment.id)
          .then((comment) => {
            if (comment !== undefined) {
              emit('change')
              replyCommentContent.value = ''
              isReplying.value = false
              refreshChildrenComments()
            } else {
              // refreshUserInfo()
              refreshChildrenComments()
              emitRefresh(true)
            }
          })
          .finally(() => {
            isProcessReplyComment.value = false
          })
      }
    })
    .catch(() => {
      mainStore.setLoginVisible(true)
    })
}

const processDeleteComment = ref(false)
const onDeleteComment = () => {
  if (processDeleteComment.value) {
    Message.clear()
    Message.info('点击频率太快')
    return
  }
  processDeleteComment.value = true
  deleteComment(props.comment.id)
    .then((success) => {
      // if (success) {
      //   refreshChildrenComments()
      // }
      // refreshChildrenComments()

      if (success) {
        // isDeleted.value = true
        emit('change')
        // refreshChildrenComments()
        emitRefresh(false)
      } else {
        // refreshUserInfo()
        emitRefresh(true)
      }
    })
    .finally(() => {
      processDeleteComment.value = false
    })
}

const childrenLoaded = ref(false)
const childrenComments = reactive<(Comment | undefined)[]>([])
const refreshChildrenComments = () => {
  childrenLoaded.value = false
  getCommentsByVideoIdOrParent(undefined, props.comment.id)
    .then((res) => {
      childrenComments.splice(0)
      res.reverse().forEach((e) => {
        childrenComments.push(e)
      })
      childrenLoaded.value = true
    })
    .catch((res) => {
      emitRefresh(true)
    })
}

onMounted(() => {
  // refreshUserInfo()
  refreshCommentLike()
  refreshChildrenComments()
})

const isLoadingComment = computed(() => {
  return (
    !childrenLoaded.value ||
    // isLoadingUser.value ||
    processDeleteComment.value ||
    // isProcessLike.value ||
    isProcessReplyComment.value
  )
})

const emitRefresh = (refreshAll: boolean) => {
  emit('refresh', refreshAll)
}

const isDeleted = ref(false)
</script>

<template>
  <a-comment
    v-show="!isDeleted"
    class="comment-item"
    align="left"
    :datetime="getTimeDiffUntilNow(props.comment.publishTime)"
    style="margin-bottom: 0; padding-bottom: 0"
  >
    <template #author>
      <span
        style="cursor: pointer"
        @click="
          () => {
            if (props.video) {
              $router.push({
                name: 'userProfile',
                params: { user_id: props.comment.authorId }
              })
            }
          }
        "
      >
        {{ props.comment.authorName }}
      </span>
    </template>
    <template #avatar>
      <a-avatar
        :size="32"
        :image-url="props.comment.authorAvatar"
        @load="
          () => {
            // isLoadingUser = false
          }
        "
        @click="
          () => {
            if (props.video) {
              $router.push({
                name: 'userProfile',
                params: { user_id: props.comment.authorId }
              })
            }
          }
        "
      ></a-avatar>
    </template>
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
          userStore.isAdmin ||
          (userStore.getCurrentUser &&
            (props.comment.authorId === userStore.getCurrentUser.id ||
              props.video?.authorId === userStore.getCurrentUser.id))
        "
      >
        <IconDelete /> 删除
      </span>
    </template>

    <!--    New comment input-->
    <a-comment
      align="right"
      :avatar="userStore.getUserAvatar"
      class="reply-comment"
      v-if="isReplying"
    >
      <template #content>
        <a-input
          :placeholder="`回复 @${props.comment.authorName}`"
          class="comment-input"
          id="reply-comment-input"
          v-model.trim="replyCommentContent"
          :max-length="400"
          @focusin="isReplying = true"
          @focusout="isReplying = false"
          @pressEnter="onPostReplyComment"
        >
          <template #suffix>
            <a-tooltip>
              <template #content> 没有可以@的朋友 </template>
              <img class="icon-at" src="/images/videoDetails/comment_at.svg" alt="at friend" />
            </a-tooltip>
            <a-tooltip>
              <template #content>回复评论</template>
              <img
                class="icon-send"
                src="/images/videoDetails/send_comment.svg"
                v-if="replyCommentContent.length > 0"
                @click="onPostReplyComment"
                alt="reply comment"
              />
            </a-tooltip>
          </template>
        </a-input>
      </template>
    </a-comment>
    <!--    New comment input-->

    <!--    Children Comment-->
    <a-spin class="load-more" dot v-if="isLoadingComment" :loading="isLoadingComment" />
    <CommentCard
      v-else
      v-for="(comment, index) in childrenComments.filter((e) => e !== undefined)"
      :index="index"
      :comment="comment as Comment"
      :key="index"
      :video="props.video"
      @change="
        () => {
          emit('change')
        }
      "
      @refresh="
        (refreshAll) => {
          if (refreshAll) {
            emitRefresh(true)
          } else {
            refreshChildrenComments()
          }
        }
      "
    />
    <!--    Children Comment-->
  </a-comment>
</template>

<style scoped></style>
