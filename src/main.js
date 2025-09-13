import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import '@/assets/main.scss'
// ELMessageBox 样式丢失 需要按需引入 ELMessageBox 样式
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-message.css'

const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
