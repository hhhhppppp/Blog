<script setup>
import { articleDeleteChannelService, articleGetChannelsService } from '@/api/article'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessage } from 'element-plus'
import { ElMessageBox } from 'element-plus'
const channelList = ref([])
// loading
const loading = ref(false) 

const getChannelList = async () => {
  loading.value = true
  const res = await articleGetChannelsService()
  channelList.value = res.data.data
  // console.log(channelList.value)
  // channelList.value = []
  loading.value = false
}
getChannelList()

const dialog = ref()
// 编辑逻辑
const onEditChannel = (row) => {
  dialog.value.open(row)
}
// 添加逻辑
const onAddChannel = () => {
  dialog.value.open({})
} 

const onDeleteChannel = async (row) => {
  await ElMessageBox.confirm('你确认要删除该分类吗', '温馨提示', {
    type: 'waring',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
  await articleDeleteChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}


const onSuccess = () => {
  getChannelList()
}
</script>
<template>
  <!-- <pageContainer></pageContainer> -->
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel">添加分类</el-button>
    </template>

    <el-table :data="channelList" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column prop="categoryName" label="分类名称"></el-table-column>
      <el-table-column prop="categoryAlias" label="分类别名"></el-table-column>
      <el-table-column label="操作" width="100">
        <!-- row 就是 channelList 中的每一项， $index 下标 -->
        <template #default="{ row, $index}">
          <el-button :icon="Edit" type="primary" plain circle @click="onEditChannel(row, $index)"></el-button>
          <el-button :icon="Delete" type="danger" plain circle @click="onDeleteChannel(row, $index)"></el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <!-- 这个 是一个 el-dialog 提示框封装成了一个组件 -->
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
</page-container> 
</template>

<style lang="scss" scoped>

</style>