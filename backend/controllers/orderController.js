const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ─── @desc    Place a new order from the user's current cart
// ─── @route   POST /api/orders
// ─── @access  Private
const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'Cash on Delivery' } = req.body;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Fetch the user's populated cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty — add items before placing order' });
    }

    // Build order items from cart (snapshot the current product details)
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product;

      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product "${item.product?.name}" is no longer available` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}" — only ${product.stock} left`,
        });
      }

      orderItems.push({
        product:  product._id,
        name:     product.name,
        image:    product.image,
        price:    product.price,
        size:     item.size,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create the order document
    const order = await Order.create({
      user:            req.user._id,
      items:           orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    // Clear the cart after successful order placement
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get logged-in user's order history
// ─── @route   GET /api/orders/my
// ─── @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get a single order by ID (user must own it, or be admin)
// ─── @route   GET /api/orders/:id
// ─── @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Allow access only to the order owner or an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get ALL orders (admin only)
// ─── @route   GET /api/orders
// ─── @access  Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update order status (admin only)
// ─── @route   PUT /api/orders/:id
// ─── @access  Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get dashboard stats (admin only)
// ─── @route   GET /api/orders/stats
// ─── @access  Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenue, pendingOrders] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.countDocuments({ status: 'pending' }),
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
};
