import axios from "axios"
import { useUserStore } from "@/stores"
// 导入 ELMessage
import { ElMessage } from "element-plus"
// 导入 router
import router from "@/router"

// 动态确定baseURL
const getBaseURL = () => {
  // 优先使用环境变量中的API URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  // 判断当前环境
  if (import.meta.env.DEV) {
    // 开发环境 - 使用本地地址
    return 'http://localhost:8080'
  } else {
    // 生产环境 - 使用服务器IP地址
    return 'http://192.168.1.47:8080'
  }
}

const baseURL = getBaseURL()

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
    
    // 添加ngrok所需的请求头，绕过浏览器警告页面
    if (baseURL.includes('ngrok')) {
      config.headers['Ngrok-Skip-Browser-Warning'] = 'true'
      config.headers['User-Agent'] = 'Mozilla/5.0'
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
