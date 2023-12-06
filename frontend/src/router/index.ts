import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    // will match everything
    path: '/:catchAll(.*)', // 不识别的path自动匹配404
    component: () => import('@/views/Status404.vue')
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/discover'
  },
  {
    path: '/discover',
    name: '首页',
    meta: {
      layout: 'a'
    },
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/video/:videoId',
    name: '详情',
    meta: {
      layout: 'a'
    },
    component: () => import('@/views/VideoDetailView.vue'),
    props: true
  }
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

// routes = routes.map((route) => addLayoutToRoute(route))
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

export default router
