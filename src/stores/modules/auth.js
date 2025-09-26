import { defineStore } from 'pinia'
import { userGetInfoService } from '@/api/user'

/**
 * 权限管理Store
 * 功能：管理用户角色和权限信息，提供权限检查方法
 * 设计理念：基于RBAC（基于角色的访问控制）模式
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,        // 用户基本信息
    role: '',          // 用户角色：admin（管理员）、user（普通用户）
    permissions: []    // 权限列表：具体的操作权限
  }),

  getters: {
    /**
     * 检查是否具有指定角色
     * @param {string} role - 要检查的角色名
     * @returns {boolean} 是否拥有该角色
     */
    hasRole: (state) => (role) => {
      return state.role === role
    },

    /**
     * 检查是否具有某些角色中的任意一个
     * @param {Array<string>} roles - 角色数组（如：['admin', 'user']）
     * @returns {boolean} 是否拥有其中任意一个角色
     * 
     * 调用方式解释：
     * - Pinia会自动将state作为第一个参数传入第一层函数
     * - 我们在使用时调用：authStore.hasAnyRole(['admin', 'user'])
     * - 实际上to.meta.roles作为参数传给了第二层函数
     * 
     * 完整写法解释：
     * 1. Pinia调用：hasAnyRole(state) => 返回一个函数
     * 2. 我们调用：返回的函数(to.meta.roles) => 返回boolean结果
     */
    hasAnyRole: function (state) {
      // 第一层函数：Pinia自动调用，传入state参数
      return function (roles) {
        // 第二层函数：我们手动调用，传入to.meta.roles参数
        // roles就是从router传过来的to.meta.roles
        return roles.includes(state.role)
      }
    },

    // 以下是箭头函数的简写形式（等效于上面的完整写法）：
    // hasAnyRole: (state) => (roles) => {
    //   return roles.includes(state.role)
    // },

    /**
     * 检查是否具有某个权限
     * @param {string|Array<string>} permission - 权限名或权限数组
     * @returns {boolean} 是否拥有该权限
     * 支持单个权限和权限数组的检查
     */
    hasPermission: (state) => (permission) => {
      if (Array.isArray(permission)) {
        // 如果是数组，检查是否拥有其中任意一个权限
        return permission.some(p => state.permissions.includes(p))
      }
      // 单个权限检查
      return state.permissions.includes(permission)
    },

    // 快捷角色检查方法
    isAdmin: (state) => state.role === 'admin',
    isUser: (state) => state.role === 'user'
  },

  actions: {
    /**
     * 设置用户权限信息
     * @param {Object} userInfo - 用户信息对象
     * 为什么这样设计：
     * 1. 集中化管理角色和权限的映射关系
     * 2. 支持从后端动态获取权限，也支持前端默认映射
     * 3. 保证权限数据的一致性和可靠性
     */
    setAuthInfo(userInfo) {
      this.user = userInfo
      this.role = userInfo.role || 'user' // 默认为普通用户
      console.log('设置用户角色:', this.role) // 调试日志

      // 根据角色设置默认权限（RBAC模式的核心）
      if (!userInfo.permissions || userInfo.permissions.length === 0) {
        switch (this.role) {
          case 'admin':
            // 管理员：拥有所有权限
            this.permissions = [
              'article:read',    // 文章查看
              'article:write',   // 文章编辑
              'article:delete',  // 文章删除
              'category:manage', // 分类管理
              'system:manage'    // 系统设置
            ]
            break
          case 'user':
            // 普通用户：只有查看权限
            this.permissions = ['article:read']
            break
          default:
            // 兼容处理：未知角色默认为普通用户权限
            this.permissions = ['article:read']
        }
      } else {
        // 如果后端返回了具体权限，则使用后端数据
        this.permissions = userInfo.permissions || []
      }
      console.log('设置用户权限:', this.permissions) // 调试日志
    },

    /**
     * 获取用户信息（包含权限）
     * 为什么需要这个方法：
     * 1. 登录后需要获取最新的用户信息和权限
     * 2. 支持token刷新后的权限同步
     * 3. 集中化的数据获取和处理逻辑
     */
    async fetchUserInfo() {
      try {
        const res = await userGetInfoService()
        console.log('获取到的用户信息:', res.data.data) // 调试日志
        this.setAuthInfo(res.data.data)
        return res.data.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },

    /**
     * 清除权限信息
     * 使用场景：退出登录、token失效等
     */
    clearAuth() {
      this.user = null
      this.role = ''
      this.permissions = []
    }
  },

  persist: true // 持久化存储，刷新页面后权限信息不丢失
})
