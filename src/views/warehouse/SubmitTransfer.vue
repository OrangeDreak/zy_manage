<template>
  <div class="submit-transfer">
    <!-- 步骤进度 -->
    <div class="steps">
      <el-steps :active="currentStep" finish-status="success">
        <el-step title="选择商品" />
        <el-step title="确认信息" />
        <el-step title="提交订单" />
      </el-steps>
    </div>

    <!-- 商品清单 -->
    <div class="product-list">
      <div class="section-title">商品清单</div>
      <el-table :data="selectedProducts">
        <el-table-column label="商品信息" min-width="400">
          <template #default="{ row }">
            <div class="product-info">
              <el-image :src="row.image" class="product-image" />
              <div class="product-detail">
                <div class="product-name">{{ row.name }}</div>
                <div class="product-spec">
                  颜色：{{ row.color }}
                  <span v-if="row.size">尺码：{{ row.size }}</span>
                </div>
                <div class="product-id">{{ row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="重量(g)" width="120" align="center" prop="weight" />
        <el-table-column label="尺寸(cm)" width="150" prop="size" />
        <el-table-column label="数量" width="120" align="center">
          <template #default="{ row }">
            ×{{ row.quantity }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 收货地址 -->
    <div class="delivery-info">
      <div class="section-title">收货地址</div>
      <div class="address-list">
        <el-radio-group v-model="selectedAddress">
          <div v-for="address in addresses" :key="address.id" class="address-item">
            <el-radio :label="address.id">
              <div class="address-content">
                <div class="contact">
                  <span class="name">{{ address.name }}</span>
                  <span class="phone">{{ address.phone }}</span>
                </div>
                <div class="address">{{ address.fullAddress }}</div>
              </div>
            </el-radio>
          </div>
        </el-radio-group>
        <el-button type="primary" plain class="add-address" @click="addNewAddress">
          <el-icon><Plus /></el-icon>
          添加新地址
        </el-button>
      </div>
    </div>

    <!-- 运输方式 -->
    <div class="shipping-method">
      <div class="section-title">运输方式</div>
      <el-radio-group v-model="selectedShipping">
        <div v-for="method in shippingMethods" :key="method.id" class="shipping-item">
          <el-radio :label="method.id">
            <div class="shipping-content">
              <div class="method-name">{{ method.name }}</div>
              <div class="method-desc">{{ method.description }}</div>
              <div class="method-time">预计 {{ method.time }} 送达</div>
            </div>
          </el-radio>
          <div class="shipping-price">¥{{ method.price }}</div>
        </div>
      </el-radio-group>
    </div>

    <!-- 包装服务 -->
    <div class="package-service">
      <div class="section-title">包装服务</div>
      <el-checkbox-group v-model="selectedServices">
        <div v-for="service in packageServices" :key="service.id" class="service-item">
          <el-checkbox :label="service.id">
            <div class="service-content">
              <div class="service-name">{{ service.name }}</div>
              <div class="service-desc">{{ service.description }}</div>
            </div>
            <div class="service-price">¥{{ service.price }}</div>
          </el-checkbox>
        </div>
      </el-checkbox-group>
    </div>

    <!-- 费用明细 -->
    <div class="cost-summary">
      <div class="section-title">费用明细</div>
      <div class="cost-items">
        <div class="cost-item">
          <span>商品总重量</span>
          <span>{{ totalWeight }}g</span>
        </div>
        <div class="cost-item">
          <span>运费</span>
          <span>¥{{ shippingCost }}</span>
        </div>
        <div class="cost-item">
          <span>包装费</span>
          <span>¥{{ packagingCost }}</span>
        </div>
        <div class="cost-item total">
          <span>预估总费用</span>
          <span class="total-amount">¥{{ totalCost }}</span>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <div class="left">
        <div class="total-info">
          <span class="label">预估总费用：</span>
          <span class="amount">¥{{ totalCost }}</span>
        </div>
      </div>
      <div class="right">
        <el-button @click="goBack">返回修改</el-button>
        <el-button type="primary" @click="submitOrder">提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const currentStep = ref(1)

// 选中的商品
const selectedProducts = ref([
  {
    id: 'SP231364071519347264',
    name: '白色衬衫男长袖修身商务休闲正装衬衣',
    color: '白色',
    size: 'XL',
    image: '/shirt.jpg',
    weight: 350,
    size: '30*25*5',
    quantity: 2
  }
])

// 地址列表
const addresses = ref([
  {
    id: 1,
    name: 'John Doe',
    phone: '+1 234 567 8901',
    fullAddress: '123 Main St, New York, NY 10001, United States'
  }
])
const selectedAddress = ref(1)

// 运输方式
const shippingMethods = ref([
  {
    id: 1,
    name: '标准快递',
    description: '适合普通包裹',
    time: '7-10 工作日',
    price: 99
  },
  {
    id: 2,
    name: '特快专递',
    description: '适合急需物品',
    time: '3-5 工作日',
    price: 199
  }
])
const selectedShipping = ref(1)

// 包装服务
const packageServices = ref([
  {
    id: 1,
    name: '标准包装',
    description: '基础防护',
    price: 10
  },
  {
    id: 2,
    name: '防水包装',
    description: '加强防水保护',
    price: 20
  }
])
const selectedServices = ref([])

// 计算总费用
const totalWeight = computed(() => {
  return selectedProducts.value.reduce((sum, product) => {
    return sum + product.weight * product.quantity
  }, 0)
})

const shippingCost = computed(() => {
  const method = shippingMethods.value.find(m => m.id === selectedShipping.value)
  return method ? method.price : 0
})

const packagingCost = computed(() => {
  return selectedServices.value.reduce((sum, serviceId) => {
    const service = packageServices.value.find(s => s.id === serviceId)
    return sum + (service ? service.price : 0)
  }, 0)
})

const totalCost = computed(() => {
  return shippingCost.value + packagingCost.value
})

// 添加新地址
const addNewAddress = () => {
  // 实现添加地址逻辑
}

// 返回修改
const goBack = () => {
  router.back()
}

// 提交订单
const submitOrder = () => {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }

  if (!selectedShipping.value) {
    ElMessage.warning('请选择运输方式')
    return
  }

  // 实现提交订单逻辑
  ElMessage.success('订单提交成功')
  router.push('/transfer-list')
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.submit-transfer {
  padding-bottom: 80px;

  .steps {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: @text-primary;
    margin-bottom: 20px;
    border-bottom: 1px solid @border-color;
    padding-bottom: 10px;
  }

  .product-list,
  .delivery-info,
  .shipping-method,
  .package-service,
  .cost-summary {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .product-info {
    display: flex;
    gap: 15px;

    .product-image {
      width: 80px;
      height: 80px;
      border-radius: 4px;
    }

    .product-detail {
      .product-name {
        color: @text-primary;
        margin-bottom: 8px;
      }

      .product-spec {
        color: @text-regular;
        font-size: 14px;
        margin-bottom: 5px;
      }

      .product-id {
        color: @text-secondary;
        font-size: 12px;
      }
    }
  }

  .address-list {
    .address-item {
      margin-bottom: 15px;
      padding: 15px;
      border: 1px solid @border-color;
      border-radius: 4px;

      &:hover {
        border-color: @primary-color;
      }
    }

    .address-content {
      margin-left: 10px;

      .contact {
        margin-bottom: 5px;

        .name {
          font-weight: bold;
          margin-right: 15px;
        }

        .phone {
          color: @text-regular;
        }
      }

      .address {
        color: @text-regular;
        font-size: 14px;
      }
    }

    .add-address {
      width: 100%;
      margin-top: 10px;
    }
  }

  .shipping-item,
  .service-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border: 1px solid @border-color;
    border-radius: 4px;
    margin-bottom: 15px;

    &:hover {
      border-color: @primary-color;
    }

    .shipping-content,
    .service-content {
      margin-left: 10px;

      .method-name,
      .service-name {
        font-weight: bold;
        margin-bottom: 5px;
      }

      .method-desc,
      .service-desc {
        color: @text-regular;
        font-size: 14px;
        margin-bottom: 5px;
      }

      .method-time {
        color: @primary-color;
        font-size: 14px;
      }
    }

    .shipping-price,
    .service-price {
      font-size: 16px;
      color: @primary-color;
      font-weight: bold;
    }
  }

  .cost-items {
    .cost-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      color: @text-regular;

      &.total {
        border-top: 1px dashed @border-color;
        padding-top: 15px;
        margin-top: 15px;
        color: @text-primary;
        font-weight: bold;

        .total-amount {
          color: @primary-color;
          font-size: 18px;
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
    margin-left: 200px;

    .total-info {
      .label {
        color: @text-regular;
      }

      .amount {
        color: @primary-color;
        font-size: 20px;
        font-weight: bold;
        margin-left: 10px;
      }
    }

    .right {
      display: flex;
      gap: 10px;
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
}
</style> 