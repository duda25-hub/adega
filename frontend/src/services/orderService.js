import api from './api'

export const orderService = {
  async create(orderData) {
    const response = await api.post('/orders', orderData)
    return response.data
  },

  async getMyOrders() {
    const response = await api.get('/orders/my-orders')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  async getAll(params = {}) {
    const response = await api.get('/orders', { params })
    return response.data
  },

  async updateStatus(id, status) {
    const response = await api.put(`/orders/${id}/status`, { status })
    return response.data
  }
}
