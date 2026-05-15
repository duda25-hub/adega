<template>
  <div class="admin-page">
    <div class="admin-header">
      <div>
        <h1 class="admin-title">Gerenciar Pedidos</h1>
        <p class="admin-subtitle">Acompanhe e gerencie todos os pedidos</p>
      </div>
    </div>

    <div class="admin-section">
      <div class="table-toolbar">
        <select v-model="statusFilter" class="toolbar-select">
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="processing">Em Processamento</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregue</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      <div class="table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Data</th>
              <th>Total</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order._id">
              <td><strong>#{{ order._id?.slice(-6).toUpperCase() }}</strong></td>
              <td>{{ order.user?.name || 'Cliente' }}</td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td>R$ {{ formatPrice(order.totalAmount) }}</td>
              <td>
                <select
                  v-model="order.status"
                  @change="updateStatus(order._id, order.status)"
                  class="status-select"
                  :class="`status-${order.status}`"
                >
                  <option value="pending">Pendente</option>
                  <option value="processing">Processando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregue</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </td>
              <td>
                <button @click="viewOrder(order)" class="action-edit" title="Ver detalhes">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Detalhes -->
    <div v-if="selectedOrder" class="modal-overlay" @click.self="selectedOrder = null">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Pedido #{{ selectedOrder._id?.slice(-6).toUpperCase() }}</h2>
          <button @click="selectedOrder = null" class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="order-detail-section">
            <h4>Cliente</h4>
            <p>{{ selectedOrder.user?.name }}</p>
            <p>{{ selectedOrder.user?.email }}</p>
          </div>
          <div class="order-detail-section">
            <h4>Produtos</h4>
            <div v-for="item in selectedOrder.products" :key="item._id" class="order-detail-item">
              <span>{{ item.product?.name }} x{{ item.quantity }}</span>
              <span>R$ {{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>
          <div class="order-detail-section">
            <h4>Endereço de Entrega</h4>
            <p>{{ formatAddress(selectedOrder.shippingAddress) }}</p>
          </div>
          <div class="order-detail-section">
            <h4>Pagamento</h4>
            <p>{{ selectedOrder.paymentMethod === 'credit' ? 'Cartão de Crédito' : selectedOrder.paymentMethod === 'pix' ? 'PIX' : 'Boleto' }}</p>
          </div>
          <div class="order-detail-total">
            <strong>Total: R$ {{ formatPrice(selectedOrder.totalAmount) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUIStore } from '../../stores/ui'
import { orderService } from '../../services/orderService'

const uiStore = useUIStore()

const orders = ref([])
const statusFilter = ref('')
const selectedOrder = ref(null)

const filteredOrders = computed(() => {
  if (!statusFilter.value) return orders.value
  return orders.value.filter(o => o.status === statusFilter.value)
})

const formatPrice = (price) => {
  return price?.toFixed(2).replace('.', ',')
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR')
}

const formatAddress = (address) => {
  if (!address) return 'Não disponível'
  return `${address.street}, ${address.number}${address.complement ? ' - ' + address.complement : ''} - ${address.neighborhood}, ${address.city}/${address.state} - CEP: ${address.cep}`
}

const updateStatus = async (id, status) => {
  try {
    await orderService.updateStatus(id, status)
    uiStore.showToast('Status atualizado!', 'success')
  } catch (err) {
    uiStore.showToast('Erro ao atualizar status', 'error')
  }
}

const viewOrder = (order) => {
  selectedOrder.value = order
}

const loadOrders = async () => {
  try {
    const response = await orderService.getAll()
    orders.value = response.orders || response
  } catch (err) {
    console.error('Erro ao carregar pedidos:', err)
  }
}

onMounted(loadOrders)
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

.toolbar-select {
  padding: var(--space-sm) var(--space-md);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
}

.status-select {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: var(--bg-input);
  color: var(--text-primary);
}

.status-select.status-pending {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.status-select.status-processing {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.status-select.status-shipped {
  background: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
}

.status-select.status-delivered {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.status-select.status-cancelled {
  background: rgba(220, 38, 38, 0.15);
  color: #dc2626;
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
  font-size: 1.2rem;
  padding: var(--space-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.modal-close:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.modal-body {
  padding: var(--space-xl);
}

.order-detail-section {
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--border-color);
}

.order-detail-section:last-of-type {
  border-bottom: none;
}

.order-detail-section h4 {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}

.order-detail-section p {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: var(--space-xs);
}

.order-detail-item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-sm) 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.order-detail-total {
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border-color);
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--color-gold);
  text-align: right;
}
</style>
