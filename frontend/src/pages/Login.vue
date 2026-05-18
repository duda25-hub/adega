<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-brand">
        <span class="brand-icon">💯</span>
        <h1 class="brand-name">Adega Premium</h1>
        <p class="brand-tagline">Entre para acessar sua conta</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label class="input-label">E-mail</label>
          <input
            v-model="form.email"
            type="email"
            class="input-field"
            :class="{ 'error': errors.email }"
            placeholder="seu@email.com"
            required
          />
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="input-group">
          <label class="input-label">Senha</label>
          <div class="password-wrapper">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="input-field"
              :class="{ 'error': errors.password }"
              placeholder="Sua senha"
              required
            />
            <button type="button" @click="showPassword = !showPassword" class="password-toggle">
              <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                <line x1="2" x2="22" y1="2" y2="22"/>
              </svg>
            </button>
          </div>
          <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
        </div>

        <div class="auth-options">
          <label class="remember-me">
            <input type="checkbox" v-model="form.remember" />
            <span>Lembrar-me</span>
          </label>
          <router-link to="/recuperar-senha" class="forgot-password">Esqueceu a senha?</router-link>
        </div>

        <button type="submit" class="btn btn-primary btn-lg" :disabled="loading" style="width: 100%;">
          <span v-if="loading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>

        <p v-if="authError" class="auth-error">{{ authError }}</p>
      </form>

      <div class="auth-footer">
        <p>Ainda não tem conta? <router-link to="/cadastro">Cadastre-se</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const errors = ref({})
const loading = ref(false)
const authError = ref('')
const showPassword = ref(false)

const handleLogin = async () => {
  errors.value = {}
  authError.value = ''
  loading.value = true

  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password
    })
    uiStore.showToast('Login realizado com sucesso!', 'success')
    router.push('/')
  } catch (err) {
    authError.value = err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-black) 0%, var(--color-gray) 100%);
  padding: var(--space-xl);
}

.auth-container {
  width: 100%;
  max-width: 420px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: var(--space-2xl);
}

.auth-brand {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.brand-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: var(--space-md);
}

.brand-name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin-bottom: var(--space-sm);
}

.brand-tagline {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.auth-form {
  margin-bottom: var(--space-xl);
}

.password-wrapper {
  position: relative;
}

.password-wrapper .input-field {
  padding-right: 50px;
}

.password-toggle {
  position: absolute;
  right: var(--space-sm);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: var(--space-sm);
}

.auth-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
  font-size: 0.85rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);
  cursor: pointer;
}

.remember-me input {
  accent-color: var(--color-wine);
}

.forgot-password {
  color: var(--color-wine-light);
  font-size: 0.85rem;
}

.auth-error {
  text-align: center;
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: var(--space-md);
  padding: var(--space-sm);
  background: rgba(220, 38, 38, 0.1);
  border-radius: var(--radius-md);
}

.auth-footer {
  text-align: center;
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.9rem;
}

.auth-footer a {
  color: var(--color-wine-light);
  font-weight: 500;
}
</style>
