const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes require authentication
router.use(protect);

router.route('/')
  .get(getCart)       // GET    /api/cart
  .post(addToCart)    // POST   /api/cart
  .delete(clearCart); // DELETE /api/cart

router.route('/:itemId')
  .put(updateCartItem)    // PUT    /api/cart/:itemId
  .delete(removeCartItem); // DELETE /api/cart/:itemId

module.exports = router;
