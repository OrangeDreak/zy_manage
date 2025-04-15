<template>
  <el-container class="layout-container">
    <!-- 顶部导航 -->
    <el-header class="header">
      <div class="header-left">
        <div class="logo">QC elf</div>
        <h3><span>管理后台</span></h3>
      </div>
      
      <div class="header-right">
        <div class="nav-items">
          <!--<div class="nav-item">{{ $t('header.nav.freightEstimate') }}</div>
          <div class="nav-item">{{ $t('header.nav.transfer') }}</div>
          <div class="nav-item">{{ $t('header.nav.help') }}</div> --->
        </div>
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar :size="32" :src="userAvatar" />
            <span class="username">{{ authStore.userInfo.username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <!-- <el-dropdown-item command="profile">个人资料</el-dropdown-item> -->
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <el-dropdown @command="handleLangChange">
          <span class="lang-switch">
            {{ currentLang === 'zh' ? '中文' : 'English' }}
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="zh">中文</el-dropdown-item>
              <el-dropdown-item command="en">English</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown> -->
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">


        <!-- 导航菜单 -->
        <el-menu
          :default-active="route.path"
          router
          :collapse="false"
        >
          <el-menu-item index="/user-list">
            <el-icon><Van /></el-icon>
            <span>{{ $t('menu.userList') }}</span>
          </el-menu-item>

          <el-menu-item index="/order-list">
            <el-icon><Van /></el-icon>
            <span>{{ $t('menu.transferOrder') }}</span>
          </el-menu-item>

          <el-menu-item index="/package-list">
            <el-icon><Goods /></el-icon>
            <span>{{ $t('menu.package') }}</span>
          </el-menu-item>

          <el-menu-item index="/logisticsList">
            <el-icon><SetUp /></el-icon>
            <span>{{ $t('menu.logisticsList') }}</span>
          </el-menu-item>

          <el-menu-item index="/dict">
            <el-icon><Notebook /></el-icon>
            <span>{{ $t('menu.dict') }}</span>
          </el-menu-item>
          <el-menu-item index="/exchange-rate">
             <el-icon><Switch /></el-icon>
             <span>{{ $t('menu.exchange') }}</span>
          </el-menu-item>
          <el-menu-item index="/recharge">
             <el-icon><Wallet /></el-icon>
             <span>{{ $t('menu.recharge') }}</span>
           </el-menu-item>
           <el-menu-item index="/ticket">
              <el-icon><Tickets /></el-icon>
              <span>{{ $t('menu.ticket') }}</span>
           </el-menu-item>
           <el-menu-item index="/article">
             <el-icon><Document /></el-icon>
             <span>{{ $t('menu.article') }}</span>
           </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 内容区 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLangStore } from '@/stores/lang'
import { storeToRefs } from 'pinia'
import { 
  Search,
  Camera,
  Bell,
  Van,
  Box,
  Goods,
  ShoppingCart,
  Wallet,
  Medal,
  Share,
  ArrowDown,
  Plus
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const langStore = useLangStore()
const { currentLang } = storeToRefs(langStore)

const searchKeyword = ref('')
const userAvatar = ref('https://placeholder.com/32')

// 处理用户下拉菜单
const handleCommand = (command) => {
  if (command === 'logout') {
    authStore.logout()
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}

// 处理语言切换
const handleLangChange = (lang) => {
  langStore.setLang(lang)
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.layout-container {
  min-height: 100vh;

  .header {
    background-color: #fff;
    border-bottom: 1px solid @border-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 20px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 40px;

      .logo {
        font-size: 24px;
        font-weight: bold;
        color: @primary-color;
      }

      .search-input {
        width: 400px;

        :deep(.el-input__wrapper) {
          background-color: #f5f7fa;
        }

        :deep(.el-input-group__append) {
          padding: 0;
          .el-button {
            border: none;
            height: 32px;
            padding: 0 15px;
          }
        }
      }
      .search-btn {
        width: 120px;
        border: none;
        padding: 0 15px;
        cursor: pointer;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 40px;

      .nav-items {
        display: flex;
        gap: 30px;

        .nav-item {
          font-size: 14px;
          color: @text-regular;
          cursor: pointer;

          &:hover {
            color: @primary-color;
          }
        }
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;

        .username {
          font-size: 14px;
          color: @text-regular;
        }
      }

      .lang-switch {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        color: @text-regular;
        font-size: 14px;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }

  .aside {
    background-color: #fff;
    border-right: 1px solid @border-color;

    .user-panel {
      padding: 20px;
      border-bottom: 1px solid @border-color;

      .account {
        font-size: 16px;
        font-weight: bold;
        color: @text-primary;
      }
    }

    :deep(.el-menu) {
      border-right: none;

      .el-menu-item {
        display: flex;
        align-items: center;
        height: 50px;
        padding: 0 20px;
        
        &.is-active {
          background-color: mix(@primary-color, #fff, 5%);
          color: @primary-color;
          font-weight: bold;
        }

        &:hover {
          background-color: mix(@primary-color, #fff, 3%);
        }

        .el-icon {
          font-size: 18px;
          margin-right: 10px;
        }
      }
    }
  }

  .el-main {
    background-color: #f5f7fa;
    padding: 20px;
  }
}
</style> 