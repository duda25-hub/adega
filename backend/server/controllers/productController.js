const Product = require('../models/Product');

/**
 * @desc    Listar todos os produtos
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      search, 
      sort, 
      page = 1, 
      limit = 12,
      featured 
    } = req.query;

    // Construir query
    const query = {};

    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Construir sort
    let sortOption = {};
    if (sort === 'price-asc') sortOption.price = 1;
    else if (sort === 'price-desc') sortOption.price = -1;
    else if (sort === 'name') sortOption.name = 1;
    else if (sort === 'rating') sortOption.rating = -1;
    else sortOption.createdAt = -1;

    // Paginação
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Buscar produtos por texto
 * @route   GET /api/products/search
 * @access  Public
 */
exports.searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({ success: true, products: [] });
    }

    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obter produto por ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obter produtos por categoria
 * @route   GET /api/products/category/:category
 * @access  Public
 */
exports.getProductsByCategory = async (req, res, next) => {
  try {
    const products = await Product.find({ category: req.params.category })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Criar produto
 * @route   POST /api/products
 * @access  Admin
 */
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Atualizar produto
 * @route   PUT /api/products/:id
 * @access  Admin
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Deletar produto
 * @route   DELETE /api/products/:id
 * @access  Admin
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.'
      });
    }

    res.json({
      success: true,
      message: 'Produto removido com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Adicionar avaliação
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.'
      });
    }

    // Verificar se usuário já avaliou
    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Você já avaliou este produto.'
      });
    }

    // Adicionar avaliação
    product.reviews.push({
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment
    });

    // Recalcular rating
    product.calculateRating();
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Avaliação adicionada com sucesso.'
    });
  } catch (error) {
    next(error);
  }
};
