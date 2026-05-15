<template>
  <div class="cart-page">
    <div class="container">
      <h1 class="page-title">Carrinho de Compras</h1>

      <div v-if="cartStore.isEmpty" class="empty-state">
        <div class="empty-state-icon">🛒</div>
        <h3 class="empty-state-title">Seu carrinho está vazio</h3>
        <p class="empty-state-text">Explore nossa seleção de produtos premium e adicione itens ao seu carrinho.</p>
        <router-link to="/produtos" class="btn btn-primary btn-lg" style="margin-top: var(--space-lg);">
          Continuar Adquirindo itens
        </router-link>
      </div>

      <div v-else class="cart-layout">
        <!-- Lista de Itens -->
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item._id" class="cart-item">
            <img :src="item.image || '/placeholder-wine.jpg'" :alt="item.name" class="item-image" />

            <div class="item-details">
              <span class="item-category">{{ item.category }}</span>
              <h3 class="item-name">{{ item.name }}</h3>
              <span class="item-price">R$ {{ formatPrice(item.price) }} / un</span>
            </div>

            <div class="item-quantity">
              <button @click="updateQty(item._id, item.quantity - 1)" class="qty-btn" :disabled="item.quantity <= 1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14"/>
                </svg>
              </button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button @click="updateQty(item._id, item.quantity + 1)" class="qty-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5v14"/>
                </svg>
              </button>
            </div>

            <span class="item-total">R$ {{ formatPrice(item.price * item.quantity) }}</span>

            <button @click="removeItem(item._id)" class="item-remove" aria-label="Remover item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <router-link to="/produtos" class="btn btn-secondary" style="margin-top: var(--space-lg);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Continuar Comprando
          </router-link>
        </div>

        <!-- Resumo -->
        <aside class="cart-summary">
          <h3 class="summary-title">Resumo do Pedido</h3>

          <div class="summary-row">
            <span>Subtotal</span>
            <span>R$ {{ formatPrice(cartStore.subtotal) }}</span>
          </div>

          <div v-if="cartStore.discount > 0" class="summary-row discount">
            <span>Desconto</span>
            <span>- R$ {{ formatPrice(cartStore.discount) }}</span>
          </div>

          <div class="coupon-section">
            <div class="coupon-input-wrapper">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Código do cupom"
                class="coupon-input"
              />
              <button @click="applyCoupon" class="coupon-btn">Aplicar</button>
            </div>
            <button v-if="cartStore.coupon" @click="cartStore.removeCoupon" class="coupon-remove">
              Remover cupom
            </button>
          </div>

          <div class="divider"></div>

          <div class="summary-row total">
            <span>Total</span>
            <span class="total-price">R$ {{ formatPrice(cartStore.total) }}</span>
          </div>

          <p class="installments" v-if="cartStore.total > 0">
            ou em até 12x de R$ {{ formatPrice(cartStore.total / 12) }}
          </p>

          <router-link to="/checkout" class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-lg);">
            Finalizar Compra
          </router-link>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '../stores/cart'
import { useUIStore } from '../stores/ui'

const cartStore = useCartStore()
const uiStore = useUIStore()

const couponCode = ref('')

const formatPrice = (price) => {
  return price?.toFixed(2).replace('.', ',')
}

const updateQty = (id, qty) => {
  cartStore.updateQuantity(id, qty)
}

const removeItem = (id) => {
  cartStore.removeItem(id)
  uiStore.showToast('Item removido do carrinho', 'info')
}

const applyCoupon = () => {
  if (!couponCode.value.trim()) return
  // Simulação de cupom
  if (couponCode.value.toUpperCase() === 'ADEga10') {
    cartStore.applyCoupon({ code: 'ADEga10', type: 'percentage', value: 10 })
    uiStore.showToast('Cupom aplicado: 10% de desconto!', 'success')
    couponCode.value = ''
  } else {
    uiStore.showToast('Cupom inválido', 'error')
  }
}
</script>

<style scoped>
.cart-page {
  padding-top: 90px;
  min-height: 100vh;
}

.page-title {
  font-family: var(--font-display);
  font-size: 2rem;
  margin-bottom: var(--space-2xl);
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--space-2xl);
  margin-bottom: var(--space-3xl);
}

/* Itens */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: var(--space-lg);
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
}

.item-details {
  min-width: 0;
}

.item-category {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--color-wine-light);
  margin-bottom: var(--space-xs);
}

.item-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: var(--space-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-price {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.item-quantity {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.qty-btn {
  width: 36px;
  height: 36px;
  background: var(--bg-input);
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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
  width: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.item-total {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-gold);
  white-space: nowrap;
}

.item-remove {
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-remove:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

/* Summary */
.cart-summary {
  position: sticky;
  top: 90px;
  height: fit-content;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.summary-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.summary-row.discount {
  color: #22c55e;
}

.summary-row.total {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-top: var(--space-md);
}

.total-price {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gold);
}

.coupon-section {
  margin: var(--space-lg) 0;
}

.coupon-input-wrapper {
  display: flex;
  gap: var(--space-sm);
}

.coupon-input {
  flex: 1;
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.coupon-input:focus {
  outline: none;
  border-color: var(--color-wine);
}

.coupon-btn {
  padding: var(--space-sm) var(--space-md);
  background: var(--color-wine);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-white);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.coupon-btn:hover {
  background: var(--color-wine-light);
}

.coupon-remove {
  display: block;
  margin-top: var(--space-sm);
  font-size: 0.8rem;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

.installments {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-top: var(--space-sm);
}

@media (max-width: 1024px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr auto;
    grid-template-rows: auto auto;
    gap: var(--space-sm);
  }

  .item-image {
    width: 80px;
    height: 80px;
    grid-row: span 2;
  }

  .item-details {
    grid-column: 2;
  }

  .item-quantity {
    grid-column: 2;
    justify-self: start;
  }

  .item-total {
    grid-column: 3;
    grid-row: span 2;
    align-self: center;
  }

  .item-remove {
    grid-column: 3;
    align-self: end;
  }
}
</style>
