<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { articleGetListService } from '@/api/article'
import ArticleEdit from './components/ArticleEdit.vue'
import { ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/index.js'
import { hasPermission } from '@/utils/permission'

const authStore = useAuthStore()
const articleList = ref([])
const total = ref()
const loading = ref(false)

const params = ref({
  pageNum: 1,
  pageSize: 5,
  categoryId: '',
  state: ''
})

const getArticleList = async () => {
  loading.value = true
  const res = await articleGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}

getArticleList()

const articleEditRef = ref()

// 添加逻辑
const onAddArticle = () => {
  articleEditRef.value.open({})
}

// 编辑逻辑
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 删除逻辑
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认要删除该文章吗', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  // 这里需要添加实际的删除逻辑
  console.log('删除文章:', row.id)
}

// 添加或者编辑成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加 最好渲染最后一页
    const lastPage = Math.ceil((total.value + 1) / params.value.pageSize)
    params.value.pageNum = lastPage
  }
  getArticleList()
}

const onSizeChange = (size) => {
  params.value.pageNum = 1
  params.value.pageSize = size
  getArticleList()
}

const onCurrentChange = (page) => {
  params.value.pageNum = page
  getArticleList()
}

// 搜索逻辑
const onSearch = () => {
  params.value.pageNum = 1
  getArticleList()
}

// 重置逻辑
const onReset = () => {
  params.value.pageNum = 1
  params.value.categoryId = ''
  params.value.state = ''
  getArticleList()
}

// 权限检查方法 - 前端页面级别的权限控制
/**
 * 编辑权限检查
 * 设计理念：只有admin用户才能编辑文章
 * 为什么这样设计：
 * 1. 符合业务逻辑：user只能查看，admin可以管理
 * 2. 前端双重保障：即使绕过前端检查，后端也会拦截
 * 3. 提升用户体验：避免无效操作和错误提示
 */
const canEditArticle = () => {
  // 仅管理员可以编辑文章
  return authStore.hasRole('admin')
}

/**
 * 删除权限检查
 * 设计理念：删除是高风险操作，仅允许管理员操作
 */
const canDeleteArticle = () => {
  // 仅管理员可以删除文章
  return authStore.hasRole('admin')
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button
        v-if="hasPermission('article:write')"
        @click="onAddArticle"
        v-permission="'article:write'">
        添加文章
      </el-button>
    </template>

    <!-- 表单区域 -->
    <el-form :inline="true">
      <el-form-item label="文章分类" style="width: 200px;">
        <ChannelSelect v-model="params.categoryId"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态" style="width: 200px;">
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="发表时间" prop="createTime"></el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <!-- 编辑按钮：根据权限显示 -->
          <el-button
            v-if="canEditArticle() && hasPermission('article:write')"
            circle plain type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
            v-permission="'article:write'">
          </el-button>

          <!-- 删除按钮：仅管理员可见 -->
          <el-button
            v-if="canDeleteArticle() && hasPermission('article:delete')"
            circle plain type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
            v-permission="'article:delete'">
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pageNum"
      v-model:page-size="params.pageSize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <ArticleEdit ref="articleEditRef" @success="onSuccess"></ArticleEdit>
  </page-container>
</template>
