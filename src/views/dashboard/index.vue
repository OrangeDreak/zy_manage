<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <!-- 数据概览卡片 -->
      <el-col :span="6" v-for="card in overviewData" :key="card.title">
        <el-card shadow="hover" class="data-card">
          <div class="card-icon" :style="{ backgroundColor: card.color }">
            <el-icon><component :is="card.icon" /></el-icon>
          </div>
          <div class="card-content">
            <div class="card-title">{{ card.title }}</div>
            <div class="card-value">{{ card.value }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>用户增长趋势</span>
              <el-radio-group v-model="userGrowthPeriod" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">全年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <v-chart class="chart" :option="userGrowthOption" autoresize />
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>登录统计</span>
              <el-select v-model="loginStatsPeriod" size="small">
                <el-option label="最近24小时" value="day" />
                <el-option label="最近7天" value="week" />
                <el-option label="最近30天" value="month" />
              </el-select>
            </div>
          </template>
          <v-chart class="chart" :option="loginStatsOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动 -->
    <el-card class="activity-card">
      <template #header>
        <div class="card-header">
          <span>最近活动</span>
          <el-button type="primary" link @click="loadMoreActivities">
            加载更多
          </el-button>
        </div>
      </template>
      <el-timeline>
        <el-timeline-item
          v-for="activity in activities"
          :key="activity.id"
          :timestamp="activity.timestamp"
          :type="activity.type"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { User, Timer, Document, Setting } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import VChart from 'vue-echarts'
import { dashboard } from '@/api/dashboard'

// 数据状态
const overviewData = ref([])
const activities = ref([])
const userGrowthPeriod = ref('week')
const loginStatsPeriod = ref('day')
const activitiesPage = ref(1)
const loading = ref(false)

// 图表配置
const userGrowthOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [],
    type: 'line',
    smooth: true
  }]
})

const loginStatsOption = ref({
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [],
    type: 'bar'
  }]
})

// 获取概览数据
const getOverviewData = async () => {
  try {
    const res = await dashboard.getOverview()
    overviewData.value = [
      {
        title: '总用户数',
        value: res.totalUsers,
        icon: 'User',
        color: '#409EFF'
      },
      {
        title: '今日登录',
        value: res.todayLogins,
        icon: 'Timer',
        color: '#67C23A'
      },
      {
        title: '系统日志',
        value: res.totalLogs,
        icon: 'Document',
        color: '#E6A23C'
      },
      {
        title: '系统配置',
        value: res.configCount,
        icon: 'Setting',
        color: '#F56C6C'
      }
    ]
  } catch (error) {
    console.error('获取概览数据失败:', error)
  }
}

// 获取用户增长数据
const getUserGrowthData = async () => {
  try {
    const res = await dashboard.getUserGrowth({ period: userGrowthPeriod.value })
    userGrowthOption.value.xAxis.data = res.dates
    userGrowthOption.value.series[0].data = res.values
  } catch (error) {
    console.error('获取用户增长数据失败:', error)
  }
}

// 获取登录统计数据
const getLoginStatsData = async () => {
  try {
    const res = await dashboard.getLoginStats({ period: loginStatsPeriod.value })
    loginStatsOption.value.xAxis.data = res.dates
    loginStatsOption.value.series[0].data = res.values
  } catch (error) {
    console.error('获取登录统计数据失败:', error)
  }
}

// 获取活动数据
const getActivities = async (loadMore = false) => {
  if (loading.value) return
  loading.value = true
  
  try {
    const res = await dashboard.getRecentActivities({
      page: activitiesPage.value,
      pageSize: 10
    })
    
    if (loadMore) {
      activities.value.push(...res.list)
    } else {
      activities.value = res.list
    }
  } catch (error) {
    console.error('获取活动数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载更多活动
const loadMoreActivities = () => {
  activitiesPage.value += 1
  getActivities(true)
}

// 监听周期变化
watch(userGrowthPeriod, getUserGrowthData)
watch(loginStatsPeriod, getLoginStatsData)

// 初始化
onMounted(() => {
  getOverviewData()
  getUserGrowthData()
  getLoginStatsData()
  getActivities()
})
</script>

<style lang=less scoped>
.dashboard {
  .data-card {
    display: flex;
    align-items: center;
    padding: 20px;
    margin-bottom: 20px;

    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 15px;

      .el-icon {
        font-size: 24px;
        color: #fff;
      }
    }

    .card-content {
      .card-title {
        font-size: 14px;
        color: #909399;
      }

      .card-value {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
        margin-top: 5px;
      }
    }
  }

  .chart-row {
    margin: 20px 0;
  }

  .chart-placeholder {
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f7fa;
    color: #909399;
  }

  .activity-card {
    margin-top: 20px;
  }

  .card-header {
    font-weight: bold;
  }
}

.chart {
  height: 300px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 