import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const toasts = ref([])
  const globalLoading = ref(false)
  const isDarkMode = ref(true)
  const mobileMenuOpen = ref(false)
  const searchOpen = ref(false)

  // Getters
  const toastCount = computed(() => toasts.value.length)

  // Actions
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type, duration })

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const setGlobalLoading = (value) => {
    globalLoading.value = value
  }

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
  }

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  const toggleSearch = () => {
    searchOpen.value = !searchOpen.value
  }

  return {
    toasts,
    globalLoading,
    isDarkMode,
    mobileMenuOpen,
    searchOpen,
    toastCount,
    showToast,
    removeToast,
    setGlobalLoading,
    toggleDarkMode,
    toggleMobileMenu,
    toggleSearch
  }
})
