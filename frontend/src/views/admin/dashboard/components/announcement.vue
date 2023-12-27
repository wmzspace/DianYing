<template>
  <a-card
    class="general-card"
    :title="$t('workplace.announcement')"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '15px 20px 13px 20px' }"
    :loading="loading"
  >
    <template #extra>
      <a-link @click="$router.push({ name: 'logView' })">{{ $t('workplace.viewMore') }}</a-link>
    </template>
    <div>
      <div v-for="(item, idx) in list" :key="idx" class="item">
        <a-tag :color="item.type" size="small">{{ item.label }}</a-tag>
        <span class="item-content" @click="$router.push({ name: 'logView' })">
          {{ item.content }}
        </span>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { getDbLog } from '@/utils/database'
import useLoading from '@/hooks/loading'
import { getTimeDiffUntilNow } from '@/utils/tools'

const { loading, setLoading } = useLoading()

setLoading(true)
getDbLog()
  .then((logs) => {
    logs.slice(0, 6).forEach((log) => {
      const type =
        log.operation === 'insert' ? 'cyan' : log.operation === 'update' ? 'blue' : 'orangered'
      const listItem = {
        type: type,
        label: log.operation === 'insert' ? '新增' : log.operation === 'update' ? '修改' : '删除',
        content: log.target.concat(' ').concat(getTimeDiffUntilNow(log.timestamp))
      }
      list.push(listItem)
    })
  })
  .finally(() => {
    setLoading(false)
  })

const list = reactive<
  {
    type: string
    label: string
    content: string
  }[]
>([])

// [
// {
//   type: 'orangered',
//   label: '活动',
//   content: '内容最新优惠活动'
// },
// {
//   type: 'cyan',
//   label: '消息',
//   content: '新增内容尚未通过审核，详情请点击查看。'
// },
// {
//   type: 'cyan',
//   label: '消息',
//   content: '新增内容尚未通过审核，详情请点击查看。'
// },
// {
//   type: 'blue',
//   label: '通知',
//   content: '当前产品试用期即将结束，如需续费请点击查看。'
// },
// {
//   type: 'blue',
//   label: '通知',
//   content: '1月新系统升级计划通知'
// },
// {
//   type: 'cyan',
//   label: '消息',
//   content: '新增内容已经通过审核，详情请点击查看。'
// }
// ]
</script>

<style scoped lang="less">
.item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 24px;
  margin-bottom: 4px;
  .item-content {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 4px;
    color: var(--color-text-2);
    text-decoration: none;
    font-size: 13px;
    cursor: pointer;
  }
}
</style>
