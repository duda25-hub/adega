const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const { orderRules } = require('../middlewares/validators');

/**
 * Rotas de Pedidos
 * Base: /api/orders
 */

// User routes
router.post('/', authenticate, orderRules, orderController.createOrder);
router.get('/my-orders', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getOrderById);

// Admin routes
router.get('/', authenticate, authorizeAdmin, orderController.getAllOrders);
router.put('/:id/status', authenticate, authorizeAdmin, orderController.updateStatus);

module.exports = router;
