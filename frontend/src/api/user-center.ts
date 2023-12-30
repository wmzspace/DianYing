import axios, { type CancelToken } from 'axios'
import { prefix_url } from '@/api/index'

export interface MyProjectRecord {
  id: number
  name: string
  description: string
  peopleNumber: number
  contributors: {
    name: string
    email: string
    avatar: string
  }[]
}
export function queryMyProjectList() {
  return axios.post('/api/user/my-project/list')
}

export interface MyTeamRecord {
  id: number
  avatar: string
  name: string
  peopleNumber: number
}
export function queryMyTeamList() {
  return axios.post('/api/user/my-team/list')
}

export interface LatestActivity {
  id: number
  title: string
  description: string
  avatar: string
}
export function queryLatestActivity() {
  return axios.post<LatestActivity[]>('/api/user/latest-activity')
}

export function saveUserInfo() {
  return axios.post('/api/user/save-info')
}

export interface BasicInfoModel {
  age: number
  id: number | string
  email: string
  nickname: string
  gender: string
  area: string
  password: string
  signature: string
}

export interface EnterpriseCertificationModel {
  accountType: number
  status: number
  time: string
  legalPerson: string
  certificateType: string
  authenticationNumber: string
  enterpriseName: string
  enterpriseCertificateType: string
  organizationCode: string
}

export type CertificationRecord = Array<{
  certificationType: number
  certificationContent: string
  status: number
  time: string
}>

export interface UnitCertification {
  enterpriseInfo: EnterpriseCertificationModel
  record: CertificationRecord
}

export function queryCertification() {
  return axios.post<UnitCertification>('/api/user/certification')
}

export function userUploadApi(
  data: FormData,
  config: {
    controller: AbortController
    onUploadProgress?: (progressEvent: any) => void
    cancelToken?: CancelToken
  },
  type: 'avatar' | 'video'
) {
  // const controller = new AbortController();
  return axios.post(prefix_url.concat(`user/upload/${type}`), data, config)
  // return new Promise<{ data: string }>((resolve) => {
  //   fetch(prefix_url.concat("user/upload/avatar"),{})
  //   resolve({
  //     data: 'ok'
  //   })
  // })
}
