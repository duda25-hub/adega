const { body, validationResult } = require('express-validator');

/**
 * Middleware para validar resultados
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Regras de validação para registro
 */
const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório')
    .isLength({ max: 100 }).withMessage('Nome muito longo'),
  body('email')
    .trim()
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Senha é obrigatória')
    .isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
  validate
];

/**
 * Regras de validação para login
 */
const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('E-mail é obrigatório')
    .isEmail().withMessage('E-mail inválido'),
  body('password')
    .notEmpty().withMessage('Senha é obrigatória'),
  validate
];

/**
 * Regras de validação para produto
 */
const productRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nome é obrigatório'),
  body('description')
    .trim()
    .notEmpty().withMessage('Descrição é obrigatória'),
  body('category')
    .notEmpty().withMessage('Categoria é obrigatória'),
  body('price')
    .notEmpty().withMessage('Preço é obrigatório')
    .isFloat({ min: 0 }).withMessage('Preço deve ser positivo'),
  body('stock')
    .notEmpty().withMessage('Estoque é obrigatório')
    .isInt({ min: 0 }).withMessage('Estoque deve ser positivo'),
  validate
];

/**
 * Regras de validação para pedido
 */
const orderRules = [
  body('products')
    .isArray({ min: 1 }).withMessage('Pelo menos um produto é obrigatório'),
  body('totalAmount')
    .notEmpty().withMessage('Total é obrigatório')
    .isFloat({ min: 0 }).withMessage('Total deve ser positivo'),
  body('shippingAddress')
    .notEmpty().withMessage('Endereço é obrigatório'),
  body('paymentMethod')
    .notEmpty().withMessage('Forma de pagamento é obrigatória')
    .isIn(['credit', 'pix', 'boleto']).withMessage('Forma de pagamento inválida'),
  validate
];

module.exports = {
  registerRules,
  loginRules,
  productRules,
  orderRules,
  validate
};
