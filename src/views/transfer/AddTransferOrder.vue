<template>
  <div class="add-transfer">
    <!-- 使用公共头部 -->
    <common-header />

    <div class="content">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="title">{{ $t('transfer.addOrder.title') }}</div>
        <el-link type="primary" @click="$router.push('/transfer-list')"
          >{{ $t('transfer.addOrder.backToList') }}</el-link
        >
      </div>

      <!-- 仓库地址信息 -->
      <div class="section warehouse-section">
        <div class="section-title">{{ $t('transfer.addOrder.warehouse.title') }}</div>
        <div class="section-content">
          <el-link type="primary" @click="getWarehouseAddress">
            {{ $t('transfer.addOrder.warehouse.getAddress') }}
          </el-link>
        </div>
        <div class="section-tip">
          <el-alert type="warning" :closable="false" show-icon>
            {{ $t('transfer.addOrder.warehouse.tip') }}
          </el-alert>
        </div>
      </div>

      <!-- 寄送信息 -->
      <div class="section">
        <div class="section-title">{{ $t('transfer.addOrder.form.title') }}</div>
        <div class="section-content">
          <!-- 自定义编码 -->
          <el-form :model="form" label-width="120px">
            <el-form-item :label="$t('transfer.addOrder.form.customCode')" required>
              <el-input
                v-model="form.customCode"
                :placeholder="$t('transfer.addOrder.form.customCodePlaceholder')"
                class="custom-code-input"
              >
                <template #append>
                  <el-tooltip content="编码说明" placement="top">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>

            <!-- 最近地址 -->
            <el-form-item :label="$t('transfer.addOrder.form.recentAddress')">
              <div class="recent-address">
                <span class="address-text">{{
                  form.recentAddress || $t('transfer.addOrder.form.noAddress')
                }}</span>
                <el-button
                  type="primary"
                  link
                  @click="showAddressForm"
                >
                  {{ $t('transfer.addOrder.form.addAddress') }}
                  <el-tooltip content="地址说明" placement="top">
                    <el-icon class="address-help"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 快递单号列表 -->
      <div class="section">
        <div class="section-title">{{ $t('transfer.addOrder.form.expressTitle') }}</div>
        <div class="section-content">
          <div
            v-for="(item, index) in form.expressItems"
            :key="index"
            class="express-item"
          >
            <el-input
              v-model="item.expressNo"
              :placeholder="$t('transfer.addOrder.form.expressNo')"
            />
            <el-input
              v-model="item.value"
              :placeholder="$t('transfer.addOrder.form.value')"
            />
            <el-upload
              class="upload-area"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              @change="handleImageUpload($event, index)"
            >
              <el-button type="primary" plain>
                <el-icon><Camera /></el-icon>
                {{ $t('transfer.addOrder.form.photo') }}
              </el-button>
            </el-upload>
            <el-button
              type="danger"
              link
              @click="removeExpressItem(index)"
              v-if="form.expressItems.length > 1"
            >
              删除
            </el-button>
          </div>

          <!-- 添加快递单号按钮 -->
          <div class="add-express">
            <el-button
              type="primary"
              plain
              class="add-btn"
              @click="addExpressItem"
            >
              <el-icon><Plus /></el-icon>
              {{ $t('transfer.addOrder.form.addExpress') }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="submit-section">
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          {{ $t('transfer.addOrder.form.submit') }}
        </el-button>
      </div>
    </div>

    <!-- 地址表单对话框 -->
    <address-form v-model="showAddress" @submit="handleAddressSubmit" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  ArrowDown,
  QuestionFilled,
  Camera,
  Plus,
  Search,
} from '@element-plus/icons-vue';
import AddressForm from './AddressForm.vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import CommonHeader from '@/components/layout/CommonHeader.vue'

const router = useRouter();
const authStore = useAuthStore();

const currentTime = ref('');
const loading = ref(false);
const showAddress = ref(false);

const form = ref({
  customCode: '',
  recentAddress: '',
  expressItems: [
    {
      expressNo: '',
      value: '',
      images: [],
    },
  ],
});

const searchKeyword = ref('');
const userAvatar = ref('https://placeholder.com/32');

// 更新时间
const updateTime = () => {
  const now = new Date();
  currentTime.value = now
    .toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(/\//g, '-');
};

let timer = null;

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});

// 获取仓库地址
const getWarehouseAddress = () => {
  ElMessage.info('请联系在线客服获取仓库地址');
};

// 显示地址表单
const showAddressForm = () => {
  showAddress.value = true;
};

// 处理地址提交
const handleAddressSubmit = (address) => {
  form.value.recentAddress = `${address.name}, ${address.address}, ${address.phone}`;
  showAddress.value = false;
};

// 添加快递单号
const addExpressItem = () => {
  form.value.expressItems.push({
    expressNo: '',
    value: '',
    images: [],
  });
};

// 删除快递单号
const removeExpressItem = (index) => {
  form.value.expressItems.splice(index, 1);
};

// 处理图片上传
const handleImageUpload = (file, index) => {
  // TODO: 处理图片上传
  ElMessage.success('图片上传功能待实现');
};

// 提交表单
const handleSubmit = async () => {
  loading.value = true;
  try {
    // TODO: 调用提交API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    ElMessage.success('提交成功');
  } catch (error) {
    console.error('提交失败:', error);
    ElMessage.error('提交失败');
  } finally {
    loading.value = false;
  }
};

// 处理用户下拉菜单
const handleCommand = (command) => {
  if (command === 'logout') {
    authStore.logout();
    router.push('/login');
  } else if (command === 'profile') {
    router.push('/profile');
  }
};
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.add-transfer {
  padding-top: 60px;
  min-height: 100vh;
  background: linear-gradient(135deg, @primary-bg 0%, @primary-lighter 100%);

  .content {
    margin-top: 60px; // 为固定定位的header留出空间
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .title {
        font-size: 24px;
        font-weight: bold;
        color: @primary-color;
      }
    }

    .section {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

      .section-title {
        font-size: 18px;
        font-weight: bold;
        color: @text-primary;
        margin-bottom: 20px;
        padding-left: 10px;
        border-left: 4px solid @primary-color;
      }

      .section-content {
        padding: 0 10px;
      }

      .section-tip {
        margin-top: 15px;
      }

      .recent-address {
        display: flex;
        align-items: center;
        gap: 20px;

        .address-text {
          color: @text-regular;
        }
        .add-btn {
          color: #fff;
        }
        .address-help {
          margin-left: 5px;
        }
      }

      .express-item {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        align-items: flex-start;

        .el-input {
          width: 250px;
        }
      }

      .add-express {
        padding: 20px 0;
        display: flex;
        justify-content: center;

        .add-btn {
          width: 200px;
          border-style: dashed;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
      }
    }

    .submit-section {
      text-align: center;
      margin-top: 30px;

      .el-button {
        width: 200px;
        height: 45px;
        font-size: 16px;
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

    &.is-plain {
      background-color: #fff;
      color: @primary-color;

      &:hover {
        background-color: mix(@primary-color, #fff, 10%);
      }
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
