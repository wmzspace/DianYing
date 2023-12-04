import type { VideoMedia } from '@/types'
import { reactive } from 'vue'
import { prefix_url } from '@/api'

export const videos: VideoMedia[] = reactive([
  {
    id: 1,
    title: 'big buck bunny',
    // url: 'https///v26-web.douyinvod.com/1f9af6a8c39466e41e21721f15339152/656df2ea/video/tos/cn/tos-cn-ve-15c001-alinc2/o0TdgXeBQIYQANGlEY8AI83A7R5fKMEfBgr9CR/?a=6383&ch=26&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=1943&bt=1943&cs=0&ds=4&ft=GN7rKGVVywfURsm80mo~xj7ScoAp4SzgEvrKE1KXtto0g3&mime_type=video_mp4&qs=0&rc=aTo5aDdnOmQ0NmkzOWZpPEBpM2p5dXU5cjk1bjMzNGkzM0BjL18yYy1fX2AxMWEvLjE1YSMvMmdrMmRzLTNgLS1kLS9zcw%3D%3D&btag=e00028000&dy_q=1701700699&feature_id=f0150a16a324336cda5d6dd0b69ed299&l=202312042238194000288A6B72D5181E10',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    top: 0,
    left: 0
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    url: prefix_url + '/videos/1.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    url: prefix_url + '/videos/2.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0
  },
  {
    id: 1,
    title: 'big buck bunny',
    // url: 'https///v26-web.douyinvod.com/1f9af6a8c39466e41e21721f15339152/656df2ea/video/tos/cn/tos-cn-ve-15c001-alinc2/o0TdgXeBQIYQANGlEY8AI83A7R5fKMEfBgr9CR/?a=6383&ch=26&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=1943&bt=1943&cs=0&ds=4&ft=GN7rKGVVywfURsm80mo~xj7ScoAp4SzgEvrKE1KXtto0g3&mime_type=video_mp4&qs=0&rc=aTo5aDdnOmQ0NmkzOWZpPEBpM2p5dXU5cjk1bjMzNGkzM0BjL18yYy1fX2AxMWEvLjE1YSMvMmdrMmRzLTNgLS1kLS9zcw%3D%3D&btag=e00028000&dy_q=1701700699&feature_id=f0150a16a324336cda5d6dd0b69ed299&l=202312042238194000288A6B72D5181E10',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    top: 0,
    left: 0
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    url: prefix_url + '/videos/1.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    url: prefix_url + '/videos/2.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0
  },
  {
    id: 1,
    title: 'big buck bunny',
    // url: 'https///v26-web.douyinvod.com/1f9af6a8c39466e41e21721f15339152/656df2ea/video/tos/cn/tos-cn-ve-15c001-alinc2/o0TdgXeBQIYQANGlEY8AI83A7R5fKMEfBgr9CR/?a=6383&ch=26&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=1943&bt=1943&cs=0&ds=4&ft=GN7rKGVVywfURsm80mo~xj7ScoAp4SzgEvrKE1KXtto0g3&mime_type=video_mp4&qs=0&rc=aTo5aDdnOmQ0NmkzOWZpPEBpM2p5dXU5cjk1bjMzNGkzM0BjL18yYy1fX2AxMWEvLjE1YSMvMmdrMmRzLTNgLS1kLS9zcw%3D%3D&btag=e00028000&dy_q=1701700699&feature_id=f0150a16a324336cda5d6dd0b69ed299&l=202312042238194000288A6B72D5181E10',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    top: 0,
    left: 0
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    url: prefix_url + '/videos/1.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    url: prefix_url + '/videos/2.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0
  },
  {
    id: 1,
    title: 'big buck bunny',
    // url: 'https///v26-web.douyinvod.com/1f9af6a8c39466e41e21721f15339152/656df2ea/video/tos/cn/tos-cn-ve-15c001-alinc2/o0TdgXeBQIYQANGlEY8AI83A7R5fKMEfBgr9CR/?a=6383&ch=26&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=1943&bt=1943&cs=0&ds=4&ft=GN7rKGVVywfURsm80mo~xj7ScoAp4SzgEvrKE1KXtto0g3&mime_type=video_mp4&qs=0&rc=aTo5aDdnOmQ0NmkzOWZpPEBpM2p5dXU5cjk1bjMzNGkzM0BjL18yYy1fX2AxMWEvLjE1YSMvMmdrMmRzLTNgLS1kLS9zcw%3D%3D&btag=e00028000&dy_q=1701700699&feature_id=f0150a16a324336cda5d6dd0b69ed299&l=202312042238194000288A6B72D5181E10',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    top: 0,
    left: 0
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    url: prefix_url + '/videos/1.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    url: prefix_url + '/videos/2.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0
  },
  {
    id: 1,
    title: 'big buck bunny',
    // url: 'https///v26-web.douyinvod.com/1f9af6a8c39466e41e21721f15339152/656df2ea/video/tos/cn/tos-cn-ve-15c001-alinc2/o0TdgXeBQIYQANGlEY8AI83A7R5fKMEfBgr9CR/?a=6383&ch=26&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=1943&bt=1943&cs=0&ds=4&ft=GN7rKGVVywfURsm80mo~xj7ScoAp4SzgEvrKE1KXtto0g3&mime_type=video_mp4&qs=0&rc=aTo5aDdnOmQ0NmkzOWZpPEBpM2p5dXU5cjk1bjMzNGkzM0BjL18yYy1fX2AxMWEvLjE1YSMvMmdrMmRzLTNgLS1kLS9zcw%3D%3D&btag=e00028000&dy_q=1701700699&feature_id=f0150a16a324336cda5d6dd0b69ed299&l=202312042238194000288A6B72D5181E10',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    top: 0,
    left: 0
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    url: prefix_url + '/videos/1.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    url: prefix_url + '/videos/2.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0
  },
  {
    id: 1,
    title: 'big buck bunny',
    // url: 'https///v26-web.douyinvod.com/1f9af6a8c39466e41e21721f15339152/656df2ea/video/tos/cn/tos-cn-ve-15c001-alinc2/o0TdgXeBQIYQANGlEY8AI83A7R5fKMEfBgr9CR/?a=6383&ch=26&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=1943&bt=1943&cs=0&ds=4&ft=GN7rKGVVywfURsm80mo~xj7ScoAp4SzgEvrKE1KXtto0g3&mime_type=video_mp4&qs=0&rc=aTo5aDdnOmQ0NmkzOWZpPEBpM2p5dXU5cjk1bjMzNGkzM0BjL18yYy1fX2AxMWEvLjE1YSMvMmdrMmRzLTNgLS1kLS9zcw%3D%3D&btag=e00028000&dy_q=1701700699&feature_id=f0150a16a324336cda5d6dd0b69ed299&l=202312042238194000288A6B72D5181E10',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    top: 0,
    left: 0
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    url: prefix_url + '/videos/1.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    url: prefix_url + '/videos/2.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0
  },
  {
    id: 1,
    title: 'big buck bunny',
    // url: 'https///v26-web.douyinvod.com/1f9af6a8c39466e41e21721f15339152/656df2ea/video/tos/cn/tos-cn-ve-15c001-alinc2/o0TdgXeBQIYQANGlEY8AI83A7R5fKMEfBgr9CR/?a=6383&ch=26&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=1943&bt=1943&cs=0&ds=4&ft=GN7rKGVVywfURsm80mo~xj7ScoAp4SzgEvrKE1KXtto0g3&mime_type=video_mp4&qs=0&rc=aTo5aDdnOmQ0NmkzOWZpPEBpM2p5dXU5cjk1bjMzNGkzM0BjL18yYy1fX2AxMWEvLjE1YSMvMmdrMmRzLTNgLS1kLS9zcw%3D%3D&btag=e00028000&dy_q=1701700699&feature_id=f0150a16a324336cda5d6dd0b69ed299&l=202312042238194000288A6B72D5181E10',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    top: 0,
    left: 0
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    url: prefix_url + '/videos/1.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    url: prefix_url + '/videos/2.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0
  },
  {
    id: 1,
    title: 'big buck bunny',
    // url: 'https///v26-web.douyinvod.com/1f9af6a8c39466e41e21721f15339152/656df2ea/video/tos/cn/tos-cn-ve-15c001-alinc2/o0TdgXeBQIYQANGlEY8AI83A7R5fKMEfBgr9CR/?a=6383&ch=26&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=1943&bt=1943&cs=0&ds=4&ft=GN7rKGVVywfURsm80mo~xj7ScoAp4SzgEvrKE1KXtto0g3&mime_type=video_mp4&qs=0&rc=aTo5aDdnOmQ0NmkzOWZpPEBpM2p5dXU5cjk1bjMzNGkzM0BjL18yYy1fX2AxMWEvLjE1YSMvMmdrMmRzLTNgLS1kLS9zcw%3D%3D&btag=e00028000&dy_q=1701700699&feature_id=f0150a16a324336cda5d6dd0b69ed299&l=202312042238194000288A6B72D5181E10',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    top: 0,
    left: 0
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    url: prefix_url + '/videos/1.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    url: prefix_url + '/videos/2.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0
  },
  {
    id: 1,
    title: 'big buck bunny',
    // url: 'https///v26-web.douyinvod.com/1f9af6a8c39466e41e21721f15339152/656df2ea/video/tos/cn/tos-cn-ve-15c001-alinc2/o0TdgXeBQIYQANGlEY8AI83A7R5fKMEfBgr9CR/?a=6383&ch=26&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=1943&bt=1943&cs=0&ds=4&ft=GN7rKGVVywfURsm80mo~xj7ScoAp4SzgEvrKE1KXtto0g3&mime_type=video_mp4&qs=0&rc=aTo5aDdnOmQ0NmkzOWZpPEBpM2p5dXU5cjk1bjMzNGkzM0BjL18yYy1fX2AxMWEvLjE1YSMvMmdrMmRzLTNgLS1kLS9zcw%3D%3D&btag=e00028000&dy_q=1701700699&feature_id=f0150a16a324336cda5d6dd0b69ed299&l=202312042238194000288A6B72D5181E10',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    top: 0,
    left: 0
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    url: prefix_url + '/videos/1.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    url: prefix_url + '/videos/2.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0
  },
  {
    id: 1,
    title: 'big buck bunny',
    // url: 'https///v26-web.douyinvod.com/1f9af6a8c39466e41e21721f15339152/656df2ea/video/tos/cn/tos-cn-ve-15c001-alinc2/o0TdgXeBQIYQANGlEY8AI83A7R5fKMEfBgr9CR/?a=6383&ch=26&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=1943&bt=1943&cs=0&ds=4&ft=GN7rKGVVywfURsm80mo~xj7ScoAp4SzgEvrKE1KXtto0g3&mime_type=video_mp4&qs=0&rc=aTo5aDdnOmQ0NmkzOWZpPEBpM2p5dXU5cjk1bjMzNGkzM0BjL18yYy1fX2AxMWEvLjE1YSMvMmdrMmRzLTNgLS1kLS9zcw%3D%3D&btag=e00028000&dy_q=1701700699&feature_id=f0150a16a324336cda5d6dd0b69ed299&l=202312042238194000288A6B72D5181E10',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    top: 0,
    left: 0
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    url: prefix_url + '/videos/1.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    url: prefix_url + '/videos/2.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0
  },
  {
    id: 1,
    title: 'big buck bunny',
    // url: 'https///v26-web.douyinvod.com/1f9af6a8c39466e41e21721f15339152/656df2ea/video/tos/cn/tos-cn-ve-15c001-alinc2/o0TdgXeBQIYQANGlEY8AI83A7R5fKMEfBgr9CR/?a=6383&ch=26&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=1943&bt=1943&cs=0&ds=4&ft=GN7rKGVVywfURsm80mo~xj7ScoAp4SzgEvrKE1KXtto0g3&mime_type=video_mp4&qs=0&rc=aTo5aDdnOmQ0NmkzOWZpPEBpM2p5dXU5cjk1bjMzNGkzM0BjL18yYy1fX2AxMWEvLjE1YSMvMmdrMmRzLTNgLS1kLS9zcw%3D%3D&btag=e00028000&dy_q=1701700699&feature_id=f0150a16a324336cda5d6dd0b69ed299&l=202312042238194000288A6B72D5181E10',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    top: 0,
    left: 0
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    url: prefix_url + '/videos/1.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    url: prefix_url + '/videos/2.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0
  },
  {
    id: 1,
    title: 'big buck bunny',
    // url: 'https///v26-web.douyinvod.com/1f9af6a8c39466e41e21721f15339152/656df2ea/video/tos/cn/tos-cn-ve-15c001-alinc2/o0TdgXeBQIYQANGlEY8AI83A7R5fKMEfBgr9CR/?a=6383&ch=26&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C3&cv=1&br=1943&bt=1943&cs=0&ds=4&ft=GN7rKGVVywfURsm80mo~xj7ScoAp4SzgEvrKE1KXtto0g3&mime_type=video_mp4&qs=0&rc=aTo5aDdnOmQ0NmkzOWZpPEBpM2p5dXU5cjk1bjMzNGkzM0BjL18yYy1fX2AxMWEvLjE1YSMvMmdrMmRzLTNgLS1kLS9zcw%3D%3D&btag=e00028000&dy_q=1701700699&feature_id=f0150a16a324336cda5d6dd0b69ed299&l=202312042238194000288A6B72D5181E10',
    url: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
    top: 0,
    left: 0
  },
  {
    id: 2,
    title: '亿万富翁找回儿子',
    url: prefix_url + '/videos/1.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title: '男孩意外搬到大明星的房间，没想竟从此走向人生巅峰',
    url: prefix_url + '/videos/2.mp4',
    top: 0,
    left: 0
  },
  {
    id: 3,
    title:
      '电子科技大学，4个计算机男生，毕业4年后现状 #电子科技大学 #计算机 #程序员 #求职 #职业规划',
    url: prefix_url + '/videos/3.mp4',
    cover: prefix_url + '/videos/3.jpeg',
    top: 0,
    left: 0
  }
])
