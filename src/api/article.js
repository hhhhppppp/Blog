import request from '@/utils/request'

// 获取文章分类
export const articleGetChannelsService = () => request.get('/category')

// 添加文章分类
export const articleAddChannelService = (data) => request.post('/category', data)

// 编辑文章分类
export const articleUpdateChannelService = (data) =>  request.put('/category', data)

// 删除文章分类
export const articleDeleteChannelService = (id) => request.delete(`/category/${id}`)

// 获取文章列表
export const articleGetListService = (params) => request.get('/article', {
  params
})

// 获取公开文章列表（无需认证）
export const articleGetPublicListService = (params) => request.get('/article/public', {
  params
})

// 获取公开文章详情（无需认证）
export const articleGetPublicDetailService = (id) => request.get(`/article/public/${id}`)

// 添加文章
export const articleAddService = (data) => request.post('/article', data)

// 获取文章详情
export const articleGetDetailService = (id) => request.get(`/article/${id}`)

// 更新文章
export const articleEditService = data => request.put('/article', data)

// 获取文章列表 API（为 HomePage.vue 添加
export const getArticleListAPI = (params) => request.get('/article', { params })
