const API = "http://localhost:3000/api";

// ================= STATE =================
let products = [];
let cart = [];
let token = localStorage.getItem("token") || null;
let user = JSON.parse(localStorage.getItem("user")) || null;

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    updateAuthUI();
    renderCart();
});

// ================= PRODUCTS =================
async function loadProducts() {
    const res = await fetch(`${API}/products`);
    products = await res.json();
    renderProducts(products);
}

function renderProducts(data) {
    const grid = document.getElementById("products-grid");
    grid.innerHTML = "";

    data.forEach(p => {
        grid.innerHTML += `
        <div class="product-card">
            <div class="product-img">${p.image_url || "📦"}</div>
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <h4>$${p.price}</h4>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
        `;
    });
}

// ================= FILTER =================
function filterProducts() {
    const search = document.getElementById("search-input").value.toLowerCase();
    const category = document.getElementById("category-filter").value;

    let filtered = products.filter(p => {
        return (
            p.name.toLowerCase().includes(search) &&
            (category === "" || p.category === category)
        );
    });

    renderProducts(filtered);
}

// ================= CART =================
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(i => i.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function updateCartUI() {
    document.getElementById("cart-count").innerText = cart.reduce((a, b) => a + b.quantity, 0);
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        container.innerHTML += `
        <div class="cart-item">
            <h4>${item.name}</h4>
            <p>$${item.price} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
        `;
    });

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("tax").innerText = `$${tax.toFixed(2)}`;
    document.getElementById("total").innerText = `$${total.toFixed(2)}`;
}

// ================= CART TOGGLE =================
function toggleCart() {
    document.getElementById("cart-sidebar").classList.toggle("active");
    document.getElementById("cart-overlay").classList.toggle("active");
}

// ================= AUTH =================
function showAuth(type) {
    document.getElementById("auth-modal").style.display = "block";

    document.getElementById("login-form").style.display =
        type === "login" ? "block" : "none";

    document.getElementById("register-form").style.display =
        type === "register" ? "block" : "none";
}

function closeAuth() {
    document.getElementById("auth-modal").style.display = "none";
}

async function handleLogin(e) {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
        token = data.token;
        user = data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        updateAuthUI();
        closeAuth();
    } else {
        alert(data.error);
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (data.token) {
        token = data.token;
        user = data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        updateAuthUI();
        closeAuth();
    } else {
        alert(data.error);
    }
}

function logout() {
    token = null;
    user = null;
    localStorage.clear();
    updateAuthUI();
}

function updateAuthUI() {
    if (token && user) {
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("user-menu").style.display = "block";
        document.getElementById("username-display").innerText = user.username;
    } else {
        document.getElementById("auth-container").style.display = "block";
        document.getElementById("user-menu").style.display = "none";
    }
}

// ================= CHECKOUT =================
async function checkout() {
    if (!token) {
        alert("Please login first");
        return;
    }

    const items = cart.map(i => ({
        id: i.id,
        quantity: i.quantity,
        price: i.price
    }));

    const subtotal = cart.reduce((a, b) => a + b.price * b.quantity, 0);
    const tax = subtotal * 0.1;
    const totalPrice = subtotal + tax;

    const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ items, totalPrice })
    });

    const data = await res.json();

    if (data.orderId) {
        alert("Order placed successfully!");
        cart = [];
        updateCartUI();
        toggleCart();
    } else {
        alert(data.error);
    }
}

// ================= ORDERS =================
async function showOrders() {
    if (!token) {
        alert("Login required");
        return;
    }

    const res = await fetch(`${API}/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const orders = await res.json();

    const grid = document.getElementById("products-grid");
    grid.innerHTML = "<h2>Your Orders</h2>";

    orders.forEach(o => {
        grid.innerHTML += `
        <div class="order-card">
            <h3>Order #${o.id}</h3>
            <p>Status: ${o.status}</p>
            <p>Total: $${o.total_price}</p>
            <small>${new Date(o.created_at).toLocaleString()}</small>
        </div>
        `;
    });
}

// ================= HOME =================
function showHome() {
    loadProducts();
}