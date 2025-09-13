import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({ username, password }) =>{
  return request.post('/user/register', { username, password })
}

// 登录接口 
export const userLoginService = ({username, password}) => request.post('/user/login', { username, password})

// 获取用户基本信息
export const userGetInfoService = () => request.get('/user/userInfo')

// 更新个人信息
export const userUpdateInfoService = ({ id, nickname, email}) => request.put('/user/update', { id, nickname, email })

// 更新用户头像
export const userUploadAvatarService = (formData) => request.patch('/user/updateAvatar',  formData )

// 更新用户密码
export const userUpdatePasswordService = (old_pwd, new_pwd, re_pwd) => request.patch('/user/updatePwd', old_pwd, new_pwd, re_pwd )