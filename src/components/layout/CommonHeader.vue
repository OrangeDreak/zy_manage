<template>
  <div class="common-header">
    <div class="header-left">
      <div class="logo">QC elf</div>
      <div class="search-wrapper">
        <el-input
          v-model="searchKeyword"
          :placeholder="$t('header.search')"
          class="search-input"
        >
          <template #prefix>
            <el-icon class="search-icon"><Search /></el-icon>
          </template>
          <template #append>
            <el-button class="search-btn">
              {{ $t('header.searchButton') }}
            </el-button>
          </template>
        </el-input>
      </div>
    </div>

    <div class="header-right">
      <div class="nav-items">
        <div class="nav-item">{{ $t('header.nav.freightEstimate') }}</div>
        <div class="nav-item">{{ $t('header.nav.transfer') }}</div>
        <div class="nav-item">{{ $t('header.nav.help') }}</div>
      </div>
      <el-dropdown @command="handleCommand">
        <span class="user-info">
          <el-avatar :size="32" :src="userAvatar" />
          <span class="username">{{ authStore.userInfo.username }}</span>
          <el-icon><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">{{ $t('header.user.profile') }}</el-dropdown-item>
            <el-dropdown-item command="logout">{{ $t('header.user.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown @command="handleLangChange">
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
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLangStore } from '@/stores/lang'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { Search, ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const langStore = useLangStore()
const { currentLang } = storeToRefs(langStore)
const { locale } = useI18n()

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
  locale.value = lang // 直接设置i18n的locale
}
</script>

<style lang="less" scoped>
@import '@/styles/variables.less';

.common-header {
  background-color: #fff;
  border-bottom: 1px solid @border-color;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  .header-left {
    display: flex;
    align-items: center;
    gap: 40px;

    .logo {
      font-size: 24px;
      font-weight: bold;
      color: @primary-color;
    }

    .search-wrapper {
      .search-input {
        width: 400px;

        :deep(.el-input__wrapper) {
          background-color: #f5f7fa;
        }

        :deep(.el-input__prefix) {
          margin-right: 8px;
        }

        :deep(.search-icon) {
          font-size: 16px;
          color: @text-regular;
        }

        :deep(.el-input-group__append) {
          padding: 0;
        }
      }

      .search-btn {
        width: 120px;
        border: none;
        padding: 0 15px;
        cursor: pointer;
      }
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
</style> 