<template>
  <div class="products-page">
    <div class="products-header">
      <div class="container">
        <h1 class="page-title">Nossos Produtos</h1>
        <p class="page-subtitle">Explore nossa seleção premium de bebidas e delicatessen</p>
      </div>
    </div>

    <div class="container">
      <div class="products-layout">
        <!-- Sidebar de Filtros -->
        <aside class="filters-sidebar" :class="{ 'mobile-open': filtersOpen }">
          <div class="filters-header">
            <h3>Filtros</h3>
            <button @click="filtersOpen = false" class="filters-close mobile-only">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="filter-group">
            <h4 class="filter-title">Categoria</h4>
            <div class="filter-options">
              <label v-for="cat in categories" :key="cat" class="filter-option">
                <input
                  type="radio"
                  name="category"
                  :value="cat"
                  v-model="selectedCategory"
                  @change="applyFilters"
                />
                <span class="option-label">{{ cat }}</span>
              </label>
              <label class="filter-option">
                <input
                  type="radio"
                  name="category"
                  value=""
                  v-model="selectedCategory"
                  @change="applyFilters"
                />
                <span class="option-label">Todas</span>
              </label>
            </div>
          </div>

          <div class="filter-group">
            <h4 class="filter-title">Preço</h4>
            <div class="price-range">
              <input
                type="number"
                v-model.number="minPrice"
                placeholder="Min"
                class="price-input"
              />
              <span>até</span>
              <input
                type="number"
                v-model.number="maxPrice"
                placeholder="Max"
                class="price-input"
              />
            </div>
            <button @click="applyFilters" class="btn btn-primary btn-sm" style="width: 100%; margin-top: var(--space-sm);">
              Aplicar Preço
            </button>
          </div>

          <div class="filter-group">
            <h4 class="filter-title">Ordenar por</h4>
            <select v-model="sortBy" @change="applyFilters" class="filter-select">
              <option value="name">Nome (A-Z)</option>
              <option value="price-asc">Preço: Menor para Maior</option>
              <option value="price-desc">Preço: Maior para Menor</option>
              <option value="rating">Melhor Avaliados</option>
            </select>
          </div>

          <button @click="clearFilters" class="btn btn-secondary btn-sm" style="width: 100%;">
            Limpar Filtros
          </button>
        </aside>

        <!-- Lista de Produtos -->
        <div class="products-content">
          <div class="products-toolbar">
            <button @click="filtersOpen = true" class="filter-toggle mobile-only">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>
              </svg>
              Filtros
            </button>
            <span class="products-count">{{ filteredProducts.length }} produtos encontrados</span>
          </div>

          <div v-if="loading" class="products-skeleton">
            <div v-for="n in 8" :key="n" class="skeleton-card">
              <div class="skeleton skeleton-image"></div>
              <div class="skeleton skeleton-text"></div>
              <div class="skeleton skeleton-text short"></div>
            </div>
          </div>

          <div v-else-if="filteredProducts.length === 0" class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <h3 class="empty-state-title">Nenhum produto encontrado</h3>
            <p class="empty-state-text">Tente ajustar seus filtros ou buscar por outro termo.</p>
            <button @click="clearFilters" class="btn btn-primary" style="margin-top: var(--space-lg);">
              Limpar Filtros
            </button>
          </div>

          <div v-else class="products-grid">
            <ProductCard
              v-for="product in filteredProducts"
              :key="product._id"
              :product="product"
            />
          </div>

          <!-- Paginação -->
          <div v-if="filteredProducts.length > 0 && totalPages > 1" class="pagination">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <span class="pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductsStore } from '../stores/products'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const loading = ref(true)
const filtersOpen = ref(false)
const selectedCategory = ref('')
const minPrice = ref(null)
const maxPrice = ref(null)
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = 12

const categories = ['Vinhos', 'Cervejas Artesanais', 'Queijos Especiais', 'Destilados Premium', 'Kits Gourmet', 'Drinks']

const allProducts = ref([])

const filteredProducts = computed(() => {
  let result = [...allProducts.value]

  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  if (minPrice.value !== null && minPrice.value !== '') {
    result = result.filter(p => p.price >= minPrice.value)
  }

  if (maxPrice.value !== null && maxPrice.value !== '') {
    result = result.filter(p => p.price <= maxPrice.value)
  }

  // Sort
  if (sortBy.value === 'price-asc') {
    result.sort((a, b) => a.price - b.price)
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price)
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortBy.value === 'rating') {
    result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
  }

  // Pagination
  const start = (currentPage.value - 1) * itemsPerPage
  return result.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => {
  let result = [...allProducts.value]
  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value)
  }
  if (minPrice.value) result = result.filter(p => p.price >= minPrice.value)
  if (maxPrice.value) result = result.filter(p => p.price <= maxPrice.value)
  return Math.ceil(result.length / itemsPerPage)
})

const applyFilters = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  selectedCategory.value = ''
  minPrice.value = null
  maxPrice.value = null
  sortBy.value = 'name'
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

onMounted(async () => {
  // Verificar query params
  if (route.query.categoria) {
    selectedCategory.value = route.query.categoria
  }
  if (route.query.search) {
    // Implementar busca
  }

  try {
    await productsStore.fetchProducts()
    allProducts.value = productsStore.products
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
  } finally {
    loading.value = false
  }
})

watch(() => route.query.categoria, (newVal) => {
  if (newVal) {
    selectedCategory.value = newVal
  }
})
</script>

<style scoped>
.products-page {
  padding-top: 70px;
}

.products-header {
  background: var(--bg-secondary);
  padding: var(--space-3xl) 0;
  margin-bottom: var(--space-2xl);
  text-align: center;
}

.page-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
}

.page-subtitle {
  color: var(--text-muted);
  font-size: 1rem;
}

.products-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--space-2xl);
  margin-bottom: var(--space-3xl);
}

.filters-sidebar {
  position: sticky;
  top: 90px;
  height: fit-content;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
}

.filters-header h3 {
  font-family: var(--font-display);
  font-size: 1.2rem;
}

.filter-group {
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-xl);
  border-bottom: 1px solid var(--border-color);
}

.filter-group:last-child {
  border-bottom: none;
}

.filter-title {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.filter-option {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.filter-option input[type="radio"] {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-light);
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-option input[type="radio"]:checked {
  border-color: var(--color-wine);
  background: var(--color-wine);
  box-shadow: inset 0 0 0 3px var(--bg-card);
}

.price-range {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.price-range span {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.price-input {
  width: 80px;
  padding: var(--space-sm);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.filter-select {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
}

.products-content {
  min-height: 600px;
}

.products-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
}

.products-count {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
}

.products-skeleton {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
}

.skeleton-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.skeleton-image {
  aspect-ratio: 3/4;
  width: 100%;
}

.skeleton-text {
  height: 20px;
  margin: var(--space-md);
  width: 80%;
}

.skeleton-text.short {
  width: 50%;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-lg);
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-color);
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-wine);
  color: var(--color-wine-light);
}

.pagination-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.mobile-only {
  display: none;
}

@media (max-width: 1024px) {
  .products-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 300px;
    z-index: var(--z-modal);
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
    border-radius: 0;
    overflow-y: auto;
  }

  .filters-sidebar.mobile-open {
    transform: translateX(0);
  }

  .mobile-only {
    display: flex;
  }

  .products-grid,
  .products-skeleton {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .products-grid,
  .products-skeleton {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 1.8rem;
  }
}
</style>
