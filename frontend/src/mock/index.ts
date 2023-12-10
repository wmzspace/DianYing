import type { DanMuProps, VideoMedia } from '@/types'
import { reactive } from 'vue'
import { prefix_url } from '@/api'
import type { User } from '@/store/user'

export interface AjaxResponse {
  ajax_data: object
  ajax_msg: string
  ajax_ok: boolean
}

export const getVideoById = (videoId: number | string) => {
  const id = typeof videoId === 'string' ? parseInt(videoId) : videoId
  return new Promise<VideoMedia | undefined>((resolve, reject) => {
    fetch(prefix_url + `/video/query?id=${videoId}`).then((res) => {
      if (res.ok) {
        res.json().then((data: VideoMedia[] | undefined) => {
          resolve(data?.[0])
        })
      }
    })
  })
  // return videos.filter((v) => v.id === id)[0]
}
import _ from 'lodash'
import { Message } from '@arco-design/web-vue'
import { method, reject } from 'lodash-es'
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
          res.json().then((data: RawComment[]) => {
            data.forEach((e) => {
              const comment: Comment = {
                authorId: e.author_id,
                content: e.content,
                publishTime: e.publish_time,
                id: e.id,
                parentId: e.parent_id === null ? undefined : e.parent_id,
                videoId: e.video_id
              }
              result.push(comment)
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
export const getCommentLikeUsersByCommentId = (commentId: number) =>
  new Promise<User[]>((resolve, reject) => {
    fetch(prefix_url.concat(`comment/get_likes?comment_id=${commentId}`))
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              resolve(ajaxData.ajax_data as User[])
            }
          })
        }
      })
      .catch((e) => {
        Message.error(e.message)
        // resolve([])
        reject(e)
      })
  })

export const likeCommentOrNot = (commentId: number, userId: number, toLike: boolean) =>
  new Promise<void>((resolve, reject) => {
    fetch(
      prefix_url.concat(`comment/like?comment_id=${commentId}&user_id=${userId}&to_like=${toLike}`),
      {
        method: 'POST'
      }
    )
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success(ajaxData.ajax_msg)
            } else {
              Message.info(ajaxData.ajax_msg)
            }
            resolve()
          })
        }
      })
      .catch((e) => {
        Message.error(e.message)
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
  videoId: number
  parentId?: number
  authorId: number
  content: string
  publishTime: string
}

export interface RawComment {
  id: number
  author_id: number
  video_id: number
  content: string
  parent_id: number | null
  publish_time: string
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
