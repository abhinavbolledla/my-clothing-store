# 👗 StyleHub — Mini E-Commerce Clothing Store

A full-stack **MERN** (MongoDB, Express, React, Node.js) e-commerce platform for a clothing store, featuring a customer-facing storefront and a complete admin panel.

---

## ✨ Features

### 🛍️ Customer Module
| Feature | Description |
|---|---|
| Authentication | JWT-based register & login |
| Browse Products | Filter by category (Men/Women/Kids), search by name |
| Product Detail | Size picker, quantity selector, add to cart |
| Shopping Cart | Add, update quantity, remove items, view total |
| Checkout | Shipping address form with order placement |
| Order History | Track all past orders with status & item details |

### 🔧 Admin Module
| Feature | Description |
|---|---|
| Admin Login | Role-based access (admin/user) |
| Dashboard | Live stats: total orders, revenue, pending orders, low stock |
| Product CRUD | Add, edit, delete, show/hide products |
| Live Preview | See product card as you type in the add/edit form |
| Order Management | View all orders, update status (pending → delivered) |
| Low Stock Alerts | Dashboard highlights products with ≤5 units left |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Vanilla CSS |
| Backend | Node.js + Express.js (MVC) |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| HTTP Client | Axios (with interceptors) |
| CSS | Vanilla CSS (custom properties, no Tailwind) |
| Fonts | Google Fonts — Inter |

---

## 📁 Project Structure

```
my-clothing-store/
├── server/
│   ├── config/        → MongoDB connection
│   ├── models/        → User, Product, Cart, Order schemas
│   ├── controllers/   → Business logic
│   ├── routes/        → API endpoints
│   ├── middleware/     → JWT auth, error handler
│   ├── seed/          → Sample data seed script
│   ├── .env           → Environment variables
│   └── server.js      → Express entry point
│
└── client/
    └── src/
        ├── api/           → Axios instance
        ├── components/    → Navbar, Footer, ProductCard, Guards
        ├── context/       → AuthContext (JWT state)
        └── pages/
            ├── Home, Products, ProductDetail, Cart, Orders
            ├── Login, Register
            └── admin/ → Dashboard, Products, Orders, Forms
```

---

## 🚀 Setup & Running

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone / Open Project

```bash
cd "d:\Abhinav Harshith\my-clothing-store"
```

### 2. Setup & Start the Backend

```bash
cd server
npm install

# 📝 Edit .env if needed (MONGO_URI is set to localhost by default)

# Optional: Seed sample data (12 products + 2 users)
npm run seed

# Start backend server (port 5000)
npm run dev
```

### 3. Setup & Start the Frontend

```bash
cd ../client
npm install

# Start frontend dev server (port 5173)
npm run dev
```

### 4. Open in Browser

- **Store:** http://localhost:5173
- **Admin:** http://localhost:5173/admin

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👤 Customer | user@store.com | user123 |
| 🔐 Admin | admin@store.com | admin123 |

> Run `npm run seed` inside the `server/` directory first to create these accounts.

---

## 🌐 REST API Reference

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |

### Products
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| GET | `/api/products/admin/all` | Admin |
| POST | `/api/products` | Admin |
| PUT | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |

### Cart
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/cart` | Private |
| POST | `/api/cart` | Private |
| PUT | `/api/cart/:itemId` | Private |
| DELETE | `/api/cart/:itemId` | Private |
| DELETE | `/api/cart` | Private |

### Orders
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/orders` | Private |
| GET | `/api/orders/my` | Private |
| GET | `/api/orders` | Admin |
| PUT | `/api/orders/:id` | Admin |
| GET | `/api/orders/stats/dashboard` | Admin |

---

## 🗄️ Database Schemas

```
User    → name, email, password(hashed), role, timestamps
Product → name, description, category, price, sizes[], stock, image, isActive
Cart    → user(ref), items[{product, size, quantity}]
Order   → user(ref), items[snapshot], totalAmount, shippingAddress, status, paymentMethod
```

---

## 📦 Environment Variables (server/.env)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/clothing_store
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
```

---

## 🎨 Design System

- **Primary color:** `#6C47FF` (violet)
- **Accent:** `#FF6B6B` (coral)
- **Typography:** Inter (Google Fonts)
- **Components:** Cards, modals, toasts, size chips, status badges
- **Admin theme:** Dark sidebar (`#1e293b`) with light main content

---

Built with ❤️ using the **MERN Stack** — MongoDB · Express · React · Node.js
