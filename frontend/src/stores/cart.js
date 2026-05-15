import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref(JSON.parse(localStorage.getItem('cart') || '[]'))
  const coupon = ref(JSON.parse(localStorage.getItem('coupon') || 'null'))

  // Getters
  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const subtotal = computed(() => 
    items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )

  const discount = computed(() => {
    if (!coupon.value) return 0
    if (coupon.value.type === 'percentage') {
      return subtotal.value * (coupon.value.value / 100)
    }
    return coupon.value.value
  })

  const total = computed(() => Math.max(0, subtotal.value - discount.value))

  const isEmpty = computed(() => items.value.length === 0)

  // Actions
  const saveToStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
    if (coupon.value) {
      localStorage.setItem('coupon', JSON.stringify(coupon.value))
    } else {
      localStorage.removeItem('coupon')
    }
  }

  const addItem = (product) => {
    const existingItem = items.value.find(item => item._id === product._id)
    if (existingItem) {
      existingItem.quantity += product.quantity || 1
    } else {
      items.value.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity: product.quantity || 1,
        category: product.category
      })
    }
    saveToStorage()
  }

  const removeItem = (productId) => {
    items.value = items.value.filter(item => item._id !== productId)
    saveToStorage()
  }

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item._id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
        saveToStorage()
      }
    }
  }

  const applyCoupon = (couponData) => {
    coupon.value = couponData
    saveToStorage()
  }

  const removeCoupon = () => {
    coupon.value = null
    saveToStorage()
  }

  const clearCart = () => {
    items.value = []
    coupon.value = null
    saveToStorage()
  }

  return {
    items,
    coupon,
    itemCount,
    subtotal,
    discount,
    total,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart
  }
})
