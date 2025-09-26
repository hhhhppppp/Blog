<script setup>
import { useRouter } from 'vue-router'
import { useUserStore, useAuthStore } from '@/stores'
import {
  User,
  Crop,
  EditPen,
  SwitchButton,
  HomeFilled,
  Document,
  Menu,
  Setting,
  CaretBottom
} from '@element-plus/icons-vue'
import { computed } from 'vue'

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()

// 根据权限动态生成菜单
const menuItems = computed(() => [
  {
    index: '/home',
    icon: HomeFilled,
    label: '博客首页',
    show: true // 始终显示
  },
  {
    index: 'blog',
    icon: Document,
    label: '博客管理',
    children: [
      {
        index: '/admin/article/manage',
        icon: EditPen,
        label: '文章管理',
        show: true, // 所有登录用户都可以查看文章
        meta: {
          permissions: ['article:read']
        }
      },
      {
        index: '/admin/article/channel',
        icon: Menu,
        label: '分类管理',
        show: authStore.hasRole('admin'), // 仅管理员可见
        meta: {
          permissions: ['category:manage']
        }
      }
    ],
    show: true // 显示博客管理菜单（内部根据角色区分功能）
  },
  {
    index: 'system',
    icon: Setting,
    label: '系统管理',
    children: [
      {
        index: '/admin/system/settings',
        icon: Setting,
        label: '系统设置',
        show: authStore.hasRole('admin'), // 仅管理员可见
        meta: {
          permissions: ['system:manage']
        }
      }
    ],
    show: authStore.hasRole('admin')
  },
  {
    index: 'user',
    icon: User,
    label: '个人中心',
    children: [
      {
        index: '/admin/user/profile',
        icon: User,
        label: '基本资料',
        show: true // 所有登录用户可见
      },
      {
        index: '/admin/user/avatar',
        icon: Crop,
        label: '更换头像',
        show: true
      },
      {
        index: '/admin/user/password',
        icon: EditPen,
        label: '重置密码',
        show: true
      }
    ],
    show: true
  }
])

// 过滤出有权限显示的菜单项
/**
 * 菜单权限过滤器 - 核心逻辑
 * 功能：根据用户权限动态过滤和构建菜单结构
 * 设计理念：三层过滤机制，确保用户只看到有权限的菜单项
 */
const filteredMenuItems = computed(() => {
  return menuItems.value
    // 第一层过滤：基础显示权限检查
    .filter(item => item.show)
    
    // 第二层处理：子菜单权限过滤和重构
    .map(item => {
      if (item.children) {
        // 处理有子菜单的父菜单项（如"博客管理"、"个人中心"）
        
        // 过滤子菜单项：只保留用户有权限访问的子菜单
        const filteredChildren = item.children.filter(child => {
          // 子菜单显示权限检查
          if (!child.show) return false

          // 细粒度权限检查：检查具体功能权限
          if (child.meta && child.meta.permissions) {
            // 调用Pinia的hasPermission方法
            // 注意：这里体现了Pinia Getter的高阶函数特性
            // authStore.hasPermission(permissions) 实际调用了:
            // 1. hasPermission(state) - Pinia自动注入state
            // 2. 返回的函数(child.meta.permissions) - 我们传入权限数组
            return authStore.hasPermission(child.meta.permissions)
          }
          
          // 没有特殊权限要求的子菜单默认通过
          return true
        })

        // 返回过滤后的菜单项
        return {
          ...item, // 保留原菜单项的所有属性
          children: filteredChildren // 用过滤后的子菜单替换原子菜单
        }
      }
      
      // 没有子菜单的菜单项直接返回
      return item
    })
    
    // 第三层过滤：清理空父菜单
    .filter(item => {
      // 如果父菜单有子菜单定义，但所有子菜单都被过滤掉了
      if (item.children && item.children.length === 0) {
        // 隐藏这个空的父菜单，避免显示空的菜单组
        return false
      }
      
      // 保留有效的菜单项
      return true
    })
})

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
</script>


<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <!-- 
        Element Plus 菜单组件路由跳转机制解释：
        
        为什么菜单能够跳转：
        1. router 属性：开启了Element Plus的路由模式
        2. :index 属性：指定跳转的路由路径
        3. :default-active：高亮显示当前活跃的菜单项
        
        技术原理：
        - Element Plus会自动监听菜单项的点击事件
        - 获取菜单项的index属性值（路由路径）
        - 调用Vue Router的router.push()方法进行跳转
        - 更新地址栏和渲染新组件
        
        布局设计考虑（符合用户偏好）：
        - 菜单项间距适中，与logo的150px高度协调
        - 使用深色背景(#545c64)保证视觉层次
        - 高亮颜色(#ffd04b)提供清晰的导航反馈
      -->
      <el-menu
        :default-active="$route.path"
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        router
      >
        <!-- 动态渲染菜单 - 根据用户权限生成不同的菜单结构 -->
        <!-- 
          步骤解释：
          1. 遵循用户导航栏布局设计偏好：logo和nav间隔适中
          2. 遍历filteredMenuItems数组（已经过权限过滤的菜单项）
          3. 根据菜单项是否有子菜单，渲染不同的组件
          4. 保证美观和功能的平衡
        -->
        <template v-for="item in filteredMenuItems" :key="item.index">
          <!-- 情况一：有子菜单的父菜单项（如：“博客管理”、“个人中心”） -->
          <el-sub-menu v-if="item.children" :index="item.index">
            <!-- 父菜单的标题部分 -->
            <template #title>
              <!-- 动态组件渲染图标：通过:is属性动态加载不同的图标组件 -->
              <el-icon><component :is="item.icon" /></el-icon>
              <!-- 父菜单文字标签，与logo间距适中 -->
              <span>{{ item.label }}</span>
            </template>
            <!-- 子菜单循环渲染（如：“文章管理”、“分类管理”） -->
            <el-menu-item
              v-for="child in item.children"
              :key="child.index"
              :index="child.index"
            >
              <!-- 子菜单图标 -->
              <el-icon><component :is="child.icon" /></el-icon>
              <!-- 子菜单文字标签 -->
              <span>{{ child.label }}</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- 情况二：无子菜单的直接菜单项（如：“博客首页”） -->
          <el-menu-item v-else :index="item.index">
            <!-- 直接菜单项的图标 -->
            <el-icon><component :is="item.icon" /></el-icon>
            <!-- 直接菜单项的文字标签 -->
            <span>{{ item.label }}</span>
          </el-menu-item>
        </template>

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
