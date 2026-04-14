const Cart = require('../models/Cart');
const Product = require('../models/Product');

// ─── @desc    Get current user's cart
// ─── @route   GET /api/cart
// ─── @access  Private
const getCart = async (req, res, next) => {
  try {
    // Populate product details for each cart item
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price image stock isActive'
    );

    if (!cart) {
      // Return an empty cart if none exists yet
      return res.json({ _id: null, user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Add item to cart (or update quantity if already exists)
// ─── @route   POST /api/cart
// ─── @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, size, quantity = 1 } = req.body;

    // Validate product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Only ${product.stock} units available in stock` });
    }

    // Find or create cart for the user
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if same product + size combination already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity if item already in cart
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({ product: productId, size, quantity });
    }

    await cart.save();

    // Return populated cart
    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price image stock isActive'
    );
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update quantity of a specific cart item
// ─── @route   PUT /api/cart/:itemId
// ─── @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Validate stock availability
    const product = await Product.findById(item.product);
    if (product && product.stock < quantity) {
      return res.status(400).json({ message: `Only ${product.stock} units available` });
    }

    item.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price image stock isActive'
    );
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Remove a specific item from cart
// ─── @route   DELETE /api/cart/:itemId
// ─── @access  Private
const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out the item to remove
    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      'items.product',
      'name price image stock isActive'
    );
    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Clear entire cart
// ─── @route   DELETE /api/cart
// ─── @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
