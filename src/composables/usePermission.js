import { useAuthStore } from '@/stores'

/**
 * 权限相关的组合式函数
 */
export function usePermission() {
  const authStore = useAuthStore()

  /**
   * 检查是否有角色权限
   */
  const hasRole = (roles) => {
    if (typeof roles === 'string') {
      return authStore.hasRole(roles)
    }
    if (Array.isArray(roles)) {
      return authStore.hasAnyRole(roles)
    }
    return false
  }

  /**
   * 检查是否有权限
   */
  const hasPermission = (permissions) => {
    if (typeof permissions === 'string') {
      return authStore.hasPermission(permissions)
    }
    if (Array.isArray(permissions)) {
      return permissions.some(permission => authStore.hasPermission(permission))
    }
    return false
  }

  /**
   * 检查是否有所有权限
   */
  const hasAllPermissions = (permissions) => {
    if (!Array.isArray(permissions)) return false
    return permissions.every(permission => authStore.hasPermission(permission))
  }

  return {
    hasRole,
    hasPermission,
    hasAllPermissions
  }
}
