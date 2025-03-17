<template>
  <div class="share-order">
    <!-- 顶部 -->
    <div class="header">
      <div class="time">{{ currentTime }}</div>
      <div class="lang-switch">
        <span>中文/USD</span>
        <el-icon><ArrowDown /></el-icon>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <div class="order-card">
        <!-- 标题栏 -->
        <div class="card-header">
          <div class="header-tabs">
            <div class="tab active">商品详情</div>
            <div class="tab">商品备注信息</div>
            <div class="tab">订单状态</div>
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="order-info">
          <div class="customer-info">
            <div class="info-item">
              <span class="label">客户编号：</span>
              <span class="value">{{ orderInfo.customerCode }}</span>
            </div>
            <div class="info-item">
              <span class="label">订单编号：</span>
              <span class="value">{{ orderInfo.orderNo }}</span>
              <el-button link type="primary" class="copy-btn">
                <el-icon><DocumentCopy /></el-icon>
              </el-button>
            </div>
            <div class="info-item">
              <span class="label">创建时间：</span>
              <span class="value">{{ orderInfo.createTime }}</span>
            </div>
          </div>

          <!-- 收件人信息 -->
          <div class="receiver-info">
            <div class="info-group">
              <div class="info-item">
                <span class="label">姓名：</span>
                <span class="value">{{ orderInfo.receiver.name }}</span>
              </div>
              <div class="info-item">
                <span class="label">地址：</span>
                <span class="value">{{ orderInfo.receiver.address }}</span>
                <el-link type="primary" class="edit-link">编辑地址</el-link>
              </div>
              <div class="info-item">
                <span class="label">城市：</span>
                <span class="value">{{ orderInfo.receiver.city }}</span>
              </div>
              <div class="info-item">
                <span class="label">邮编：</span>
                <span class="value">{{ orderInfo.receiver.zipCode }}</span>
              </div>
              <div class="info-item">
                <span class="label">手机号：</span>
                <span class="value">{{ orderInfo.receiver.phone }}</span>
              </div>
              <div class="info-item">
                <span class="label">邮箱：</span>
                <span class="value">{{ orderInfo.receiver.email }}</span>
              </div>
              <div class="info-item">
                <span class="label">国家：</span>
                <span class="value">{{ orderInfo.receiver.country }}</span>
              </div>
            </div>
          </div>

          <!-- 物流信息 -->
          <div class="logistics-info">
            <div class="tracking-no">
              <span class="label">物流单号：</span>
              <span class="value">{{ orderInfo.trackingNo }}</span>
              <el-icon class="location-icon"><Location /></el-icon>
              <span class="time">{{ orderInfo.lastUpdateTime }}</span>
            </div>
            <div class="package-info">
              <div class="package-images">
                <el-image 
                  v-for="(img, index) in orderInfo.images" 
                  :key="index"
                  :src="img"
                  fit="cover"
                  class="package-image"
                />
              </div>
              <el-button type="primary" class="download-btn">
                <el-icon><Download /></el-icon>
                下载全部图片
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowDown, DocumentCopy, Location, Download } from '@element-plus/icons-vue'

const currentTime = ref('')

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-')
}

let timer = null

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

// 模拟订单数据
const orderInfo = ref({
  customerCode: '9252BB',
  orderNo: '7887981564176',
  createTime: '2025-02-20 19:11:16',
  receiver: {
    name: 'Dominic Migliorini',
    address: '164 Tumbleweed Drive',
    city: 'New York',
    zipCode: '14534',
    phone: '(585)643-9252',
    email: 'rhlaxman164@gmail.com',
    country: '美国'
  },
  trackingNo: '921449036271881100162025',
  lastUpdateTime: '2025-03-07 13:24:00 包裹离开始发地',
  images: [
    'path/to/image1.jpg',
    'path/to/image2.jpg',
    'path/to/image3.jpg',
    'path/to/image4.jpg'
  ]
})
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.share-order {
  min-height: 100vh;
  background: linear-gradient(135deg, @primary-bg 0%, @primary-lighter 100%);

  .header {
    height: 40px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: @text-regular;
    font-size: 14px;

    .lang-switch {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
    }
  }

  .content {
    max-width: 1000px;
    margin: 20px auto;
    padding: 0 20px;

    .order-card {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
      overflow: hidden;

      .card-header {
        background: #fff;
        border-bottom: 1px solid @border-color;
        padding: 0 20px;

        .header-tabs {
          display: flex;
          gap: 40px;

          .tab {
            padding: 15px 0;
            font-size: 16px;
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
          }
        }
      }

      .order-info {
        padding: 20px;

        .customer-info {
          margin-bottom: 30px;
        }

        .receiver-info {
          margin-bottom: 30px;
          
          .info-group {
            background: mix(@primary-color, #fff, 5%);
            padding: 15px;
            border-radius: 4px;
          }
        }

        .info-item {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;

          .label {
            color: @text-regular;
            min-width: 80px;
          }

          .value {
            color: @text-primary;
          }

          .edit-link {
            margin-left: auto;
          }
        }

        .logistics-info {
          .tracking-no {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;

            .location-icon {
              color: @primary-color;
              margin-left: 20px;
            }

            .time {
              color: @text-regular;
              font-size: 14px;
            }
          }

          .package-info {
            .package-images {
              display: flex;
              gap: 10px;
              margin-bottom: 15px;

              .package-image {
                width: 100px;
                height: 100px;
                border-radius: 4px;
              }
            }

            .download-btn {
              display: flex;
              align-items: center;
              gap: 5px;
            }
          }
        }
      }
    }
  }

  :deep(.el-button--primary) {
    background-color: @primary-color;
    border-color: @primary-color;

    &:hover {
      background-color: darken(@primary-color, 10%);
      border-color: darken(@primary-color, 10%);
    }
  }

  :deep(.el-link.el-link--primary) {
    color: @primary-color;

    &:hover {
      color: darken(@primary-color, 10%);
    }
  }
}
</style> 