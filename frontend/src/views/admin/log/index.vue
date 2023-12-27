<template>
  <div class="container">
    <Breadcrumb :items="['menu.list', 'menu.list.user.searchTable']" />
    <a-card class="general-card" :title="$t('menu.list.user.searchTable')">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="formModel"
            :label-col-props="{ span: 6 }"
            :wrapper-col-props="{ span: 18 }"
            label-align="left"
          >
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item field="operation" label="操作">
                  <a-select
                    v-model="formModel.operation"
                    :options="operationOptions"
                    placeholder="请选择操作"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="operation" label="操作对象">
                  <a-select
                    v-model="formModel.target"
                    :options="targetOptions"
                    placeholder="请选择操作对象"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="recordValue" label="记录值">
                  <a-input v-model.trim="formModel.recordValue" placeholder="请输入记录值" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="timestamp" label="时间">
                  <a-range-picker v-model="formModel.timestamp" style="width: 100%" />
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
              {{ $t('searchTable.user.form.search') }}
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.user.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button :type="'secondary'" :status="'danger'" @click="handleDeleteAllLogs">
              <template #icon>
                <icon-delete />
              </template>
              清空日志
            </a-button>
            <a-button @click="search">
              <template #icon>
                <icon-refresh />
              </template>
              {{ $t('searchTable.user.actions.refresh') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-button>
            <template #icon>
              <icon-download />
            </template>
            {{ $t('searchTable.user.operation.download') }}
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
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading || editLoading"
        :pagination="true"
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
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #operation="{ record }">
          <div class="one-line" style="cursor: text">
            <span v-if="record.operation === 'insert'" style="color: var(--color-success)"
              >新增</span
            >
            <span v-else-if="record.operation === 'update'" style="color: var(--color-warning)"
              >修改</span
            >
            <span v-else style="color: var(--color-danger)">删除</span>
          </div>
        </template>
        <template #target="{ record }">
          <a-tooltip>
            <div class="one-line">{{ record.target }}</div>
            <template #content>{{ record.target }}</template>
          </a-tooltip>
        </template>
        <template #recordValue="{ record }">
          <a-tooltip :trigger="['click']">
            <a-link class="one-line">查看</a-link>
            <template #content>
              <div style="white-space: pre; text-align: left; overflow: scroll">
                <!--                {{ parseRecordValue(record.recordValue) }}-->
                {{ record.recordValue }}
              </div>
            </template>
          </a-tooltip>
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
  type VideoRecordCanEdit,
  type UserQueryForm,
  type UserListRes,
  type UserRecord,
  type PolicyParamsUser,
  type PolicyParamsLog,
  type LogListRes,
  type LogRecord,
  type LogQueryForm
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
import { areas } from '@/views/user/profile/mock'
import { deleteAllLogs, getDbLog, parseRecordValue } from '@/utils/database'

type SizeProps = 'mini' | 'small' | 'medium' | 'large'
type Column = TableColumnData & { checked?: true }

const editLoadObject = useLoading()
const editLoading = editLoadObject.loading
const setEditLoading = editLoadObject.setLoading

const handleDeleteAllLogs = () => {
  setEditLoading(true)
  deleteAllLogs()
    .catch((msg) => {
      Message.error({
        id: 'deleteLog',
        content: msg
      })
    })
    .finally(() => {
      search()
      setEditLoading(false)
    })
}

const generateFormModel = () => {
  let record: LogQueryForm = {
    operation: undefined,
    recordValue: undefined,
    timestamp: undefined,
    target: undefined
  }
  return record
}

const { loading, setLoading } = useLoading(true)
const { t } = useI18n()

const renderData = ref<LogRecord[]>([])
const formModel = ref(generateFormModel())
const cloneColumns = ref<Column[]>([])
const showColumns = ref<Column[]>([])

const size = ref<SizeProps>('medium')

const basePagination: Pagination = {
  current: 1,
  pageSize: 20
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

const columns = computed<TableColumnData[]>(() => [
  {
    title: '#',
    dataIndex: 'index',
    slotName: 'index',
    width: 40,
    fixed: 'left'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    slotName: 'operation',
    width: 40,
    fixed: 'left'
  },
  {
    title: '操作对象',
    dataIndex: 'target',
    slotName: 'target',
    align: 'center',
    width: 140
  },
  {
    title: '记录值',
    dataIndex: 'recordValue',
    slotName: 'recordValue',
    align: 'center',
    width: 100
  },

  {
    title: '执行时间',
    dataIndex: 'timestamp',
    align: 'center',
    width: 180,
    sortable: {
      sortDirections: ['descend', 'ascend']
    }
  }
])
const operationOptions = computed<SelectOptionData[]>(() => [
  {
    label: '全部',
    value: undefined
  },
  {
    label: '新增',
    value: 'insert'
  },
  {
    label: '修改',
    value: 'update'
  },
  {
    label: '删除',
    value: 'delete'
  }
])

const targetOptions = computed<SelectOptionData[]>(() => [
  {
    label: '全部',
    value: undefined
  },
  {
    label: '用户',
    value: '用户'
  },
  {
    label: '视频',
    value: '视频'
  },
  {
    label: '评论',
    value: '评论'
  },
  {
    label: '标签',
    value: '标签'
  },
  {
    label: '视频标签关系',
    value: '视频标签关系'
  },
  {
    label: '视频播放记录',
    value: '视频播放记录'
  },
  {
    label: '视频点赞记录',
    value: '视频点赞记录'
  },
  {
    label: '视频收藏记录',
    value: '视频收藏记录'
  },
  {
    label: '评论点赞记录',
    value: '评论点赞记录'
  },
  {
    label: '验证码记录',
    value: '验证码记录'
  },
  {
    label: '数据备份记录',
    value: '数据备份记录'
  }
])

const fetchData = async (params: PolicyParamsLog = { current: 1, pageSize: 20 }) => {
  setLoading(true)
  getDbLog()
    .then((logs) => {
      let results = logs
      if (params.operation) {
        results = results.filter((record) => record.operation === params.operation)
      }
      if (params.target) {
        results = results.filter((record) => record.target === params.target)
      }
      if (params.recordValue) {
        results = results.filter((record) =>
          record.recordValue.includes(params.recordValue as string)
        )
      }
      if (params.timestamp && params.timestamp.length === 2) {
        results = results.filter((record) =>
          isTimeInRange(params.timestamp as unknown as string[], record.timestamp)
        )
      }
      const data: LogListRes = {
        list: results,
        total: 0
      }
      renderData.value = data.list
      pagination.current = params.current
      pagination.total = data.total
      setLoading(false)
    })
    .catch((msg: string) => {
      Message.error({
        id: 'userList',
        content: msg
      })
      location.reload()
    })
  return
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
  name: 'logView'
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
