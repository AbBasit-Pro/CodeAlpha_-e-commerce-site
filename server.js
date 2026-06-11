const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Database Connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ecommerce_db'
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return next();

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ==================== DATABASE INITIALIZATION ====================
async function initializeDatabase() {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL,
        image_url VARCHAR(255),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id),
        total_price DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id),
        product_id INT REFERENCES products(id),
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `);

    // Insert sample products if table is empty
    const result = await pool.query('SELECT COUNT(*) FROM products');
    if (parseInt(result.rows[0].count) === 0) {
      const sampleProducts = [
        { name: 'Wireless Headphones', description: 'Premium sound quality', price: 79.99, stock: 50, category: 'Electronics', image: '🎧' },
        { name: 'USB-C Cable', description: 'Fast charging cable', price: 12.99, stock: 200, category: 'Accessories', image: '🔌' },
        { name: 'Phone Stand', description: 'Adjustable phone holder', price: 15.99, stock: 100, category: 'Accessories', image: '📱' },
        { name: 'Bluetooth Speaker', description: 'Portable wireless speaker', price: 49.99, stock: 75, category: 'Electronics', image: '🔊' },
        { name: 'Screen Protector', description: 'Tempered glass protector', price: 9.99, stock: 300, category: 'Accessories', image: '📺' },
        { name: 'Power Bank', description: '20000mAh capacity', price: 34.99, stock: 120, category: 'Electronics', image: '🔋' }
      ];

      for (const product of sampleProducts) {
        await pool.query(
          'INSERT INTO products (name, description, price, stock, category, image_url) VALUES ($1, $2, $3, $4, $5, $6)',
          [product.name, product.description, product.price, product.stock, product.category, product.image]
        );
      }
      console.log('✅ Sample products inserted');
    }

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;

    const result = await pool.query(
      `INSERT INTO products (name, description, price, stock, category, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, stock, category, image_url]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const token = jwt.sign({ id: result.rows[0].id, username }, JWT_SECRET);
    res.json({ token, user: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PRODUCT ROUTES ====================
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SHOPPING CART & ORDER ROUTES ====================
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Please login first' });
    }

    const { items, totalPrice } = req.body;

    // Create order
    const orderResult = await pool.query(
      'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING id',
      [req.user.id, totalPrice, 'pending']
    );

    const orderId = orderResult.rows[0].id;

    // Add order items
    for (const item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [orderId, item.id, item.quantity, item.price]
      );

      // Update product stock
      await pool.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.id]
      );
    }

    res.json({ orderId, status: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Please login first' });
    }

    const result = await pool.query(
      `SELECT o.*, json_agg(json_build_object('product_id', oi.product_id, 'quantity', oi.quantity, 'price', oi.price, 'name', p.name)) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== INITIALIZATION ====================
initializeDatabase();

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API ready for requests\n`);
});

module.exports = app;
