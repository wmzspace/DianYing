import type { RawVideo, VideoMedia } from '@/types'
import { prefix_url } from '@/api'
import _ from 'lodash'
import { Message } from '@arco-design/web-vue'

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
