<template>
  <div class="login-log">
    <el-card>
      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>

      <!-- 日志表格 -->
      <el-table :data="logList" v-loading="loading">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="ip" label="IP地址" />
        <el-table-column prop="loginTime" label="登录时间" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status ? 'success' : 'danger'">
              {{ scope.row.status ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { log } from '@/api/log'

const loading = ref(false)
const logList = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const searchForm = ref({
  username: '',
  dateRange: []
})

// 获取登录日志
const getLoginLogs = async () => {
  loading.value = true
  try {
    const res = await log.getLoginLogs({
      page: page.value,
      pageSize: pageSize.value,
      ...searchForm.value
    })
    logList.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  page.value = 1
  getLoginLogs()
}

// 页码改变
const handlePageChange = () => {
  getLoginLogs()
}

onMounted(() => {
  getLoginLogs()
})
</script>

<style lang="less" scoped>
.login-log {
  .search-form {
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style> 