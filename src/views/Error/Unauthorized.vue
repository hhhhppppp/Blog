<template>
  <div class="unauthorized-page">
    <el-result
      icon="warning"
      title="403"
      sub-title="抱歉，您没有权限访问此页面"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/home')">
          返回首页
        </el-button>
        <el-button @click="$router.back()">返回上一页</el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.unauthorized-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
