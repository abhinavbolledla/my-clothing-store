const mongoose = require('mongoose');

// Schema for a single item in the order (snapshot of product at purchase time)
const orderItemSchema = new mongoose.Schema({
  // Reference to original product (for linking purposes)
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },

  // Snapshot fields — saved so order history is accurate even if product changes
  name:  { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  size:  { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    // Customer who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // List of ordered items with price snapshot
    items: [orderItemSchema],

    // Calculated order total (sum of price * quantity for all items)
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Shipping address details
    shippingAddress: {
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      pincode: { type: String, required: true },
    },

    // Order lifecycle status
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },

    // Payment method (for future payment gateway integration)
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery',
    },
  },
  {
    timestamps: true, // createdAt = order date
  }
);

module.exports = mongoose.model('Order', orderSchema);
