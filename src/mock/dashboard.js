// 生成随机数据
const generateRandomData = (count, min, max) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

// 生成日期数组
const generateDates = (count) => {
  const dates = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString())
  }
  return dates
}

export const mockDashboardData = {
  // 概览数据
  overview: {
    totalUsers: 1234,
    todayLogins: 123,
    totalLogs: 456,
    configCount: 789
  },

  // 用户增长数据
  userGrowth: {
    week: {
      dates: generateDates(7),
      values: generateRandomData(7, 10, 100)
    },
    month: {
      dates: generateDates(30),
      values: generateRandomData(30, 10, 100)
    },
    year: {
      dates: generateDates(12),
      values: generateRandomData(12, 100, 1000)
    }
  },

  // 登录统计数据
  loginStats: {
    day: {
      dates: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      values: generateRandomData(24, 0, 50)
    },
    week: {
      dates: generateDates(7),
      values: generateRandomData(7, 50, 200)
    },
    month: {
      dates: generateDates(30),
      values: generateRandomData(30, 100, 500)
    }
  },

  // 最近活动
  activities: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    content: [
      '用户 admin 登录系统',
      '新增用户 user001',
      '更新系统配置',
      '删除用户 test123',
      '修改用户权限'
    ][Math.floor(Math.random() * 5)],
    timestamp: new Date(Date.now() - i * 3600000).toLocaleString(),
    type: ['primary', 'success', 'warning', 'danger'][Math.floor(Math.random() * 4)]
  }))
} 