const mongoose = require('mongoose');

/**
 * Schema de Avaliação (Review)
 * Subdocumento incorporado no produto
 */
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

/**
 * Schema do Produto
 * Gerencia todos os produtos da adega com avaliações
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true,
    maxlength: [200, 'Nome não pode exceder 200 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    maxlength: [2000, 'Descrição não pode exceder 2000 caracteres']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Categoria é obrigatória']
  },
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo']
  },
  images: [{
    type: String,
    required: [true, 'Pelo menos uma imagem é obrigatória']
  }],
  stock: {
    type: Number,
    required: [true, 'Estoque é obrigatório'],
    min: [0, 'Estoque não pode ser negativo'],
    default: 0
  },
  reviews: [reviewSchema],
  harmonization: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },
  alcoholContent: {
    type: Number,
    min: 0,
    max: 100
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índices para busca eficiente
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ featured: 1 });

// Virtual para calcular rating médio
productSchema.methods.calculateRating = function() {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
    return;
  }

  const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = total / this.reviews.length;
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);