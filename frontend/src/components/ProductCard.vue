<template>
  <div class="product-card" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="product-image-wrapper">
      <img
        :src="product.images?.[0] || '/placeholder-item.jpg'"
        :alt="product.name"
        class="product-image"
        loading="lazy"
      />
      <div class="product-overlay" :class="{ 'active': hover }">
        <button @click.stop="addToCart" class="overlay-btn overlay-btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Adicionar
        </button>
        <router-link :to="`/produto/${product._id}`" class="overlay-btn overlay-btn-secondary">
          Ver Detalhes
        </router-link>
      </div>
      <button
        @click.stop="toggleFavorite"
        class="favorite-btn"
        :class="{ 'active': isFavorite }"
        aria-label="Favoritar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3.332.5-4.5 2-1.168-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      </button>
      <span v-if="product.stock <= 5 && product.stock > 0" class="stock-badge">
        Apenas {{ product.stock }} restantes
      </span>
      <span v-if="product.stock === 0" class="stock-badge out-of-stock">
        Esgotado
      </span>
    </div>

    <div class="product-info">
      <span class="product-category">{{ product.category }}</span>
      <h3 class="product-name">
        <router-link :to="`/produto/${product._id}`">{{ product.name }}</router-link>
      </h3>
 <p class="product-origin" v-if="product.origin">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M3 6h18v12H3V6z"/><path d="M9 12h6"/> </svg>
  {{ product.origin }}
</p>

<p v-if="product.harmonization" class="product-harmonization">
  Sugestão: {{ product.harmonization }}
</p>
      <div class="product-footer">
        <span class="product-price">R$ {{ formatPrice(product.price) }}</span>
        <div class="product-rating" v-if="product.rating">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>{{ product.rating.toFixed(1) }}</span>
        </div>
      </div>
      <p v-if="product.harmonization" class="product-harmonization">
        Dica da 💯Amor: {{ product.harmonization }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const authStore = useAuthStore()
const uiStore = useUIStore()

const hover = ref(false)

const isFavorite = computed(() => {
  return authStore.user?.favorites?.includes(props.product._id)
})

const formatPrice = (price) => {
  return price?.toFixed(2).replace('.', ',')
}

const addToCart = () => {
  if (props.product.stock === 0) {
    uiStore.showToast('Produto esgotado', 'error')
    return
  }
  cartStore.addItem({
    _id: props.product._id,
    name: props.product.name,
    price: props.product.price,
    images: props.product.images,
    category: props.product.category,
    quantity: 1
  })
  uiStore.showToast(`${props.product.name} adicionado ao carrinho!`, 'success')
}

const toggleFavorite = () => {
  if (!authStore.isAuthenticated) {
    uiStore.showToast('Faça login para favoritar produtos', 'info')
    return
  }
  // Implementar lógica de favoritos
  uiStore.showToast('Adicionado aos favoritos!', 'success')
}
</script>

<style scoped>
.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.product-card:hover {
  border-color: var(--border-light);
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.product-image-wrapper {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: var(--bg-secondary);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(13, 13, 13, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.product-overlay.active {
  opacity: 1;
}

.overlay-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg);
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 160px;
  justify-content: center;
}

.overlay-btn-primary {
  background: var(--color-wine);
  color: var(--color-white);
  border: none;
}

.overlay-btn-primary:hover {
  background: var(--color-wine-light);
}

.overlay-btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  text-decoration: none;
}

.overlay-btn-secondary:hover {
  border-color: var(--color-wine);
  color: var(--color-wine-light);
}

.favorite-btn {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  width: 36px;
  height: 36px;
  background: rgba(13, 13, 13, 0.7);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  z-index: 5;
}

.favorite-btn:hover,
.favorite-btn.active {
  background: var(--color-wine);
  color: var(--color-white);
}

.favorite-btn.active svg {
  fill: currentColor;
}

.stock-badge {
  position: absolute;
  top: var(--space-sm);
  left: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-wine);
  color: var(--color-white);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: var(--radius-sm);
  z-index: 5;
}

.stock-badge.out-of-stock {
  background: var(--color-gray-medium);
}

.product-info {
  padding: var(--space-lg);
}

.product-category {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-wine-light);
  margin-bottom: var(--space-sm);
}

.product-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: var(--space-sm);
  line-height: 1.3;
}

.product-name a {
  color: var(--text-primary);
  transition: color var(--transition-fast);
}

.product-name a:hover {
  color: var(--color-wine-light);
}

.product-origin {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: var(--space-md);
}

.product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
}

.product-price {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-gold);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-gold);
  font-size: 0.9rem;
  font-weight: 500;
}

.product-harmonization {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-style: italic;
  line-height: 1.4;
}
</style>
