import type { DanMuProps, VideoMedia } from '@/types'
import { reactive } from 'vue'
import { prefix_url } from '@/api'
import type { User } from '@/store/user'

export const getVideoById = (videoId: number | string) => {
  const id = typeof videoId === 'string' ? parseInt(videoId) : videoId
  return new Promise<VideoMedia | undefined>((resolve, reject) => {
    fetch(prefix_url + `/video/query?id=${videoId}`).then((res) => {
      if (res.ok) {
        res.json().then((data: VideoMedia[] | undefined) => {
          console.log('video', data?.[0])
          resolve(data?.[0])
        })
      }
    })
  })
  // return videos.filter((v) => v.id === id)[0]
}
import _ from 'lodash'
import { Message } from '@arco-design/web-vue'
// export const pullVideo = (num: number): VideoMedia[] => {
//   return _.cloneDeep(_.sampleSize(videos, num))
// }

export const pullVideo = (num: number) =>
  new Promise<VideoMedia[]>((resolve, reject) => {
    const result: VideoMedia[] = []
    fetch(prefix_url.concat(`video/get?num=${num}`), {
      method: 'GET'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            console.log(data)
            const rawVideos: [] = data
            rawVideos.forEach((e: VideoMedia) => {
              e.top = 0
              e.left = 0
              e.loaded = false
              result.push(e)
            })
            resolve(_.cloneDeep(result))
            // return _.cloneDeep(_.sampleSize(videos, num))
          })
        }
      })
      .catch((e) => {
        Message.error(e)
        reject(e)
      })
  })

export const getCommentsByVideoId = (videoId: number) =>
  new Promise<Comment[]>((resolve, reject) => {
    const result: Comment[] = []
    fetch(prefix_url.concat(`comment/get?video_id=${videoId}`), {
      method: 'GET'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            console.log('comments:', data)
            const rawVideos: [] = data
            rawVideos.forEach((e: Comment) => {
              result.push(e)
            })
            resolve(_.cloneDeep(result))
            // return _.cloneDeep(_.sampleSize(videos, num))
          })
        }
      })
      .catch((e) => {
        Message.error(e)
        reject(e)
      })
  })

// export const users: User[] = reactive([
//   {
//     id: 1,
//     name: '19岁带饭冲锋🌈',
//     avatar: 'images/avatar.jpeg'
//   }
// ])

export interface Comment {
  id: number
  parentId?: number
  authorId: number
  content: string
  datetime: string
}

// export const comments = reactive([])
export const videos: VideoMedia[] = reactive([])

// export const comments: Comment[] = reactive([
//   {
//     id: 1,
//     authorId: 1,
//     content: '别太荒谬了哥们，别太荒谬了哥们',
//     datetime: '1小时'
//   },
//   {
//     id: 2,
//     authorId: 2,
//     content: '跟我谈😍',
//     datetime: '21分钟'
//   },
//   {
//     id: 3,
//     authorId: 3,
//     content: '我好喜欢',
//     datetime: '1分钟'
//   }
// ])

// (() => {
//   const result = [
//     {
//       id: '0',
//       start: 100,
//       duration: 5000,
//       txt: '666'
//     },
//     {
//       id: '0',
//       start: 2000,
//       duration: 5000,
//       txt: '666666'
//     },
//     {
//       id: '0',
//       start: 6000,
//       duration: 5000,
//       txt: '666666666'
//     }
//   ] as DanMuProps[]
//   result.forEach((e, index) => {
//     e.id = (index + 1).toString()
//     return e
//   })
//   return result
// })()
