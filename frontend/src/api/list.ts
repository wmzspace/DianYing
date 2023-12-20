import axios from 'axios'
import qs from 'query-string'
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface'

export interface VideoRecord {
  authorName: string
  videoId: number | string
  videoTitle: string
  contentType: 'horizontalVideo' | 'verticalVideo'
  // filterType: 'artificial' | 'rules';
  likeCount: number
  starCount: number
  commentCount: number
  status: 'online' | 'offline' | 'awaitApproval'
  publishTime: string
  tags: string[]
}

export interface VideoQueryForm {
  authorName: string | undefined
  videoId: string | undefined
  videoTitle: string | undefined
  contentType: 'horizontalVideo' | 'verticalVideo' | undefined
  // filterType: 'artificial' | 'rules';
  status: 'online' | 'offline' | 'awaitApproval' | undefined
  publishTime: string[] | undefined
  tags: string[] | undefined
}

export interface PolicyParams extends Partial<VideoQueryForm> {
  current: number
  pageSize: number
}

export interface VideoListRes {
  list: VideoRecord[]
  total: number
}

export function queryPolicyList(params: PolicyParams) {
  return axios.get<VideoListRes>('/api/list/policy', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj)
    }
  })
}

export interface ServiceRecord {
  id: number
  title: string
  description: string
  name?: string
  actionType?: string
  icon?: string
  data?: DescData[]
  enable?: boolean
  expires?: boolean
}
export function queryInspectionList() {
  return axios.get('/api/list/quality-inspection')
}

export function queryTheServiceList() {
  return axios.get('/api/list/the-service')
}

export function queryRulesPresetList() {
  return axios.get('/api/list/rules-preset')
}
