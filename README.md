# TechStore - Full-Stack E-Commerce Application

A modern, full-featured e-commerce application built with **Express.js**, **PostgreSQL**, and **Vanilla JavaScript**. Features user authentication, shopping cart, product management, and order processing.

## 📋 Features

✅ **User Authentication**
- User registration and login with JWT
- Secure password hashing with bcryptjs
- Persistent user sessions

✅ **Product Management**
- Browse products with search and filter
- Detailed product pages
- Product categories
- Stock management

✅ **Shopping Cart**
- Add/remove items
- Adjust quantities
- Real-time cart updates
- Tax calculation (10%)
- Persistent cart storage

✅ **Order Processing**
- Checkout with cart items
- Order history
- Order tracking
- Automatic inventory updates

✅ **Database**
- PostgreSQL with structured schema
- Users, Products, Orders, and Order Items tables
- Sample products pre-loaded

✅ **Modern UI**
- Responsive design (mobile-friendly)
- Smooth animations and transitions
- Beautiful gradient aesthetics
- Intuitive user interface

## 🛠️ Technology Stack

**Backend:**
- Node.js & Express.js
- PostgreSQL
- JWT (JSON Web Tokens)
- bcryptjs

**Frontend:**
- HTML5
- CSS3 (with animations & gradients)
- Vanilla JavaScript (ES6+)
- Fetch API

**Database:**
- PostgreSQL (8.0+)

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Step 1: Setup PostgreSQL Database

```bash
# Create a new PostgreSQL database
createdb ecommerce_db

# You can also do this in pgAdmin or psql:
# CREATE DATABASE ecommerce_db;
```

### Step 2: Clone & Install Dependencies

```bash
# Navigate to project directory
cd ecommerce-app

# Install dependencies
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db

# JWT Secret (change this in production!)
JWT_SECRET=your-secret-key-change-in-production
```

### Step 4: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run at `http://localhost:3000`

## 🚀 Usage

1. **Open the application** in your browser: `http://localhost:3000`

2. **Register/Login**
   - Create a new account using the Register button
   - Or login with existing credentials

3. **Browse Products**
   - Browse all products on the home page
   - Use search bar to find specific products
   - Filter by category

4. **View Product Details**
   - Click "View" button on any product
   - See full description, price, and stock
   - Add to cart with desired quantity

5. **Shopping Cart**
   - Click cart icon to open sidebar
   - Adjust quantities or remove items
   - See real-time totals with tax calculation

6. **Checkout**
   - Click "Proceed to Checkout"
   - Must be logged in to place order
   - Order is processed and saved to database

7. **View Orders**
   - Click "Orders" in navigation
   - See all past orders with items and totals
   - Track order status

## 📁 Project Structure

```
ecommerce-app/
├── server.js                 # Main Express server & API routes
├── package.json             # Dependencies
├── public/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── styles.css      # Complete styling
│   └── js/
│       └── app.js          # Frontend logic & API calls
└── README.md               # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details

### Orders
- `POST /api/orders` - Create new order (requires auth)
- `GET /api/orders` - Get user's orders (requires auth)

## 🗄️ Database Schema

### Users Table
```sql
- id (PRIMARY KEY)
- username (UNIQUE)
- email (UNIQUE)
- password (hashed)
- created_at
```

### Products Table
```sql
- id (PRIMARY KEY)
- name
- description
- price
- stock
- image_url (emoji)
- category
- created_at
```

### Orders Table
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- total_price
- status
- created_at
```

### Order Items Table
```sql
- id (PRIMARY KEY)
- order_id (FOREIGN KEY)
- product_id (FOREIGN KEY)
- quantity
- price
```

## 🎨 Design Features

- **Modern Color Scheme**: Sophisticated blues and coral accents
- **Smooth Animations**: Staggered reveals and hover effects
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Clear Typography**: Clean sans-serif fonts with hierarchy
- **Gradient Elements**: Elegant gradient backgrounds
- **Shadow Depth**: Layered shadow effects for visual hierarchy

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- SQL injection prevention via parameterized queries
- CORS enabled for safety

## 🐛 Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Ensure PostgreSQL is running and credentials in `.env` are correct

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution**: Change PORT in `.env` or kill process using port 3000

### Products Not Loading
**Solution**: 
1. Clear browser cache
2. Check browser console for errors
3. Verify server is running on correct port

### Cart Data Lost on Refresh
**Solution**: Clear browser's local storage is working correctly. Refresh and test again.

## 📈 Future Enhancements

- Payment gateway integration (Stripe/PayPal)
- Email notifications for orders
- Admin dashboard for product management
- Product reviews and ratings
- Wishlist functionality
- Advanced filtering and sorting
- Inventory notifications
- Email verification for sign-up

## 📝 Sample Products

The database comes pre-loaded with 6 sample products:
1. Wireless Headphones - $79.99
2. USB-C Cable - $12.99
3. Phone Stand - $15.99
4. Bluetooth Speaker - $49.99
5. Screen Protector - $9.99
6. Power Bank - $34.99

## 🤝 Contributing

Feel free to fork and submit pull requests for any improvements!

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 💡 Tips for Development

1. **Testing API**: Use Postman or curl to test endpoints
2. **Database Debugging**: Use pgAdmin or psql CLI
3. **Frontend Debugging**: Use Chrome DevTools (F12)
4. **CORS Issues**: Frontend must be served from same origin or add CORS headers
5. **Token Expiration**: Implement refresh tokens for production

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify database connection
3. Ensure all dependencies are installed
4. Check that ports are not blocked by firewall

Enjoy building! 🚀
