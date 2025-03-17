import request from '@/utils/request'

export const log = {
  // 获取登录日志
  getLoginLogs(params) {
    return request({
      url: '/api/logs/login',
      method: 'get',
      params
    })
  }
} 