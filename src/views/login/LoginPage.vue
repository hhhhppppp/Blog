<script setup>
import { userLoginService, userRegisterService } from '@/api/user'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'

import bg1 from '@/assets/bg1.png'
// import bg2 from '@/assets/bg2.png'
import bg3 from '@/assets/bg3.png'
import bg4 from '@/assets/bg4.png'
const isRegister = ref(false)
// 整个用于提交的 form 数据
const formData = ref({
  username: 'Hpday',
  password: '123456',
  repassword: ''
})
// 整个表单的校验规则
const rules = {
  username: [
    // 非空校验
    { required: true, message: '请输入用户名', trigger: 'blur' },
    // 长度校验
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur'}
  ],
  password: [
    // 非空校验
    { required: true, message: '请输入密码', trigger: 'blur' },
    // 正则校验  \S 非空字符
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' }
  ],
  repassword: [
    // 非空校验
    { required: true, message: '请输入密码', trigger: 'blur' },
    // 正则校验  \S 非空字符
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if(value !== formData.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 成功也要 callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
// 导入 ELMessage
import { ElMessage } from "element-plus"
const form = ref()
const register = async () => {
  // 注册成功之前 先进行校验 校验成功 → 请求， 校验失败 → 自动提示
  await form.value.validate()
  const res = await userRegisterService(formData.value)
  console.log(res.data.message)
  // alert('注册成功')
  ElMessage.success(res.data.message)
  // 切换到 登录
  isRegister.value = false
}

// 切换 登录/注册 清空表单数据

watch(isRegister, () => {
  formData.value = {
    username: '',
    password: '',
    repassword: ''
  }
})

import { useUserStore } from '@/stores'
import router from '@/router'
const loading = ref(false)
const userStore = useUserStore()
const login = async () => {
  form.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = await userLoginService(formData.value)
        userStore.setToken(res.data.token)

        // 获取用户信息
        await userStore.getUser()

        // 根据角色跳转页面
        if (userStore.user.role === 'admin') {
          router.push('/')
        } else {
          router.push('/home')
        }

        ElMessage.success('登录成功')
      } catch (error) {
        ElMessage.error(error.response?.data?.message || '登录失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const bgImg = ref([
  { id: 1, url: bg1},
  // { id: 2, url: bg2},
  { id: 3, url: bg3},
  { id: 4, url: bg4}
])

const goHome = () => {
  router.push('/home')
}
</script>

<template>
  <div class="login-page-wrapper">
    <el-row class="login-page">
      <el-col :span="12" class="bg">
          <el-carousel height="100vh">
            <el-carousel-item v-for="item in bgImg" :key="item.id">
              <el-image
                :src="item.url"
                fit="cover"
                style="width: 100%; height: 100%"
              />
            </el-carousel-item>
          </el-carousel>
      </el-col>
      <el-col :span="6" :offset="3" class="form">
        <div class="back-to-home">
          <el-button link @click="goHome">
            <i class="el-icon-arrow-left"></i> 返回首页
          </el-button>
        </div>
        <el-form
          :model="formData"
          :rules="rules"
          ref="form"
          size="large"
          autocomplete="off"
          v-if="isRegister">
          <el-form-item>
            <h1>注册</h1>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              :prefix-icon="User"
              placeholder="请输入用户名">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input
              v-model="formData.repassword"
              :prefix-icon="Lock"
              type="password"
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="button" type="primary" auto-insert-space @click="register">
              注册
            </el-button>
          </el-form-item>
          <el-form-item class="flex">
            <el-link type="info" :underline="false" @click="isRegister = false">
              ← 返回
            </el-link>
          </el-form-item>
        </el-form>
        <el-form
          :model="formData"
          :rules="rules"
          ref="form"
          size="large"
          autocomplete="off"
          v-else>
          <el-form-item>
            <h1>登录</h1>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              :prefix-icon="User"
              placeholder="请输入用户名">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              name="password"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="flex">
            <div class="flex">
              <el-checkbox>记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button class="button" type="primary" auto-insert-space @click="login"
              >登录</el-button
            >
          </el-form-item>
          <el-form-item class="flex">
            <el-link type="info" :underline="false" @click="isRegister = true">
              注册 →
            </el-link>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.login-page-wrapper {
  position: relative;
}

.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    // background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      // url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;

    // 走马灯
    .demonstration {
      color: var(--el-text-color-secondary);
    }
    .el-carousel__item h3 {
      color: #475669;
      opacity: 0.75;
      line-height: 300px;
      margin: 0;
      text-align: center;
    }

    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }

    .el-carousel__item:nth-child(2n + 1) {
      background-color: #d3dce6;
    }
  }
  .form {
    position: relative; // 添加相对定位
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    // background: #000;
    .back-to-home {
      position: absolute; // 绝对定位
      top: 20px;         // 距离顶部20px
      left: 0;           // 距离左侧0
      z-index: 100;
    }
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}

</style>
