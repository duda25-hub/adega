const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc    Criar novo pedido
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { products, totalAmount, shippingAddress, paymentMethod, coupon } = req.body;

    // Validar estoque
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Produto não encontrado.`
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}`
        });
      }
    }

    // Criar pedido
    const order = await Order.create({
      user: req.user._id,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      coupon
    });

    // Atualizar estoque
    for (const item of products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Popular produtos para resposta
    await order.populate('products.product');
    await order.populate('user', 'name email');

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Listar pedidos do usuário logado
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'name images price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obter pedido por ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.product')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado.'
      });
    }

    // Verificar se usuário é dono do pedido ou admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado.'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Listar todos os pedidos (Admin)
 * @route   GET /api/orders
 * @access  Admin
 */
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate('products.product', 'name images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
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
 * @desc    Atualizar status do pedido
 * @route   PUT /api/orders/:id/status
 * @access  Admin
 */
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('products.product').populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado.'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};
