<template>
  <div class="checkout-page">
    <div class="container">
      <h1 class="page-title">Finalizar Compra</h1>

      <div v-if="cartStore.isEmpty" class="empty-state">
        <div class="empty-state-icon">🛒</div>
        <h3 class="empty-state-title">Seu carrinho está vazio</h3>
        <router-link to="/produtos" class="btn btn-primary btn-lg">
          Continuar Comprando
        </router-link>
      </div>

      <div v-else class="checkout-layout">
        <!-- Formulário -->
        <div class="checkout-form">
          <!-- Endereço -->
          <section class="checkout-section">
            <h2 class="section-title-small">
              <span class="section-number">1</span>
              Endereço de Entrega
            </h2>

            <div class="address-grid">
              <div class="input-group">
                <label class="input-label">CEP</label>
                <input v-model="address.cep" type="text" class="input-field" placeholder="00000-000" required />
              </div>
              <div class="input-group">
                <label class="input-label">Rua</label>
                <input v-model="address.street" type="text" class="input-field" placeholder="Nome da rua" required />
              </div>
              <div class="input-group">
                <label class="input-label">Número</label>
                <input v-model="address.number" type="text" class="input-field" placeholder="123" required />
              </div>
              <div class="input-group">
                <label class="input-label">Complemento</label>
                <input v-model="address.complement" type="text" class="input-field" placeholder="Apto, bloco, etc." />
              </div>
              <div class="input-group">
                <label class="input-label">Bairro</label>
                <input v-model="address.neighborhood" type="text" class="input-field" placeholder="Bairro" required />
              </div>
              <div class="input-group">
                <label class="input-label">Cidade</label>
                <input v-model="address.city" type="text" class="input-field" placeholder="Cidade" required />
              </div>
              <div class="input-group">
                <label class="input-label">Estado</label>
                <input v-model="address.state" type="text" class="input-field" placeholder="UF" maxlength="2" required />
              </div>
            </div>
          </section>

          <!-- Pagamento -->
          <section class="checkout-section">
            <h2 class="section-title-small">
              <span class="section-number">2</span>
              Forma de Pagamento
            </h2>

            <div class="payment-methods">
              <label class="payment-method" :class="{ 'active': paymentMethod === 'credit' }">
                <input type="radio" v-model="paymentMethod" value="credit" />
                <div class="method-icon">💳</div>
                <div class="method-info">
                  <span class="method-name">Cartão de Crédito</span>
                  <span class="method-desc">Visa, Mastercard, Elo</span>
                </div>
              </label>

              <label class="payment-method" :class="{ 'active': paymentMethod === 'pix' }">
                <input type="radio" v-model="paymentMethod" value="pix" />
                <div class="method-icon">⚡</div>
                <div class="method-info">
                  <span class="method-name">PIX</span>
                  <span class="method-desc">Pagamento instantâneo</span>
                </div>
              </label>

              <label class="payment-method" :class="{ 'active': paymentMethod === 'boleto' }">
                <input type="radio" v-model="paymentMethod" value="boleto" />
                <div class="method-icon">📄</div>
                <div class="method-info">
                  <span class="method-name">Boleto Bancário</span>
                  <span class="method-desc">Vencimento em 3 dias</span>
                </div>
              </label>
            </div>

            <!-- Campos do cartão -->
            <div v-if="paymentMethod === 'credit'" class="credit-card-form">
              <div class="input-group">
                <label class="input-label">Número do Cartão</label>
                <input v-model="card.number" type="text" class="input-field" placeholder="0000 0000 0000 0000" />
              </div>
              <div class="input-group">
                <label class="input-label">Nome no Cartão</label>
                <input v-model="card.name" type="text" class="input-field" placeholder="Como aparece no cartão" />
              </div>
              <div class="card-row">
                <div class="input-group">
                  <label class="input-label">Validade</label>
                  <input v-model="card.expiry" type="text" class="input-field" placeholder="MM/AA" />
                </div>
                <div class="input-group">
                  <label class="input-label">CVV</label>
                  <input v-model="card.cvv" type="text" class="input-field" placeholder="123" maxlength="4" />
                </div>
              </div>
              <div class="input-group">
                <label class="input-label">Parcelas</label>
                <select v-model="card.installments" class="filter-select">
                  <option v-for="n in 12" :key="n" :value="n">
                    {{ n }}x de R$ {{ formatPrice(cartStore.total / n) }} {{ n === 1 ? 'sem juros' : '' }}
                  </option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <!-- Resumo -->
        <aside class="checkout-summary">
          <h3 class="summary-title">Resumo do Pedido</h3>

          <div class="summary-items">
            <div v-for="item in cartStore.items" :key="item._id" class="summary-item">
              <div class="summary-item-info">
                <span class="summary-item-qty">{{ item.quantity }}x</span>
                <span class="summary-item-name">{{ item.name }}</span>
              </div>
              <span class="summary-item-price">R$ {{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="summary-row">
            <span>Subtotal</span>
            <span>R$ {{ formatPrice(cartStore.subtotal) }}</span>
          </div>
          <div v-if="cartStore.discount > 0" class="summary-row discount">
            <span>Desconto</span>
            <span>- R$ {{ formatPrice(cartStore.discount) }}</span>
          </div>
          <div class="summary-row">
            <span>Frete</span>
            <span class="free-shipping">Grátis</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span class="total-price">R$ {{ formatPrice(cartStore.total) }}</span>
          </div>

          <button @click="finishOrder" class="btn btn-primary btn-lg" :disabled="loading" style="width: 100%; margin-top: var(--space-lg);">
            <span v-if="loading">Processando...</span>
            <span v-else>Confirmar Pedido</span>
          </button>

          <p class="secure-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Pagamento 100% seguro
          </p>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useUIStore } from '../stores/ui'
import { orderService } from '../services/orderService'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const uiStore = useUIStore()

const loading = ref(false)
const paymentMethod = ref('credit')

const address = ref({
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: ''
})

const card = ref({
  number: '',
  name: '',
  expiry: '',
  cvv: '',
  installments: 1
})

const formatPrice = (price) => {
  return price?.toFixed(2).replace('.', ',')
}

const finishOrder = async () => {
  // Validação básica
  if (!address.value.cep || !address.value.street || !address.value.number) {
    uiStore.showToast('Preencha todos os campos do endereço', 'error')
    return
  }

  loading.value = true

  try {
    const orderData = {
      products: cartStore.items.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: cartStore.total,
      shippingAddress: address.value,
      paymentMethod: paymentMethod.value,
      coupon: cartStore.coupon
    }

    await orderService.create(orderData)
    cartStore.clearCart()
    uiStore.showToast('Pedido realizado com sucesso!', 'success')
    router.push('/pedidos')
  } catch (err) {
    uiStore.showToast(err.response?.data?.message || 'Erro ao finalizar pedido', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-page {
  padding-top: 90px;
  min-height: 100vh;
}

.page-title {
  font-family: var(--font-display);
  font-size: 2rem;
  margin-bottom: var(--space-2xl);
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-2xl);
  margin-bottom: var(--space-3xl);
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-2xl);
}

.checkout-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.section-title-small {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  font-family: var(--font-display);
  font-size: 1.2rem;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-color);
}

.section-number {
  width: 32px;
  height: 32px;
  background: var(--color-wine);
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  flex-shrink: 0;
}

.address-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-md);
}

.address-grid .input-group:nth-child(2) {
  grid-column: span 2;
}

.address-grid .input-group:nth-child(5),
.address-grid .input-group:nth-child(6),
.address-grid .input-group:nth-child(7) {
  grid-column: span 1;
}

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
}

.payment-method {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-input);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.payment-method input {
  display: none;
}

.payment-method.active {
  border-color: var(--color-wine);
  background: rgba(139, 0, 0, 0.1);
}

.method-icon {
  font-size: 1.5rem;
}

.method-info {
  display: flex;
  flex-direction: column;
}

.method-name {
  font-weight: 600;
  color: var(--text-primary);
}

.method-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.credit-card-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.card-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

/* Summary */
.checkout-summary {
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

.summary-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.summary-item-info {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.summary-item-qty {
  color: var(--color-wine-light);
  font-weight: 600;
  min-width: 30px;
}

.summary-item-name {
  color: var(--text-secondary);
}

.summary-item-price {
  color: var(--text-primary);
  font-weight: 500;
  white-space: nowrap;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.summary-row.discount {
  color: #22c55e;
}

.free-shipping {
  color: #22c55e;
  font-weight: 500;
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

.secure-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  font-size: 0.8rem;
  color: var(--text-muted);
}

@media (max-width: 1024px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-summary {
    position: relative;
    top: 0;
  }

  .address-grid {
    grid-template-columns: 1fr;
  }

  .address-grid .input-group:nth-child(2) {
    grid-column: span 1;
  }
}
</style>
