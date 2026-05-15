<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
      >
        <span class="toast-icon" v-if="toast.type === 'success'">✓</span>
        <span class="toast-icon" v-else-if="toast.type === 'error'">✕</span>
        <span class="toast-icon" v-else-if="toast.type === 'warning'">!</span>
        <span class="toast-icon" v-else>ℹ</span>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUIStore } from '../stores/ui'

const uiStore = useUIStore()
const toasts = computed(() => uiStore.toasts)
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--space-xl);
  right: var(--space-xl);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  animation: slideIn 0.3s ease;
}

.toast-success {
  border-left: 3px solid #22c55e;
}

.toast-error {
  border-left: 3px solid #dc2626;
}

.toast-warning {
  border-left: 3px solid #f59e0b;
}

.toast-info {
  border-left: 3px solid var(--color-wine);
}

.toast-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.toast-success .toast-icon {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.toast-error .toast-icon {
  background: rgba(220, 38, 38, 0.2);
  color: #dc2626;
}

.toast-warning .toast-icon {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.toast-info .toast-icon {
  background: rgba(139, 0, 0, 0.2);
  color: var(--color-wine-light);
}

.toast-message {
  font-size: 0.9rem;
  color: var(--text-primary);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .toast-container {
    left: var(--space-md);
    right: var(--space-md);
    max-width: none;
  }
}
</style>
