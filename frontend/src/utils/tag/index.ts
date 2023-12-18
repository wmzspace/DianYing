import { prefix_url } from '@/api'
import { reject } from 'lodash-es'
import _ from 'lodash'

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
// return
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
