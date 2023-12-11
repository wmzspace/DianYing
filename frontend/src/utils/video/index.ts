import type { RawVideo, VideoMedia } from '@/types'
import { prefix_url } from '@/api'
import type { AjaxResponse } from '@/api'
import _ from 'lodash'
import { Message } from '@arco-design/web-vue'
import type { User } from '@/store/user'

export const getVideoById = (videoId: number | string) => {
  const id = typeof videoId === 'string' ? parseInt(videoId) : videoId
  return new Promise<VideoMedia | undefined>((resolve, reject) => {
    fetch(prefix_url + `/video/query?id=${videoId}`).then((res) => {
      if (res.ok) {
        res.json().then((data: RawVideo[]) => {
          resolve(parseVideoMedia(data[0]))
        })
      }
    })
  })
  // return videos.filter((v) => v.id === id)[0]
}

export const parseVideoMedia = (rawVideo: RawVideo): VideoMedia => {
  return {
    authorId: rawVideo.author_id,
    cover: rawVideo.cover,
    height: rawVideo.height,
    id: rawVideo.id,
    left: rawVideo.left,
    loaded: rawVideo.loaded,
    title: rawVideo.title,
    top: rawVideo.top,
    url: rawVideo.url,
    width: rawVideo.width,
    publishTime: rawVideo.publish_time
  }
}

export const pullVideo = (num: number) =>
  new Promise<VideoMedia[]>((resolve, reject) => {
    const result: VideoMedia[] = []
    fetch(prefix_url.concat(`video/get?num=${num}`), {
      method: 'GET'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data: RawVideo[]) => {
            const results: VideoMedia[] = []
            data.forEach((e) => {
              results.push(parseVideoMedia(e))
            })
            resolve(_.cloneDeep(results))
            // return _.cloneDeep(_.sampleSize(videos, num))
          })
        }
      })
      .catch((e) => {
        Message.error(e)
        reject(e)
      })
  })

// export const getVideoByVideoId = (videoId: number | undefined, parentId: number | undefined) => {
//   const result: VideoMedia[] = []
//   const videoString = videoId === undefined ? '' : `&video_id=${videoId}`
//   const parentString = parentId === undefined ? '' : `&parent_id=${parentId}`
//   return new Promise<VideoMedia[]>((resolve, reject) => {
//     fetch(prefix_url.concat(`video/get?`).concat(videoString).concat(parentString), {
//       method: 'POST'
//     })
//       .then((res) => {
//         if (res.ok) {
//           res.json().then((ajaxData: AjaxResponse) => {
//             if (ajaxData.ajax_ok) {
//               const data = ajaxData.ajax_data as RawVideo[]
//               data.forEach((e) => {
//                 const video: VideoMedia = {
//                   authorId: e.author_id,
//                   content: e.content,
//                   publishTime: e.publish_time,
//                   id: e.id,
//                   parentId: e.parent_id === null ? undefined : e.parent_id,
//                   videoId: e.video_id
//                 }
//                 result.push(video)
//               })
//               resolve(_.cloneDeep(result))
//             } else {
//               Message.info(ajaxData.ajax_msg)
//             }
//           })
//         }
//       })
//       .catch((e) => {
//         Message.error(e)
//         reject(e)
//       })
//   })
// }
export const getVideoActionUsersByVideoId = (videoId: number, action: string) =>
  new Promise<User[]>((resolve, reject) => {
    fetch(prefix_url.concat(`video/get_actions?video_id=${videoId}&action=${action}`))
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

export const likeOrStarVideoOrNot = (
  videoId: number,
  userId: number,
  toStatus: boolean,
  action: string
) =>
  new Promise<void>((resolve, reject) => {
    fetch(
      prefix_url.concat(
        `video/action?video_id=${videoId}&user_id=${userId}&to_status=${toStatus}&action=${action}`
      ),
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
