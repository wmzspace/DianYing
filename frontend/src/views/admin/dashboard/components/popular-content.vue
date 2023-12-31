<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title>
        {{ $t('workplace.popularContent') }}
      </template>
      <template #extra>
        <!--        <a-link>{{ $t('workplace.viewMore') }}</a-link>-->
        <span>热度 Top10</span>
      </template>
      <a-space direction="vertical" :size="10" fill>
        <a-radio-group v-model:model-value="type" type="button">
          <a-radio value="video">
            {{ $t('workplace.popularContent.video') }}
          </a-radio>
          <a-radio value="image" disabled>
            {{ $t('workplace.popularContent.image') }}
          </a-radio>
          <a-radio value="text" disabled>
            {{ $t('workplace.popularContent.text') }}
          </a-radio>
        </a-radio-group>
        <a-table
          :data="renderList"
          :pagination="false"
          :bordered="false"
          :scroll="{ x: '100%', y: '264px' }"
        >
          <template #columns>
            <a-table-column title="排名" data-index="index" :align="'center'" :fixed="'left'">
              <template #cell="{ rowIndex }">
                <a-typography-paragraph
                  :ellipsis="{
                    rows: 1
                  }"
                >
                  {{ rankingArr ? rankingArr[rowIndex] : '-' }}
                </a-typography-paragraph>
              </template>
            </a-table-column>
            <a-table-column title="内容标题" data-index="videoTitle">
              <template #cell="{ record }">
                <a-typography-paragraph
                  :ellipsis="{
                    rows: 1
                  }"
                >
                  {{ record.videoTitle }}
                </a-typography-paragraph>
              </template>
            </a-table-column>
            <a-table-column title="点击量" data-index="playCount" :align="'center'">
              <template #cell="{ record }">
                <a-typography-paragraph
                  :ellipsis="{
                    rows: 1
                  }"
                >
                  {{ simplifyNumber(record.playCount, 0, 'EN').string }}
                </a-typography-paragraph>
              </template>
            </a-table-column>
            <!--            <a-table-column-->
            <!--              title="日涨幅"-->
            <!--              data-index="increases"-->
            <!--              :sortable="{-->
            <!--                sortDirections: ['ascend', 'descend']-->
            <!--              }"-->
            <!--            >-->
            <!--              <template #cell="{ record }">-->
            <!--                <div class="increases-cell">-->
            <!--                  <span>{{ record.increases }}%</span>-->
            <!--                  <icon-caret-up-->
            <!--                    v-if="record.increases !== 0"-->
            <!--                    style="color: #f53f3f; font-size: 8px"-->
            <!--                  />-->
            <!--                </div>-->
            <!--              </template>-->
            <!--            </a-table-column>-->
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import useLoading from '@/hooks/loading'
import type { TableData } from '@arco-design/web-vue/es/table/interface'
import { getVideoInfoAll } from '@/utils/video'
import { getRankings, simplifyNumber } from '@/utils/tools'

const type = ref('video')
const { loading, setLoading } = useLoading()
const renderList = ref<TableData[]>()
const rankingArr = computed(() =>
  renderList.value !== undefined ? getRankings(renderList.value.map((e) => e.playCount)) : undefined
)

setLoading(true)
getVideoInfoAll()
  .then((records) => {
    renderList.value = records.sort((a, b) => b.playCount - a.playCount).slice(0, 10)
  })
  .finally(() => {
    setLoading(false)
  })
</script>

<style scoped lang="less">
.general-card {
  min-height: 395px;
}
:deep(.arco-table-tr) {
  height: 44px;
  .arco-typography {
    margin-bottom: 0;
  }
}
.increases-cell {
  display: flex;
  align-items: center;
  span {
    margin-right: 4px;
  }
}
</style>
