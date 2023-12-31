<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '20px'
      }"
      :title="$t('workplace.contentData')"
    >
      <template #extra>
        <span>最近七天</span>
      </template>
      <Chart height="289px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { graphic } from 'echarts'
import useLoading from '@/hooks/loading'
import { queryContentData } from '@/api/dashboard'
import type { ContentDataRecord } from '@/api/dashboard'
import useChartOption from '@/hooks/chart-option'
import type { ToolTipFormatterParams } from '@/types/echarts'
import type { AnyObject } from '@/types/global'
import dayjs from 'dayjs'
import { prefix_url } from '@/api'
import { Message } from '@arco-design/web-vue'
import { simplifyNumber } from '@/utils/tools'

function graphicFactory(side: AnyObject) {
  return {
    type: 'text',
    bottom: '8',
    ...side,
    style: {
      text: '',
      textAlign: 'center',
      fill: '#4E5969',
      fontSize: 12
    }
  }
}
const { loading, setLoading } = useLoading(true)
const xAxis = ref<string[]>([])
const chartsData = ref<number[]>([])
const graphicElements = ref([graphicFactory({ left: '2.6%' }), graphicFactory({ right: 0 })])
const { chartOption } = useChartOption(() => {
  return {
    grid: {
      left: '2.6%',
      right: '0',
      top: '10',
      bottom: '30'
    },
    xAxis: {
      type: 'category',
      offset: 2,
      data: xAxis.value,
      boundaryGap: false,
      axisLabel: {
        color: '#4E5969',
        formatter(value: number, idx: number) {
          if (idx === 0) return ''
          if (idx === xAxis.value.length - 1) return ''
          // return `${value}`
          return value
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        interval: (idx: number) => {
          if (idx === 0) return false
          if (idx === xAxis.value.length - 1) return false
          return true
        },
        lineStyle: {
          color: '#E5E8EF'
        }
      },
      axisPointer: {
        show: true,
        lineStyle: {
          color: '#23ADFF',
          width: 2
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        formatter(value: any, idx: number) {
          if (idx === 0) return value
          return simplifyNumber(value, 0, 'EN').string
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#E5E8EF'
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        const [firstElement] = params as ToolTipFormatterParams[]
        return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            <div class="content-panel"><span>日增流量</span><span class="tooltip-value">${Number(
              firstElement.value
            ).toLocaleString()}</span></div>
          </div>`
      },
      className: 'echarts-tooltip-diy'
    },
    graphic: {
      elements: graphicElements.value
    },
    series: [
      {
        data: chartsData.value,
        type: 'line',
        smooth: true,
        // symbol: 'circle',
        symbolSize: 12,
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderWidth: 2
          }
        },
        lineStyle: {
          width: 3,
          color: new graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: 'rgba(30, 231, 255, 1)'
            },
            {
              offset: 0.5,
              color: 'rgba(36, 154, 255, 1)'
            },
            {
              offset: 1,
              color: 'rgba(111, 66, 251, 1)'
            }
          ])
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(17, 126, 255, 0.16)'
            },
            {
              offset: 1,
              color: 'rgba(17, 128, 255, 0)'
            }
          ])
        }
      }
    ]
  }
})

const fetchData = async () => {
  setLoading(true)
  fetch(prefix_url.concat('video/get/weekly'))
    .then((res) => {
      if (res.ok) {
        res.json().then((chartData: ContentDataRecord[]) => {
          chartData.forEach((el: ContentDataRecord, idx: number) => {
            xAxis.value.push(el.x)
            chartsData.value.push(el.y)
            if (idx === 0) {
              graphicElements.value[0].style.text = el.x
            }
            if (idx === chartData.length - 1) {
              graphicElements.value[1].style.text = el.x
            }
          })
        })
      } else {
        Message.error(res.statusText)
      }
    })
    .catch((e) => {
      Message.error(e.message)
    })
    .finally(() => {
      setLoading(false)
    })
}
fetchData()
</script>

<style scoped lang="less"></style>
