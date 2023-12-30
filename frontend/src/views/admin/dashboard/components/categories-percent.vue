<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{
        padding: '20px'
      }"
    >
      <template #title>
        {{ $t('workplace.categoriesPercent') }}
      </template>
      <Chart height="310px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import useLoading from '@/hooks/loading'
import useChartOption from '@/hooks/chart-option'
import { computed, ref } from 'vue'
import { getTagStatistic } from '@/utils/tag'
import { getVideoInfoAll } from '@/utils/video'
import { simplifyNumber } from '@/utils/tools'

const { loading, setLoading } = useLoading()

const tagStatistic = ref<{ name: string; count: number }[]>([])
const SHOW_TAGS_NUM = 5
const tagNames = computed(() => tagStatistic.value.slice(0, SHOW_TAGS_NUM).map((e) => e.name))
const tagCount = computed(() => tagStatistic.value.slice(0, SHOW_TAGS_NUM).map((e) => e.count))
getTagStatistic().then((data) => {
  tagStatistic.value = data
})

const totalContentNum = ref(0)

setLoading(true)
getVideoInfoAll()
  .then((videos) => {
    totalContentNum.value = videos.length
  })
  .finally(() => {
    setLoading(false)
  })

const { chartOption } = useChartOption((isDark) => {
  // echarts support https://echarts.apache.org/zh/theme-builder.html
  // It's not used here
  return {
    legend: {
      left: 'center',
      data: tagNames.value,
      bottom: 0,
      icon: 'circle',
      itemWidth: 8,
      textStyle: {
        color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969'
      },
      itemStyle: {
        borderWidth: 0
      }
    },
    tooltip: {
      show: true,
      trigger: 'item'
    },
    graphic: {
      elements: [
        {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
            text: '内容量',
            textAlign: 'center',
            fill: isDark ? '#ffffffb3' : '#4E5969',
            fontSize: 14
          }
        },
        {
          type: 'text',
          left: 'center',
          top: '50%',
          style: {
            text: totalContentNum.value,
            textAlign: 'center',
            fill: isDark ? '#ffffffb3' : '#1D2129',
            fontSize: 16,
            fontWeight: 500
          }
        }
      ]
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        label: {
          formatter: '{d}%',
          fontSize: 14,
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969'
        },
        itemStyle: {
          borderColor: isDark ? '#232324' : '#fff',
          borderWidth: 1
        },
        data: tagNames.value.map((_, index) => {
          return {
            value: tagCount.value[index],
            name: tagNames.value[index],
            itemStyle: {
              color: isDark ? itemStyles[index].dark : itemStyles[index].light
            }
          }
        })

        //   [
        //   {
        //     value: tagCount.value[0],
        //     name: tagNames.value[0],
        //     itemStyle: {
        //       color: isDark ? itemStyles[0].dark : itemStyles[0].light
        //     }
        //   },
        //   {
        //     value: tagCount.value[1],
        //     name: tagNames.value[1],
        //     itemStyle: {
        //       color: isDark ? itemStyles[1].dark : itemStyles[1].light
        //     }
        //   },
        //   {
        //     value: tagCount.value[2],
        //     name: tagNames.value[2],
        //     itemStyle: {
        //       color: isDark ? itemStyles[2].dark : itemStyles[2].light
        //     }
        //   }
        // ]
      }
    ]
  }
})

const itemStyles = [
  {
    dark: '#3D72F6',
    light: '#249EFF'
  },
  {
    dark: '#A079DC',
    light: '#313CA9'
  },
  {
    dark: '#6CAAF5',
    light: '#21CCFF'
  },
  // ------------,
  {
    dark: '#9a6cf5',
    light: '#215cff'
  },
  {
    dark: '#716cf5',
    light: '#21e5ff'
  }
]
</script>

<style scoped lang="less"></style>
