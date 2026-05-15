<template>
  <div class="orders-page">
    <div class="container">
      <h1 class="page-title">Meus Pedidos</h1>

      <div v-if="loading" class="orders-skeleton">
        <div v-for="n in 3" :key="n" class="skeleton skeleton-order"></div>
      </div>

      <div v-else-if="orders.length === 0" class="empty-state">
        <div class="empty-state-icon">📦</div>
        <h3 class="empty-state-title">Nenhum pedido ainda</h3>
        <p class="empty-state-text">Você ainda não realizou nenhum pedido. Explore nossos produtos!</p>
        <router-link to="/produtos" class="btn btn-primary btn-lg" style="margin-top: var(--space-lg);">
          Explorar Produtos
        </router-link>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order._id" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <span class="order-number">Pedido #{{ order._id?.slice(-6).toUpperCase() }}</span>
              <span class="order-date">{{ formatDate(order.createdAt) }}</span>
            </div>
            <span class="order-status" :class="`status-${order.status}`">
              {{ getStatusLabel(order.status) }}
            </span>
          </div>

          <div class="order-items">
            <div v-for="item in order.products" :key="item._id" class="order-item">
              <img :src="item.product?.images?.[0] || '/placeholder-wine.jpg'" :alt="item.product?.name" class="order-item-image" />
              <div class="order-item-details">
                <span class="order-item-name">{{ item.product?.name }}</span>
                <span class="order-item-qty">{{ item.quantity }}x R$ {{ formatPrice(item.price) }}</span>
              </div>
              <span class="order-item-total">R$ {{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-address">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{{ formatAddress(order.shippingAddress) }}</span>
            </div>
            <div class="order-total">
              <span>Total:</span>
              <span class="total-value">R$ {{ formatPrice(order.totalAmount) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUIStore } from '../stores/ui'
import { orderService } from '../services/orderService'

const uiStore = useUIStore()

const loading = ref(true)
const orders = ref([])

const formatPrice = (price) => {
  return price?.toFixed(2).replace('.', ',')
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatAddress = (address) => {
  if (!address) return 'Endereço não disponível'
  return `${address.street}, ${address.number} - ${address.city}/${address.state}`
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendente',
    processing: 'Em Processamento',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

onMounted(async () => {
  try {
    const response = await orderService.getMyOrders()
    orders.value = response
  } catch (err) {
    uiStore.showToast('Erro ao carregar pedidos', 'error')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.orders-page {
  padding-top: 90px;
  min-height: 100vh;
}

.page-title {
  font-family: var(--font-display);
  font-size: 2rem;
  margin-bottom: var(--space-2xl);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin-bottom: var(--space-3xl);
}

.order-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.order-number {
  font-weight: 600;
  color: var(--text-primary);
}

.order-date {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.order-status {
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.status-processing {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.status-shipped {
  background: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
}

.status-delivered {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.status-cancelled {
  background: rgba(220, 38, 38, 0.15);
  color: #dc2626;
}

.order-items {
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.order-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.order-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
}

.order-item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.order-item-name {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.order-item-qty {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.order-item-total {
  font-weight: 600;
  color: var(--color-gold);
  white-space: nowrap;
}

.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.order-address {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.85rem;
  color: var(--text-muted);
}

.order-total {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.order-total span:first-child {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.total-value {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-gold);
}

.orders-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.skeleton-order {
  height: 200px;
  width: 100%;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }
}
</style>
