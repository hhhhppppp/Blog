<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { articleGetListService } from '@/api/article'
import ArticleEdit from './components/ArticleEdit.vue'
import { ElMessageBox } from 'element-plus'
const articleList = ref([])
const total = ref()
const loading = ref(false)
// const cateId = ref(10)
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
  const onDeleteAricle = async (row) => {
    await ElMessageBox.confirm('你确认要删除该分类吗', '温馨提示', {
    type: 'waring',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    console.log(row)
    // 需要添加删除文章的 api
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




</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle">添加文章</el-button>
    </template>
      
    <!-- 表单区域 -->
     <el-form :inline="true">
      <el-form-item label="文章分类" style="width: 200px;">
        <!-- Vue2 => v-model :value 和 @input 的简写 -->
        <!-- Vue3 => v-model :modelValue 和 @update:modelValue 的简写 -->
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
        <!-- 利用作用域插槽 row 可以 获取当前行的数据 -->
        <template #default="{ row }">
          <el-button circle plain type="primary" :icon="Edit" @click="onEditArticle(row)"></el-button>
          <el-button circle plain type="danger" :icon="Delete" @click="onDeleteAricle(row)"></el-button>
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

<style lang="scss" scoped>

</style>