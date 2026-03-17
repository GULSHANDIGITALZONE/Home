require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const https = require("https");

const app = express();
const PORT = Number(process.env.PORT || 8080);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change_this_password";
const JWT_SECRET = process.env.JWT_SECRET || "replace_with_random_secret";
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
const RAZORPAY_ENABLED = String(process.env.RAZORPAY_ENABLED).toLowerCase() === "true";
const MANUAL_PAYMENT_FALLBACK = String(process.env.MANUAL_PAYMENT_FALLBACK).toLowerCase() !== "false";

const DATA_DIR = path.join(__dirname, "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const adminTokens = new Map();

app.use(cors({
  origin: CLIENT_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

function ensureFile(filePath, defaultValue) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

function readJson(filePath, defaultValue) {
  ensureFile(filePath, defaultValue);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function nowIso() {
  return new Date().toISOString();
}

function createToken() {
  return crypto.randomBytes(24).toString("hex");
}

function signValue(value) {
  return crypto.createHmac("sha256", JWT_SECRET).update(value).digest("hex");
}

function createAuthToken() {
  const raw = createToken();
  const token = raw + "." + signValue(raw);
  adminTokens.set(token, { createdAt: Date.now() });
  return token;
}

function isValidToken(token) {
  if (!token || !adminTokens.has(token)) return false;
  const [raw, signature] = token.split(".");
  return signature === signValue(raw);
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!isValidToken(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

function generateDocId(prefix) {
  return prefix + "_" + crypto.randomBytes(6).toString("hex");
}

function getProducts() {
  return readJson(PRODUCTS_FILE, []);
}

function saveProducts(products) {
  writeJson(PRODUCTS_FILE, products);
}

function getOrders() {
  return readJson(ORDERS_FILE, []);
}

function saveOrders(orders) {
  writeJson(ORDERS_FILE, orders);
}

function sanitizeProduct(product) {
  return {
    docId: product.docId,
    id: product.id,
    title: product.title,
    details: product.details,
    amount: Number(product.amount),
    image: product.image,
    type: product.type,
    actionLabel: product.actionLabel,
    actionUrl: product.actionUrl,
    features: Array.isArray(product.features) ? product.features : [],
    createdAt: product.createdAt || nowIso(),
    updatedAt: nowIso()
  };
}

function findProductById(productId) {
  return getProducts().find((item) => item.id === productId);
}

function createHttpsRequest(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function createRazorpayOrder(product, customer) {
  const payload = JSON.stringify({
    amount: Number(product.amount) * 100,
    currency: "INR",
    receipt: generateDocId("rcpt"),
    notes: {
      productId: product.id,
      email: customer.email || ""
    }
  });

  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");
  const response = await createHttpsRequest({
    hostname: "api.razorpay.com",
    path: "/v1/orders",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload),
      Authorization: `Basic ${auth}`
    }
  }, payload);

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error("Razorpay order create failed");
  }

  return response.data;
}

function verifyRazorpaySignature(orderId, paymentId, signature) {
  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/products", (req, res) => {
  res.json(getProducts());
});

app.post("/api/auth/admin-login", (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
  return res.json({ token: createAuthToken() });
});

app.get("/api/admin/products", requireAdmin, (req, res) => {
  res.json({ products: getProducts() });
});

app.post("/api/admin/products", requireAdmin, (req, res) => {
  const payload = req.body || {};
  const products = getProducts();
  if (products.some((item) => item.id === payload.id)) {
    return res.status(400).json({ message: "Product ID already exists" });
  }

  const product = sanitizeProduct({
    ...payload,
    docId: generateDocId("prod"),
    createdAt: nowIso()
  });

  products.push(product);
  saveProducts(products);
  res.status(201).json({ product });
});

app.put("/api/admin/products/:docId", requireAdmin, (req, res) => {
  const { docId } = req.params;
  const payload = req.body || {};
  const products = getProducts();
  const index = products.findIndex((item) => item.docId === docId);
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const createdAt = products[index].createdAt || nowIso();
  products[index] = sanitizeProduct({
    ...products[index],
    ...payload,
    docId,
    createdAt
  });
  saveProducts(products);
  res.json({ product: products[index] });
});

app.delete("/api/admin/products/:docId", requireAdmin, (req, res) => {
  const { docId } = req.params;
  const products = getProducts();
  const nextProducts = products.filter((item) => item.docId !== docId);
  if (nextProducts.length === products.length) {
    return res.status(404).json({ message: "Product not found" });
  }
  saveProducts(nextProducts);
  res.json({ success: true });
});

app.get("/api/admin/orders", requireAdmin, (req, res) => {
  const orders = getOrders().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  res.json({ orders });
});

app.post("/api/payments/create-order", async (req, res) => {
  try {
    const { productId, name, email } = req.body || {};
    const product = findProductById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const orders = getOrders();
    const orderRecord = {
      docId: generateDocId("ord"),
      productId: product.id,
      productTitle: product.title,
      customerName: name || "",
      customerEmail: email || "",
      amount: Number(product.amount),
      status: "pending",
      mode: RAZORPAY_ENABLED ? "razorpay" : "manual",
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    if (RAZORPAY_ENABLED && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      const razorpayOrder = await createRazorpayOrder(product, { name, email });
      orderRecord.gatewayOrderId = razorpayOrder.id;
      orders.push(orderRecord);
      saveOrders(orders);
      return res.json({
        success: true,
        orderId: orderRecord.docId,
        razorpayOrder
      });
    }

    if (!MANUAL_PAYMENT_FALLBACK) {
      return res.status(400).json({ message: "Payment gateway not configured" });
    }

    orders.push(orderRecord);
    saveOrders(orders);
    return res.json({
      success: true,
      orderId: orderRecord.docId,
      manualFallback: true
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Create order failed" });
  }
});

app.post("/api/payments/verify", (req, res) => {
  const {
    productId,
    email,
    manualFallback,
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body || {};

  const product = findProductById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const orders = getOrders();
  let order = orderId ? orders.find((item) => item.docId === orderId) : null;

  if (!order) {
    order = {
      docId: generateDocId("ord"),
      productId: product.id,
      productTitle: product.title,
      customerName: "",
      customerEmail: email || "",
      amount: Number(product.amount),
      status: "pending",
      mode: manualFallback ? "manual" : "unknown",
      createdAt: nowIso(),
      updatedAt: nowIso()
    };
    orders.push(order);
  }

  if (RAZORPAY_ENABLED && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
    const verified = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!verified) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    order.status = "paid";
    order.mode = "razorpay";
    order.gatewayOrderId = razorpay_order_id;
    order.gatewayPaymentId = razorpay_payment_id;
    order.updatedAt = nowIso();
    saveOrders(orders);
    return res.json({ success: true, mode: "razorpay", order });
  }

  if (MANUAL_PAYMENT_FALLBACK && manualFallback) {
    order.status = "paid";
    order.mode = "manual";
    order.updatedAt = nowIso();
    saveOrders(orders);
    return res.json({ success: true, mode: "manual", order });
  }

  return res.status(400).json({ success: false, message: "Payment data not valid" });
});

app.use(express.static(path.join(__dirname, "..")));

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "Not found" });
  }
  return res.sendFile(path.join(__dirname, "..", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Store backend running on port ${PORT}`);
});
