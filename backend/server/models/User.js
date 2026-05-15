const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schema do Usuário
 * Gerencia autenticação, perfil, endereços e favoritos
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome não pode exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'E-mail inválido']
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
    select: false // Não retorna senha em queries por padrão
  },
  phone: {
    type: String,
    trim: true
  },
  addresses: [{
    cep: String,
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true // Adiciona createdAt e updatedAt
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  // Só hash se a senha foi modificada
  if (!this.isModified('password')) return next();

  // Gerar salt e hash
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
