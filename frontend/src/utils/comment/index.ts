import { prefix_url } from '@/api'
import _ from 'lodash'
import { Message } from '@arco-design/web-vue'
import type { User } from '@/store/user'
import type { AjaxResponse } from '@/api'

export const getCommentsByVideoIdOrParent = (
  videoId: number | undefined,
  parentId: number | undefined
) => {
  const result: Comment[] = []
  const videoString = videoId === undefined ? '' : `&video_id=${videoId}`
  const parentString = parentId === undefined ? '' : `&parent_id=${parentId}`
  return new Promise<Comment[]>((resolve, reject) => {
    fetch(prefix_url.concat(`comment/get?`).concat(videoString).concat(parentString), {
      method: 'POST'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              const data = ajaxData.ajax_data as RawComment[]
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
            } else {
              Message.info(ajaxData.ajax_msg)
            }
          })
        }
      })
      .catch((e) => {
        Message.error(e)
        reject(e)
      })
  })
}
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

interface PostCommentRawResponse {
  comment_id: number
}

export const postComment = (
  authorId: number,
  content: string,
  videoId: number | undefined,
  parentId: number | undefined
) => {
  const videoString = videoId === undefined ? '' : `&video_id=${videoId}`
  const parentString = parentId === undefined ? '' : `&parent_id=${parentId}`
  return new Promise<number | undefined>((resolve, reject) => {
    fetch(
      prefix_url
        .concat(`comment/post?`)
        .concat(`&author_id=${authorId}`)
        .concat(`&content=${content}`)
        .concat(videoString)
        .concat(parentString),
      {
        method: 'POST'
      }
    )
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success(ajaxData.ajax_msg)
              const data = ajaxData.ajax_data as PostCommentRawResponse
              resolve(data.comment_id)
            } else {
              Message.info(ajaxData.ajax_msg)
              resolve(undefined)
            }
          })
        } else {
          Message.error(res.statusText)
          reject(res.statusText)
        }
      })
      .catch((e) => {
        Message.error(e.message)
        reject(e.meta)
      })
  })
}

export const deleteComment = (commentId: number) => {
  return new Promise<boolean>((resolve, reject) => {
    fetch(prefix_url.concat(`comment/delete?`).concat(`&comment_id=${commentId}`), {
      method: 'POST'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              Message.success(ajaxData.ajax_msg)
              resolve(true)
            } else {
              Message.info(ajaxData.ajax_msg)
              resolve(false)
            }
          })
        } else {
          Message.error(res.statusText)
          reject(res.statusText)
        }
      })
      .catch((e) => {
        Message.error(e.message)
        reject(e.meta)
      })
  })
}

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
