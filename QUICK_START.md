# 🚀 Quick Start Guide - TechStore E-Commerce

Get up and running in 5 minutes!

## Prerequisites Checklist
- [ ] Node.js installed (check with `node -v`)
- [ ] PostgreSQL installed and running (check with `psql --version`)
- [ ] npm installed (check with `npm -v`)

## Step-by-Step Setup

### 1️⃣ Create PostgreSQL Database (30 seconds)

**Using psql command line:**
```bash
psql -U postgres
CREATE DATABASE ecommerce_db;
\q
```

**Or using pgAdmin GUI:**
- Open pgAdmin
- Right-click "Databases"
- Create → Database
- Name: `ecommerce_db`
- Click Save

### 2️⃣ Setup Project (1 minute)

```bash
# Navigate to project directory
cd ecommerce-app

# Copy environment template
cp .env.example .env

# Install dependencies
npm install
```

### 3️⃣ Configure Database Connection (1 minute)

Edit `.env` file with your database credentials:

```env
DB_USER=postgres          # Your PostgreSQL username
DB_PASSWORD=postgres      # Your PostgreSQL password
DB_HOST=localhost         # Database host
DB_PORT=5432             # Default PostgreSQL port
DB_NAME=ecommerce_db     # Database name we created
```

**Default credentials (if unchanged during PostgreSQL install):**
```
User: postgres
Password: postgres
Host: localhost
Port: 5432
```

### 4️⃣ Start the Server (1 minute)

```bash
# Development mode (recommended - auto-reloads on changes)
npm run dev

# You should see:
# ✅ Database initialized successfully
# 🚀 Server running on http://localhost:3000
```

### 5️⃣ Open in Browser (30 seconds)

Navigate to: **http://localhost:3000**

You're done! 🎉

---

## First Steps in the App

1. **Register a new account**
   - Click "Register" button
   - Fill in details
   - Create account

2. **Browse products**
   - You'll see 6 sample products
   - Search or filter by category

3. **Add to cart**
   - Click "View" on a product
   - Adjust quantity
   - Click "Add to Cart"

4. **Checkout**
   - Click cart icon
   - Click "Proceed to Checkout"
   - Order will be placed!

5. **View orders**
   - Click "Orders" in navigation
   - See your purchase history

---

## Troubleshooting

### Error: "connect ECONNREFUSED"
**PostgreSQL not running!**
```bash
# Windows: Start PostgreSQL service
# Mac: brew services start postgresql
# Linux: sudo service postgresql start
```

### Error: "EADDRINUSE: address already in use"
**Port 3000 is in use!**
```bash
# Change port in .env file
PORT=3001
```

### Error: "password authentication failed"
**Wrong database credentials!**
- Check username and password in `.env`
- Verify in PostgreSQL

### Products not showing?
- Refresh page (Ctrl+F5 or Cmd+Shift+R)
- Open DevTools (F12) and check Console tab
- Verify server is running

---

## Project Structure at a Glance

```
ecommerce-app/
├── server.js          ← Express backend & API
├── package.json       ← Dependencies
├── .env               ← Your configuration (create from .env.example)
└── public/            ← Frontend files
    ├── index.html     ← Main page
    ├── css/styles.css ← Styling
    └── js/app.js      ← JavaScript logic
```

---

## Key Files Explained

| File | Purpose |
|------|---------|
| `server.js` | Express server, database connection, all API routes |
| `public/index.html` | HTML structure for the UI |
| `public/css/styles.css` | All styling and animations |
| `public/js/app.js` | JavaScript for interactivity and API calls |
| `.env` | Configuration (database, ports, secrets) |

---

## Sample Test Data

The app automatically loads 6 products:
- 🎧 Wireless Headphones ($79.99)
- 🔌 USB-C Cable ($12.99)
- 📱 Phone Stand ($15.99)
- 🔊 Bluetooth Speaker ($49.99)
- 📺 Screen Protector ($9.99)
- 🔋 Power Bank ($34.99)

---

## Common Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Install dependencies
npm install

# Check if PostgreSQL is running
psql --version

# Connect to database
psql -U postgres -d ecommerce_db
```

---

## Next Steps

✅ App working? Great!

Now you can:
- **Modify products** - Edit sample data in `server.js`
- **Customize styling** - Edit `public/css/styles.css`
- **Add features** - Expand `server.js` and `public/js/app.js`
- **Connect payment** - Add Stripe/PayPal integration
- **Deploy** - Use Heroku, AWS, or Railway

---

## Need Help?

1. **Check the browser console** (F12)
2. **Check server logs** (terminal)
3. **Verify `.env` file** (correct credentials?)
4. **Restart everything** (stop server, close DB, start fresh)

---

**Happy coding! 🚀**
