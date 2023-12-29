import { Dayjs } from 'dayjs'

export interface DanMuProps {
  duration: Number // barrage display time, Unit is `ms`(The minimum is 5000 ms)
  id: String
  start?: Number // Barrage appearance time, Unit is `ms`
  prior?: Boolean // Whether the barrage is displayed first，default false
  color?: Boolean // The barrage is a color barrage, default false
  txt: String // Barrage text content
  style?: {
    // Barrage custom style
    color?: String // E.g：'#ff9500',
    fontSize?: String // E.g：'20px',
    padding?: String // E.g： 2px 11px',
  }
  /**
   * Display mode, default is `scroll`
   * `top`- Top center
   * `bottom`- Bottom center
   * `scroll`- Scroll display
   */
  mode?: String
  like?: {
    // Like parameter
    el: HTMLElement // Only support dom
    style?: {
      // Binding style
      paddingLeft: String //E.g: '10px',
      color: String //E.g:'#ff0000'
    }
  }
}

export interface RawVideo {
  author_id: number
  author_name: string
  author_avatar: string
  cover: string
  height: number
  id: number
  left: number
  loaded: boolean
  publish_time: string
  title: string
  top: number
  url: string
  width: number
  status: 'online' | 'offline' | 'awaitApproval'
}

export interface VideoMedia {
  id: number
  title: string
  authorId: number
  authorAvatar: string
  authorName: string
  url: string
  cover: string
  height: number
  width: number
  status: 'online' | 'offline' | 'awaitApproval'
  description?: string
  danmu?: DanMuProps[]
  actualHeight?: number
  actualWidth?: number
  top: number
  left: number
  loaded: boolean
  publishTime: string
}

export interface NotificationData {
  title: string
  time: Dayjs
  svg: any
  // img?: unknown;
}
