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
              <a-col :span="8">
                <a-form-item field="nickName" :label="$t('searchTable.user.form.nickName')">
                  <a-input
                    v-model="formModel.nickName"
                    :placeholder="$t('searchTable.user.form.nickName.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="status" :label="$t('searchTable.user.form.age')">
                  <a-input-number
                    :precision="0"
                    :min="0"
                    v-model="formModel.age"
                    :placeholder="$t('searchTable.user.form.age.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="gender" :label="$t('searchTable.user.form.gender')">
                  <a-select
                    v-model="formModel.gender"
                    :options="genderOptions"
                    :placeholder="$t('searchTable.user.form.selectDefault')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="email" :label="$t('searchTable.user.form.email')">
                  <a-input
                    v-model="formModel.email"
                    :placeholder="$t('searchTable.user.form.email.placeholder')"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="area" :label="$t('searchTable.user.form.area')">
                  <a-cascader
                    v-model="formModel.area"
                    :options="areas"
                    :placeholder="$t('searchTable.user.form.selectDefault')"
                    allow-clear
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="publishTime" :label="$t('searchTable.user.form.registerTime')">
                  <a-range-picker v-model="formModel.registerTime" style="width: 100%" />
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
            <a-button type="primary" @click="mainStore.setLoginVisible(true)">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t('searchTable.user.operation.create') }}
            </a-button>
            <a-tooltip :content="$t('searchTable.actions.refresh')">
              <a-button @click="search">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('searchTable.user.actions.refresh') }}
              </a-button>
            </a-tooltip>
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
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
        </template>
        <template #nickName="{ record }">
          <a-tooltip>
            <div class="one-line">{{ record.nickName }}</div>
            <template #content>{{ record.nickName }}</template>
          </a-tooltip>
        </template>
        <template #signature="{ record }">
          <div
            class="one-line"
            v-if="record.signature == undefined || record.signature.length === 0"
          >
            -
          </div>
          <a-tooltip v-else>
            <div class="one-line">
              {{ record.signature && record.signature.length > 0 ? record.signature : '-' }}
            </div>
            <template #content>{{ record.signature }}</template>
          </a-tooltip>
        </template>
        <template #age="{ record }">
          <div class="one-line" v-if="record.age == undefined || record.age === 0">-</div>
          <a-tooltip v-else>
            <div class="one-line">{{ record.age }}</div>
            <template #content>{{ record.age }}</template>
          </a-tooltip>
        </template>
        <template #email="{ record }">
          <a-tooltip>
            <div class="one-line">{{ record.email }}</div>
            <template #content>{{ record.email }}</template>
          </a-tooltip>
        </template>
        <template #password="{ record }">
          <a-tooltip>
            <div class="one-line">*****</div>
            <template #content>{{
              record.password && record.password.length > 0 ? record.password : '未设置'
            }}</template>
          </a-tooltip>
        </template>
        <template #gender="{ record }">
          <span>{{ $t(`searchTable.user.form.gender.${record.gender}`) }}</span>
        </template>

        <template #area="{ record }">
          {{ record.area }}
        </template>

        <template #operations="{ record, rowIndex }">
          <div style="display: flex; align-items: center; justify-content: center">
            <a-button
              type="text"
              size="small"
              :status="'normal'"
              style="padding: 6px"
              @click="$router.push({ name: 'userProfile', params: { user_id: record.id } })"
            >
              编辑
            </a-button>
            <a-button
              type="text"
              size="small"
              :status="'danger'"
              style="padding: 6px"
              @click="handleDeleteUser(record, rowIndex)"
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
  type VideoRecordCanEdit,
  type UserQueryForm,
  type UserListRes,
  type UserRecord,
  type PolicyParamsUser
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

type SizeProps = 'mini' | 'small' | 'medium' | 'large'
type Column = TableColumnData & { checked?: true }

const mainStore = useMainStore()

const editLoadObject = useLoading()
const editLoading = editLoadObject.loading
const setEditLoading = editLoadObject.setLoading

const getRecordIndex = (rowIndex: number) => {
  return pagination.pageSize * (pagination.current - 1) + rowIndex
}

const handleDeleteUser = (record: UserRecord, rowIndex: number) => {
  setEditLoading(true)
  if (record.id !== renderData.value[getRecordIndex(rowIndex)].id) {
    Message.error({
      id: 'videoEdit',
      content: '删除失败：数据异常'
    })
    location.reload()
  }
  userStore.deleteUser(record.id).finally(() => {
    search()
    setEditLoading(false)
  })
}

const generateFormModel = () => {
  let record: UserQueryForm = {
    age: undefined,
    area: undefined,
    email: undefined,
    gender: undefined,
    nickName: undefined,
    registerTime: undefined
  }
  return record
}

const userStore = useUserStore()
const { loading, setLoading } = useLoading(true)
const { t } = useI18n()

const renderData = ref<UserRecord[]>([])
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

const columns = computed<TableColumnData[]>(() => [
  {
    title: t('searchTable.user.columns.index'),
    dataIndex: 'index',
    slotName: 'index',
    width: 75,
    fixed: 'left'
  },
  {
    title: t('searchTable.user.columns.nickName'),
    dataIndex: 'nickName',
    slotName: 'nickName',
    align: 'center',
    width: 140
  },
  {
    title: t('searchTable.user.columns.gender'),
    dataIndex: 'gender',
    slotName: 'gender',
    align: 'center',
    width: 100,
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },

  {
    title: t('searchTable.user.columns.area'),
    dataIndex: 'area',
    slotName: 'area',
    align: 'center',
    width: 100,
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },
  {
    title: t('searchTable.user.columns.age'),
    dataIndex: 'age',
    slotName: 'age',
    align: 'center',
    width: 100,
    sortable: {
      sortDirections: ['ascend', 'descend']
    }
  },

  {
    title: t('searchTable.user.columns.signature'),
    dataIndex: 'signature',
    slotName: 'signature',
    align: 'center',
    width: 200
  },

  {
    title: t('searchTable.user.columns.videoNum'),
    dataIndex: 'videoNum',
    slotName: 'videoNum',
    align: 'center',
    width: 100,
    sortable: {
      sortDirections: ['descend', 'ascend']
    }
  },
  {
    title: t('searchTable.user.columns.playedNum'),
    dataIndex: 'playedNum',
    slotName: 'playedNum',
    align: 'center',
    width: 100,
    sortable: {
      sortDirections: ['descend', 'ascend']
    }
  },
  {
    title: t('searchTable.user.columns.email'),
    dataIndex: 'email',
    slotName: 'email',
    align: 'center',
    width: 180
  },
  {
    title: t('searchTable.user.columns.password'),
    dataIndex: 'password',
    slotName: 'password',
    align: 'center',
    width: 100
  },

  {
    title: t('searchTable.user.columns.registerTime'),
    dataIndex: 'registerTime',
    align: 'center',
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
const genderOptions = computed<SelectOptionData[]>(() => [
  {
    label: '男',
    value: 'male'
  },
  {
    label: '女',
    value: 'female'
  }
])

const inputValue = ref('')
const options = ref<string[]>([])
const allTags = ref<string[]>([])
onMounted(() => {
  getAllTags().then((tags) => {
    allTags.value = tags
    options.value = tags
  })
})

const fetchData = async (params: PolicyParamsUser = { current: 1, pageSize: 20 }) => {
  setLoading(true)
  userStore
    .getUserInfoAll()
    .then((users) => {
      let results = users
      if (params.nickName !== undefined && params.nickName.length > 0) {
        results = results.filter((record) => record.nickName.includes(params.nickName as string))
      }
      if (params.email !== undefined && params.email.length > 0) {
        results = results.filter((record) => record.email.includes(params.email as string))
      }
      if (params.gender) {
        results = results.filter((record) => record.gender === params.gender)
      }
      if (params.area) {
        results = results.filter((record) => record.area === params.area)
      }
      if (params.age !== undefined) {
        results = results.filter((record) => record.age === params.age)
      }
      if (params.registerTime && params.registerTime.length === 2) {
        results = results.filter((record) =>
          isTimeInRange(params.registerTime as unknown as string[], record.registerTime)
        )
      }

      const data: UserListRes = {
        list: results,
        total: results.length
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
  name: 'SearchTableUser'
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
