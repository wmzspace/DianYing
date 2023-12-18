<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 6 }"
    :wrapper-col-props="{ span: 18 }"
  >
    <a-form-item
      field="cover"
      :label="$t('stepForm.form.label.advertisingSource')"
      :rules="[
        {
          required: true,
          message: $t('stepForm.form.error.advertisingSource.required')
        }
      ]"
    >
      <div>
        <a-upload
          list-type="picture-card"
          :file-list="fileList"
          :action="prefix_url.concat('user/upload/cover')"
          image-preview
          @success="handleUploaded"
          :limit="1"
          :on-before-remove="handleRemove"
        />
        <p style="font-size: 10px" v-if="formData.cover === ''">点击预览或更改封面</p>
        <p style="font-size: 10px" v-else>{{ formData.cover }}</p>
      </div>
    </a-form-item>
    <a-form-item
      field="tags"
      :label="$t('stepForm.form.label.keyword')"
      :rules="[{ required: true, message: $t('stepForm.form.error.keyword.required') }]"
    >
      <!--      <a-select v-model="formData.tags" :placeholder="$t('stepForm.placeholder.keyword')" multiple>-->
      <!--        <a-option>今日头条</a-option>-->
      <!--        <a-option>火山</a-option>-->
      <!--      </a-select>-->
      <a-select
        v-model="formData.tags"
        v-model:input-value="inputValue"
        :options="options"
        :style="{ width: '320px' }"
        :placeholder="$t('stepForm.placeholder.keyword')"
        multiple
        @search="handleSearch"
        @inputValueChange="handleInputValueChange"
        @change="handleTagsChange"
        :allow-clear="true"
      />
    </a-form-item>
    <!--    <a-form-item-->
    <!--      field="pushNotify"-->
    <!--      :label="$t('stepForm.form.label.pushNotify')"-->
    <!--      :rules="[{ required: true }]"-->
    <!--    >-->
    <!--      <a-switch v-model="formData.pushNotify" />-->
    <!--    </a-form-item>-->
    <a-form-item
      field="title"
      :label="$t('stepForm.form.label.advertisingContent')"
      :rules="[
        {
          required: true,
          message: $t('stepForm.form.error.advertisingContent.required')
        },
        {
          maxLength: 100,
          message: $t('stepForm.form.error.advertisingContent.maxLength')
        }
      ]"
      row-class="keep-margin"
    >
      <a-textarea
        v-model="formData.title"
        :max-length="100"
        :auto-size="{
          minRows: 2
        }"
        :show-word-limit="true"
        :placeholder="$t('stepForm.placeholder.advertisingContent')"
      />
    </a-form-item>
    <a-form-item>
      <!-- <a-button type="primary" @click="onNextClick">
        {{ $t('stepForm.button.next') }}
      </a-button> -->
      <a-space>
        <a-button type="secondary" @click="goPrev">
          {{ $t('stepForm.button.prev') }}
        </a-button>
        <a-button type="primary" @click="onNextClick">
          {{ $t('stepForm.button.submit') }}
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { FormInstance } from '@arco-design/web-vue/es/form'
import type { VideoUploadFormModel2 } from '@/api/form'
import { type AjaxResponse, prefix_url } from '@/api'
import { Message } from '@arco-design/web-vue'
import { getAllTags, tagSuffixes } from '@/utils/tag'

const emits = defineEmits(['changeStep'])
const props = defineProps<{
  originCover: string
}>()

const inputValue = ref('')
// const options = computed(() => showTags.value.map((tag) => tag.name))
const options = ref<string[]>([])
const allTags = ref<string[]>([])
onMounted(() => {
  getAllTags().then((tags) => {
    allTags.value = tags
    options.value = tags
  })
  formData.value.cover = props.originCover
})

const handleTagsChange = () => {
  if (inputValue.value.length <= 0) {
    options.value = allTags.value
  }
}

const handleSearch = (value: string) => {
  value = value.trim()
  options.value = allTags.value
  if (!options.value.includes(value) && value.length > 0) {
    options.value = tagSuffixes().map((suffix) => value.concat(suffix))
  }
}
const handleInputValueChange = (value: string) => {
  inputValue.value = inputValue.value.trim()
}

const defaultCoverFile = computed(() => {
  return {
    uid: '-2',
    name: '',
    url: props.originCover
  }
})
const fileList = computed(() => {
  return [defaultCoverFile.value]
})
const defaultCover = computed(() => fileList.value[0].url)
watch(defaultCover, (value) => {
  formData.value.cover = defaultCover.value
})
// const fileList = ref<FileItem[]>([defaultCoverFile.value])

const formRef = ref<FormInstance>()
const formData = ref<VideoUploadFormModel2>({
  cover: props.originCover,
  title: '',
  tags: []
})

const handleRemove = async () => {
  formRef.value?.resetFields('cover')
  return new Promise<boolean>((resolve) => {
    resolve(true)
  })
}

const handleUploaded = (e: any) => {
  const ajaxData = e.response as AjaxResponse
  if (ajaxData.ajax_ok) {
    formData.value.cover = ajaxData.ajax_data as unknown as string
    Message.success({
      id: 'uploadCover',
      content: ajaxData.ajax_msg
    })
  } else {
    Message.error({
      id: 'uploadCover',
      content: ajaxData.ajax_msg
    })
  }
}

const onNextClick = async () => {
  const res = await formRef.value?.validate()
  if (!res) {
    emits('changeStep', 'submit', { ...formData.value })
  }
}
const goPrev = () => {
  emits('changeStep', 'backward')
}
</script>

<style scoped lang="less">
.container {
  .keep-margin {
    margin-bottom: 20px;
  }
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 0;
  background-color: var(--color-bg-2);
}

.steps {
  margin-bottom: 36px;
}

.form {
  width: 540px;
}

.form-content {
  padding: 8px 50px 0 30px;
}
</style>
