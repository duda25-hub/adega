<template>
  <div class="product-detail-page">
    <div v-if="loading" class="detail-skeleton">
      <div class="skeleton skeleton-gallery"></div>
      <div class="skeleton skeleton-info">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-price"></div>
      </div>
    </div>

    <div v-else-if="product" class="container">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/">Início</router-link>
        <span>/</span>
        <router-link to="/produtos">Produtos</router-link>
        <span>/</span>
        <router-link :to="`/produtos?categoria=${product.category}`">{{ product.category }}</router-link>
        <span>/</span>
        <span class="breadcrumb-current">{{ product.name }}</span>
      </nav>

      <div class="product-detail">
        <!-- Galeria -->
        <div class="product-gallery">
          <div class="main-image">
            <img
              :src="product.images?.[selectedImage] || '/placeholder-wine.jpg'"
              :alt="product.name"
            />
          </div>
          <div v-if="product.images?.length > 1" class="thumbnail-list">
            <button
              v-for="(img, index) in product.images"
              :key="index"
              @click="selectedImage = index"
              class="thumbnail"
              :class="{ 'active': selectedImage === index }"
            >
              <img :src="img" :alt="`${product.name} - ${index + 1}`" />
            </button>
          </div>
        </div>

        <!-- Info -->
        <div class="product-info">
          <span class="product-category-badge">{{ product.category }}</span>
          <h1 class="product-title">{{ product.name }}</h1>

          <div class="product-meta">
            <div v-if="product.origin" class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
              </svg>
              <span>{{ product.origin }}</span>
            </div>
            <div v-if="product.alcoholContent" class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6.01" y1="2" y2="2"/><line x1="10" x2="10.01" y1="2" y2="2"/>
              </svg>
              <span>{{ product.alcoholContent }}% alc.</span>
            </div>
            <div v-if="product.rating" class="meta-item rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span>{{ product.rating.toFixed(1) }} ({{ product.reviews?.length || 0 }} avaliações)</span>
            </div>
          </div>

          <p class="product-description">{{ product.description }}</p>

          <div v-if="product.harmonization" class="harmonization-box">
            <h4>🍽️ Harmonização Recomendada</h4>
            <p>{{ product.harmonization }}</p>
          </div>

          <div class="product-price-section">
            <span class="product-price">R$ {{ formatPrice(product.price) }}</span>
            <span v-if="product.stock > 0" class="stock-status in-stock">
              ✓ Em estoque ({{ product.stock }} unidades)
            </span>
            <span v-else class="stock-status out-of-stock">
              ✕ Esgotado
            </span>
          </div>

          <div class="product-actions">
            <div class="quantity-selector">
              <button @click="quantity > 1 ? quantity-- : null" class="qty-btn" :disabled="quantity <= 1">-</button>
              <span class="qty-value">{{ quantity }}</span>
              <button @click="quantity < product.stock ? quantity++ : null" class="qty-btn" :disabled="quantity >= product.stock">+</button>
            </div>
            <button @click="addToCart" class="btn btn-primary btn-lg add-cart-btn" :disabled="product.stock === 0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Adicionar ao Carrinho
            </button>
            <button @click="toggleFavorite" class="btn btn-secondary favorite-action" :class="{ 'active': isFavorite }">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.332.5-4.5 2-1.168-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews -->
      <div v-if="product.reviews?.length > 0" class="reviews-section">
        <h2 class="section-title">Avaliações</h2>
        <div class="reviews-list">
          <div v-for="review in product.reviews" :key="review._id" class="review-card">
            <div class="review-header">
              <div class="reviewer-avatar">{{ review.userName?.charAt(0) || 'U' }}</div>
              <div class="reviewer-info">
                <span class="reviewer-name">{{ review.userName || 'Usuário' }}</span>
                <div class="review-stars">
                  <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= review.rating }">★</span>
                </div>
              </div>
              <span class="review-date">{{ formatDate(review.date) }}</span>
            </div>
            <p class="review-text">{{ review.comment }}</p>
          </div>
        </div>
      </div>

      <!-- Produtos Relacionados -->
      <div v-if="relatedProducts.length > 0" class="related-section">
        <h2 class="section-title">Produtos Relacionados</h2>
        <div class="products-grid">
          <ProductCard
            v-for="relProduct in relatedProducts"
            :key="relProduct._id"
            :product="relProduct"
          />
        </div>
      </div>
    </div>

    <div v-else class="empty-state container" style="padding-top: 120px;">
      <div class="empty-state-icon">📦</div>
      <h3 class="empty-state-title">Produto não encontrado</h3>
      <p class="empty-state-text">O produto que você procura não existe ou foi removido.</p>
      <router-link to="/produtos" class="btn btn-primary" style="margin-top: var(--space-lg);">
        Ver Produtos
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const uiStore = useUIStore()

const loading = ref(true)
const product = ref(null)
const selectedImage = ref(0)
const quantity = ref(1)
const relatedProducts = ref([])

const isFavorite = computed(() => {
  return authStore.user?.favorites?.includes(product.value?._id)
})

const formatPrice = (price) => {
  return price?.toFixed(2).replace('.', ',')
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const addToCart = () => {
  cartStore.addItem({
    _id: product.value._id,
    name: product.value.name,
    price: product.value.price,
    images: product.value.images,
    category: product.value.category,
    quantity: quantity.value
  })
  uiStore.showToast(`${quantity.value}x ${product.value.name} adicionado ao carrinho!`, 'success')
  quantity.value = 1
}

const toggleFavorite = () => {
  if (!authStore.isAuthenticated) {
    uiStore.showToast('Faça login para favoritar produtos', 'info')
    return
  }
  uiStore.showToast('Adicionado aos favoritos!', 'success')
}

onMounted(async () => {
  try {
    const productId = route.params.id
    const data = await productsStore.fetchProductById(productId)
    product.value = data.product

    console.log(product.value)

    // Carregar relacionados
    await productsStore.fetchProducts({ category: product.value.category, limit: 4 })
    relatedProducts.value = productsStore.products.filter(p => p._id !== productId).slice(0, 4)
  } catch (err) {
    console.error('Erro ao carregar produto:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.product-detail-page {
  padding-top: 70px;
  min-height: 100vh;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xl) 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.breadcrumb a:hover {
  color: var(--text-primary);
}

.breadcrumb-current {
  color: var(--text-secondary);
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3xl);
  margin-bottom: var(--space-3xl);
}

/* Galeria */
.product-gallery {
  position: sticky;
  top: 90px;
  height: fit-content;
}

.main-image {
  aspect-ratio: 1;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
  margin-bottom: var(--space-md);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-list {
  display: flex;
  gap: var(--space-sm);
}

.thumbnail {
  width: 80px;
  height: 80px;
  background: var(--bg-card);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
}

.thumbnail.active,
.thumbnail:hover {
  border-color: var(--color-wine);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Info */
.product-category-badge {
  display: inline-block;
  padding: var(--space-xs) var(--space-md);
  background: rgba(139, 0, 0, 0.15);
  color: var(--color-wine-light);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-md);
}

.product-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--space-lg);
  line-height: 1.2;
}

.product-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.9rem;
  color: var(--text-muted);
}

.meta-item.rating {
  color: var(--color-gold);
}

.product-description {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
}

.harmonization-box {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.harmonization-box h4 {
  font-family: var(--font-display);
  font-size: 1.1rem;
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
}

.harmonization-box p {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.product-price-section {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-xl);
  border-bottom: 1px solid var(--border-color);
}

.product-price {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-gold);
}

.stock-status {
  font-size: 0.85rem;
  font-weight: 500;
}

.stock-status.in-stock {
  color: #22c55e;
}

.stock-status.out-of-stock {
  color: #dc2626;
}

.product-actions {
  display: flex;
  gap: var(--space-md);
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.qty-btn {
  width: 44px;
  height: 44px;
  background: var(--bg-input);
  border: none;
  color: var(--text-primary);
  font-size: 1.2rem;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.qty-btn:hover:not(:disabled) {
  background: var(--bg-hover);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-value {
  width: 50px;
  text-align: center;
  font-weight: 600;
  color: var(--text-primary);
}

.add-cart-btn {
  flex: 1;
}

.favorite-action {
  width: 50px;
  height: 50px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-action.active {
  background: var(--color-wine);
  border-color: var(--color-wine);
  color: var(--color-white);
}

.favorite-action.active svg {
  fill: currentColor;
}

/* Reviews */
.reviews-section {
  margin-bottom: var(--space-3xl);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.review-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.review-header {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  background: var(--color-wine);
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.reviewer-info {
  flex: 1;
}

.reviewer-name {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
}

.review-stars {
  display: flex;
  gap: 2px;
}

.review-stars .star {
  color: var(--color-gray-medium);
  font-size: 0.9rem;
}

.review-stars .star.filled {
  color: var(--color-gold);
}

.review-date {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.review-text {
  color: var(--text-secondary);
  line-height: 1.6;
  padding-left: calc(40px + var(--space-md));
}

/* Related */
.related-section {
  margin-bottom: var(--space-3xl);
}

.related-section .products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-xl);
}

/* Skeleton */
.detail-skeleton {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3xl);
  padding: var(--space-3xl);
  max-width: 1280px;
  margin: 0 auto;
}

.skeleton-gallery {
  aspect-ratio: 1;
}

.skeleton-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.skeleton-title {
  height: 40px;
  width: 80%;
}

.skeleton-price {
  height: 50px;
  width: 40%;
}

@media (max-width: 1024px) {
  .product-detail {
    grid-template-columns: 1fr;
  }

  .product-gallery {
    position: relative;
    top: 0;
  }

  .related-section .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .detail-skeleton {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .product-title {
    font-size: 1.5rem;
  }

  .product-price {
    font-size: 1.5rem;
  }

  .product-actions {
    flex-wrap: wrap;
  }

  .related-section .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .review-text {
    padding-left: 0;
  }
}

@media (max-width: 480px) {
  .related-section .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
