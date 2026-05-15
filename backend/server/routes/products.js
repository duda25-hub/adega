const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const { productRules } = require('../middlewares/validators');

/**
 * Rotas de Produtos
 * Base: /api/products
 */

// Public routes
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);

// Protected routes - Admin only
router.post('/', authenticate, authorizeAdmin, productRules, productController.createProduct);
router.put('/:id', authenticate, authorizeAdmin, productRules, productController.updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, productController.deleteProduct);

// Reviews - Authenticated users
router.post('/:id/reviews', authenticate, productController.addReview);

module.exports = router;
