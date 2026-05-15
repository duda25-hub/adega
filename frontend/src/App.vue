<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <Navbar v-if="!isAdminRoute" />
    <AdminSidebar v-if="isAdminRoute && isAdmin" />
    <main :class="{ 'admin-main': isAdminRoute }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer v-if="!isAdminRoute" />
    <ToastContainer />
    <LoadingOverlay v-if="globalLoading" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useUIStore } from './stores/ui'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import AdminSidebar from './components/AdminSidebar.vue'
import ToastContainer from './components/ToastContainer.vue'
import LoadingOverlay from './components/LoadingOverlay.vue'

const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUIStore()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isAdmin = computed(() => authStore.user?.role === 'admin')
const isDarkMode = computed(() => uiStore.isDarkMode)
const globalLoading = computed(() => uiStore.globalLoading)
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.admin-main {
  margin-left: 280px;
  min-height: 100vh;
  background: var(--bg-primary);
}

@media (max-width: 768px) {
  .admin-main {
    margin-left: 0;
  }
}
</style>
