import api from './api'

export const userService = {
  async getAll() {
    const response = await api.get('/users')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async updateRole(id, role) {
    const response = await api.put(`/users/${id}/role`, { role })
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/users/${id}`)
    return response.data
  }
}
