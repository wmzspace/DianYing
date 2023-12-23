import axios from 'axios'
import type { TableData } from '@arco-design/web-vue/es/table/interface'
import { imageList, textList, videoList } from '@/views/admin/dashboard/mock'

export interface ContentDataRecord {
  x: string
  y: number
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data')
}

export interface PopularRecord {
  key: number
  clickNumber: string
  title: string
  increases: number
}

export function queryPopularList(params: { type: string }) {
  // return axios.get<TableData[]>('/api/popular/list', { params });
  return new Promise<{ data: any[] }>((resolve) => {
    if (params.type === 'image') {
      resolve({ data: [...imageList] })
    }
    if (params.type === 'video') {
      resolve({ data: [...videoList] })
      // resolve({ data: [] })
    }
    resolve({ data: [...textList] })
  })
}
