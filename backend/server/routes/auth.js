const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { registerRules, loginRules } = require('../middlewares/validators');

/**
 * Rotas de Autenticação
 * Base: /api/auth
 */

// Public routes
router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);
router.post('/forgot-password', authController.forgotPassword);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, authController.changePassword);

module.exports = router;
