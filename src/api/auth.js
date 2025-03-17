import request from '@/utils/request'

const API_BASE_URL = 'localhost:8081/tp' // local

export const auth = {
  // 用户登录
  login(data) {
    return request({
      url: '${API_BASE_URL}/admin/user/login',
      method: 'post',
      data
    })
  }
} 