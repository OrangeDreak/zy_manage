<template>
  <div class="my-package">
    <!-- 状态标签页 -->
    <div class="status-tabs">
      <div 
        v-for="tab in statusTabs" 
        :key="tab.value"
        :class="['tab-item', { active: currentStatus === tab.value }]"
        @click="handleTabClick(tab.value)"
      >
        {{ $t(`package.status.${tab.value}`) }}
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-area">
      <el-input
        v-model="searchForm.orderNo"
        :placeholder="$t('package.search.placeholder')"
        class="search-input"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSearch">
        {{ $t('package.search.button') }}
      </el-button>
    </div>

    <!-- 包裹列表 -->
    <div class="package-list">
      <el-table 
        :data="packageList" 
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <!-- 选择列 -->
        <el-table-column type="selection" width="55" />

        <el-table-column :label="$t('package.table.packageInfo')" min-width="300">
          <template #default="{ row }">
            <div class="package-info">
              <div class="package-no">
                {{ $t('package.table.packageNo') }}：{{ row.packageNo }}
                <el-button link type="primary" class="copy-btn">
                  <el-icon><DocumentCopy /></el-icon>
                </el-button>
              </div>
              <div class="submit-time">{{ $t('package.table.submitTime') }}：{{ row.submitTime }}</div>
              <div class="package-images">
                <el-image 
                  v-for="(img, index) in row.images" 
                  :key="index"
                  :src="img"
                  fit="cover"
                  class="package-image"
                />
                <div class="image-count">{{ row.images.length }}{{ $t('package.table.images') }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="$t('package.table.weight')" width="120" align="center" prop="weight" />
        <el-table-column :label="$t('package.table.size')" width="150" prop="size" />
        <el-table-column :label="$t('package.table.shippingFee')" width="120">
          <template #default="{ row }">
            ${{ row.shippingFee }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('package.table.shippingMethod')" width="150">
          <template #default="{ row }">
            {{ row.shippingMethod }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('package.table.status')" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ $t(`package.status.${row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column :label="$t('package.table.actions')" width="120" fixed="right">
          <template #default="{ row }">
            <el-button 
              link 
              type="primary" 
              @click="$router.push(`/package/${row.packageNo}`)"
            >
              {{ $t('warehouse.table.details') }}
            </el-button>
            <el-button 
              v-if="row.status === '已取消'" 
              link 
              type="danger" 
              @click="deletePackage(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <div class="total">共 {{ total }} 条</div>
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="prev, pager, next, sizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <div class="left">
        <el-checkbox v-model="selectAll" @change="handleSelectAll">全选</el-checkbox>
        <span class="selected-count">选中订单 {{ selectedCount }} 个</span>
      </div>
      <div class="right">
        <el-button type="primary" :disabled="!selectedCount" @click="submitTransfer">
          提交运送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, DocumentCopy } from '@element-plus/icons-vue'

// 状态标签
const statusTabs = [
  { label: 'all', value: 'all' },
  { label: 'pending', value: 'pending' },
  { label: 'inStock', value: 'inStock' },
  { label: 'shipping', value: 'shipping' },
  { label: 'delivered', value: 'delivered' },
  { label: 'cancelled', value: 'cancelled' }
]

const currentStatus = ref('all')
const searchForm = ref({
  orderNo: ''
})
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const selectAll = ref(false)
const selectedRows = ref([])
const selectedCount = computed(() => selectedRows.value.length)

// 模拟包裹数据
const packageList = ref([
  {
    packageNo: 'EP26083887545365708',
    submitTime: '2024-12-20 18:40:34',
    images: ['/img1.jpg', '/img2.jpg'],
    weight: 525,
    size: '33*32*10',
    shippingFee: 48.56,
    shippingMethod: '马来联邦',
    status: '已取消',
    destination: 'Canada'
  },
  // ... 其他包裹数据
])

// 获取状态类型
const getStatusType = (status) => {
  const types = {
    '待支付': 'warning',
    '已出单': 'info',
    '已发货': 'primary',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return types[status] || 'info'
}

// 处理标签页点击
const handleTabClick = (status) => {
  currentStatus.value = status
  // 重新加载数据
}

// 处理搜索
const handleSearch = () => {
  // 实现搜索逻辑
}

// 删除包裹
const deletePackage = (row) => {
  // 实现删除逻辑
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val) => {
  page.value = val
  // 重新加载数据
}

// 处理表格选择变化
const handleSelectionChange = (rows) => {
  selectedRows.value = rows
  selectAll.value = rows.length === packageList.value.length
}

// 处理全选
const handleSelectAll = (val) => {
  const table = document.querySelector('.el-table')
  if (table) {
    if (val) {
      table.__vue__?.toggleAllSelection()
    } else {
      table.__vue__?.clearSelection()
    }
  }
}

// 提交运送
const submitTransfer = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要运送的包裹')
    return
  }
  
  // 这里实现提交运送逻辑
  console.log('提交运送', selectedRows.value)
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.my-package {
  .status-tabs {
    display: flex;
    background: #fff;
    padding: 0 20px;
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    .tab-item {
      padding: 15px 30px;
      font-size: 14px;
      color: @text-regular;
      cursor: pointer;
      position: relative;

      &.active {
        color: @primary-color;
        font-weight: bold;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: @primary-color;
        }
      }

      &:hover {
        color: @primary-color;
      }
    }
  }

  .search-area {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;

    .search-input {
      width: 300px;
    }

    :deep(.el-button--primary) {
      background-color: @primary-color;
      border-color: @primary-color;

      &:hover {
        background-color: darken(@primary-color, 10%);
        border-color: darken(@primary-color, 10%);
      }
    }
  }

  .package-list {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    .package-info {
      .package-no {
        font-weight: bold;
        color: @primary-color;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .submit-time {
        color: @text-regular;
        margin-bottom: 8px;
      }

      .package-images {
        display: flex;
        align-items: center;
        gap: 8px;

        .package-image {
          width: 60px;
          height: 60px;
          border-radius: 4px;
        }

        .image-count {
          color: @text-regular;
          font-size: 12px;
        }
      }
    }

    :deep(.el-tag) {
      &.el-tag--primary {
        background-color: mix(@primary-color, #fff, 10%);
        border-color: mix(@primary-color, #fff, 20%);
        color: @primary-color;
      }
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .total {
        color: @text-regular;
      }

      :deep(.el-pagination.is-background) {
        .el-pager li:not(.is-disabled).is-active {
          background-color: @primary-color;
        }
      }
    }
  }

  .bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;
    background: #fff;
    box-shadow: 0 -2px 12px 0 rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-left: 200px; // 留出侧边栏宽度

    .left {
      display: flex;
      align-items: center;
      gap: 20px;

      .selected-count {
        color: @text-regular;
        font-size: 14px;
      }
    }

    :deep(.el-checkbox) {
      --el-checkbox-checked-bg-color: @primary-color;
      --el-checkbox-checked-border-color: @primary-color;
      --el-checkbox-checked-text-color: @primary-color;
    }

    :deep(.el-button--primary) {
      background-color: @primary-color;
      border-color: @primary-color;

      &:hover {
        background-color: darken(@primary-color, 10%);
        border-color: darken(@primary-color, 10%);
      }

      &.is-disabled {
        background-color: mix(@primary-color, #fff, 50%);
        border-color: mix(@primary-color, #fff, 50%);
      }
    }
  }

  // 为底部操作栏留出空间
  .package-list {
    margin-bottom: 80px;
  }

  // 表格选择列样式
  :deep(.el-table) {
    .el-checkbox {
      --el-checkbox-checked-bg-color: @primary-color;
      --el-checkbox-checked-border-color: @primary-color;
      --el-checkbox-checked-text-color: @primary-color;
    }
  }
}
</style> 