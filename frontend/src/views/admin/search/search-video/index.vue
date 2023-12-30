<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.video.searchTable']" />
    <a-card class="general-card" :title="$t('menu.list.video.searchTable')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="videoTitle" :label="$t('searchTable.form.videoTitle')">
                  <a-input
                    v-model="formModel.videoTitle"
                    :placeholder="$t('searchTable.form.videoTitle.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="authorName" :label="$t('searchTable.form.authorName')">
                  <a-input
                    v-model="formModel.authorName"
                    :placeholder="$t('searchTable.form.authorName.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="videoId" :label="$t('searchTable.form.videoTags')">
                  <a-select
                    v-model="formModel.tags"
                    v-model:input-value="inputValue"
                    :options="options"
                    :placeholder="$t('searchTable.form.videoTags.placeholder')"
                    multiple
                    @search="handleSearch"
                    @inputValueChange="handleInputValueChange"
                    @change="handleTagsChange"
                    :allow-clear="true"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="contentType" :label="$t('searchTable.form.contentType')">
                  <a-select
                    v-model="formModel.contentType"
                    :options="contentTypeOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="publishTime" :label="$t('searchTable.form.publishTime')">
                  <a-range-picker v-model="formModel.publishTime" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('searchTable.form.status')">
                  <a-select
                    v-model="formModel.status"
                    :options="statusOptions"
                    :placeholder="$t('searchTable.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 84px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="vertical" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              {{ $t('searchTable.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="mainStore.setGoToPost(true)">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <a-tooltip :content="$t('searchTable.actions.refresh')">
              <!--            <div class="action-icon" @click="search"><icon-refresh size="18" /></div>-->
              <a-button @click="search">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('searchTable.actions.refresh') }}
              </a-button>
            </a-tooltip>
            <!--            <a-upload action="/">-->
            <!--              <template #upload-button>-->
            <!--                <a-button>-->
            <!--                  {{ $t('searchTable.operation.import') }}-->
            <!--                </a-button>-->
            <!--              </template>-->
            <!--            </a-upload>-->
          </a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('searchTable.operation.download') }}
          </a-button>
          <!--          <a-tooltip :content="$t('searchTable.actions.refresh')">-->
          <!--            <div class="action-icon" @click="search"><icon-refresh size="18" /></div>-->
          <!--          </a-tooltip>-->
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
              <div class="action-icon"><icon-line-height size="18" /></div>
            </a-tooltip>
            <template #content>
              <a-doption
                v-for="item in densityList"
                :key="item.value"
                :value="item.value"
                :class="{ active: item.value === size }"
              >
                <span>{{ item.name }}</span>
              </a-doption>
            </template>
          </a-dropdown>
          <!--          <a-tooltip :content="$t('searchTable.actions.columnSetting')">-->
          <!--            <a-popover trigger="click" position="bl" @popup-visible-change="popupVisibleChange">-->
          <!--              <div class="action-icon"><icon-settings size="18" /></div>-->
          <!--              <template #content>-->
          <!--                <div id="tableSetting">-->
          <!--                  <div v-for="(item, index) in showColumns" :key="item.dataIndex" class="setting">-->
          <!--                    <div style="margin-right: 4px; cursor: move">-->
          <!--                      <icon-drag-arrow />-->
          <!--                    </div>-->
          <!--                    <div>-->
          <!--                      <a-checkbox-->
          <!--                        v-model="item.checked"-->
          <!--                        @change="handleChange($event, item as TableColumnData, index)"-->
          <!--                      >-->
          <!--                      </a-checkbox>-->
          <!--                    </div>-->
          <!--                    <div class="title">-->
          <!--                      {{ item.title === '#' ? '序列号' : item.title }}-->
          <!--                    </div>-->
          <!--                  </div>-->
          <!--                </div>-->
          <!--              </template>-->
          <!--            </a-popover>-->
          <!--          </a-tooltip>-->
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading || editLoading"
        :pagination="pagination"
        :columns="cloneColumns as TableColumnData[]"
        :data="renderData"
        :bordered="false"
        :size="size"
        :scroll="{
          x: 1000,
          y: '100%'
        }"
        :scrollbar="true"
        column-resizable
        @page-change="onPageChange"
        @sorterChange="onSortChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #status="{ record, rowIndex }">
          <!--          <span v-if="record.status === 'offline'" class="circle"></span>-->
          <!--          <span v-else class="circle pass"></span>-->
          <a-select
            v-model="editingData[getRecordIndex(rowIndex)].status"
            :options="statusOptions"
            :placeholder="$t('searchTable.form.selectDefault')"
            v-if="editingData[getRecordIndex(rowIndex)].isEditing"
          />
          <span
            v-else
            :style="{
              color: (() => {
                switch (record.status) {
                  case 'online':
                    return '#52C41A'
                  case 'awaitApproval':
                    return '#B37FEB'
                  case 'offline':
                    return '#F5222D'
                }
              })()
            }"
            >{{ $t(`searchTable.form.status.${record.status}`) }}</span
          >
        </template>
        <template #videoTitle="{ record, rowIndex }">
          <a-input
            v-model.trim="editingData[getRecordIndex(rowIndex)].videoTitle"
            :placeholder="$t('searchTable.edit.videoTitle.placeholder')"
            v-if="editingData[getRecordIndex(rowIndex)].isEditing"
            :max-length="100"
          />
          <a-tooltip v-else>
            <div class="one-line">{{ record.videoTitle }}</div>
            <template #content>{{ record.videoTitle }}</template>
          </a-tooltip>
        </template>
        <template #videoTags="{ record }">
          <a-tooltip>
            <div class="one-line">
              <a-link v-for="(tag, index) in record.tags" :key="index" :hoverable="false">
                #{{ tag }}</a-link
              >
            </div>
            <template #content
              ><a-link
                v-for="(tag, index) in record.tags"
                :key="index"
                :hoverable="false"
                style="color: white"
              >
                #{{ tag }}</a-link
              ></template
            >
          </a-tooltip>
        </template>
        <template #authorName="{ record, rowIndex }">
          <a-input-number
            v-model="editingData[getRecordIndex(rowIndex)].authorId"
            v-if="editingData[getRecordIndex(rowIndex)].isEditing"
            :placeholder="$t('searchTable.edit.authorId.placeholder')"
          />
          <a-tooltip v-else>
            <div class="one-line">{{ record.authorName }}</div>
            <template #content>{{ record.authorName }}</template>
          </a-tooltip>
        </template>
        <template #contentType="{ record }">
          <a-space>
            <a-avatar v-if="record.contentType === 'img'" :size="16" shape="square">
              <img
                alt="avatar"
                src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/581b17753093199839f2e327e726b157.svg~tplv-49unhts6dw-image.image"
              />
            </a-avatar>
            <a-avatar
              v-else-if="record.contentType === 'horizontalVideo'"
              :size="16"
              shape="square"
            >
              <img alt="avatar" src="/images/admin/upload/horizontal.png" />
            </a-avatar>
            <a-avatar v-else :size="16" shape="square">
              <img alt="avatar" src="/images/admin/upload/vertical.png" />
            </a-avatar>
            {{ $t(`searchTable.form.contentType.${record.contentType}`) }}
          </a-space>
        </template>
        <template #filterType="{ record }">
          {{ $t(`searchTable.form.filterType.${record.filterType}`) }}
        </template>
        <template #operations="{ record, rowIndex }">
          <div style="display: flex; align-items: center; justify-content: center">
            <a-button
              type="text"
              size="small"
              style="padding: 8px"
              @click="handleSwitchEdit(record, rowIndex)"
              >{{ editingData[getRecordIndex(rowIndex)].isEditing ? '取消' : '编辑' }}</a-button
            >
            <a-button
              type="text"
              size="small"
              :status="'success'"
              style="padding: 6px"
              v-if="editingData[getRecordIndex(rowIndex)].isEditing"
              @click="handleSaveEdit(record, rowIndex)"
            >
              保存
            </a-button>
            <a-button
              type="text"
              size="small"
              :status="'danger'"
              style="padding: 6px"
              v-if="!editingData[getRecordIndex(rowIndex)].isEditing"
              @click="handleDeleteVideo(record, rowIndex)"
            >
              删除
            </a-button>
          </div>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/loading'
import {
  type VideoRecord,
  type PolicyParamsVideo,
  type VideoListRes,
  type VideoQueryForm,
  type VideoRecordCanEdit
} from '@/api/list'
import type { Pagination } from '@/types/global'
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import cloneDeep from 'lodash/cloneDeep'
import Sortable from 'sortablejs'
import { prefix_url } from '@/api'
import {
  deleteVideoById,
  editVideoById,
  type EditVideoForm,
  getVideoActionUsersByVideoId,
  getVideoInfoById,
  pullVideo
} from '@/utils/video'
import { reject } from 'lodash-es'
import { Message } from '@arco-design/web-vue'
import { useUserStore } from '@/store'
import { getAllTags, tagSuffixes } from '@/utils/tag'
import { isTimeInRange } from '@/utils/tools'
import { useMainStore } from '@/store/main'
import _ from 'lodash'

type SizeProps = 'mini' | 'small' | 'medium' | 'large'
type Column = TableColumnData & { checked?: true }

const mainStore = useMainStore()

const getRecordIndex = (rowIndex: number) => {
  return pagination.pageSize * (pagination.current - 1) + rowIndex
}

const handleSwitchEdit = (record: VideoRecordCanEdit, rowIndex: number) => {
  // editingData.value = _.cloneDeep(renderData.value)
  if (!editingData.value[getRecordIndex(rowIndex)].isEditing) {
    isEditingTable.value = false
  }
  editingData.value[getRecordIndex(rowIndex)].isEditing =
    !editingData.value[getRecordIndex(rowIndex)].isEditing
}

const editLoadObject = useLoading()
const editLoading = editLoadObject.loading
const setEditLoading = editLoadObject.setLoading
const handleSaveEdit = (record: VideoRecordCanEdit, rowIndex: number) => {
  setEditLoading(true)
  if (record.videoId !== editingData.value[getRecordIndex(rowIndex)].videoId) {
    Message.error({
      id: 'videoEdit',
      content: '保存失败：数据异常'
    })
    location.reload()
  }
  const rowEditData = editingData.value[getRecordIndex(rowIndex)]
  const editForm: EditVideoForm = {
    authorId: rowEditData.authorId,
    status: rowEditData.status,
    title: rowEditData.videoTitle,
    videoId: rowEditData.videoId
  }
  editVideoById(editForm)
    .then(() => {
      search()
    })
    .finally(() => {
      setEditLoading(false)
    })
}

const handleDeleteVideo = (record: VideoRecordCanEdit, rowIndex: number) => {
  setEditLoading(true)
  if (record.videoId !== editingData.value[getRecordIndex(rowIndex)].videoId) {
    Message.error({
      id: 'videoEdit',
      content: '删除失败：数据异常'
    })
    location.reload()
  }

  deleteVideoById(record.videoId)
    .then((msg) => {
      Message.success({
        id: 'videoEdit',
        content: msg
      })
      search()
    })
    .catch((e) => {
      Message.success({
        id: 'videoEdit',
        content: e
      })
    })
    .finally(() => {
      setEditLoading(false)
    })
}

const generateFormModel = () => {
  let record: VideoQueryForm = {
    videoId: undefined,
    videoTitle: undefined,
    contentType: undefined,
    // filterType: '',
    authorName: undefined,
    publishTime: [],
    status: undefined,
    tags: undefined
  }
  return record
}

const userStore = useUserStore()
const { loading, setLoading } = useLoading(true)
const { t } = useI18n()

const editingData = ref<VideoRecordCanEdit[]>([])
const renderData = ref<VideoRecordCanEdit[]>([])
const formModel = ref(generateFormModel())
const cloneColumns = ref<Column[]>([])
const showColumns = ref<Column[]>([])

const size = ref<SizeProps>('medium')

const basePagination: Pagination = {
  current: 1,
  pageSize: 10
}
const pagination = reactive({
  ...basePagination
})
const densityList = computed(() => [
  {
    name: t('searchTable.size.mini'),
    value: 'mini'
  },
  {
    name: t('searchTable.size.small'),
    value: 'small'
  },
  {
    name: t('searchTable.size.medium'),
    value: 'medium'
  },
  {
    name: t('searchTable.size.large'),
    value: 'large'
  }
])

const isEditingTable = computed<boolean>({
  get: () => {
    for (let i = 0; i < editingData.value.length; i++) {
      if (editingData.value[i].isEditing) {
        return true
      }
    }
    return false
  },
  set: (value) => {
    if (!value) {
      // editingData.value = _.cloneDeep(renderData.value)
      editingData.value.filter((data) => data.isEditing).forEach((data) => (data.isEditing = false))
    }
  }
})

const columns = computed<TableColumnData[]>(() => [
  {
    title: t('searchTable.columns.index'),
    dataIndex: 'index',
    slotName: 'index',
    width: 75,
    fixed: 'left'
  },
  {
    title: t('searchTable.columns.status'),
    dataIndex: 'status',
    slotName: 'status',
    width: isEditingTable.value ? 140 : 85,
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: t('searchTable.columns.videoTitle'),
    dataIndex: 'videoTitle',
    slotName: 'videoTitle',
    width: 200
  },
  {
    title: t('searchTable.columns.videoTags'),
    dataIndex: 'tags',
    slotName: 'videoTags',
    width: 150
  },
  {
    title: isEditingTable.value ? '作者编号/名称' : '作者名称',
    dataIndex: 'authorName',
    slotName: 'authorName',
    width: 140,
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },

  {
    title: t('searchTable.columns.contentType'),
    dataIndex: 'contentType',
    slotName: 'contentType',
    width: 130,
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: t('searchTable.columns.likeCount'),
    dataIndex: 'likeCount',
    slotName: 'likeCount',
    align: 'center',
    width: 100,
    sortable: {
      sortDirections: ['descend', 'ascend']
    }
  },
  {
    title: t('searchTable.columns.starCount'),
    dataIndex: 'starCount',
    slotName: 'starCount',
    align: 'center',
    width: 100,
    sortable: {
      sortDirections: ['descend', 'ascend']
    }
  },
  {
    title: t('searchTable.columns.commentCount'),
    dataIndex: 'commentCount',
    slotName: 'commentCount',
    align: 'center',
    width: 100,
    sortable: {
      sortDirections: ['descend', 'ascend']
    }
  },
  {
    title: t('searchTable.columns.publishTime'),
    dataIndex: 'publishTime',
    width: 180,
    sortable: {
      sortDirections: ['descend', 'ascend']
    }
  },

  {
    title: t('searchTable.columns.operations'),
    dataIndex: 'operations',
    slotName: 'operations',
    fixed: 'right',
    align: 'center',
    width: 100
  }
])
const contentTypeOptions = computed<SelectOptionData[]>(() => [
  // {
  //   label: t('searchTable.form.contentType.img'),
  //   value: 'img'
  // },
  {
    label: t('searchTable.form.contentType.horizontalVideo'),
    value: 'horizontalVideo'
  },
  {
    label: t('searchTable.form.contentType.verticalVideo'),
    value: 'verticalVideo'
  }
])
const filterTypeOptions = computed<SelectOptionData[]>(() => [
  {
    label: t('searchTable.form.filterType.artificial'),
    value: 'artificial'
  },
  {
    label: t('searchTable.form.filterType.rules'),
    value: 'rules'
  }
])
const statusOptions = computed<SelectOptionData[]>(() => [
  // {
  //   label: t('searchTable.form.selectDefault'),
  //   value: undefined
  // },
  {
    label: t('searchTable.form.status.online'),
    value: 'online'
  },
  {
    label: t('searchTable.form.status.offline'),
    value: 'offline'
  },
  {
    label: t('searchTable.form.status.awaitApproval'),
    value: 'awaitApproval'
  }
])

const inputValue = ref('')
// const options = computed(() => showTags.value.map((tag) => tag.name))
const options = ref<string[]>([])
const allTags = ref<string[]>([])
onMounted(() => {
  getAllTags().then((tags) => {
    allTags.value = tags
    options.value = tags
  })
})

const onSortChange = () => {
  isEditingTable.value = false
  // console.log('!')
  // editingData.value = _.cloneDeep(renderData.value)
}
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

const fetchData = async (params: PolicyParamsVideo = { current: 1, pageSize: 20 }) => {
  setLoading(true)
  pullVideo({
    tagsName: params.tags,
    tagFilterMode: 'filterAll',
    sort: 'sort',
    allStatus: 'all'
  })
    .then((videos) => {
      const promises = videos.map(
        async (video): Promise<VideoRecord> =>
          getVideoInfoById(video.id)
            .then((record) => record)
            .catch((e) => {
              // 处理错误
              Message.error({
                id: 'videoList',
                content: e.message
              })
              // 返回一个标记错误的值或者抛出一个新的错误，具体取决于你的需求
              throw e.message
            })
      )
      Promise.all(promises).then((records) => {
        let results = records
        if (params.authorName) {
          results = results.filter((record) =>
            record.authorName.includes(params.authorName as string)
          )
        }
        if (params.videoTitle) {
          results = results.filter((record) =>
            record.videoTitle.includes(params.videoTitle as string)
          )
        }
        if (params.contentType) {
          results = results.filter((record) => record.contentType === params.contentType)
        }
        if (params.status) {
          results = results.filter((record) => record.status === params.status)
        }
        if (params.publishTime && params.publishTime.length === 2) {
          results = results.filter((record) =>
            isTimeInRange(params.publishTime as unknown as string[], record.publishTime)
          )
        }

        const data: VideoListRes = {
          list: results,
          total: results.length
        }
        const editableList = data.list as VideoRecordCanEdit[]
        editableList.forEach((item) => (item.isEditing = false))
        renderData.value = editableList
        editingData.value = _.cloneDeep(renderData.value)
        pagination.current = params.current
        pagination.total = data.total
        setLoading(false)
      })
    })
    .catch((e) => {
      Message.error({
        id: 'videoList',
        content: e.message
      })
    })
}

const search = () => {
  fetchData({
    ...basePagination,
    ...formModel.value
  } as unknown as PolicyParamsVideo)
}
const onPageChange = (current: number) => {
  fetchData({ ...basePagination, current })
}

fetchData()
const reset = () => {
  formModel.value = generateFormModel()
  search()
}

const handleSelectDensity = (val: string | number | Record<string, any> | undefined, e: Event) => {
  size.value = val as SizeProps
}

const exchangeArray = <T extends Array<any>>(
  array: T,
  beforeIdx: number,
  newIdx: number,
  isDeep = false
): T => {
  const newArray = isDeep ? cloneDeep(array) : array
  if (beforeIdx > -1 && newIdx > -1) {
    // 先替换后面的，然后拿到替换的结果替换前面的
    newArray.splice(beforeIdx, 1, newArray.splice(newIdx, 1, newArray[beforeIdx]).pop())
  }
  return newArray
}

watch(
  () => columns.value,
  (val) => {
    // isEditingTable.value = false
    // editingData.value = _.cloneDeep(renderData.value)
    cloneColumns.value = cloneDeep(val)
    cloneColumns.value.forEach((item, index) => {
      item.checked = true
    })
    showColumns.value = cloneDeep(cloneColumns.value)
  },
  { deep: true, immediate: true }
)
</script>

<script lang="ts">
export default {
  name: 'SearchTableVideo'
}
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  overflow-y: scroll;
}
:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}
.action-icon {
  margin-left: 12px;
  cursor: pointer;
}
.active {
  color: #0960bd;
  background-color: #e3f4fc;
}
.setting {
  display: flex;
  align-items: center;
  width: 200px;
  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}
</style>
