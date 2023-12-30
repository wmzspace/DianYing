import axios from 'axios'
import { prefix_url } from '@/api/index'

export interface VideoUploadFormModel1 {
  authorId: number | string
  url: string
  // cover: string
  height: number
  width: number
  cover: string
}

// export interface ChannelInfoModel {
//   advertisingSource: string
//   advertisingMedia: string
//   keyword: string[]
//   pushNotify: boolean
//   advertisingContent: string
// }

export interface VideoUploadFormModel2 {
  cover: string
  title: string
  tags: string[]
}

export type VideoUploadFormModelUnit = VideoUploadFormModel1 & VideoUploadFormModel2

export function submitChannelForm(data: VideoUploadFormModelUnit) {
  return axios.post(prefix_url.concat('video/post'), { data })
}
