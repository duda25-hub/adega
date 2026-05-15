import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productService } from '../services/productService'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref([])
  const categories = ref([])
  const featuredProducts = ref([])
  const currentProduct = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({
    category: '',
    minPrice: null,
    maxPrice: null,
    sort: 'name',
    search: ''
  })
  const pagination = ref({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })

  // Getters
  const filteredProducts = computed(() => {
    let result = [...products.value]

    if (filters.value.category) {
      result = result.filter(p => p.category === filters.value.category)
    }

    if (filters.value.minPrice !== null) {
      result = result.filter(p => p.price >= filters.value.minPrice)
    }

    if (filters.value.maxPrice !== null) {
      result = result.filter(p => p.price <= filters.value.maxPrice)
    }

    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search)
      )
    }

    // Sort
    const sort = filters.value.sort
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sort === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    return result
  })

  // Actions
  const fetchProducts = async (params = {}) => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.getAll({ 
        ...params, 
        page: pagination.value.page,
        limit: pagination.value.limit 
      })
      products.value = response.products || response
      if (response.pagination) {
        pagination.value = response.pagination
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar produtos'
    } finally {
      loading.value = false
    }
  }

  const fetchProductById = async (id) => {
    loading.value = true
    error.value = null
    try {
      const response = await productService.getById(id)
      currentProduct.value = response
      return response
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro ao carregar produto'
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchFeatured = async () => {
    try {
      const response = await productService.getAll({ featured: true, limit: 8 })
      featuredProducts.value = response.products || response
    } catch (err) {
      console.error('Erro ao carregar produtos em destaque:', err)
    }
  }

  const searchProducts = async (query) => {
    loading.value = true
    try {
      const response = await productService.search(query)
      products.value = response
    } catch (err) {
      error.value = err.response?.data?.message || 'Erro na busca'
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      category: '',
      minPrice: null,
      maxPrice: null,
      sort: 'name',
      search: ''
    }
  }

  const setPage = (page) => {
    pagination.value.page = page
  }

  return {
    products,
    categories,
    featuredProducts,
    currentProduct,
    loading,
    error,
    filters,
    pagination,
    filteredProducts,
    fetchProducts,
    fetchProductById,
    fetchFeatured,
    searchProducts,
    setFilters,
    resetFilters,
    setPage
  }
})
