import { mockDashboardData } from '@/mock/dashboard'

export const dashboard = {
  // 获取仪表盘数据
  getOverview() {
    return Promise.resolve(mockDashboardData.overview)
  },

  // 获取用户增长趋势
  getUserGrowth({ period }) {
    return Promise.resolve(mockDashboardData.userGrowth[period])
  },

  // 获取登录统计
  getLoginStats({ period }) {
    return Promise.resolve(mockDashboardData.loginStats[period])
  },

  // 获取最近活动
  getRecentActivities() {
    return Promise.resolve({
      list: mockDashboardData.activities
    })
  }
} 