<template>
  <div class="my-assets">
    <!-- 资产卡片 -->
    <div class="assets-card">
      <div class="balance-info">
        <div class="title">{{ $t('assets.balance.title') }}</div>
        <div class="amount">{{ balance }}</div>
        <div class="frozen">({{ $t('assets.balance.frozen') }}：{{ frozenAmount }})</div>
      </div>
      <div class="actions">
        <el-button type="primary" @click="handleWithdraw">
          {{ $t('assets.balance.withdraw') }}
        </el-button>
        <el-button @click="handleRecharge">
          {{ $t('assets.balance.recharge') }}
        </el-button>
        <el-tooltip :content="$t('assets.balance.help')" placement="top">
          <el-icon class="help-icon"><QuestionFilled /></el-icon>
        </el-tooltip>
      </div>
    </div>

    <!-- 交易记录 -->
    <div class="transaction-list">
      <!-- 搜索区域 -->
      <div class="search-area">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          :range-separator="$t('assets.transaction.dateRange.separator')"
          :start-placeholder="$t('assets.transaction.dateRange.start')"
          :end-placeholder="$t('assets.transaction.dateRange.end')"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
        <el-button link type="primary" @click="viewStatement">
          {{ $t('assets.transaction.viewStatement') }}
        </el-button>
      </div>

      <!-- 交易表格 -->
      <el-table :data="transactionList" v-loading="loading">
        <el-table-column :label="$t('assets.transaction.table.time')" prop="time" width="180" />
        <el-table-column :label="$t('assets.transaction.table.type')" prop="type" width="120" />
        <el-table-column :label="$t('assets.transaction.table.amount')" width="150">
          <template #default="{ row }">
            <span :class="{ 'income': row.amount > 0, 'expense': row.amount < 0 }">
              {{ row.amount > 0 ? '+' : '' }}{{ row.amount }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('assets.transaction.table.balance')" prop="balance" width="150" />
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QuestionFilled, DocumentCopy } from '@element-plus/icons-vue'

const loading = ref(false)
const balance = ref('753.64')
const frozenAmount = ref('0')
const dateRange = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const expandedRows = ref([])

// 模拟交易数据
const transactionList = ref([
  {
    id: '1',
    time: '2024-02-07 15:07:36',
    type: '订单退款',
    amount: 13.33,
    balance: '753.64',
    orderNo: 'REF20240207150736',
    description: '订单取消退款',
    paymentMethod: '原路退回',
    transactionNo: 'TX20240207150736'
  },
  {
    id: '2',
    time: '2024-02-07 15:07:24',
    type: '下单支付',
    amount: -13.33,
    balance: '740.32',
    orderNo: 'ORD20240207150724',
    description: '购买商品',
    paymentMethod: '余额支付',
    transactionNo: 'TX20240207150724'
  }
  // ... 其他交易记录
])

// 提现
const handleWithdraw = () => {
  // 实现提现逻辑
}

// 充值
const handleRecharge = () => {
  // 实现充值逻辑
}

// 查看账单
const viewStatement = () => {
  // 实现查看账单逻辑
}

// 分页相关方法
const handleSizeChange = (val) => {
  pageSize.value = val
  // 重新加载数据
}

const handleCurrentChange = (val) => {
  page.value = val
  // 重新加载数据
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.my-assets {
  .assets-card {
    background: linear-gradient(135deg, @primary-color, darken(@primary-color, 10%));
    padding: 30px;
    border-radius: 8px;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .balance-info {
      .title {
        font-size: 16px;
        opacity: 0.9;
        margin-bottom: 10px;
      }

      .amount {
        font-size: 36px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .frozen {
        font-size: 14px;
        opacity: 0.8;
      }
    }

    .actions {
      display: flex;
      gap: 10px;
      align-items: center;

      .el-button {
        --el-button-bg-color: rgba(255, 255, 255, 0.2);
        --el-button-border-color: rgba(255, 255, 255, 0.3);
        --el-button-hover-bg-color: rgba(255, 255, 255, 0.3);
        --el-button-hover-border-color: rgba(255, 255, 255, 0.4);
        --el-button-active-bg-color: rgba(255, 255, 255, 0.4);
        --el-button-active-border-color: rgba(255, 255, 255, 0.5);
        --el-button-text-color: #fff;

        &.el-button--primary {
          --el-button-bg-color: #fff;
          --el-button-border-color: #fff;
          --el-button-hover-bg-color: #f5f7fa;
          --el-button-hover-border-color: #f5f7fa;
          --el-button-active-bg-color: #e4e7ed;
          --el-button-active-border-color: #e4e7ed;
          --el-button-text-color: @primary-color;
        }
      }

      .help-icon {
        color: rgba(255, 255, 255, 0.8);
        font-size: 20px;
        cursor: pointer;

        &:hover {
          color: #fff;
        }
      }
    }
  }

  .transaction-list {
    background: #fff;
    padding: 20px;
    border-radius: 8px;

    .search-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .income {
      color: #67c23a;
    }

    .expense {
      color: #f56c6c;
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

    .transaction-table {
      width: 100% !important;

      :deep(.el-table__expanded-cell) {
        padding: 10px 20px;
      }

      :deep(.el-table__body) {
        width: 100%;
      }
    }
  }
}

.detail-info {
  padding: 20px;
  background: mix(@primary-color, #fff, 5%);
  border-radius: 4px;
  margin: 10px 0;

  .detail-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    &:last-child {
      margin-bottom: 0;
    }

    .label {
      width: 100px;
      color: @text-regular;
    }

    .value {
      color: @text-primary;
      flex: 1;
    }

    .copy-btn {
      margin-left: 10px;
    }
  }
}
</style> 