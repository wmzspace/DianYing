import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import VideoDetailView from '@/views/VideoDetailView.vue'
import DashboardView from '@/views/admin/dashboard/DashboardView.vue'
import { useUserStore } from '@/store'
import SearchTableVideo from '@/views/admin/search/search-video/index.vue'
import SearchTableUser from '@/views/admin/search/search-user/index.vue'
import adminSetting from '@/views/admin/settings/index.vue'
import PostVideo from '@/views/admin/post-video/index.vue'
import logView from '@/views/admin/log/index.vue'
import { useMainStore } from '@/store/main'
import { Message } from '@arco-design/web-vue'
import { getVideoInfoById } from '@/utils/video'
import type { VideoRecord } from '@/api/list'

let routes: Array<RouteRecordRaw> = [
  {
    // will match everything
    path: '/:catchAll(.*)', // 不识别的path自动匹配404
    component: () => import('@/views/Status404.vue')
  },
  // {
  //   path: '/',
  //   redirect: '/discover',
  //   meta: {
  //     layout: 'a'
  //   }
  // },
  {
    path: '/discover',
    name: 'discover',
    meta: {
      layout: 'a',
      key: '1'
    },
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/',
    name: 'VideoRecommend',
    meta: {
      layout: 'a',
      key: '2'
    },
    component: () => import('@/views/VideoRecommend/index.vue')
  },

  {
    path: '/video/:video_id',
    name: 'videoDetail',
    meta: {
      layout: 'a'
    },
    component: VideoDetailView,
    props: true
  },
  {
    path: '/user/:user_id',
    name: 'userProfile',
    meta: {
      layout: 'a',
      key: '5'
      // requiresAuth: true,
      // roles: ['user', 'admin']
    },
    component: () => import('@/views/user/profile/UserProfileView.vue'),
    props: true
  },
  {
    path: '/admin',
    meta: {
      layout: 'b',
      requiresAuth: true,
      roles: ['user', 'admin']
    },
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          layout: 'b',
          key: 'dashboard',
          requiresAuth: true,
          roles: ['admin']
        },
        component: DashboardView
      },
      {
        path: 'post-video',
        name: 'postVideo',
        meta: {
          layout: 'b',
          key: 'postVideo',
          requiresAuth: true,
          roles: ['user']
        },
        component: PostVideo
      },
      {
        path: 'search',
        meta: {
          layout: 'b',
          requiresAuth: true,
          roles: ['admin']
        },
        children: [
          {
            path: 'video',
            name: 'searchVideo',
            meta: {
              layout: 'b',
              key: 'searchVideo',
              requiresAuth: true,
              roles: ['admin']
            },
            component: SearchTableVideo
          },
          {
            path: 'user',
            name: 'searchUser',
            meta: {
              layout: 'b',
              key: 'searchUser',
              requiresAuth: true,
              roles: ['admin']
            },
            component: SearchTableUser
          }
        ]
      },
      {
        path: 'settings',
        name: 'adminSetting',
        meta: {
          layout: 'b',
          key: 'adminSetting',
          requiresAuth: true,
          roles: ['admin']
        },
        component: adminSetting
      },
      {
        path: 'log',
        name: 'logView',
        meta: {
          layout: 'b',
          key: 'logView',
          requiresAuth: true,
          roles: ['admin']
        },
        component: logView
      }
    ]
    // component: () => import('@/views/DashboardView.vue')
  }
  // TODO: EXCEPTION
  // children: [
  //   // 当 /user/:id 匹配成功
  //   // UserHome 将被渲染到 User 的 <router-view> 内部
  //   { path: '', component: VideoDetailView }
  //
  //   // ...其他子路由
  // ],
  // {
  //   path: '/tables',
  //   name: '明细',
  //   meta: {
  //     layout: 'dashboard'
  //   },
  //   component: () => import('../views/TablesView.vue')
  // },
  // {
  //   path: '/settings',
  //   name: '设置',
  //   meta: {
  //     layout: 'dashboard'
  //   },
  //   component: () => import('../views/SettingsView.vue')
  // }
  // {
  //   path: "/billing",
  //   name: "记账",
  //   meta: {
  //     layout: "dashboard",
  //   },
  //   component: () => import("../views/TablesView.vue"),
  // },
  // {
  //   path: "/",
  //   name: "home",
  //   component: HomeView,
  // },
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
]

// Adding layout property from each route to the meta
// object so it can be accessed later.
function addLayoutToRoute(route: RouteRecordRaw, parentLayout = 'a') {
  route.meta = route.meta || {}
  route.meta.layout = route.meta.layout || parentLayout

  if (route.children) {
    route.children = route.children.map((childRoute) =>
      addLayoutToRoute(childRoute, route.meta?.layout as string | undefined)
    )
  }
  return route
}

routes = routes.map((route) => addLayoutToRoute(route))
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth'
      }
    }
    return {
      x: 0,
      y: 0,
      behavior: 'smooth'
    }
  }
})

export const canUserAccess = () =>
  new Promise((resolve, reject) => {
    resolve(true)
  })

// router/index.js
router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  const mainStore = useMainStore()
  // const isAuthenticated = userStore.isAdmin
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth) {
    if (
      ((to.meta.roles as string[]).includes('admin') && userStore.isAdmin) ||
      ((to.meta.roles as string[]).includes('user') &&
        !userStore.isAdmin &&
        userStore.getCurrentUser)
    ) {
      // next() //允许访问
      return
    } else {
      // 跳转访问
      if (userStore.isAdmin) {
        // 管理员跳转
        // next('/admin')
        return '/admin'
      } else {
        // 用户跳转
        if (mainStore.goToPost) {
          // 用户重定向
          mainStore.goToPost = false
          return '/admin/post-video'
          // next('/admin/post-video')
        } else {
          // 用户跳转回首页
          // next('/')
          return '/'
        }
      }
    }
  } else {
    //允许访问
    if (to.name === 'videoDetail' && to.query.validate !== 'ignore') {
      try {
        const video = await getVideoInfoById(to.params.video_id as string)
        if (video.status !== 'online' && !userStore.isAdminOrCurUser(video.authorId)) {
          Message.warning({
            id: 'videoNotOnline',
            content: '视频不存在'
          })
          return '/'
        }
      } catch (msg) {
        Message.error({
          id: 'videoNotOnline',
          content: msg as string
        })
        return '/'
      }
    }
  }
})

export default router
