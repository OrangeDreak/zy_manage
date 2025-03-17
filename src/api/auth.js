import request from '@/utils/request'

export const auth = {
  // 用户登录
  login(data) {
    return request({
      url: '/admin/user/login',
      method: 'post',
      data
    })
  }
} 