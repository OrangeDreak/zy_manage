<template>
  <div class="transfer-list">
    <!-- 搜索区域 -->
    <div class="search-area">
      <el-form :inline="true" :model="searchForm">
        <el-form-item :label="t('transfer.list.search.customerCode')">
          <el-input v-model="searchForm.userCode" :placeholder="t('transfer.list.search.placeholder.customerCode')" />
        </el-form-item>
        <el-form-item :label="t('transfer.list.search.orderNo')">
          <el-input v-model="searchForm.orderNo" :placeholder="t('transfer.list.search.placeholder.orderNo')" />
        </el-form-item>
        <el-form-item :label="t('transfer.list.search.tag')">
          <el-select v-model="searchForm.tag" :placeholder="t('transfer.list.search.placeholder.tag')">
            <el-option :label="t('package.status.all')" value="" />
            <el-option label="标签1" value="tag1" />
            <el-option label="标签2" value="tag2" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('transfer.list.search.status')">
          <el-select v-model="searchForm.status" :placeholder="t('transfer.list.search.placeholder.status')">
            <el-option :label="t('package.status.all')" value="" />
            <el-option :label="t('transfer.list.status.pending')" value="pending" />
            <el-option :label="t('transfer.list.status.inStock')" value="inStock" />
            <el-option :label="t('transfer.list.status.shipping')" value="shipping" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="default" plain @click="handleReset">{{ t('transfer.list.search.reset') }}</el-button>
          <el-button type="primary" @click="handleSearch">{{ t('transfer.list.search.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <el-table :data="orders" v-loading="loading">
        <!-- 商品详情列 -->
        <el-table-column :label="t('transfer.list.table.productDetails')" min-width="400">
          <template #default="{ row }">
            <div class="product-info">
              <div class="customer-code">{{ t('transfer.list.table.customerCode') }}：{{ row.userCode }}</div>
              <div class="order-info">
                <div class="order-no">
                  {{ t('transfer.list.table.orderNo') }}：{{ row.orderNo }}
                  <el-button link type="primary" class="copy-btn">
                    <el-icon><DocumentCopy /></el-icon>
                  </el-button>
                </div>
                <div class="address-info">
                  <div>{{ t('transfer.list.table.recipientInfo.name') }}：{{ row.name }}</div>
                  <div>{{ t('transfer.list.table.recipientInfo.address') }}：{{ row.address }}</div>
                  <div>{{ t('transfer.list.table.recipientInfo.zipCode') }}：{{ row.zipCode }}</div>
                  <div>{{ t('transfer.list.table.recipientInfo.phone') }}：{{ row.phone }}</div>
                  <div>{{ t('transfer.list.table.recipientInfo.email') }}：{{ row.email }}</div>
                  <div>{{ t('transfer.list.table.recipientInfo.country') }}：{{ row.country }}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <!-- 商品备注信息列 -->
        <el-table-column :label="t('transfer.list.table.productRemark')" min-width="200">
          <template #default="{ row }">
            <div class="remark-info">
              <el-button link type="primary" @click="showRemark(row)">
                {{ t('transfer.list.table.editRemark') }}
              </el-button>
              <div class="remark-text">{{ row.remark || t('transfer.list.table.noRemark') }}</div>
            </div>
          </template>
        </el-table-column>

        <!-- 重量/尺寸列 -->
        <el-table-column :label="t('transfer.list.table.weightSize')" min-width="150">
          <template #default="{ row }">
            <div class="size-info">
              <div>{{ row.weight }}g</div>
              <div>{{ row.size }}</div>
            </div>
          </template>
        </el-table-column>

        <!-- 订单状态列 -->
        <el-table-column :label="t('transfer.list.table.orderStatus')" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ t(`transfer.list.status.${row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 物流状态列 -->
        <el-table-column :label="t('transfer.list.table.logisticsStatus')" min-width="200">
          <template #default="{ row }">
            <div class="logistics-info">
              <div>{{ t('transfer.list.table.trackingNo') }}：{{ row.trackingNo }}</div>
              <div>{{ row.latestTrack }}</div>
            </div>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column :label="t('transfer.list.table.actions')" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleShare(row)">
              {{ t('transfer.list.table.share') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'

const { t } = useI18n()
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = ref({
  userCode: '',
  orderNo: '',
  tag: '',
  status: ''
})

const orders = ref([])

// 获取订单列表
const getOrders = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    orders.value = Array(10).fill(null).map((_, index) => ({
      id: index + 1,
      userCode: '3730',
      orderNo: `YT${String(index + 1).padStart(10, '0')}`,
      name: 'Alonso González',
      address: 'Calle de Pablo Lastras García 7,3izq',
      zipCode: '28680',
      phone: '+34 627333730',
      email: 'alonsogonyu55@gmail.com',
      country: '西班牙',
      weight: '100',
      size: '23.0*26.9*43.9',
      status: 'inStock',
      trackingNo: 'SF1234567890',
      latestTrack: '包裹已到达目的地仓库',
      remark: ''
    }))
    total.value = 100
  } catch (error) {
    console.error(t('transfer.list.messages.getOrdersFailed'), error)
    ElMessage.error(t('transfer.list.messages.getOrdersFailed'))
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  page.value = 1
  getOrders()
}

// 处理重置
const handleReset = () => {
  searchForm.value = {
    userCode: '',
    orderNo: '',
    tag: '',
    status: ''
  }
  handleSearch()
}

// 处理分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getOrders()
}

const handleCurrentChange = (val) => {
  page.value = val
  getOrders()
}

// 获取状态标签类型
const getStatusType = (status) => {
  const map = {
    'pending': 'info',
    'inStock': 'success',
    'shipping': 'warning'
  }
  return map[status] || 'info'
}

// 显示备注编辑
const showRemark = (row) => {
  ElMessage.info(`编辑订单 ${row.orderNo} 的备注`)
}

// 分享订单
const handleShare = (row) => {
  ElMessage.success(`分享订单：${row.orderNo}`)
}

onMounted(() => {
  getOrders()
})
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.transfer-list {
  padding: 20px;

  .search-area {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    :deep(.el-button--primary) {
      background-color: @primary-color;
      border-color: @primary-color;

      &:hover {
        background-color: darken(@primary-color, 10%);
        border-color: darken(@primary-color, 10%);
      }
    }
  }

  .order-list {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

    .product-info {
      .customer-code {
        color: @primary-color;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .order-info {
        .order-no {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          color: @text-primary;
          font-weight: bold;
        }

        .address-info {
          color: @text-regular;
          line-height: 1.6;
        }
      }
    }

    .remark-info {
      .remark-text {
        color: @text-regular;
        margin-top: 5px;
        font-size: 13px;
      }
    }

    .size-info {
      color: @text-regular;
      line-height: 1.6;
    }

    .logistics-info {
      color: @text-regular;
      line-height: 1.6;
    }

    :deep(.el-tag) {
      &--success {
        background-color: mix(@primary-color, #fff, 10%);
        border-color: mix(@primary-color, #fff, 20%);
        color: @primary-color;
      }
    }

    :deep(.el-button--primary) {
      color: @primary-color;

      &:hover {
        color: darken(@primary-color, 10%);
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;

    :deep(.el-pagination.is-background) {
      .el-pager li:not(.is-disabled).is-active {
        background-color: @primary-color;
      }
    }
  }
}
</style> 