<template>
  <div class="admin-page">
    <div class="admin-header">
      <div>
        <h1 class="admin-title">Gerenciar Produtos</h1>
        <p class="admin-subtitle">Adicione, edite ou remova produtos da adega</p>
      </div>
      <button @click="openModal()" class="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5v14"/>
        </svg>
        Novo Produto
      </button>
    </div>

    <div class="admin-section">
      <div class="table-toolbar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar produtos..."
          class="toolbar-search"
        />
        <select v-model="filterCategory" class="toolbar-select">
          <option value="">Todas as categorias</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product._id">
              <td>
                <img :src="product.images?.[0] || '/placeholder-wine.jpg'" class="table-image" />
              </td>
              <td>{{ product.name }}</td>
              <td>
                <span class="table-badge">{{ product.category }}</span>
              </td>
              <td>R$ {{ formatPrice(product.price) }}</td>
              <td>
                <span :class="{ 'low-stock': product.stock <= 5 }">
                  {{ product.stock }}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <button @click="openModal(product)" class="action-edit" title="Editar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                    </svg>
                  </button>
                  <button @click="deleteProduct(product._id)" class="action-delete" title="Excluir">
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
          <h2>{{ editingProduct ? 'Editar Produto' : 'Novo Produto' }}</h2>
          <button @click="closeModal" class="modal-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveProduct" class="modal-form">
          <div class="form-grid">
            <div class="input-group">
              <label class="input-label">Nome</label>
              <input v-model="form.name" type="text" class="input-field" required />
            </div>
            <div class="input-group">
              <label class="input-label">Categoria</label>
              <select v-model="form.category" class="filter-select" required>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div class="input-group">
              <label class="input-label">Preço</label>
              <input v-model.number="form.price" type="number" step="0.01" class="input-field" required />
            </div>
            <div class="input-group">
              <label class="input-label">Estoque</label>
              <input v-model.number="form.stock" type="number" class="input-field" required />
            </div>
            <div class="input-group">
              <label class="input-label">Origem</label>
              <input v-model="form.origin" type="text" class="input-field" />
            </div>
            <div class="input-group">
              <label class="input-label">Teor Alcoólico (%)</label>
              <input v-model.number="form.alcoholContent" type="number" step="0.1" class="input-field" />
            </div>
            <div class="input-group full-width">
              <label class="input-label">Descrição</label>
              <textarea v-model="form.description" class="input-field" rows="3"></textarea>
            </div>
            <div class="input-group full-width">
              <label class="input-label">Harmonização</label>
              <textarea v-model="form.harmonization" class="input-field" rows="2"></textarea>
            </div>
            <div class="input-group full-width">
              <label class="input-label">URL da Imagem</label>
              <input v-model="form.imageUrl" type="url" class="input-field" placeholder="https://..." />
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving">Salvando...</span>
              <span v-else>Salvar Produto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUIStore } from '../../stores/ui'
import { productService } from '../../services/productService'

const uiStore = useUIStore()

const products = ref([])
const categories = ['Vinhos', 'Cervejas Artesanais', 'Queijos Especiais', 'Destilados Premium', 'Kits Gourmet', 'Drinks']
const searchQuery = ref('')
const filterCategory = ref('')
const showModal = ref(false)
const editingProduct = ref(null)
const saving = ref(false)

const form = ref({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  origin: '',
  alcoholContent: null,
  description: '',
  harmonization: '',
  imageUrl: ''
})

const filteredProducts = computed(() => {
  let result = [...products.value]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q))
  }
  if (filterCategory.value) {
    result = result.filter(p => p.category === filterCategory.value)
  }
  return result
})

const formatPrice = (price) => {
  return price?.toFixed(2).replace('.', ',')
}

const openModal = (product = null) => {
  editingProduct.value = product
  if (product) {
    form.value = { ...product, imageUrl: product.images?.[0] || '' }
  } else {
    form.value = {
      name: '',
      category: categories[0],
      price: 0,
      stock: 0,
      origin: '',
      alcoholContent: null,
      description: '',
      harmonization: '',
      imageUrl: ''
    }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
}

const saveProduct = async () => {
  saving.value = true
  try {
    const productData = {
      ...form.value,
      images: form.value.imageUrl ? [form.value.imageUrl] : []
    }
    delete productData.imageUrl

    if (editingProduct.value) {
      await productService.update(editingProduct.value._id, productData)
      uiStore.showToast('Produto atualizado!', 'success')
    } else {
      await productService.create(productData)
      uiStore.showToast('Produto criado!', 'success')
    }
    await loadProducts()
    closeModal()
  } catch (err) {
    uiStore.showToast('Erro ao salvar produto', 'error')
  } finally {
    saving.value = false
  }
}

const deleteProduct = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este produto?')) return
  try {
    await productService.delete(id)
    uiStore.showToast('Produto excluído!', 'success')
    await loadProducts()
  } catch (err) {
    uiStore.showToast('Erro ao excluir produto', 'error')
  }
}

const loadProducts = async () => {
  try {
    const response = await productService.getAll()
    products.value = response.products || response
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
  }
}

onMounted(loadProducts)
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
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.toolbar-search {
  flex: 1;
  max-width: 300px;
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.toolbar-select {
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
}

.table-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
}

.table-badge {
  padding: var(--space-xs) var(--space-sm);
  background: rgba(139, 0, 0, 0.15);
  color: var(--color-wine-light);
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: var(--radius-sm);
}

.low-stock {
  color: #dc2626;
  font-weight: 600;
}

.table-actions {
  display: flex;
  gap: var(--space-sm);
}

.action-edit,
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
  transition: all var(--transition-fast);
}

.action-edit {
  color: var(--color-gold);
}

.action-edit:hover {
  background: rgba(201, 169, 110, 0.1);
}

.action-delete {
  color: #dc2626;
}

.action-delete:hover {
  background: rgba(220, 38, 38, 0.1);
}

/* Modal */
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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

.modal-form .form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.modal-form .full-width {
  grid-column: span 2;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  margin-top: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .modal-form .form-grid {
    grid-template-columns: 1fr;
  }
  .modal-form .full-width {
    grid-column: span 1;
  }
}
</style>
