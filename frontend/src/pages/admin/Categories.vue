<template>
  <div class="admin-page">
    <div class="admin-header">
      <div>
        <h1 class="admin-title">Gerenciar Categorias</h1>
        <p class="admin-subtitle">Organize as categorias da adega</p>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5v14"/>
        </svg>
        Nova Categoria
      </button>
    </div>

    <div class="admin-section">
      <div class="table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Produtos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category._id">
              <td><strong>{{ category.name }}</strong></td>
              <td>{{ category.description || '-' }}</td>
              <td>{{ category.productCount || 0 }}</td>
              <td>
                <div class="table-actions">
                  <button @click="openModal(category)" class="action-edit" title="Editar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                    </svg>
                  </button>
                  <button @click="deleteCategory(category._id)" class="action-delete" title="Excluir">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ editingCategory ? 'Editar Categoria' : 'Nova Categoria' }}</h2>
          <button @click="closeModal" class="modal-close">✕</button>
        </div>
        <form @submit.prevent="saveCategory" class="modal-form">
          <div class="input-group">
            <label class="input-label">Nome</label>
            <input v-model="form.name" type="text" class="input-field" required />
          </div>
          <div class="input-group">
            <label class="input-label">Descrição</label>
            <textarea v-model="form.description" class="input-field" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving">Salvando...</span>
              <span v-else>Salvar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUIStore } from '../../stores/ui'
import { categoryService } from '../../services/categoryService'

const uiStore = useUIStore()

const categories = ref([])
const showModal = ref(false)
const editingCategory = ref(null)
const saving = ref(false)

const form = ref({
  name: '',
  description: ''
})

const openModal = (category = null) => {
  editingCategory.value = category
  form.value = category ? { ...category } : { name: '', description: '' }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingCategory.value = null
}

const saveCategory = async () => {
  saving.value = true
  try {
    if (editingCategory.value) {
      await categoryService.update(editingCategory.value._id, form.value)
      uiStore.showToast('Categoria atualizada!', 'success')
    } else {
      await categoryService.create(form.value)
      uiStore.showToast('Categoria criada!', 'success')
    }
    await loadCategories()
    closeModal()
  } catch (err) {
    uiStore.showToast('Erro ao salvar categoria', 'error')
  } finally {
    saving.value = false
  }
}

const deleteCategory = async (id) => {
  if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
  try {
    await categoryService.delete(id)
    uiStore.showToast('Categoria excluída!', 'success')
    await loadCategories()
  } catch (err) {
    uiStore.showToast('Erro ao excluir categoria', 'error')
  }
}

const loadCategories = async () => {
  try {
    const response = await categoryService.getAll()
    categories.value = response
  } catch (err) {
    console.error('Erro ao carregar categorias:', err)
  }
}

onMounted(loadCategories)
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

.table-actions {
  display: flex;
  gap: var(--space-sm);
}

.action-edit {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-gold);
  transition: all var(--transition-fast);
}

.action-edit:hover {
  background: rgba(201, 169, 110, 0.1);
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-xl);
}

.modal-content {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  font-family: var(--font-display);
  font-size: 1.3rem;
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 1.2rem;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.modal-form {
  padding: var(--space-xl);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-color);
}
</style>
