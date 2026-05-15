<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <router-link to="/" class="footer-logo">
            <span class="logo-text">Adega 💯Amor</span>
          </router-link>
          <p class="footer-description">
            O ponto de encontro oficial! Bebidas geladas, o melhor do churrasco, hambúrgueres artesanais e os melhores eventos da região.
          </p>
          <div class="footer-social">
            <a href="#" class="social-link" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" class="social-link" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Cardápio & Diversão</h4>
          <ul class="footer-links">
            <li><router-link to="/produtos?categoria=comidas">Hambúrgueres e Porções</router-link></li>
            <li><router-link to="/produtos?categoria=churrasco">Espetinhos e Carnes</router-link></li>
            <li><router-link to="/produtos?categoria=bebidas">Bebidas em Geral</router-link></li>
            <li><router-link to="/eventos">Agenda de Eventos</router-link></li>
            <li><router-link to="/reservas">Aluguel de Espaço</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Institucional</h4>
          <ul class="footer-links">
            <li><router-link to="/">Sobre a 💯Amor</router-link></li>
            <li><router-link to="/">Como Pedir</router-link></li>
            <li><router-link to="/">Entrega Rápida</router-link></li>
            <li><router-link to="/feed">Comunidade e Rank</router-link></li>
            <li><router-link to="/">Fale Conosco</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4 class="footer-title">Fique por dentro!</h4>
          <p class="footer-text">Receba avisos de novos pagodes, jogos e promoções relâmpago.</p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input
              v-model="email"
              type="email"
              placeholder="Seu melhor e-mail"
              class="newsletter-input"
              required
            />
            <button type="submit" class="newsletter-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m22 2-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </form>
          <div class="footer-contact">
            <p><strong>Dúvidas? Chame a gente:</strong> (11) 99999-9999</p>
            <p><strong>Email:</strong> contato@adega100amor.com</p>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p> © 2026 Adega 💯Amor. Onde a resenha não acaba.</p>
        <div class="footer-payments">
          <span class="payment-icon">💳</span> <span class="payment-icon">💵</span> <span class="payment-icon">📱</span> </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
const email = ref('')

const subscribeNewsletter = () => {
  uiStore.showToast('Inscrição realizada com sucesso!', 'success')
  email.value = ''
}
</script>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: var(--space-3xl) 0 var(--space-xl);
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: var(--space-2xl);
  margin-bottom: var(--space-2xl);
}

.footer-brand {
  max-width: 320px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: var(--space-md);
}

.logo-icon {
  font-size: 1.5rem;
}

.footer-description {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.7;
  margin-bottom: var(--space-lg);
}

.footer-social {
  display: flex;
  gap: var(--space-sm);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-input);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.social-link:hover {
  background: var(--color-wine);
  color: var(--color-white);
}

.footer-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  margin-bottom: var(--space-lg);
  color: var(--text-primary);
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: var(--space-sm);
}

.footer-links a {
  color: var(--text-muted);
  font-size: 0.9rem;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--text-primary);
}

.footer-text {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-bottom: var(--space-md);
}

.newsletter-form {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.newsletter-input {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  color: var(--text-primary);
  font-size: 0.9rem;
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--color-wine);
}

.newsletter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: var(--color-wine);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-white);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.newsletter-btn:hover {
  background: var(--color-wine-light);
}

.footer-contact p {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: var(--space-xs);
}

.footer-contact strong {
  color: var(--text-secondary);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border-color);
}

.footer-bottom p {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.footer-payments {
  display: flex;
  gap: var(--space-sm);
}

.payment-icon {
  font-size: 1.5rem;
  opacity: 0.6;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  .footer-brand {
    max-width: 100%;
  }

  .footer-bottom {
    flex-direction: column;
    gap: var(--space-md);
    text-align: center;
  }
}
</style>
