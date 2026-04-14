const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// ─── User Routes (Private) ─────────────────────────────────────────────────────
router.post('/',     protect, placeOrder);    // POST   /api/orders   — place order
router.get('/my',    protect, getMyOrders);   // GET    /api/orders/my — my order history
router.get('/:id',   protect, getOrderById);  // GET    /api/orders/:id

// ─── Admin Routes ──────────────────────────────────────────────────────────────
router.get('/stats/dashboard', protect, admin, getDashboardStats); // GET /api/orders/stats/dashboard
router.get('/',          protect, admin, getAllOrders);             // GET /api/orders
router.put('/:id',       protect, admin, updateOrderStatus);       // PUT /api/orders/:id

module.exports = router;
