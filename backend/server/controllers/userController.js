const User = require('../models/User');

/**
 * @desc    Listar todos os usuários
 * @route   GET /api/users
 * @access  Admin
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obter usuário por ID
 * @route   GET /api/users/:id
 * @access  Admin
 */
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Atualizar função do usuário
 * @route   PUT /api/users/:id/role
 * @access  Admin
 */
exports.updateRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deletar usuário
 * @route   DELETE /api/users/:id
 * @access  Admin
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    res.json({
      success: true,
      message: 'Usuário removido com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};
