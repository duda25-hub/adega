/**
 * Middleware de tratamento de erros global
 * Padroniza respostas de erro da API
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Erro:', err);

  // Erro de ID inválido do Mongoose
  if (err.name === 'CastError') {
    const message = 'Recurso não encontrado.';
    error = { message, statusCode: 404 };
  }

  // Erro de campo duplicado
  if (err.code === 11000) {
    const message = 'Campo duplicado. Valor já existe.';
    error = { message, statusCode: 400 };
  }

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Erro de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido.';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Erro interno do servidor.'
  });
};

module.exports = errorHandler;
