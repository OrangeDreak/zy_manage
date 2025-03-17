<template>
  <div class="transfer-order">
    <div class="page-title">添加转运订单</div>
    
    <!-- 仓库地址信息 -->
    <div class="section">
      <div class="section-title">获取仓库地址</div>
      <div class="section-tip">请联系客服获取仓库地址</div>
    </div>

    <!-- 用户信息区域 -->
    <div class="section">
      <div class="user-code">
        <el-input 
          v-model="userCode" 
          placeholder="自定义用户编码"
          class="user-code-input"
        >
          <template #append>
            <el-tooltip content="用户编码说明" placement="top">
              <el-icon><QuestionFilled /></el-icon>
            </el-tooltip>
          </template>
        </el-input>
      </div>

      <div class="recent-address">
        <span>最近用户编码地址信息：</span>
        <span class="address-info">XXXXX</span>
        <el-button 
          type="primary" 
          link 
          class="new-address"
          @click="handleAddAddress"
        >
          新增用户地址信息
          <el-tooltip content="地址信息说明" placement="top">
            <el-icon class="address-help"><QuestionFilled /></el-icon>
          </el-tooltip>
        </el-button>
      </div>
    </div>

    <!-- 订单信息录入区域 -->
    <div class="section">
      <div v-for="(order, index) in orders" :key="index" class="order-item">
        <div class="order-row">
          <div class="order-input">
            <el-input 
              v-model="order.expressNo" 
              placeholder="快递单号"
            >
              <template #append>
                <el-tooltip content="快递单号说明" placement="top">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </template>
            </el-input>
          </div>

          <div class="order-input">
            <el-input 
              v-model="order.value" 
              placeholder="货值"
              type="number"
            />
          </div>

          <div class="order-input">
            <el-input 
              v-model="order.sku" 
              placeholder="商品SKU信息"
            />
          </div>

          <el-button 
            type="danger" 
            circle
            @click="removeOrder(index)"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 底部操作区 -->
    <div class="add-order">
      <el-button 
        class="add-btn"
        @click="addOrder"
      >
        <el-icon><Plus /></el-icon>
        新增转运订单
        <el-tooltip content="转运订单说明" placement="top">
          <el-icon class="order-help"><QuestionFilled /></el-icon>
        </el-tooltip>
      </el-button>
    </div>

    <!-- 新增地址对话框 -->
    <AddressForm
      v-model="addressDialogVisible"
      @submit="handleAddressSubmit"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QuestionFilled, Plus, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import AddressForm from './AddressForm.vue'

const userCode = ref('')
const orders = ref([
  {
    expressNo: '',
    value: '',
    sku: ''
  }
])

const addressDialogVisible = ref(false)

// 添加新订单
const addOrder = () => {
  orders.value.push({
    expressNo: '',
    value: '',
    sku: ''
  })
}

// 删除订单
const removeOrder = (index) => {
  if (orders.value.length === 1) {
    ElMessage.warning('至少保留一个订单')
    return
  }
  orders.value.splice(index, 1)
}

// 添加地址
const handleAddAddress = () => {
  addressDialogVisible.value = true
}

// 添加处理地址提交的方法
const handleAddressSubmit = (address) => {
  console.log('新增地址:', address)
  // TODO: 更新最近地址信息
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.transfer-order {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .page-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
    color: #303133;
  }

  .section {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

    &-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #303133;
    }

    &-tip {
      color: #909399;
      font-size: 14px;
    }
  }

  .user-code {
    margin-bottom: 15px;

    &-input {
      max-width: 400px;
    }
  }

  .recent-address {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #606266;

    .address-info {
      color: #303133;
      font-weight: bold;
    }
  }

  .new-address {
    display: flex;
    align-items: center;

    .address-help {
      margin-left: 5px;
    }
  }

  .order-item {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid #EBEEF5;
    border-radius: 4px;
  }

  .order-row {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .order-input {
    flex: 1;
  }

  .add-order {
    display: flex;
    justify-content: center;
    margin-top: 30px;

    .add-btn {
      background-color: @primary-light;
      border-color: @primary-light;
      color: @primary-color;
      font-size: 16px;
      height: 50px;
      padding: 0 30px;
      display: flex;
      align-items: center;
      gap: 5px;

      &:hover {
        background-color: darken(@primary-light, 5%);
        border-color: darken(@primary-light, 5%);
      }
    }

    .order-help {
      margin-left: 5px;
    }
  }
}

:deep(.el-input-group__append) {
  cursor: pointer;
}
</style> 