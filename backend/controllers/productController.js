const Product = require('../models/Product');

// ─── @desc    Get all products (with optional category filter & search)
// ─── @route   GET /api/products
// ─── @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;

    // Build dynamic query filter
    const filter = { isActive: true };

    if (category && ['Men', 'Women', 'Kids'].includes(category)) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum  = parseInt(page);
    const pageSize = parseInt(limit);
    const skip     = (pageNum - 1) * pageSize;

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      currentPage: pageNum,
      totalPages:  Math.ceil(total / pageSize),
      totalProducts: total,
    });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get single product by ID
// ─── @route   GET /api/products/:id
// ─── @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Create a new product
// ─── @route   POST /api/products
// ─── @access  Admin only
const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, sizes, stock, image } = req.body;

    const product = await Product.create({
      name,
      description,
      category,
      price,
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      stock,
      image,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Update a product
// ─── @route   PUT /api/products/:id
// ─── @access  Admin only
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update only the fields provided in the request body
    const { name, description, category, price, sizes, stock, image, isActive } = req.body;

    if (name        !== undefined) product.name        = name;
    if (description !== undefined) product.description = description;
    if (category    !== undefined) product.category    = category;
    if (price       !== undefined) product.price       = price;
    if (sizes       !== undefined) product.sizes       = sizes;
    if (stock       !== undefined) product.stock       = stock;
    if (image       !== undefined) product.image       = image;
    if (isActive    !== undefined) product.isActive    = isActive;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Delete (soft-delete) a product
// ─── @route   DELETE /api/products/:id
// ─── @access  Admin only
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Soft delete: set isActive to false instead of removing from DB
    product.isActive = false;
    await product.save();

    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── @desc    Get all products including inactive ones (admin view)
// ─── @route   GET /api/products/admin/all
// ─── @access  Admin only
const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
};
