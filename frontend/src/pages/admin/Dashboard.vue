<template>
  <div class="admin-page">
    <div class="admin-header">
      <h1 class="admin-title">Dashboard</h1>
      <p class="admin-subtitle">Visão geral da adega</p>
    </div>

    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-icon" style="background: rgba(139, 0, 0, 0.15);">💰</div>
        <div class="metric-info">
          <span class="metric-value">R$ {{ formatPrice(metrics.revenue) }}</span>
          <span class="metric-label">Receita Total</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon" style="background: rgba(59, 130, 246, 0.15);">📦</div>
        <div class="metric-info">
          <span class="metric-value">{{ metrics.orders }}</span>
          <span class="metric-label">Pedidos</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon" style="background: rgba(34, 197, 94, 0.15);">👥</div>
        <div class="metric-info">
          <span class="metric-value">{{ metrics.users }}</span>
          <span class="metric-label">Clientes</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon" style="background: rgba(245, 158, 11, 0.15);">🍷</div>
        <div class="metric-info">
          <span class="metric-value">{{ metrics.products }}</span>
          <span class="metric-label">Produtos</span>
        </div>
      </div>
    </div>

    <div class="admin-sections">
      <div class="admin-section">
        <h2 class="section-title-small">Pedidos Recentes</h2>
        <div class="table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order._id">
                <td>#{{ order._id?.slice(-6).toUpperCase() }}</td>
                <td>{{ order.user?.name || 'Cliente' }}</td>
                <td>{{ formatDate(order.createdAt) }}</td>
                <td>R$ {{ formatPrice(order.totalAmount) }}</td>
                <td>
                  <span class="status-badge" :class="`status-${order.status}`">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="admin-section">
        <h2 class="section-title-small">Produtos Mais Vendidos</h2>
        <div class="table-wrapper">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Vendas</th>
                <th>Receita</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in topProducts" :key="product._id">
                <td>{{ product.name }}</td>
                <td>{{ product.category }}</td>
                <td>{{ product.sales || 0 }}</td>
                <td>R$ {{ formatPrice(product.revenue || 0) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { orderService } from '../../services/orderService'
import { productService } from '../../services/productService'
import { userService } from '../../services/userService'

const metrics = ref({
  revenue: 0,
  orders: 0,
  users: 0,
  products: 0
})

const recentOrders = ref([])
const topProducts = ref([])

const formatPrice = (price) => {
  return price?.toFixed(2).replace('.', ',')
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendente',
    processing: 'Processando',
    shipped: 'Enviado',
    delivered: 'Entregue',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

onMounted(async () => {
  try {
    const [ordersRes, productsRes, usersRes] = await Promise.all([
      orderService.getAll(),
      productService.getAll(),
      userService.getAll()
    ])

    const orders = ordersRes.orders || ordersRes
    const products = productsRes.products || productsRes
    const users = usersRes.users || usersRes

    metrics.value = {
      revenue: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      orders: orders.length,
      users: users.length,
      products: products.length
    }

    recentOrders.value = orders.slice(0, 5)
    topProducts.value = products.slice(0, 5)
  } catch (err) {
    console.error('Erro ao carregar dashboard:', err)
  }
})
</script>

<style scoped>
.admin-page {
  padding: var(--space-xl);
  max-width: 1200px;
}

.admin-header {
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

.metric-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
}

.metric-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.admin-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.admin-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.section-title-small {
  font-family: var(--font-display);
  font-size: 1.2rem;
  margin-bottom: var(--space-lg);
}

.table-wrapper {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  text-align: left;
  padding: var(--space-md);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
}

.admin-table td {
  padding: var(--space-md);
  font-size: 0.9rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
}

.admin-table tr:last-child td {
  border-bottom: none;
}

.status-badge {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
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

@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
