import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Actions
  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const login = async (credentials) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)
      setToken(response.token)
      setUser(response.user)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    try {
      const response = await authService.register(userData)
      setToken(response.token)
      setUser(response.user)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao cadastrar'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchProfile = async () => {
    if (!token.value) return
    try {
      const response = await authService.getProfile()
      setUser(response)
    } catch (err) {
      logout()
    }
  }

  const updateProfile = async (userData) => {
    loading.value = true
    try {
      const response = await authService.updateProfile(userData)
      setUser(response)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao atualizar perfil'
      throw err
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    loading.value = true
    try {
      const response = await authService.changePassword(passwordData)
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao alterar senha'
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  // Initialize
  if (token.value) {
    fetchProfile()
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    fetchProfile,
    updateProfile,
    changePassword,
    logout
  }
})
