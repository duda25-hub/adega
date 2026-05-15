const mongoose = require('mongoose');

/**
 * Schema de Item do Pedido
 * Subdocumento incorporado no pedido
 */
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true // Preço no momento da compra
  }
});

/**
 * Schema do Pedido
 * Gerencia todo o ciclo de vida de uma compra
 */
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    cep: { type: String, required: true },
    street: { type: String, required: true },
    number: { type: String, required: true },
    complement: String,
    neighborhood: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    enum: ['credit', 'pix', 'boleto'],
    required: true
  },
  coupon: {
    code: String,
    type: { type: String, enum: ['percentage', 'fixed'] },
    value: Number
  }
}, {
  timestamps: true
});

// Índices para consultas eficientes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);
