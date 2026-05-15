<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <router-link to="/" class="sidebar-brand">
       <span class="logo-text">Adega 💯Amor</span>
      </router-link>
      <span class="sidebar-badge">Admin</span>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/admin" class="sidebar-link" exact>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
        </svg>
        Dashboard
      </router-link>
      <router-link to="/admin/produtos" class="sidebar-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
          <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
        </svg>
        Produtos
      </router-link>
      <router-link to="/admin/categorias" class="sidebar-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
        </svg>
        Categorias
      </router-link>
      <router-link to="/admin/pedidos" class="sidebar-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
          <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        Pedidos
      </router-link>
      <router-link to="/admin/usuarios" class="sidebar-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Usuários
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <router-link to="/" class="sidebar-link sidebar-link-back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
        </svg>
        Voltar para Loja
      </router-link>
      <button @click="logout" class="sidebar-link sidebar-link-logout">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/>
          <line x1="21" x2="9" y1="12" y2="12"/>
        </svg>
        Sair
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.admin-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  z-index: var(--z-sticky);
}

.sidebar-header {
  padding: var(--space-xl);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
}

.brand-icon {
  font-size: 1.3rem;
}

.sidebar-badge {
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-wine);
  color: var(--color-white);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: var(--radius-sm);
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  color: var(--text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  text-decoration: none;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  text-align: left;
}

.sidebar-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.sidebar-link.router-link-active {
  background: rgba(139, 0, 0, 0.15);
  color: var(--color-wine-light);
}

.sidebar-footer {
  padding: var(--space-lg);
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.sidebar-link-back {
  color: var(--color-gold);
}

.sidebar-link-back:hover {
  background: rgba(201, 169, 110, 0.1);
}

.sidebar-link-logout {
  color: #dc2626;
}

.sidebar-link-logout:hover {
  background: rgba(220, 38, 38, 0.1);
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    transform: translateX(-100%);
    transition: transform var(--transition-normal);
  }
}
</style>
