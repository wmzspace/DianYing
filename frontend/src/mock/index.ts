import type { DanMuProps, VideoMedia } from '@/types'
import { reactive } from 'vue'
import { prefix_url } from '@/api'
import type { User } from '@/store/user'

export const getVideoById = (videoId: number | string) => {
  const id = typeof videoId === 'string' ? parseInt(videoId) : videoId
  return videos.filter((v) => v.id === id)[0]
}
import _ from 'lodash'

export const pullVideo = (num: number): VideoMedia[] => {
  return _.cloneDeep(_.sampleSize(videos, num))
}

export const videos: VideoMedia[] = [
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  },
  {
    id: 1,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    authorId: 1,
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0,
    width: 1280,
    height: 720,
    loaded: false
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    authorId: 1,
    url: prefix_url + '/videos/1.mp4',
    cover: prefix_url + '/videos/1.png',
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    loaded: false
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    authorId: 1,
    url: prefix_url + '/videos/2.mp4',
    cover: prefix_url + '/videos/2.jpeg',
    top: 0,
    left: 0,
    width: 1024,
    height: 576,
    loaded: false
  }
]
// export const videos: VideoMedia[] = reactive(
//   videosList.flatMap((element) => Array(3).fill(element))
// )
// const videos: VideoMedia[] = reactive(_.repeat(videosList, 3))

// export const users: User[] = reactive([
//   {
//     id: 1,
//     name: '19岁带饭冲锋🌈',
//     avatar: 'images/avatar.jpeg'
//   }
// ])

export interface Comment {
  id: number
  parentId: number
  authorId: number
  content: string
  datetime: string
}

export const comments: Comment[] = reactive([
  {
    id: 1,
    parentId: -1,
    authorId: 1,
    content: '别太荒谬了哥们，别太荒谬了哥们',
    datetime: '1小时'
  },
  {
    id: 2,
    parentId: -1,
    authorId: 2,
    content: '跟我谈😍',
    datetime: '21分钟'
  },
  {
    id: 3,
    parentId: -1,
    authorId: 3,
    content: '我好喜欢',
    datetime: '1分钟'
  }
])

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
