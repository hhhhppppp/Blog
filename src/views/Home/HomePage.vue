<!-- src/views/home/HomePage.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { articleGetPublicListService, articleGetPublicDetailService } from '@/api/article'
import { useUserStore } from '@/stores'
import router from '@/router'
// 导入本地图片资源
import bg1 from '@/assets/bg1.png'
import bg2 from '@/assets/bg2.png'
import bg3 from '@/assets/bg3.png'
import bg4 from '@/assets/bg4.png'

const articles = ref([])
const loading = ref(false)
const userStore = useUserStore()
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(6)
const selectedArticle = ref(null)
const articleLoading = ref(false)

// 本地图片数组
const localImages = [bg1, bg2, bg3, bg4]

// 假数据
const mockArticles = [
  {
    id: 1,
    title: 'Vue 3 全面解析',
    content: '<p>Vue 3 是目前最流行的前端框架之一，它带来了许多新特性和性能提升。本文将全面解析 Vue 3 的核心概念...</p>',
    coverImg: bg1, // 使用本地图片
    categoryName: '前端开发',
    author: '技术博主',
    createTime: '2025-09-15T10:30:00',
    categoryId: 1
  },
  {
    id: 2,
    title: 'React Hooks 深入浅出',
    content: '<p>React Hooks 是 React 16.8 版本引入的重要特性，它让我们可以在函数组件中使用状态和其他 React 特性...</p>',
    coverImg: bg2, // 使用本地图片
    categoryName: '前端开发',
    author: '前端专家',
    createTime: '2025-09-12T14:20:00',
    categoryId: 1
  },
  {
    id: 3,
    title: 'Node.js 微服务架构实践',
    content: '<p>随着业务复杂度的增加，单体应用已经无法满足需求。微服务架构成为了现代应用开发的重要选择...</p>',
    coverImg: bg3, // 使用本地图片
    categoryName: '后端开发',
    author: '架构师',
    createTime: '2025-09-10T09:15:00',
    categoryId: 2
  },
  {
    id: 4,
    title: '数据库优化实战',
    content: '<p>数据库性能优化是每个开发者都需要掌握的技能。本文将通过实际案例，分享数据库优化的经验和技巧...</p>',
    coverImg: bg4, // 使用本地图片
    categoryName: '数据库',
    author: 'DBA专家',
    createTime: '2025-09-08T16:45:00',
    categoryId: 3
  },
  {
    id: 5,
    title: '云计算时代的安全挑战',
    content: '<p>在云计算快速发展的今天，安全问题变得尤为重要。本文将探讨云环境下的安全挑战和应对策略...</p>',
    coverImg: bg1, // 使用本地图片
    categoryName: '云计算',
    author: '安全专家',
    createTime: '2025-09-05T11:30:00',
    categoryId: 4
  },
  {
    id: 6,
    title: '人工智能在前端的应用',
    content: '<p>人工智能技术正在改变前端开发的方式。本文将介绍AI在前端开发中的实际应用场景...</p>',
    coverImg: bg2, // 使用本地图片
    categoryName: '人工智能',
    author: 'AI研究员',
    createTime: '2025-09-01T13:20:00',
    categoryId: 5
  }
]

const mockArticleDetail = {
  id: 1,
  title: 'Vue 3 全面解析',
  content: `<h2>Vue 3 核心特性详解</h2>
  <p>Vue 3 是目前最流行的前端框架之一，它带来了许多新特性和性能提升。本文将全面解析 Vue 3 的核心概念。</p>

  <h3>Composition API</h3>
  <p>Composition API 是 Vue 3 最重要的新特性之一，它提供了一种更灵活的方式来组织和重用组件逻辑。</p>

  <h3>性能提升</h3>
  <p>Vue 3 在性能方面有了显著提升，包括更快的渲染速度和更小的包体积。</p>

  <h3>更好的 TypeScript 支持</h3>
  <p>Vue 3 从底层开始就使用 TypeScript 编写，提供了更好的类型推断和开发体验。</p>

  <p>总的来说，Vue 3 是一个值得学习和使用的现代前端框架。</p>`,
  coverImg: bg1, // 使用本地图片
  categoryName: '前端开发',
  author: '技术博主',
  createTime: '2025-09-15T10:30:00',
  categoryId: 1
}

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(total.value / pageSize.value)
})

const loadArticles = async (page = 1) => {
  loading.value = true
  try {
    // 使用公开接口获取文章列表
    const res = await articleGetPublicListService({
      pageNum: page,
      pageSize: pageSize.value
    })
    // 为获取到的文章分配本地图片
    articles.value = res.data.data.map((article, index) => ({
      ...article,
      coverImg: localImages[index % localImages.length] // 循环使用本地图片
    }))
    total.value = res.data.total
    currentPage.value = page
  } catch (error) {
    console.error('获取文章列表失败，使用假数据:', error)
    // 使用假数据
    articles.value = mockArticles
    total.value = mockArticles.length
    currentPage.value = page
  } finally {
    loading.value = false
  }
}

const loadArticleDetail = async (id) => {
  articleLoading.value = true
  try {
    const res = await articleGetPublicDetailService(id)
    // 为详情页文章分配本地图片
    selectedArticle.value = {
      ...res.data.data,
      coverImg: bg1 // 默认使用第一张图片
    }
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    console.error('获取文章详情失败，使用假数据:', error)
    // 使用假数据
    selectedArticle.value = mockArticleDetail
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    articleLoading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}

const goToAdmin = () => {
  router.push('/admin/article/manage')
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const handlePageChange = (page) => {
  loadArticles(page)
}

const goBackToList = () => {
  selectedArticle.value = null
}

// 初始化加载第一页
onMounted(() => {
  loadArticles(1)
})
</script>

<!-- 模板部分保持不变 -->


<template>
  <div class="home-page">
    <div class="header">
      <h1>首页</h1>
      <div class="auth-section">
        <div v-if="!userStore.token" class="login-prompt">
<!--          <span class="prompt-text">登录后可进行更多操作</span>-->
          <el-button type="primary" @click="goToLogin" size="small" class="login-btn">登录</el-button>
        </div>
        <div v-else class="user-actions">
          <span class="welcome-text">你好，{{ userStore.user.username }}</span>
          <el-button type="primary" @click="goToAdmin" size="small" class="admin-btn">管理后台</el-button>
          <el-button @click="userStore.removeToken(); router.push('/home')" size="small" class="logout-btn">退出</el-button>
        </div>
      </div>
    </div>

    <div class="content">
      <!-- 文章详情页面 -->
      <div v-if="selectedArticle" class="article-detail">
        <div class="detail-header">
          <el-button @click="goBackToList" type="primary" link>
            <i class="el-icon-arrow-left"></i> 返回列表
          </el-button>
          <h1 class="detail-title">{{ selectedArticle.title }}</h1>
          <div class="detail-meta">
            <span class="meta-item">
              <i class="el-icon-user"></i>
              {{ selectedArticle.author || '匿名作者' }}
            </span>
            <span class="meta-item">
              <i class="el-icon-folder"></i>
              {{ selectedArticle.categoryName || '未分类' }}
            </span>
            <span class="meta-item">
              <i class="el-icon-date"></i>
              {{ formatDate(selectedArticle.createTime) }}
            </span>
          </div>
        </div>

        <div v-if="articleLoading" class="detail-loading">
          <el-skeleton :rows="10" animated />
        </div>

        <div v-else class="detail-content">
          <div v-if="selectedArticle.coverImg" class="detail-cover">
            <img :src="selectedArticle.coverImg" :alt="selectedArticle.title" />
          </div>
          <!-- 使用 v-html 解析富文本内容 -->
          <div class="detail-body" v-html="selectedArticle.content"></div>
        </div>
      </div>

      <!-- 文章列表页面 -->
      <div v-else>
        <div v-if="loading" class="loading">
          <el-skeleton :rows="5" animated />
        </div>

        <div v-else>
          <div v-if="articles.length === 0" class="empty-state">
            <el-empty description="暂无文章" />
          </div>

          <div v-else class="articles-container">
            <!-- 使用网格布局，每行3个卡片 -->
            <div class="grid-wrapper">
              <div
                v-for="article in articles"
                :key="article.id"
                class="article-card"
                @click="loadArticleDetail(article.id)"
              >
                <div class="card-header">
                  <div class="cover-image">
                    <img
                      v-if="article.coverImg"
                      :src="article.coverImg"
                      :alt="article.title"
                    />
                    <div v-else class="placeholder-image">
                      <i class="el-icon-picture"></i>
                    </div>
                  </div>
                </div>

                <div class="card-body">
                  <h3 class="article-title">{{ article.title }}</h3>
                  <!-- 使用 v-html 解析富文本内容 -->
                  <div class="article-description" v-html="article.content"></div>
                  <div class="article-meta">
                    <span class="meta-item">
                      <i class="el-icon-user"></i>
                      {{ article.author || '匿名作者' }}
                    </span>
                    <span class="meta-item">
                      <i class="el-icon-folder"></i>
                      {{ article.categoryName || '未分类' }}
                    </span>
                    <span class="meta-item">
                      <i class="el-icon-date"></i>
                      {{ formatDate(article.createTime) }}
                    </span>
                  </div>
                </div>

                <div class="card-footer">
                  <el-button type="primary" link @click.stop>阅读全文</el-button>
                </div>
              </div>
            </div>

            <!-- 分页组件 -->
            <div class="pagination-wrapper" v-if="total > pageSize">
              <el-pagination
                v-model:current-page="currentPage"
                :page-size="pageSize"
                :total="total"
                layout="prev, pager, next, jumper, ->, total"
                @current-change="handlePageChange"
                background
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;

    h1 {
      margin: 0;
      font-size: 28px;
      color: #333;
      font-weight: 600;
    }

    .auth-section {
      .user-actions {
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 14px;
        color: #666;
      }
      .login-prompt {
        display: flex;
        align-items: center;
        gap: 15px;
        //background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 8px 20px;
        border-radius: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

        .prompt-text {
          color: white;
          font-size: 14px;
          font-weight: 500;
        }

        .login-btn {
          background: #000;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-weight: 500;
          transition: all 0.3s ease;

          //&:hover {
          //  background: rgba(255, 255, 255, 0.3);
          //  transform: translateY(-2px);
          //  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          //}
        }
      }

      .user-actions {
        display: flex;
        align-items: center;
        gap: 15px;
        background: #f8f9fa;
        padding: 8px 20px;
        border-radius: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

        .welcome-text {
          color: #495057;
          font-size: 14px;
          font-weight: 500;
        }

        .admin-btn {
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
        }

        .logout-btn {
          background: #fff;
          border: 1px solid #dee2e6;
          color: #6c757d;
          transition: all 0.3s ease;

          &:hover {
            background: #e9ecef;
            border-color: #adb5bd;
            transform: translateY(-2px);
          }
        }
      }
    }
  }

  .content {
    .loading, .detail-loading {
      padding: 40px 0;
    }

    .empty-state {
      padding: 60px 0;
    }

    /* 文章详情样式 */
    .article-detail {
      .detail-header {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;

        .el-button {
          margin-bottom: 15px;
          font-size: 14px;
        }

        .detail-title {
          margin: 0 0 15px 0;
          font-size: 32px;
          color: #333;
          font-weight: 600;
          line-height: 1.3;
        }

        .detail-meta {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: #999;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
        }
      }

      .detail-content {
        .detail-cover {
          width: 100%;
          height: 400px;
          margin-bottom: 30px;
          border-radius: 8px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }
        }

        .detail-body {
          font-size: 16px;
          line-height: 1.8;
          color: #333;

          :deep(img) {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
            margin: 10px 0;
          }

          :deep(p) {
            margin: 15px 0;
            text-align: justify;
          }

          :deep(h1), :deep(h2), :deep(h3) {
            margin: 20px 0 15px 0;
            color: #333;
          }

          :deep(h1) {
            font-size: 28px;
          }

          :deep(h2) {
            font-size: 24px;
          }

          :deep(h3) {
            font-size: 20px;
          }

          :deep(strong) {
            font-weight: bold;
          }

          :deep(em) {
            font-style: italic;
          }
        }
      }
    }

    /* 文章列表样式 */
    .articles-container {
      .grid-wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 25px;
        margin-bottom: 30px;

        @media (max-width: 1024px) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (max-width: 768px) {
          grid-template-columns: 1fr;
        }
      }

      .article-card {
        background: #fff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .card-header {
          position: relative;
          height: 200px;
          overflow: hidden;

          .cover-image {
            width: 100%;
            height: 100%;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
              transition: transform 0.3s ease;
            }
          }

          .placeholder-image {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f5f5f5;
            color: #999;
            font-size: 24px;
          }
        }

        .card-body {
          padding: 15px 20px;

          .article-title {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #333;
            font-weight: 600;
            line-height: 1.4;
            word-break: break-word;
          }

          .article-description {
            margin: 0 0 15px 0;
            font-size: 14px;
            line-height: 1.6;
            color: #666;
            text-align: justify;
            word-break: break-word;

            // 限制显示行数
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;

            :deep(p) {
              margin: 0;
              display: inline;
            }

            :deep(br) {
              display: none;
            }
          }

          .article-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            font-size: 12px;
            color: #999;

            .meta-item {
              display: flex;
              align-items: center;
              gap: 5px;

              i {
                font-size: 12px;
              }
            }
          }
        }

        .card-footer {
          padding: 0 20px 15px;
          border-top: 1px solid #f5f5f5;
          text-align: right;

          .el-button {
            padding: 0;
            font-size: 14px;
            color: #409eff;
          }
        }
      }

      .pagination-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 30px;

        :deep(.el-pagination) {
          .btn-prev, .btn-next, .el-pager li {
            background-color: #fff;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            margin: 0 5px;
          }

          .el-pager li.active {
            background-color: #409eff;
            color: #fff;
            border-color: #409eff;
          }
        }
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    padding: 15px;

    .header {
      flex-direction: column;
      gap: 15px;
      text-align: center;

      .auth-section {
        .user-actions {
          justify-content: center;
          flex-wrap: wrap;
        }
      }
    }

    .content {
      .article-detail {
        .detail-header {
          .detail-title {
            font-size: 24px;
          }
        }

        .detail-content {
          .detail-cover {
            height: 250px;
          }
        }
      }

      .articles-container {
        .grid-wrapper {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>
