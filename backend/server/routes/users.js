const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

/**
 * Rotas de Usuários
 * Base: /api/users
 */

// Admin only
router.get('/', authenticate, authorizeAdmin, userController.getUsers);
router.get('/:id', authenticate, authorizeAdmin, userController.getUserById);
router.put('/:id/role', authenticate, authorizeAdmin, userController.updateRole);
router.delete('/:id', authenticate, authorizeAdmin, userController.deleteUser);

module.exports = router;
