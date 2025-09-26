// import { userGetInfoService } from "@/api/user"
import { defineStore } from "pinia"
import { ref } from 'vue'
import { useAuthStore } from "@/stores/modules/auth.js";
// 用户模块
export const useUserStore = defineStore('User', () => {
  // token 信息
  const token = ref('')
  const setToken = (newToken) => {
    token.value = newToken
  }
  const removeToken = () => {
    token.value = ''
  }

  const user = ref({})
  const getUser = async () => {
    // const res = await userGetInfoService()
    const authStore = useAuthStore()
    const userInfo = await authStore.fetchUserInfo()
    // user.value = res.data.data
    user.value = userInfo
    return userInfo
  }
  const setUser = (obj) => {
    user.value = obj
  }
  return {
    token,
    setToken,
    removeToken,
    user,
    getUser,
    setUser
  }
},{
  persist: true
})
