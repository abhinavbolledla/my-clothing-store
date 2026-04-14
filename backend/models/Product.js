const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Product display name
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    // Detailed product description
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    // Clothing category
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Men', 'Women', 'Kids'],
    },

    // Price in rupees (or your local currency)
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    // Available sizes for this product
    sizes: {
      type: [String],
      enum: ['S', 'M', 'L', 'XL'],
      default: ['S', 'M', 'L', 'XL'],
    },

    // Total stock quantity across all sizes
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },

    // URL or path to product image
    image: {
      type: String,
      default: 'https://via.placeholder.com/400x500?text=No+Image',
    },

    // Is the product currently listed/visible in the store
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
