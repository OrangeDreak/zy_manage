import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export const useLangStore = defineStore('lang', () => {
  const i18n = useI18n()
  const currentLang = ref(localStorage.getItem('lang') || 'zh')

  // 监听语言变化
  watch(currentLang, (newLang) => {
    localStorage.setItem('lang', newLang)
    i18n.locale.value = newLang // 立即更新i18n的locale
  })

  const setLang = (lang) => {
    currentLang.value = lang
  }

  return {
    currentLang,
    setLang
  }
}) 