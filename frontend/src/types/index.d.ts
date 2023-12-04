import { Dayjs } from 'dayjs'

export interface VideoMedia {
  id: number
  title: string
  url: string
  description?: string
  height: number
  width?: number
}

export interface NotificationData {
  title: string
  time: Dayjs
  svg: any
  // img?: unknown;
}
