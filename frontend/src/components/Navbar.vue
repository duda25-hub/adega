<template>
  <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled, 'navbar-open': mobileMenuOpen }">
    <div class="container navbar-container">
      <router-link to="/" class="navbar-brand">
      
<span class="brand-text">Adega 💯Amor</span>
      </router-link>

      <div class="navbar-search" v-if="searchOpen">
        <div class="search-wrapper">
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Buscar comida, bebidas ou eventos..."
            class="search-input"
            ref="searchInput"
          />
          <button @click="handleSearch" class="search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
          <button @click="toggleSearch" class="search-close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>


      <div class="navbar-links" :class="{ 'active': mobileMenuOpen }">
  <router-link to="/produtos" class="nav-link" @click="closeMobileMenu">
    <span>Cardápio</span>
  </router-link>
  <router-link to="/eventos" class="nav-link" @click="closeMobileMenu">
    <span>Eventos & Jogos</span>
  </router-link>
  <router-link to="/comunidade" class="nav-link" @click="closeMobileMenu">
    <span>Comunidade</span> </router-link>
  <router-link to="/reservas" class="nav-link" @click="closeMobileMenu">
    <span>Aluguel de Espaço</span>
  </router-link>

  <template v-if="isAuthenticated">
    <router-link to="/perfil" class="nav-link" @click="closeMobileMenu">
      <span>Meu Rank 🏆</span>
    </router-link>
    <router-link v-if="isAdmin" to="/admin" class="nav-link nav-link-admin" @click="closeMobileMenu">
      <span>Painel Admin</span>
    </router-link>
  </template>
  
  <template v-else>
    <router-link to="/login" class="nav-link" @click="closeMobileMenu">
      <span>Entrar</span>
    </router-link>
    <router-link to="/cadastro" class="nav-link nav-link-highlight" @click="closeMobileMenu">
      <span>Criar Conta</span>
    </router-link>
  </template>
</div>

      <div class="navbar-actions">
        <button @click="toggleSearch" class="action-btn" aria-label="Buscar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
        </button>

        <router-link to="/carrinho" class="action-btn cart-btn" aria-label="Carrinho">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </router-link>

        <button @click="toggleMobileMenu" class="action-btn menu-btn" aria-label="Menu">
          <svg v-if="!mobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 12h16M4 6h16M4 18h16"/>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useUIStore } from '../stores/ui'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const uiStore = useUIStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const cartCount = computed(() => cartStore.itemCount)
const searchOpen = computed(() => uiStore.searchOpen)
const mobileMenuOpen = computed(() => uiStore.mobileMenuOpen)

const isScrolled = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const toggleSearch = () => {
  uiStore.toggleSearch()
  if (!searchOpen.value) {
    setTimeout(() => searchInput.value?.focus(), 100)
  }
}

const toggleMobileMenu = () => {
  uiStore.toggleMobileMenu()
}

const closeMobileMenu = () => {
  uiStore.mobileMenuOpen = false
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/produtos?search=${encodeURIComponent(searchQuery.value)}`)
    uiStore.searchOpen = false
    searchQuery.value = ''
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-sticky);
  background: transparent;
  transition: all var(--transition-normal);
  border-bottom: 1px solid transparent;
}

.navbar-scrolled {
  background: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(20px);
  border-bottom-color: var(--border-color);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-primary);
  z-index: 10;
}

.brand-icon {
  font-size: 1.6rem;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.nav-link {
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-wine);
  transition: width var(--transition-normal);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-primary);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-link-highlight {
  background: var(--color-wine);
  color: var(--color-white) !important;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
}

.nav-link-highlight::after {
  display: none;
}

.nav-link-highlight:hover {
  background: var(--color-wine-light);
}

.nav-link-admin {
  color: var(--color-gold) !important;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  z-index: 10;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.cart-btn {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: var(--color-wine);
  color: var(--color-white);
  font-size: 0.65rem;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-search {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(13, 13, 13, 0.98);
  padding: var(--space-md) var(--space-lg);
  z-index: 20;
}

.search-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  color: var(--text-primary);
  font-size: 0.95rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-wine);
}

.search-btn,
.search-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--space-sm);
}

.menu-btn {
  display: none;
}

@media (max-width: 1024px) {
  .navbar-links {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(13, 13, 13, 0.98);
    flex-direction: column;
    justify-content: center;
    gap: var(--space-xl);
    opacity: 0;
    visibility: hidden;
    transition: all var(--transition-normal);
  }

  .navbar-links.active {
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    font-size: 1.2rem;
  }

  .menu-btn {
    display: flex;
  }
}

@media (max-width: 480px) {
  .brand-text {
    display: none;
  }
}
</style>
