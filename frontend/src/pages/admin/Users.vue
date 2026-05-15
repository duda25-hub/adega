<template>
  <div class="admin-page">
    <div class="admin-header">
      <div>
        <h1 class="admin-title">Gerenciar Usuários</h1>
        <p class="admin-subtitle">Visualize e gerencie os usuários da plataforma</p>
      </div>
    </div>

    <div class="admin-section">
      <div class="table-toolbar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar usuários..."
          class="toolbar-search"
        />
      </div>

      <div class="table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Função</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user._id">
              <td>
                <div class="user-cell">
                  <div class="user-avatar">{{ getInitials(user.name) }}</div>
                  <span>{{ user.name }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone || '-' }}</td>
              <td>
                <select
                  v-model="user.role"
                  @change="updateRole(user._id, user.role)"
                  class="role-select"
                  :class="user.role"
                >
                  <option value="user">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <button @click="deleteUser(user._id)" class="action-delete" title="Excluir">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUIStore } from '../../stores/ui'
import { userService } from '../../services/userService'

const uiStore = useUIStore()

const users = ref([])
const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u => 
    u.name.toLowerCase().includes(q) || 
    u.email.toLowerCase().includes(q)
  )
})

const getInitials = (name) => {
  return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const updateRole = async (id, role) => {
  try {
    await userService.updateRole(id, role)
    uiStore.showToast('Função atualizada!', 'success')
  } catch (err) {
    uiStore.showToast('Erro ao atualizar função', 'error')
  }
}

const deleteUser = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este usuário?')) return
  try {
    await userService.delete(id)
    uiStore.showToast('Usuário excluído!', 'success')
    await loadUsers()
  } catch (err) {
    uiStore.showToast('Erro ao excluir usuário', 'error')
  }
}

const loadUsers = async () => {
  try {
    const response = await userService.getAll()
    users.value = response.users || response
  } catch (err) {
    console.error('Erro ao carregar usuários:', err)
  }
}

onMounted(loadUsers)
</script>

<style scoped>
.admin-page {
  padding: var(--space-xl);
  max-width: 1200px;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2xl);
}

.admin-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  margin-bottom: var(--space-xs);
}

.admin-subtitle {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.admin-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.table-toolbar {
  margin-bottom: var(--space-lg);
}

.toolbar-search {
  max-width: 300px;
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: var(--color-wine);
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.role-select {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: var(--bg-input);
  color: var(--text-primary);
}

.role-select.admin {
  background: rgba(139, 0, 0, 0.15);
  color: var(--color-wine-light);
}

.role-select.user {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.action-delete {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dc2626;
  transition: all var(--transition-fast);
}

.action-delete:hover {
  background: rgba(220, 38, 38, 0.1);
}
</style>
