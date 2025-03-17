import request from '@/utils/request'


export const user = {
  // 获取用户列表
  getUsers(params) {
    return request({
      url: '/api/users',
      method: 'get',
      params
    })
  },

  createUser(data) {
    return request({
      url: '/api/users',
      method: 'post',
      data
    })
  },

  updateUser(id, data) {
    return request({
      url: `/api/users/${id}`,
      method: 'put',
      data
    })
  },

  deleteUser(id) {
    return request({
      url: `/api/users/${id}`,
      method: 'delete'
    })
  }
} 