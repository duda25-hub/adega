<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-brand">
        <span class="brand-icon">🍷</span>
        <h1 class="brand-name">Adega Premium</h1>
        <p class="brand-tagline">Crie sua conta e comece a explorar</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="input-group">
          <label class="input-label">Nome Completo</label>
          <input
            v-model="form.name"
            type="text"
            class="input-field"
            :class="{ 'error': errors.name }"
            placeholder="Seu nome completo"
            required
          />
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

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
          <label class="input-label">Telefone</label>
          <input
            v-model="form.phone"
            type="tel"
            class="input-field"
            placeholder="(11) 99999-9999"
          />
        </div>

        <div class="input-group">
          <label class="input-label">Senha</label>
          <div class="password-wrapper">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="input-field"
              :class="{ 'error': errors.password }"
              placeholder="Mínimo 6 caracteres"
              required
              minlength="6"
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

        <div class="input-group">
          <label class="input-label">Confirmar Senha</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            class="input-field"
            :class="{ 'error': errors.confirmPassword }"
            placeholder="Repita sua senha"
            required
          />
          <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
        </div>

        <div class="input-group">
          <label class="terms-label">
            <input type="checkbox" v-model="form.acceptTerms" required />
            <span>Aceito os <a href="#">termos de uso</a> e <a href="#">política de privacidade</a></span>
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-lg" :disabled="loading" style="width: 100%;">
          <span v-if="loading">Criando conta...</span>
          <span v-else>Criar Conta</span>
        </button>

        <p v-if="authError" class="auth-error">{{ authError }}</p>
      </form>

      <div class="auth-footer">
        <p>Já tem conta? <router-link to="/login">Faça login</router-link></p>
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
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = ref({})
const loading = ref(false)
const authError = ref('')
const showPassword = ref(false)

const handleRegister = async () => {
  errors.value = {}
  authError.value = ''

  // Validação
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'As senhas não coincidem'
    return
  }

  if (form.value.password.length < 6) {
    errors.value.password = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  loading.value = true

  try {
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      phone: form.value.phone
    })
    uiStore.showToast('Conta criada com sucesso!', 'success')
    router.push('/')
  } catch (err) {
    authError.value = err.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
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
  max-width: 460px;
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

.terms-label {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.terms-label input {
  accent-color: var(--color-wine);
  margin-top: 3px;
}

.terms-label a {
  color: var(--color-wine-light);
  text-decoration: underline;
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
