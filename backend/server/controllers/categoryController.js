const Category = require('../models/Category');

/**
 * @desc    Listar todas as categorias
 * @route   GET /api/categories
 * @access  Public
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obter categoria por ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada.'
      });
    }

    res.json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Criar categoria
 * @route   POST /api/categories
 * @access  Admin
 */
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Atualizar categoria
 * @route   PUT /api/categories/:id
 * @access  Admin
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada.'
      });
    }

    res.json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deletar categoria
 * @route   DELETE /api/categories/:id
 * @access  Admin
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada.'
      });
    }

    res.json({
      success: true,
      message: 'Categoria removida com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};
