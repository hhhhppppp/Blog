import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import '@/assets/main.scss'
// ELMessageBox 样式丢失 需要按需引入 ELMessageBox 样式
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-message.css'

import permission from "@/directives/permission.js";

const app = createApp(App)

app.use(router)
app.use(pinia)

app.directive('role', permission.role)
app.directive('permission', permission.permission)

app.mount('#app')
