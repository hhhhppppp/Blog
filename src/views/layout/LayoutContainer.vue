<!-- src/views/layout/LayoutContainer.vue -->
<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import {
  User,
  Crop,
  EditPen,
  SwitchButton,
  HomeFilled,
  Document,
  Menu
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/admin/user/profile')
      break
    case 'avatar':
      router.push('/admin/user/avatar')
      break
    case 'password':
      router.push('/admin/user/password')
      break
    case 'logout':
      userStore.removeToken()
      router.push('/home')
      break
  }
}

// 添加返回首页的方法
const goHome = () => {
  router.push('/home')
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        :default-active="$route.path"
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        router
      >
        <el-menu-item index="/home" @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          <span>博客首页</span>
        </el-menu-item>
        <el-sub-menu index="blog">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>博客管理</span>
          </template>
          <el-menu-item index="/admin/article/manage">
            <el-icon><EditPen /></el-icon>
            <span>文章管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/article/channel">
            <el-icon><Menu /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><User /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/admin/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/admin/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/admin/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>你好：<strong>{{ userStore.user.username }}</strong></div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.user.userPic" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <!-- 折叠的下拉部分 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>个人博客 © Created by Hp</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #545c64;
    &__logo {
      height: 150px;
      width: 100%;
      background: url('@/assets/logo.png') no-repeat center / 100% 150px;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
