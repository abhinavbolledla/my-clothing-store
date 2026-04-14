const mongoose = require('mongoose');

// Schema for a single item inside the cart
const cartItemSchema = new mongoose.Schema(
  {
    // Reference to the Product document
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    // Selected size for this cart item
    size: {
      type: String,
      required: true,
      enum: ['S', 'M', 'L', 'XL'],
    },

    // Number of units added to cart
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
  },
  { _id: true } // Each cart item gets its own _id for update/delete operations
);

const cartSchema = new mongoose.Schema(
  {
    // Owner of this cart (one cart per user)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },

    // Array of cart items
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cart', cartSchema);
