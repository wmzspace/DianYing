import { Dayjs } from 'dayjs'

export interface VideoMedia {
  id: number
  title: string
  url: string
  cover?: string
  description?: string
  height?: number
  width?: number
  actualHeight?: number
  actualWidth?: number
  top: number
  left: number
}

export interface NotificationData {
  title: string
  time: Dayjs
  svg: any
  // img?: unknown;
}
