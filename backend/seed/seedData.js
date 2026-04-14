/**
 * Seed Script — Populates the database with:
 *  - 1 Admin user
 *  - 1 Regular user
 *  - 12 Sample clothing products (Men, Women, Kids)
 *
 * Usage: node seed/seedData.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load .env from server directory (script is run from server/ folder)
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const User    = require('../models/User');
const Product = require('../models/Product');
const Cart    = require('../models/Cart');
const Order   = require('../models/Order');

// ─── Sample Users ──────────────────────────────────────────────────────────────
const users = [
  {
    name:     'Admin User',
    email:    'admin@store.com',
    password: 'admin123',
    role:     'admin',
  },
  {
    name:     'John Doe',
    email:    'user@store.com',
    password: 'user123',
    role:     'user',
  },
];

// ─── Sample Products ───────────────────────────────────────────────────────────
const products = [
  // ── Men ──
  {
    name:        'Classic White Oxford Shirt',
    description: 'A timeless white Oxford shirt perfect for formal and casual occasions. Made from 100% cotton breathable fabric.',
    category:    'Men',
    price:       1299,
    sizes:       ['S', 'M', 'L', 'XL'],
    stock:       45,
    image:       'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop',
  },
  {
    name:        'Slim Fit Dark Denim Jeans',
    description: 'Straight-cut slim fit jeans in a dark indigo wash. Durable denim with 2% elastane for comfort.',
    category:    'Men',
    price:       2499,
    sizes:       ['S', 'M', 'L', 'XL'],
    stock:       30,
    image:       'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
  },
  {
    name:        'Casual Graphic Tee',
    description: 'Relaxed-fit graphic t-shirt with a custom print. Pre-shrunk, soft jersey cotton.',
    category:    'Men',
    price:       599,
    sizes:       ['S', 'M', 'L', 'XL'],
    stock:       80,
    image:       'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
  },
  {
    name:        'Urban Bomber Jacket',
    description: 'Lightweight bomber jacket with ribbed cuffs and collar. Perfect for layering in cooler weather.',
    category:    'Men',
    price:       3499,
    sizes:       ['M', 'L', 'XL'],
    stock:       20,
    image:       'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=500&fit=crop',
  },

  // ── Women ──
  {
    name:        'Floral Wrap Midi Dress',
    description: 'Elegant wrap-style midi dress with a vibrant floral print. Flowy chiffon fabric ideal for events.',
    category:    'Women',
    price:       2199,
    sizes:       ['S', 'M', 'L'],
    stock:       35,
    image:       'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
  },
  {
    name:        'High-Waist Linen Trousers',
    description: 'Breathable high-waist linen trousers with wide-leg cut. Perfect for office and casual wear.',
    category:    'Women',
    price:       1799,
    sizes:       ['S', 'M', 'L', 'XL'],
    stock:       40,
    image:       'https://images.unsplash.com/photo-1594938298603-f7748a4e5adc?w=400&h=500&fit=crop',
  },
  {
    name:        'Ribbed Crop Top',
    description: 'Fitted ribbed crop top in neutral tones. Versatile everyday essential that pairs with anything.',
    category:    'Women',
    price:       799,
    sizes:       ['S', 'M', 'L'],
    stock:       60,
    image:       'https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=400&h=500&fit=crop',
  },
  {
    name:        'Denim Jacket — Washed Blue',
    description: 'Classic washed blue denim jacket with a relaxed fit and button-up front. A wardrobe staple.',
    category:    'Women',
    price:       2799,
    sizes:       ['S', 'M', 'L', 'XL'],
    stock:       25,
    image:       'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400&h=500&fit=crop',
  },

  // ── Kids ──
  {
    name:        'Dinosaur Print Tee — Kids',
    description: 'Fun and playful dinosaur print t-shirt for kids. Soft cotton, easy wash, colourfast print.',
    category:    'Kids',
    price:       499,
    sizes:       ['S', 'M', 'L'],
    stock:       50,
    image:       'https://images.unsplash.com/photo-1622290319238-14daa793163d?w=400&h=500&fit=crop',
  },
  {
    name:        'Stretchy Jogger Pants — Kids',
    description: 'Comfortable elastic-waist jogger pants for active kids. Soft fleece interior lining.',
    category:    'Kids',
    price:       699,
    sizes:       ['S', 'M', 'L'],
    stock:       45,
    image:       'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
  },
  {
    name:        'Rainbow Hoodie — Kids',
    description: 'Bright rainbow-striped hoodie with a kangaroo pocket. Warm and machine washable.',
    category:    'Kids',
    price:       999,
    sizes:       ['S', 'M', 'L'],
    stock:       30,
    image:       'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=500&fit=crop',
  },
  {
    name:        'Frilled Skirt Set — Girls',
    description: 'Adorable frilled skirt and matching top set for girls. Comfortable, breathable cotton blend.',
    category:    'Kids',
    price:       899,
    sizes:       ['S', 'M', 'L'],
    stock:       20,
    image:       'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
  },
];

// ─── Seed Function ─────────────────────────────────────────────────────────────
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Hash passwords and create users
    const createdUsers = await User.insertMany(
      await Promise.all(
        users.map(async (u) => ({
          ...u,
          password: await bcrypt.hash(u.password, 10),
        }))
      )
    );
    console.log(`👤 Inserted ${createdUsers.length} users`);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`👕 Inserted ${createdProducts.length} products`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('──────────────────────────────────');
    console.log('🔐 Admin Login:  admin@store.com / admin123');
    console.log('👤 User Login:   user@store.com  / user123');
    console.log('──────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
