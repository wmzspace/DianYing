import axios from 'axios'
import qs from 'query-string'
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface'
import type { BackupRecord } from '@/utils/database'
import type { VideoMedia } from '@/types'

export interface VideoRecord {
  authorName: string
  authorId: number
  videoId: number | string
  videoTitle: string
  contentType: 'horizontalVideo' | 'verticalVideo'
  // filterType: 'artificial' | 'rules';
  playCount: number
  likeCount: number
  starCount: number
  commentCount: number
  status: 'online' | 'offline' | 'awaitApproval'
  publishTime: string
  tags: string[]
}

export interface UserRecord {
  nickName: string
  id: number | string
  email: string
  password: string
  age: number
  gender: 'male' | 'female'
  videoNum: number
  likedNum: number
  playedNum: number
  signature: string
  registerTime: string
  area: string
  avatar: string
}

export interface VideoRecordCanEdit extends VideoRecord {
  isEditing: boolean
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

export interface UserQueryForm {
  nickName: string | undefined
  email: string | undefined
  age: number | undefined
  gender: 'male' | 'female' | undefined
  registerTime: string[] | undefined
  area: string | undefined
}

export interface BackupQueryForm {
  name: string | undefined
}

export interface PolicyParamsVideo extends Partial<VideoQueryForm> {
  current: number
  pageSize: number
}

export interface PolicyParamsUser extends Partial<UserQueryForm> {
  current: number
  pageSize: number
}

export interface PolicyParamsBackup extends Partial<BackupQueryForm> {
  current: number
  pageSize: number
}

export interface UserListRes {
  list: UserRecord[]
  total: number
}

export interface VideoListRes {
  list: VideoRecord[]
  total: number
}
export interface BackupListRes {
  list: BackupRecord[]
  total: number
}

export function queryPolicyList(params: PolicyParamsVideo) {
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
