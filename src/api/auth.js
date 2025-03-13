import request from '@/utils/request'

export const auth = {
  // 用户登录
  login(data) {
    return request({
      url: '/api/auth/login',
      method: 'post',
      data
    })
  },

  // 用户注册
  register(data) {
    return request({
      url: '/api/auth/register',
      method: 'post',
      data
    })
  }
} 