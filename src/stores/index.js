import { createPinia } from "pinia"
import presist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(presist)
export default pinia


// 统一导出
// import { useUserStore } from "./modules/user"
// export { useUserStore }
// import { useCounterStore } from "./modules/counter"
// export { useCounterStore }

export * from './modules/user' // 接收 user 模块的所有的按需导出
export * from './modules/counter'
export * from './modules/auth.js'
