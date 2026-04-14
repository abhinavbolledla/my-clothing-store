const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// ─── Public Routes ─────────────────────────────────────────────────────────────
router.get('/', getProducts);                  // GET /api/products?category=Men&search=shirt

// ─── Admin-Only Routes ─────────────────────────────────────────────────────────
router.get('/admin/all', protect, admin, getAllProductsAdmin); // GET /api/products/admin/all

router.route('/:id')
  .get(getProductById)                         // GET /api/products/:id (public)
  .put(protect, admin, updateProduct)          // PUT /api/products/:id (admin)
  .delete(protect, admin, deleteProduct);      // DELETE /api/products/:id (admin)

router.post('/', protect, admin, createProduct); // POST /api/products (admin)

module.exports = router;
