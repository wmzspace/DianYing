import type { RawVideo, VideoMedia } from '@/types'

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
