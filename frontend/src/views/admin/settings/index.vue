<template>
  <div class="container">
    <Breadcrumb :addition-items="['高级管理']" />
    <a-card class="general-card" title="数据备份">
      <a-row style="height: 50px">
        <a-col :flex="1">
          <a-row>
            <a-form :model="formModel" ref="backupFormRef">
              <!--            <a-row :gutter="1">-->
              <!--              <a-col :span="16">-->
              <a-form-item
                field="name"
                label="还原点:"
                :hide-label="true"
                :rules="{
                  required: true,
                  message: '请输入还原点名称'
                }"
              >
                <a-input v-model.trim="formModel.name" placeholder="请输入还原点名称" />
              </a-form-item>
              <!--              </a-col>-->
              <!--                      </a-row>-->
            </a-form>
          </a-row>
        </a-col>
        <a-divider style="height: 38px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="horizontal" :size="18">
            <!--          <a-button type="primary" @click="search">-->
            <!--            <template #icon>-->
            <!--              <icon-search />-->
            <!--            </template>-->
            <!--            搜索-->
            <!--          </a-button>-->
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button
              type="primary"
              @click="handleCreateBackup"
              :loading="createLoadObject === undefined ? false : createLoadObject.loading.value"
              status="danger"
              v-if="
                formModel.name !== undefined &&
                formModel.name.length > 0 &&
                renderData.map((e) => e.name).includes(formModel.name)
              "
            >
              <template #icon>
                <icon-refresh />
              </template>
              覆盖
            </a-button>
            <a-button
              v-else
              type="primary"
              @click="handleCreateBackup"
              :loading="createLoadObject === undefined ? false : createLoadObject.loading.value"
            >
              <template #icon>
                <icon-plus />
              </template>
              新建
            </a-button>
            <a-button @click="search">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="search">
              <template #icon>
                <icon-refresh />
              </template>
              刷新
            </a-button>
            <span style="color: red; margin-left: 10px; white-space: nowrap"
              >"__protect__": 删改保护标记</span
            >
          </a-space>
        </a-col>
        <a-col :span="12" style="display: flex; align-items: center; justify-content: end">
          <a-button @click="handleForceRollBack" :type="'primary'" :status="'danger'">
            <template #icon>
              <icon-exclamation-polygon-fill />
            </template>
            重置数据库
          </a-button>
          <!--          <a-tooltip :content="$t('searchTable.actions.refresh')">-->
          <!--            <div class="action-icon" @click="search"><icon-refresh size="18" /></div>-->
          <!--          </a-tooltip>-->
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="'缩放'">
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
        :scrollbar="true"
        column-resizable
        @page-change="onPageChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #name="{ record }">
          <a-tooltip>
            <div class="one-line">{{ record.name }}</div>
            <template #content>{{ record.name }}</template>
          </a-tooltip>
        </template>
        <template #path="{ record }">
          <a-tooltip>
            <div class="one-line">{{ record.path }}</div>
            <template #content>{{ record.path }}</template>
          </a-tooltip>
        </template>
        <template #operations="{ record, rowIndex }">
          <div style="display: flex; align-items: center; justify-content: center">
            <a-button
              type="text"
              size="small"
              :status="'normal'"
              style="padding: 6px"
              @click="handleRollBack(record.name)"
            >
              还原
            </a-button>
            <a-button
              type="text"
              size="small"
              :status="'danger'"
              style="padding: 6px"
              @click="handleDeleteBackup(record, rowIndex)"
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
import { type BackupListRes, type BackupQueryForm, type PolicyParamsBackup } from '@/api/list'
import type { Pagination } from '@/types/global'
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface'
import cloneDeep from 'lodash/cloneDeep'
import { Message } from '@arco-design/web-vue'
import { useUserStore } from '@/store'
import { isTimeInRange } from '@/utils/tools'
import { useMainStore } from '@/store/main'
import {
  type BackupRecord,
  createBackup,
  deleteBackup,
  getDbBackup,
  resetDatabase,
  rollBackDatabase
} from '@/utils/database'
import { areas } from '@/views/user/profile/mock'

type SizeProps = 'mini' | 'small' | 'medium' | 'large'
type Column = TableColumnData & { checked?: true }

const mainStore = useMainStore()

const editLoadObject = useLoading()
const editLoading = editLoadObject.loading
const setEditLoading = editLoadObject.setLoading

const generateFormModel = () => {
  let record: BackupQueryForm = {
    name: undefined
  }
  return record
}
const formModel = ref(generateFormModel())
const backupFormRef = ref()

const createLoadObject = useLoading()
const handleCreateBackup = () => {
  backupFormRef.value.validate().then((value: any) => {
    if (value === undefined) {
      createLoadObject.setLoading(true)
      createBackup(formModel.value.name as string)
        .catch((msg) => {
          Message.error({
            id: 'createBackup',
            content: msg
          })
        })
        .finally(() => {
          formModel.value.name = undefined
          search()
          createLoadObject.setLoading(false)
        })
    }
  })
}

const handleForceRollBack = () => {
  setEditLoading(true)
  resetDatabase()
    .catch((msg) => {
      Message.error({
        id: 'forceRollBack',
        content: msg
      })
    })
    .finally(() => {
      search()
      setEditLoading(false)
    })
}

const handleRollBack = (name: string) => {
  setEditLoading(true)
  rollBackDatabase(name)
    .catch((msg) => {
      Message.error({
        id: 'rollBack',
        content: msg
      })
    })
    .finally(() => {
      search()
      setEditLoading(false)
    })
}

const handleDeleteBackup = (record: BackupRecord, rowIndex: number) => {
  setEditLoading(true)
  if (record.id !== renderData.value[rowIndex].id) {
    Message.error({
      id: 'deleteBackup',
      content: '删除失败：数据异常'
    })
    location.reload()
  }
  deleteBackup(record.name)
    .catch((msg) => {
      Message.error({
        id: 'deleteBackup',
        content: msg
      })
    })
    .finally(() => {
      search()
      setEditLoading(false)
    })
}

const { loading, setLoading } = useLoading(true)
const { t } = useI18n()

const renderData = ref<BackupRecord[]>([])
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
    width: 10,
    fixed: 'left'
  },
  {
    title: '名称',
    dataIndex: 'name',
    slotName: 'name',
    width: 20
  },
  {
    title: '路径',
    dataIndex: 'path',
    slotName: 'path',
    align: 'center',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 120,
    align: 'center',
    sortable: {
      sortDirections: ['descend', 'ascend']
    }
  },
  {
    title: '操作',
    dataIndex: 'operations',
    slotName: 'operations',
    align: 'center',
    fixed: 'right',
    width: 40
  }
])

const fetchData = async (params: PolicyParamsBackup = { current: 1, pageSize: 20 }) => {
  setLoading(true)
  getDbBackup()
    .then((backups) => {
      const data: BackupListRes = {
        list: backups,
        total: 0
      }
      renderData.value = data.list
      pagination.current = params.current
      pagination.total = data.total
      setLoading(false)
    })
    .catch((msg: string) => {
      Message.error({
        id: 'backupList',
        content: msg
      })
      location.reload()
    })
}

const search = () => {
  backupFormRef.value.clearValidate()
  fetchData({
    ...basePagination,
    ...formModel.value
  } as unknown as PolicyParamsBackup)
}
const onPageChange = (current: number) => {
  fetchData({ ...basePagination, current })
}

fetchData()
const reset = () => {
  formModel.value = generateFormModel()
  backupFormRef.value.clearValidate()
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
  name: 'adminSetting'
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
