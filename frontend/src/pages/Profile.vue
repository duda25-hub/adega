<template>
  <div class="profile-page">
    <div class="container">
      <h1 class="page-title">Meu Perfil</h1>

      <div class="profile-layout">
        <!-- Sidebar -->
        <aside class="profile-sidebar">
          <div class="profile-avatar">
            <span>{{ userInitials }}</span>
          </div>
          <h2 class="profile-name">{{ authStore.user?.name }}</h2>
          <p class="profile-email">{{ authStore.user?.email }}</p>
          <span class="profile-role" :class="{ 'admin': authStore.isAdmin }">
            {{ authStore.isAdmin ? 'Administrador' : 'Cliente' }}
          </span>

          <nav class="profile-nav">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="profile-nav-item"
              :class="{ 'active': activeTab === tab.id }"
            >
              <span class="nav-icon">{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </nav>
        </aside>

        <!-- Content -->
        <div class="profile-content">
          <!-- Dados Pessoais -->
          <div v-if="activeTab === 'profile'" class="profile-section">
            <h2 class="section-title-small">Dados Pessoais</h2>
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-grid">
                <div class="input-group">
                  <label class="input-label">Nome Completo</label>
                  <input v-model="profileForm.name" type="text" class="input-field" required />
                </div>
                <div class="input-group">
                  <label class="input-label">E-mail</label>
                  <input v-model="profileForm.email" type="email" class="input-field" required />
                </div>
                <div class="input-group">
                  <label class="input-label">Telefone</label>
                  <input v-model="profileForm.phone" type="tel" class="input-field" />
                </div>
              </div>
              <button type="submit" class="btn btn-primary" :disabled="profileLoading">
                <span v-if="profileLoading">Salvando...</span>
                <span v-else>Salvar Alterações</span>
              </button>
            </form>
          </div>

          <!-- Alterar Senha -->
          <div v-if="activeTab === 'password'" class="profile-section">
            <h2 class="section-title-small">Alterar Senha</h2>
            <form @submit.prevent="changePassword" class="profile-form">
              <div class="input-group">
                <label class="input-label">Senha Atual</label>
                <input v-model="passwordForm.currentPassword" type="password" class="input-field" required />
              </div>
              <div class="input-group">
                <label class="input-label">Nova Senha</label>
                <input v-model="passwordForm.newPassword" type="password" class="input-field" required minlength="6" />
              </div>
              <div class="input-group">
                <label class="input-label">Confirmar Nova Senha</label>
                <input v-model="passwordForm.confirmPassword" type="password" class="input-field" required />
              </div>
              <button type="submit" class="btn btn-primary" :disabled="passwordLoading">
                <span v-if="passwordLoading">Alterando...</span>
                <span v-else>Alterar Senha</span>
              </button>
            </form>
          </div>

          <!-- Endereços -->
          <div v-if="activeTab === 'addresses'" class="profile-section">
            <h2 class="section-title-small">Meus Endereços</h2>
            <div v-if="addresses.length === 0" class="empty-state-small">
              <p>Nenhum endereço cadastrado.</p>
            </div>
            <div v-else class="addresses-list">
              <div v-for="(addr, index) in addresses" :key="index" class="address-card">
                <div class="address-info">
                  <p><strong>{{ addr.street }}, {{ addr.number }}</strong></p>
                  <p v-if="addr.complement">{{ addr.complement }}</p>
                  <p>{{ addr.neighborhood }} - {{ addr.city }}/{{ addr.state }}</p>
                  <p>CEP: {{ addr.cep }}</p>
                </div>
                <button @click="removeAddress(index)" class="address-remove">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            <button @click="showAddressForm = true" class="btn btn-secondary" style="margin-top: var(--space-lg);">
              + Adicionar Endereço
            </button>

            <form v-if="showAddressForm" @submit.prevent="addAddress" class="address-form">
              <h3>Novo Endereço</h3>
              <div class="form-grid">
                <div class="input-group">
                  <label class="input-label">CEP</label>
                  <input v-model="newAddress.cep" type="text" class="input-field" required />
                </div>
                <div class="input-group">
                  <label class="input-label">Rua</label>
                  <input v-model="newAddress.street" type="text" class="input-field" required />
                </div>
                <div class="input-group">
                  <label class="input-label">Número</label>
                  <input v-model="newAddress.number" type="text" class="input-field" required />
                </div>
                <div class="input-group">
                  <label class="input-label">Complemento</label>
                  <input v-model="newAddress.complement" type="text" class="input-field" />
                </div>
                <div class="input-group">
                  <label class="input-label">Bairro</label>
                  <input v-model="newAddress.neighborhood" type="text" class="input-field" required />
                </div>
                <div class="input-group">
                  <label class="input-label">Cidade</label>
                  <input v-model="newAddress.city" type="text" class="input-field" required />
                </div>
                <div class="input-group">
                  <label class="input-label">Estado</label>
                  <input v-model="newAddress.state" type="text" class="input-field" maxlength="2" required />
                </div>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn btn-primary">Salvar Endereço</button>
                <button type="button" @click="showAddressForm = false" class="btn btn-secondary">Cancelar</button>
              </div>
            </form>
          </div>

          <!-- Favoritos -->
          <div v-if="activeTab === 'favorites'" class="profile-section">
            <h2 class="section-title-small">Meus Favoritos</h2>
            <div v-if="favorites.length === 0" class="empty-state-small">
              <p>Você ainda não tem produtos favoritos.</p>
              <router-link to="/produtos" class="btn btn-primary" style="margin-top: var(--space-md);">
                Explorar Produtos
              </router-link>
            </div>
            <div v-else class="favorites-grid">
              <ProductCard
                v-for="product in favorites"
                :key="product._id"
                :product="product"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'
import ProductCard from '../components/ProductCard.vue'

const authStore = useAuthStore()
const uiStore = useUIStore()

const activeTab = ref('profile')
const profileLoading = ref(false)
const passwordLoading = ref(false)
const showAddressForm = ref(false)

const tabs = [
  { id: 'profile', label: 'Dados Pessoais', icon: '👤' },
  { id: 'password', label: 'Alterar Senha', icon: '🔒' },
  { id: 'addresses', label: 'Endereços', icon: '📍' },
  { id: 'favorites', label: 'Favoritos', icon: '❤️' }
]

const profileForm = ref({
  name: '',
  email: '',
  phone: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const addresses = ref([])
const newAddress = ref({
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: ''
})

const favorites = ref([])

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

onMounted(() => {
  if (authStore.user) {
    profileForm.value = {
      name: authStore.user.name || '',
      email: authStore.user.email || '',
      phone: authStore.user.phone || ''
    }
    addresses.value = authStore.user.addresses || []
  }
})

const updateProfile = async () => {
  profileLoading.value = true
  try {
    await authStore.updateProfile(profileForm.value)
    uiStore.showToast('Perfil atualizado com sucesso!', 'success')
  } catch (err) {
    uiStore.showToast('Erro ao atualizar perfil', 'error')
  } finally {
    profileLoading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    uiStore.showToast('As senhas não coincidem', 'error')
    return
  }
  passwordLoading.value = true
  try {
    await authStore.changePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    uiStore.showToast('Senha alterada com sucesso!', 'success')
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (err) {
    uiStore.showToast('Erro ao alterar senha', 'error')
  } finally {
    passwordLoading.value = false
  }
}

const addAddress = () => {
  addresses.value.push({ ...newAddress.value })
  newAddress.value = { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' }
  showAddressForm.value = false
  uiStore.showToast('Endereço adicionado!', 'success')
}

const removeAddress = (index) => {
  addresses.value.splice(index, 1)
  uiStore.showToast('Endereço removido', 'info')
}
</script>

<style scoped>
.profile-page {
  padding-top: 90px;
  min-height: 100vh;
}

.page-title {
  font-family: var(--font-display);
  font-size: 2rem;
  margin-bottom: var(--space-2xl);
}

.profile-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--space-2xl);
  margin-bottom: var(--space-3xl);
}

/* Sidebar */
.profile-sidebar {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  height: fit-content;
  position: sticky;
  top: 90px;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  background: var(--color-wine);
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto var(--space-md);
}

.profile-name {
  font-family: var(--font-display);
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: var(--space-xs);
}

.profile-email {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: var(--space-sm);
}

.profile-role {
  display: block;
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  padding: var(--space-xs) var(--space-sm);
  background: var(--bg-input);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-xl);
}

.profile-role.admin {
  background: rgba(139, 0, 0, 0.2);
  color: var(--color-wine-light);
}

.profile-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.profile-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
  width: 100%;
}

.profile-nav-item:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.profile-nav-item.active {
  background: rgba(139, 0, 0, 0.15);
  color: var(--color-wine-light);
}

.nav-icon {
  font-size: 1.2rem;
}

/* Content */
.profile-content {
  min-height: 500px;
}

.profile-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.section-title-small {
  font-family: var(--font-display);
  font-size: 1.3rem;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.profile-form {
  max-width: 600px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.form-grid .input-group:nth-child(1),
.form-grid .input-group:nth-child(4),
.form-grid .input-group:nth-child(5) {
  grid-column: span 2;
}

.addresses-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.address-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

.address-info p {
  margin-bottom: var(--space-xs);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.address-info strong {
  color: var(--text-primary);
}

.address-remove {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: var(--space-sm);
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.address-remove:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.address-form {
  margin-top: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-color);
}

.address-form h3 {
  font-family: var(--font-display);
  font-size: 1.1rem;
  margin-bottom: var(--space-lg);
}

.form-actions {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.empty-state-small {
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-muted);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-lg);
}

@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .profile-sidebar {
    position: relative;
    top: 0;
  }

  .favorites-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-grid .input-group:nth-child(1),
  .form-grid .input-group:nth-child(4),
  .form-grid .input-group:nth-child(5) {
    grid-column: span 1;
  }

  .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style>
