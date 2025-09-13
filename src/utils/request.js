import axios from "axios"
import { useUserStore } from "@/stores"
// 导入 ELMessage
import { ElMessage } from "element-plus"
// 导入 router
import router from "@/router"

const baseURL = 'http://192.168.1.47:8080'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserStore()
    if(userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)
// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 4. 摘取核心响应数据
    if(res.data.code === 1) {
      return res
    }
    // TODO 3. 处理业务失败
    // 失败 给出错误提示
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res)
  },
  (err) => {
    // TODO 5. 处理401错误
    // 错误的特殊情况 → 401 权限不足 或者 token 过期 → 拦截到登录
    if(err.response.status === 401) {
      router.push('/login')
    }
    // 错误的默认情况
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)
// 默认导出
export default instance
// 按需导出
export { baseURL }
