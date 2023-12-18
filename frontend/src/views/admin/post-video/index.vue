<template>
  <div class="container">
    <Breadcrumb :items="['menu.postVideo']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title>
          {{ $t('stepForm.step.title') }}
        </template>
        <div class="wrapper">
          <a-steps v-model:current="step" style="min-width: 580px" line-less class="steps">
            <a-step :description="$t('stepForm.step.subTitle.baseInfo')">
              {{ $t('stepForm.step.title.baseInfo') }}
            </a-step>
            <a-step :description="$t('stepForm.step.subTitle.channel')">
              {{ $t('stepForm.step.title.channel') }}
            </a-step>
            <a-step :description="$t('stepForm.step.subTitle.finish')">
              {{ $t('stepForm.step.title.finish') }}
            </a-step>
          </a-steps>
          <keep-alive>
            <UploadFile v-if="step === 1" @change-step="changeStep" />
            <ChannelInfo
              v-else-if="step === 2"
              @change-step="changeStep"
              :origin-cover="submitModel.cover"
            />
            <Success v-else-if="step === 3" @change-step="changeStep" @jump-to-video="handleJump" />
          </keep-alive>
        </div>
      </a-card>
    </a-spin>
  </div>
</template>
<script lang="ts">
export default {
  name: 'postVideo'
}
</script>
<script lang="ts" setup>
import { ref } from 'vue'
import useLoading from '@/hooks/loading'
import { submitChannelForm } from '@/api/form'
import type {
  VideoUploadFormModelUnit,
  VideoUploadFormModel1,
  VideoUploadFormModel2
} from '@/api/form'
// import BaseInfo from './components/base-info.vue'
import UploadFile from './components/upload-file.vue'
import ChannelInfo from './components/channel-info.vue'
import Success from './components/success.vue'
import type { AjaxResponse } from '@/api'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'

const newVideoId = ref<string | undefined>(undefined)
const { loading, setLoading } = useLoading(false)
const step = ref(1)
const submitModel = ref<VideoUploadFormModelUnit>({
  authorId: -1,
  cover: '',
  height: -1,
  tags: [],
  title: '',
  url: '',
  width: -1
})

const submitForm = async () => {
  newVideoId.value = undefined
  setLoading(true)
  try {
    const data = await submitChannelForm(submitModel.value)
    const ajaxData = data.data as AjaxResponse
    if (ajaxData.ajax_ok) {
      Message.success({
        id: 'postVideo',
        content: ajaxData.ajax_msg
      })
      newVideoId.value = ajaxData.ajax_data as unknown as string
      step.value = 3
      submitModel.value = {} as VideoUploadFormModelUnit // init
    } else {
      Message.error({
        id: 'postVideo',
        content: ajaxData.ajax_msg
      })
    }
  } catch (err) {
    Message.error({
      id: 'postVideo',
      content: err as string
    })
    // you can report use errorHandler or other
  } finally {
    setLoading(false)
  }
}
const changeStep = (
  direction: string | number,
  model: VideoUploadFormModel1 | VideoUploadFormModel2
) => {
  if (typeof direction === 'number') {
    step.value = direction
    return
  }

  if (direction === 'forward' || direction === 'submit') {
    submitModel.value = {
      ...submitModel.value,
      ...model
    }
    if (direction === 'submit') {
      submitForm()
      return
    }
    step.value += 1
  } else if (direction === 'backward') {
    step.value -= 1
  }
}

const router = useRouter()
const handleJump = () => {
  router.push(`/video/${newVideoId.value}`)
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  overflow-y: scroll;
}
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);
  :deep(.arco-form) {
    .arco-form-item {
      &:last-child {
        margin-top: 20px;
      }
    }
  }
}

.steps {
  margin-bottom: 36px;
}
</style>
