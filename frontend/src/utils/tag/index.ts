import { type AjaxResponse, prefix_url } from '@/api'
import { reject } from 'lodash-es'
import _ from 'lodash'
import { Message } from '@arco-design/web-vue'
import type { UserRecord } from '@/api/list'
import { getVideosByUserLikeOrStar } from '@/utils/video'

export const getAllTags = () =>
  new Promise<string[]>((resolve) => {
    fetch(prefix_url.concat('tag/get'), {
      method: 'GET'
    })
      .then((res) => {
        if (res.ok) {
          res.json().then((data: string[]) => {
            resolve(data)
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export const getTagStatistic = () =>
  new Promise<{ name: string; count: number }[]>((resolve, reject) => {
    fetch(prefix_url.concat('tag/statistic'))
      .then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            resolve(data)
          })
        } else {
          reject(res.statusText)
        }
      })
      .catch((e) => {
        reject(e.message)
      })
  })

export const tagSuffixes = () => [
  '',
  ..._.sampleSize(
    [
      '教程',
      '挑战',
      '趣味',
      '观点',
      '分析',
      '攻略',
      '测评',
      '评论',
      '体验',
      '科技',
      '生活',
      '创意',
      '演示',
      '玩家',
      '赛事',
      '新闻',
      '技巧',
      '故事',
      '实验'
    ],
    4
  )
]

export const getTagsByChannel = (channelName: string) =>
  new Promise<string[]>((resolve, reject) => {
    fetch(prefix_url.concat(`tag/channel?name=${channelName}`))
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              resolve(ajaxData.ajax_data as unknown as string[])
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

export const getUserLikeTags = (userId: number | string) =>
  new Promise<string[]>((resolve, reject) => {
    fetch(prefix_url.concat(`user/get/like_tags?user_id=${userId}`))
      .then((res) => {
        if (res.ok) {
          res.json().then((ajaxData: AjaxResponse) => {
            if (ajaxData.ajax_ok) {
              resolve(ajaxData.ajax_data as string[])
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
