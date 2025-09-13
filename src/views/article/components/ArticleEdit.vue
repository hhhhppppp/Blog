<script setup>
import { ref, nextTick } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { articleAddService, articleEditService, articleGetDetailService } from '@/api/article'
import { ElMessage } from 'element-plus'
// import axios from 'axios'
// import { baseURL } from '@/utils/request'
// 控制抽屉显示隐藏
const visibleDrawer = ref(false)
const defaultFrom = ref({
  id: '',
  title: '',
  categoryId: '',
  coverImg: '',
  content: '',
  state: ''
})
// 准备数据
const formModel = ref({
  ...defaultFrom.value
})
// 图片上传
const imgUrl = ref('')
const emit = defineEmits(['success'])
const onUploadFile = (uploadFile) => {
  // console.log(uploadFile)
  imgUrl.value = URL.createObjectURL(uploadFile.raw) //预览图片
  formModel.value.coverImg = uploadFile.raw 
}

const onPublish = async (state) => {
  formModel.value.state = state
  // 当前接口，需要的是 formData 对象
  // 将普通对象 → 转换成 formData 对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  if (formModel.value.id) {
    // 编辑操作
    await articleEditService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    emit('success', 'edit')
  } else {
    await articleAddService(fd)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    emit('success', 'add')
  }
}

const editorRef = ref()
// // 重置编辑器内容的安全方法
// const resetEditorContent = async () => {
//   await nextTick() // 等待DOM更新
//   if (editorRef.value) {
//     // 使用 QuillEditor 的正确方式设置内容
//     formModel.value.content = ''
//   }
// }
const open = async (row) => {
  visibleDrawer.value = true
    // 等待抽屉完全打开和组件渲染
  await nextTick()

  if (row.id) {
    // console.log('编辑回显') 
    const res = await articleGetDetailService(row.id)
    formModel.value = res.data.data
    // 图片需要单独处理回显
    imgUrl.value = formModel.value.coverImg
    // // 提交后台， 需要的是 file 格式的，将网络图片 转成 file 格式
    // // 网络图片转成 file 对象，需要转换
    // formModel.value.coverImg = await imageUrlToFile(imgUrl.value, formModel.value.coverImg)
  } else {
    formModel.value = { ...defaultFrom } //基于默认的数据重置表单
    // 这里重置了表单的数据，但是图片上传 img 地址，富文本编辑器内容 =》 需要手动重置
    imgUrl.value = ''
    editorRef.value.setHTML('')
    // await resetEditorContent()
    // console.log('添加')
  }
  // console.log(row)
}

// 将网络图片地址转换为File对象
// async function imageUrlToFile(url, fileName) {
//   try {
//     // 第一步：使用axios获取网络图片数据
//     const response = await axios.get(url, { responseType: 'arraybuffer' });
//     const imageData = response.data;

//     // 第二步：将图片数据转换为Blob对象
//     const blob = new Blob([imageData], { type: response.headers['content-type'] });

//     // 第三步：创建一个新的File对象
//     const file = new File([blob], fileName, { type: blob.type });

//     return file;
//   } catch (error) {
//     console.error('将图片转换为File对象时发生错误:', error);
//     throw error;
//   }
// }

// 组件 对外暴露的方法
defineExpose({
  open
})
</script>


<template>
  <el-drawer
    v-model="visibleDrawer"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    size="50%"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="categoryId">
        <ChannelSelect
          v-model="formModel.categoryId"
          width="100%"
        ></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="coverImg">
        <!-- 文件上传 -->
        <el-upload
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <quill-editor ref="editorRef" theme="snow" v-model:content="formModel.content" content-type="html"></quill-editor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>