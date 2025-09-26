import { useAuthStore } from '@/stores'

/**
 * 检查是否有角色权限
 * @param {string|array} roles - 角色或角色数组
 * @returns {boolean}
 */
export function hasRole(roles) {
  const authStore = useAuthStore()
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
 * @param {string|array} permissions - 权限或权限数组
 * @returns {boolean}
 */
export function hasPermission(permissions) {
  const authStore = useAuthStore()
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
 * @param {array} permissions - 权限数组
 * @returns {boolean}
 */
export function hasAllPermissions(permissions) {
  const authStore = useAuthStore()
  if (!Array.isArray(permissions)) return false
  return permissions.every(permission => authStore.hasPermission(permission))
}

export default {
  hasRole,
  hasPermission,
  hasAllPermissions
}
