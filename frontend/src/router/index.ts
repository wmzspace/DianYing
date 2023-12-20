import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import VideoDetailView from '@/views/VideoDetailView.vue'
import DashboardView from '@/views/admin/dashboard/DashboardView.vue'
import EXCEPTION from '@/router/exception'
import { useUserStore } from '@/store'
import SearchTableVideo from '@/views/admin/search/search-video/index.vue'
import SearchTableUser from '@/views/admin/search/search-user/index.vue'
import PostVideo from '@/views/admin/post-video/index.vue'
import { useMainStore } from '@/store/main'

let routes: Array<RouteRecordRaw> = [
  {
    // will match everything
    path: '/:catchAll(.*)', // 不识别的path自动匹配404
    component: () => import('@/views/Status404.vue')
  },
  {
    path: '/',
    redirect: '/discover',
    meta: {
      layout: 'a'
    }
  },
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
      key: '5',
      requiresAuth: true,
      roles: ['user', 'admin']
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

// router/index.js
router.beforeEach((to, from, next) => {
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
      next() //允许访问
    } else {
      if (userStore.isAdmin) {
        next('/admin')
      } else {
        if (mainStore.goToPost) {
          mainStore.goToPost = false
          alert('!')
          next('/admin/post-video')
        } else {
          next('/')
        }
      }
    }
  } else {
    next() //允许访问
  }
})

export default router
