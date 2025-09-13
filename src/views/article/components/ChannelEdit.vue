<script setup>
import { articleUpdateChannelService, articleAddChannelService } from '@/api/article'
import { ref } from 'vue'
const dialogVisible = ref(false)

const open = (row) => {
  // console.log(row)
  dialogVisible.value = true
  formModel.value = { ...row }
  console.log(formModel.value)
}
const formModel = ref({
  categoryName: '',
  categoryAlias: ''
})
const rules = {
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的分空字符', trigger: 'blur' }
  ],
  categoryAlias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
  ]
}
defineExpose({
  open
})

const formRef = ref()
const emit = defineEmits(['success'])
const onSubmit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await articleUpdateChannelService(formModel.value)
  } else {
    await articleAddChannelService(formModel.value)
  }
  dialogVisible.value = false
  emit('success')
}
</script>
<template>
    <el-dialog
      v-model="dialogVisible"
      :title="formModel.id ? '编辑分类' : '添加分类'"
      width="30%"
    >

    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="padding-right: 30px">
      <el-form-item label="分类名称" prop="categoryName">
        <el-input v-model="formModel.categoryName" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="categoryAlias">
        <el-input v-model="formModel.categoryAlias" placeholder="请输入分类别名"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>