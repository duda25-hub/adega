const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware de autenticação JWT
 * Verifica token e anexa usuário à requisição
 */
const authenticate = async (req, res, next) => {
  try {
    // Extrair token do header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acesso não autorizado. Token não fornecido.' 
      });
    }

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuário não encontrado.' 
      });
    }

    // Anexar usuário à requisição
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expirado.' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Erro na autenticação.' 
    });
  }
};

/**
 * Middleware de autorização admin
 * Garante que apenas administradores acessem a rota
 */
const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Acesso restrito a administradores.' 
    });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
