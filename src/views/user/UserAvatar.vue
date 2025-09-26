
<script setup>import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userUploadAvatarService } from '@/api/user'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const uploadRef = ref()
const imgUrl = ref(userStore.user.userPic)
const imageFile = ref(null) // 添加文件引用

const onUploadFile = (uploadFile) => {
  // 保存文件对象
  imageFile.value = uploadFile.raw

  // 预览图片
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
}

const onUpdateAvatar = async () => {
  try {
    if (!imageFile.value) {
      ElMessage({ type: 'error', message: '请先选择图片' })
      return
    }

    // 创建 FormData 对象
    const formData = new FormData()
    formData.append('avatarFile', imageFile.value)

    await userUploadAvatarService(formData)
    await userStore.getUser()
    ElMessage({ type: 'success', message: '更换头像成功' })

    // 清空文件引用
    imageFile.value = null
  } catch (error) {
    console.error('更换头像失败:', error)
    ElMessage({ type: 'error', message: '更换头像失败: ' + (error.response?.data?.message || error.message) })
  }
}
</script>

<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
        <br />
        <el-button
          @click="uploadRef.$el.querySelector('input').click()"
          type="primary"
          :icon="Plus"
          size="large"
          >
          选择图片
        </el-button>
        <el-button type="success" :icon="Upload" size="large" @click="onUpdateAvatar">
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
