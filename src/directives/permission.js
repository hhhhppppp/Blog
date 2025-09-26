import { hasRole, hasPermission } from '@/utils/permission'

export default {
  // 角色权限指令
  role: {
    mounted(el, binding) {
      const { value } = binding
      if (value && !hasRole(value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  },

  // 权限指令
  permission: {
    mounted(el, binding) {
      const { value } = binding
      if (value && !hasPermission(value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}
