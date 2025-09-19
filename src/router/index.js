// src/router/index.js
import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue'),
      meta: { hideLayout: true } // 登录页不显示布局
    },
    {
      path: '/',
      redirect: '/home'
    },
    // 首页（公开访问）
    {
      path: '/home',
      component: () => import('@/views/Home/HomePage.vue')
    },
    // 后台管理界面（需要登录）
    {
      path: '/admin',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/admin/article/manage',
      children: [
        {
          path: '/admin/article/manage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/admin/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/admin/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/admin/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/admin/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ],
})

// 登录访问拦截
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 公开页面，直接放行
  const publicPages = ['/home', '/login']
  if (publicPages.includes(to.path)) {
    next()
    return
  }

  // 如果没有token，跳转到登录页
  if (!userStore.token) {
    next('/login')
    return
  }

  // 已登录用户可以访问所有页面
  next()
})

export default router
