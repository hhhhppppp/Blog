import { useAuthStore, useUserStore } from '@/stores/index.js'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/LoginPage.vue'),
      meta: {
        hideLayout: true,
        public: true // 公开页面
      }
    },
    {
      path: '/',
      redirect: '/home'
    },
    // 首页（公开访问）
    {
      path: '/home',
      component: () => import('@/views/Home/HomePage.vue'),
      meta: { public: true }
    },
    // 后台管理界面（需要特定权限）
    {
      path: '/admin',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/admin/article/manage',
      meta: {
        requiresAuth: true,
        // role: ['admin', 'editor'] // 需要管理员或编辑角色
      },
      children: [
        {
          path: 'article/manage',
          component: () => import('@/views/article/ArticleManage.vue'),
          meta: {
            title: '文章管理',
            roles: ['admin', 'user'], // 允许admin和user访问，但功能不同
            permissions: ['article:read'] // 只需要读权限
            // 设计理念：
            // 1. admin用户：可以增删改查文章
            // 2. user用户：只能查看文章列表，无编辑/删除按钮
            // 3. 同一个页面，不同角色看到不同的功能
          }
        },
        {
          path: 'article/channel',
          component: () => import('@/views/article/ArticleChannel.vue'),
          meta: {
            title: '分类管理',
            roles: ['admin','user'], // 仅管理员可管理分类
            permissions: ['category:manage']
          }
        },
        {
          path: 'user/profile',
          component: () => import('@/views/user/UserProfile.vue'),
          meta: {
            title: '个人资料',
            requiresAuth: true // 所有登录用户都可访问
          }
        },
        // 添加缺失的用户头像路由
        {
          path: 'user/avatar',
          component: () => import('@/views/user/UserAvatar.vue'),
          meta: {
            title: '更换头像',
            requiresAuth: true
          }
        },
        {
          path: 'user/password',
          component: () => import('@/views/user/UserPassword.vue'),
          meta: {
            title: '重置密码',
            requiresAuth: true // 所有登录用户都可访问
          }
        },
        {
          path: 'system/settings',
          component: () => import('@/views/System/SystemSettings.vue'),
          meta: {
            title: '系统设置',
            roles: ['admin'], // 仅超级管理员
            permissions: ['system:manage']
          }
        }
      ]
    },
    // 无权限页面
    {
      path: '/unauthorized',
      component: () => import('@/views/Error/Unauthorized.vue'),
      meta: { public: true }
    }
  ],
})

/**
 * 路由守卫 - 权限控制的核心
 * 功能：在路由跳转前检查用户的权限，确保安全性
 * 设计原理：
 * 1. 分层检查：登录状态 -> 角色权限 -> 具体权限
 * 2. 早期返回：每一层检查不通过就立即返回，提高性能
 * 3. 默认安全：未明确指定权限的路由默认需要登录
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const userStore = useUserStore()

  // 第一层：检查是否为公开页面（不需要任何权限）
  if (to.meta.public) {
    next()
    return
  }

  // 第二层：检查登录状态（token是否存在）
  if (!userStore.token) {
    next('/login')
    return
  }

  // 第三层：确保用户信息已加载（支持刷新后的状态恢复）
  if (!authStore.user) {
    try {
      await authStore.fetchUserInfo()
    } catch {
      // 获取用户信息失败，清除token重新登录
      authStore.clearAuth()
      next('/login')
      return
    }
  }

  // 第四层：检查是否只需要登录权限（不需要特定角色或权限）
  if (to.meta.requiresAuth && !to.meta.roles && !to.meta.permissions) {
    next()
    return
  }

  // 第五层：检查角色权限
  if (to.meta.roles && !authStore.hasAnyRole(to.meta.roles)) {
    next('/unauthorized')
    return
  }

  // 第六层：检查具体权限（最细粒度的控制）
  if (to.meta.permissions && to.meta.permissions.length > 0) {
    const hasAnyPermission = to.meta.permissions.some(permission => authStore.hasPermission(permission))
    if (!hasAnyPermission) {
      next('/unauthorized')
      return
    }
  }

  // 所有检查通过，允许访问
  next()
})

export default router
