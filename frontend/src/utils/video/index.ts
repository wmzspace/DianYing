import type { RawVideo, VideoMedia } from '@/types'
import { prefix_url } from '@/api'
import type { AjaxResponse } from '@/api'
import _ from 'lodash'
import { Message } from '@arco-design/web-vue'
import type { VideoRecord } from '@/api/list'

export const getVideoById = (videoId: number | string) => {
  const id = typeof videoId === 'string' ? parseInt(videoId) : videoId
  return new Promise<VideoMedia | undefined>((resolve, reject) => {
    fetch(prefix_url + `/video/query?id=${videoId}`)
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              const data = ajaxData.ajax_data as RawVideo
              resolve(parseVideoMedia(data))
            } else {
              reject(ajaxData.ajax_msg)
            }
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
  // return videos.filter((v) => v.id === id)[0]
}

export const deleteVideoById = (videoId: number | string) =>
  new Promise<string>((resolve, reject) => {
    fetch(prefix_url.concat(`video/delete?id=${videoId}`), {
      method: 'POST'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              resolve(ajaxData.ajax_msg)
            } else {
              reject(ajaxData.ajax_msg)
            }
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export const parseVideoMedia = (rawVideo: RawVideo): VideoMedia => {
  return {
    authorId: rawVideo.author_id,
    authorAvatar: rawVideo.author_avatar,
    authorName: rawVideo.author_name,
    cover: rawVideo.cover,
    height: rawVideo.height,
    id: rawVideo.id,
    left: rawVideo.left,
    loaded: rawVideo.loaded,
    title: rawVideo.title,
    top: rawVideo.top,
    url: rawVideo.url,
    width: rawVideo.width,
    publishTime: rawVideo.publish_time,
    status: rawVideo.status
  }
}

export interface pullVideoRequest {
  num?: number
  authorId?: number
  tagsName?: string[]
  tagFilterMode?: 'filterAll' | undefined
  sort?: 'sort' | undefined
  allStatus?: 'all' | undefined
}
export const pullVideo = (request?: pullVideoRequest) =>
  new Promise<VideoMedia[]>((resolve, reject) => {
    const numString = request && typeof request.num !== 'undefined' ? `&num=${request.num}` : ''
    const authorString =
      request && typeof request.authorId !== 'undefined' ? `&author_id=${request.authorId}` : ''
    const tagString =
      request && typeof request.tagsName !== 'undefined' && request.tagsName.length > 0
        ? `&tags_name=${request.tagsName}`
        : ''
    const tagFilterModeString =
      request && typeof request.tagFilterMode !== 'undefined'
        ? `&tag_filter_mode=${request.tagFilterMode}`
        : ''
    const sortString = request && typeof request.sort !== 'undefined' ? `&sort=${request.sort}` : ''
    const allStatusString =
      request && typeof request.allStatus !== 'undefined' ? `&all_status=${request.allStatus}` : ''

    fetch(
      prefix_url
        .concat(`video/get?`)
        .concat(numString)
        .concat(authorString)
        .concat(tagString)
        .concat(tagFilterModeString)
        .concat(sortString)
        .concat(allStatusString),
      {
        method: 'GET'
      }
    )
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

export const getVideoActionUsersByVideoId = (videoId: number | string, action: string) =>
  new Promise<number[]>((resolve, reject) => {
    fetch(prefix_url.concat(`video/get/actions?video_id=${videoId}&action=${action}`))
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              resolve(ajaxData.ajax_data as number[])
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

export const recordVideoPlay = (videoId: number | string, userId: number | string) =>
  new Promise<void>((resolve, reject) => {
    fetch(prefix_url.concat(`video/action/play?user_id=${userId}&video_id=${videoId}`), {
      method: 'POST'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              resolve()
            } else {
              reject(ajaxData.ajax_msg)
            }
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export const likeOrStarVideoOrNot = (
  videoId: number | string,
  userId: number | string,
  toStatus: boolean,
  action: 'like' | 'star'
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

export const getVideosByUserLikeOrStar = (
  userId: number | string,
  action: 'like' | 'star' | 'play'
) =>
  new Promise<VideoMedia[]>((resolve, reject) => {
    fetch(prefix_url.concat(`/user/get/actions?id=${userId}&action=${action}`), {
      method: 'GET'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              resolve(ajaxData.ajax_data as VideoMedia[])
            } else {
              reject(ajaxData.ajax_msg)
            }
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export const getVideoInfoAll = () =>
  new Promise<VideoRecord[]>((resolve, reject) => {
    fetch(prefix_url.concat(`video/info/all`), {
      method: 'GET'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((records: VideoRecord[]) => {
            resolve(records)
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export const getVideoInfoById = (videoId: number | string) =>
  new Promise<VideoRecord>((resolve, reject) => {
    fetch(prefix_url.concat(`video/info/${videoId}`), {
      method: 'GET'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              resolve(ajaxData.ajax_data as VideoRecord)
            } else {
              reject(ajaxData.ajax_msg)
            }
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export interface EditVideoForm {
  videoId: number | string
  title: string
  authorId: number | string
  status: 'online' | 'offline' | 'awaitApproval'
}

export const editVideoById = (formData: EditVideoForm) =>
  new Promise<void>((resolve, reject) => {
    fetch(
      prefix_url
        .concat('video/edit?')
        .concat(`&videoId=${formData.videoId}`)
        .concat(`&title=${formData.title}`)
        .concat(`&authorId=${formData.authorId}`)
        .concat(`&status=${formData.status}`),
      {
        method: 'POST'
      }
    )
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success({
                id: 'videoEdit',
                content: ajaxData.ajax_msg
              })
              resolve()
            } else {
              reject(ajaxData.ajax_msg)
            }
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })
