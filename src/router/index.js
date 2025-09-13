import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    { 
      path: '/',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        // 异步组件， （路由懒加载）
        { path: '/article/manage', component: () => import('@/views/article/ArticleManage.vue') },
        { path: '/article/channel', component: () => import('@/views/article/ArticleChannel.vue') },
        { path: '/user/profile', component: () => import('@/views/user/UserProfile.vue') },
        { path: '/user/avatar', component: () => import('@/views/user/UserAvatar.vue') },
        { path: '/user/password', component: () => import('@/views/user/UserPassword.vue') }
      ]
    },
  ],
})

// 登录访问拦截 => 默认直接放行
// 根据返回值决定 是否放行还是拦截
// 返回值：
// 1、undefined / true  直接放行
// 2、false 拦回 from 的地址页面
// 3、具体路径 或者 路径对象 拦截到对应的地址
//  '/login'  { name: 'login'}
router.beforeEach((to) => {
  // 如果 没有token 且访问的时非登录页，拦截到登录页
  const userStore = useUserStore()
  if (!userStore.token && to.path !== '/login') return '/login'
})
export default router
