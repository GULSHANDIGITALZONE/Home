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
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";
const BREVO_API_KEY = process.env.BREVO_API_KEY || "";
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_SENDER_EMAIL = process.env.RESEND_SENDER_EMAIL || "";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || "";
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
const CLOUD_DOWNLOAD_BASE_URL = process.env.CLOUD_DOWNLOAD_BASE_URL || "";
const CLOUD_DOWNLOAD_TOKEN = process.env.CLOUD_DOWNLOAD_TOKEN || "";

const DATA_DIR = path.join(__dirname, "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const COUPONS_FILE = path.join(DATA_DIR, "coupons.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const NOTIFICATIONS_FILE = path.join(DATA_DIR, "notifications.json");
const ADMINS_FILE = path.join(DATA_DIR, "admins.json");
const GIFT_CARDS_FILE = path.join(DATA_DIR, "giftcards.json");
const BLOG_POSTS_FILE = path.join(DATA_DIR, "blog-posts.json");
const AUDIT_LOG_FILE = path.join(DATA_DIR, "audit-log.json");
const SUPPORT_TICKETS_FILE = path.join(DATA_DIR, "support-tickets.json");
const QA_FILE = path.join(DATA_DIR, "questions.json");
const adminTokens = new Map();
const downloadTokens = new Map();

app.use(cors({
  origin: CLIENT_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

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

function createAuthToken(session) {
  const raw = createToken();
  const token = raw + "." + signValue(raw);
  adminTokens.set(token, { createdAt: Date.now(), ...(session || {}) });
  return token;
}

function isValidToken(token) {
  if (!token || !adminTokens.has(token)) return false;
  const [raw, signature] = token.split(".");
  return signature === signValue(raw);
}

function getAdminSession(token) {
  if (!token || !adminTokens.has(token)) return null;
  return adminTokens.get(token);
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!isValidToken(token)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  req.adminSession = getAdminSession(token);
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

function getCoupons() {
  return readJson(COUPONS_FILE, []);
}

function saveCoupons(coupons) {
  writeJson(COUPONS_FILE, coupons);
}

function getUsers() {
  return readJson(USERS_FILE, []);
}

function saveUsers(users) {
  writeJson(USERS_FILE, users);
}

function getReviews() {
  return readJson(REVIEWS_FILE, []);
}

function saveReviews(reviews) {
  writeJson(REVIEWS_FILE, reviews);
}

function getNotifications() {
  return readJson(NOTIFICATIONS_FILE, []);
}

function saveNotifications(notifications) {
  writeJson(NOTIFICATIONS_FILE, notifications);
}

function getAdmins() {
  return readJson(ADMINS_FILE, []);
}

function saveAdmins(admins) {
  writeJson(ADMINS_FILE, admins);
}

function getGiftCards() {
  return readJson(GIFT_CARDS_FILE, []);
}

function saveGiftCards(giftCards) {
  writeJson(GIFT_CARDS_FILE, giftCards);
}

function getBlogPosts() {
  return readJson(BLOG_POSTS_FILE, []);
}

function saveBlogPosts(posts) {
  writeJson(BLOG_POSTS_FILE, posts);
}

function getAuditLog() {
  return readJson(AUDIT_LOG_FILE, []);
}

function saveAuditLog(log) {
  writeJson(AUDIT_LOG_FILE, log);
}

function getSupportTickets() {
  return readJson(SUPPORT_TICKETS_FILE, []);
}

function saveSupportTickets(tickets) {
  writeJson(SUPPORT_TICKETS_FILE, tickets);
}

function getQuestions() {
  return readJson(QA_FILE, []);
}

function saveQuestions(items) {
  writeJson(QA_FILE, items);
}

function pushNotification(notification) {
  const notifications = getNotifications();
  notifications.unshift({
    docId: generateDocId("ntf"),
    createdAt: nowIso(),
    ...notification
  });
  saveNotifications(notifications.slice(0, 120));
}

function pushAuditLog(entry) {
  const log = getAuditLog();
  log.unshift({
    docId: generateDocId("aud"),
    at: nowIso(),
    ...entry
  });
  saveAuditLog(log.slice(0, 300));
}

function sanitizeProduct(product) {
  return {
    docId: product.docId,
    id: product.id,
    title: product.title,
    details: product.details,
    amount: Number(product.amount),
    category: product.category || "digital",
    image: product.image,
    type: product.type,
    actionLabel: product.actionLabel,
    actionUrl: product.actionUrl,
    stock: Number(product.stock || 0),
    badge: product.badge || "",
    offerText: product.offerText || "",
    tags: Array.isArray(product.tags) ? product.tags : [],
    billingCycle: product.billingCycle || "",
    bundleItems: Array.isArray(product.bundleItems) ? product.bundleItems : [],
    countdownEndsAt: product.countdownEndsAt || "",
    dynamicDiscountPercent: Number(product.dynamicDiscountPercent || 0),
    productGallery: Array.isArray(product.productGallery) ? product.productGallery : [],
    slaText: product.slaText || "",
    vendorName: product.vendorName || "",
    features: Array.isArray(product.features) ? product.features : [],
    createdAt: product.createdAt || nowIso(),
    updatedAt: nowIso()
  };
}

function findProductById(productId) {
  return getProducts().find((item) => item.id === productId);
}

function findCouponByCode(code) {
  return getCoupons().find((item) => {
    const limit = Number(item.usageLimit || 0);
    const used = Number(item.usedCount || 0);
    const underLimit = !limit || used < limit;
    const notExpired = !item.expiresAt || new Date(item.expiresAt).getTime() >= Date.now();
    return item.code.toLowerCase() === String(code || "").toLowerCase() && item.active && underLimit && notExpired;
  });
}

function calculateDiscount(subtotal, coupon) {
  if (!coupon) return 0;
  if (coupon.type === "flat") return Math.min(Number(coupon.value) || 0, subtotal);
  if (coupon.type === "percent") return Math.round(subtotal * ((Number(coupon.value) || 0) / 100));
  return 0;
}

function getEffectiveProductAmount(product) {
  const base = Number((product && product.amount) || 0);
  const discountPercent = Number((product && product.dynamicDiscountPercent) || 0);
  if (!discountPercent) return base;
  return Math.max(base - Math.round(base * (discountPercent / 100)), 0);
}

function buildReferralCode(email, phone) {
  const base = String(email || phone || generateDocId("ref"))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 8);
  return `REF${base || crypto.randomBytes(3).toString("hex")}`.toUpperCase();
}

function updateCouponUsage(couponCode) {
  if (!couponCode) return;
  const coupons = getCoupons();
  const coupon = coupons.find((item) => item.code === couponCode);
  if (!coupon) return;
  coupon.usedCount = Number(coupon.usedCount || 0) + 1;
  saveCoupons(coupons);
}

function applyReferralReward(order) {
  if (!order.referralCode || !order.customerEmail) return;
  const users = getUsers();
  const referrer = users.find((item) => item.referralCode === order.referralCode && item.email !== order.customerEmail);
  if (!referrer) return;
  referrer.referralCount = Number(referrer.referralCount || 0) + 1;
  referrer.referralCredit = Number(referrer.referralCredit || 0) + Math.max(Math.round(Number(order.amount || 0) * 0.05), 25);
  referrer.updatedAt = nowIso();
  saveUsers(users);
  pushNotification({
    type: "referral",
    title: "Referral reward added",
    message: `${referrer.email || referrer.name} earned reward from ${order.productTitle}`
  });
}

function markOrderPaid(order, mode, paymentData) {
  const alreadyPaid = order.status === "paid";
  order.status = "paid";
  order.mode = mode || order.mode;
  if (paymentData && paymentData.gatewayOrderId) order.gatewayOrderId = paymentData.gatewayOrderId;
  if (paymentData && paymentData.gatewayPaymentId) order.gatewayPaymentId = paymentData.gatewayPaymentId;
  order.updatedAt = nowIso();
  order.timeline = Array.isArray(order.timeline) ? order.timeline : [];
  order.timeline.push({
    at: nowIso(),
    status: "paid",
    note: `Order marked paid via ${mode || order.mode || "system"}`
  });
  if (!alreadyPaid) {
    updateCouponUsage(order.couponCode);
    applyReferralReward(order);
    queueOrderNotifications(order);
    order.loyaltyPoints = Number(order.loyaltyPoints || 0) + Math.max(Math.round(Number(order.amount || 0) / 50), 5);
    const users = getUsers();
    const user = users.find((item) => item.email && item.email === order.customerEmail);
    if (user) {
      if (Number(order.walletCredit || 0) > 0) {
        user.referralCredit = Math.max(Number(user.referralCredit || 0) - Number(order.walletCredit || 0), 0);
      }
      user.loyaltyPoints = Number(user.loyaltyPoints || 0) + order.loyaltyPoints;
      user.updatedAt = nowIso();
      saveUsers(users);
    }
  }
}

function hasUserUsedCoupon(email, couponCode, orders) {
  if (!email || !couponCode) return false;
  return orders.some((item) => item.status === "paid" && item.customerEmail === email && item.couponCode === couponCode);
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escapeValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((row) => headers.map((key) => escapeValue(row[key])).join(","))].join("\n");
}

function computeAdminStats() {
  const products = getProducts();
  const orders = getOrders();
  const users = getUsers();
  const reviews = getReviews();
  const notifications = getNotifications();
  const tickets = getSupportTickets();
  const questions = getQuestions();
  const paidOrders = orders.filter((item) => item.status === "paid");
  const refundedOrders = orders.filter((item) => item.status === "refunded");
  const suspendedUsers = users.filter((item) => item.status === "suspended");
  const failedOrders = orders.filter((item) => item.status === "failed");
  const revenue = paidOrders.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const lowStock = products.filter((item) => Number(item.stock || 0) > 0 && Number(item.stock || 0) <= 5);
  const abandonedCarts = users.filter((item) => item.cloudData && Array.isArray(item.cloudData.cart) && item.cloudData.cart.length > 0);
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5);
  const averageRating = reviews.length
    ? Number((reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1))
    : 0;
  const salesTrend = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    const dayKey = day.toISOString().slice(0, 10);
    const dayOrders = paidOrders.filter((item) => String(item.updatedAt || item.createdAt).slice(0, 10) === dayKey);
    return {
      day: day.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      revenue: dayOrders.reduce((sum, item) => sum + Number(item.amount || 0), 0),
      orders: dayOrders.length
    };
  });
  const topProducts = Object.values(paidOrders.reduce((acc, order) => {
    const key = order.productTitle || order.productId;
    acc[key] = acc[key] || { label: key, orders: 0, revenue: 0 };
    acc[key].orders += 1;
    acc[key].revenue += Number(order.amount || 0);
    return acc;
  }, {})).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const topCoupons = Object.values(paidOrders.filter((item) => item.couponCode).reduce((acc, order) => {
    const key = order.couponCode;
    acc[key] = acc[key] || { label: key, uses: 0, discount: 0 };
    acc[key].uses += 1;
    acc[key].discount += Number(order.discount || 0);
    return acc;
  }, {})).sort((a, b) => b.uses - a.uses).slice(0, 5);
  const topReferrers = users
    .filter((item) => Number(item.referralCount || 0) > 0)
    .map((item) => ({
      label: item.email || item.name || item.referralCode,
      referrals: Number(item.referralCount || 0),
      credit: Number(item.referralCredit || 0),
      payoutStatus: item.payoutStatus || "pending"
    }))
    .sort((a, b) => b.referrals - a.referrals)
    .slice(0, 5);

  return {
    totals: {
      products: products.length,
      orders: orders.length,
      paidOrders: paidOrders.length,
      refundedOrders: refundedOrders.length,
      failedOrders: failedOrders.length,
      users: users.length,
      suspendedUsers: suspendedUsers.length,
      revenue,
      reviews: reviews.length,
      averageRating,
      notifications: notifications.length,
      abandonedCarts: abandonedCarts.length,
      tickets: tickets.length,
      questions: questions.length
    },
    widgets: {
      lowStock,
      recentOrders,
      recentNotifications: notifications.slice(0, 6),
      abandonedCarts: abandonedCarts.slice(0, 6).map((item) => ({
        email: item.email || item.phone || item.name,
        count: (item.cloudData && item.cloudData.cart && item.cloudData.cart.length) || 0
      })),
      salesTrend,
      topProducts,
      topCoupons,
      topReferrers,
      latestReviews: [...reviews]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    }
  };
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

async function sendJsonRequest(hostname, pathName, method, headers, payload) {
  const body = payload ? JSON.stringify(payload) : "";
  return createHttpsRequest({
    hostname,
    path: pathName,
    method,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body),
      ...(headers || {})
    }
  }, body);
}

async function sendOrderEmail(order) {
  if (BREVO_API_KEY && BREVO_SENDER_EMAIL && order.customerEmail) {
    return sendJsonRequest("api.brevo.com", "/v3/smtp/email", "POST", {
      "api-key": BREVO_API_KEY
    }, {
      sender: { email: BREVO_SENDER_EMAIL, name: "GDZ Store" },
      to: [{ email: order.customerEmail, name: order.customerName || "Customer" }],
      subject: `Order Confirmed - ${order.productTitle}`,
      htmlContent: `<h2>Order Confirmed</h2><p>Your order <strong>${order.docId}</strong> for <strong>${order.productTitle}</strong> has been confirmed.</p><p>Amount: Rs. ${order.amount}</p>`
    });
  }
  if (RESEND_API_KEY && RESEND_SENDER_EMAIL && order.customerEmail) {
    return sendJsonRequest("api.resend.com", "/emails", "POST", {
      Authorization: `Bearer ${RESEND_API_KEY}`
    }, {
      from: RESEND_SENDER_EMAIL,
      to: [order.customerEmail],
      subject: `Order Confirmed - ${order.productTitle}`,
      html: `<h2>Order Confirmed</h2><p>Your order <strong>${order.docId}</strong> for <strong>${order.productTitle}</strong> has been confirmed.</p><p>Amount: Rs. ${order.amount}</p>`
    });
  }
  return null;
}

async function sendWhatsAppOrder(order) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) return null;
  if (!order.customerPhone) return null;
  return sendJsonRequest("graph.facebook.com", `/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, "POST", {
    Authorization: `Bearer ${WHATSAPP_TOKEN}`
  }, {
    messaging_product: "whatsapp",
    to: order.customerPhone,
    type: "text",
    text: {
      body: `GDZ Store: order ${order.docId} for ${order.productTitle} confirmed. Amount Rs. ${order.amount}.`
    }
  });
}

function queueOrderNotifications(order) {
  sendOrderEmail(order).catch(() => null);
  sendWhatsAppOrder(order).catch(() => null);
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

app.get("/api/products/:id", (req, res) => {
  const product = findProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  const reviews = getReviews().filter((item) => item.productId === product.id);
  const averageRating = reviews.length
    ? Number((reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1))
    : 0;
  const related = getProducts()
    .filter((item) => item.id !== product.id && item.category === product.category)
    .slice(0, 4);
  res.json({
    product,
    reviews,
    averageRating,
    related
  });
});

app.get("/api/coupons/validate", (req, res) => {
  const { code, subtotal, email } = req.query;
  const coupon = findCouponByCode(code);
  if (!coupon) {
    return res.status(404).json({ valid: false, message: "Invalid coupon" });
  }
  if (hasUserUsedCoupon(String(email || ""), coupon.code, getOrders())) {
    return res.status(400).json({ valid: false, message: "This coupon is already used by this user" });
  }
  const base = Number(subtotal || 0);
  const discount = calculateDiscount(base, coupon);
  return res.json({
    valid: true,
    coupon,
    discount,
    finalTotal: Math.max(base - discount, 0)
  });
});

app.get("/api/coupons/suggestions", (req, res) => {
  const subtotal = Number(req.query.subtotal || 0);
  const email = String(req.query.email || "");
  if (!subtotal) {
    return res.json({ suggestions: [] });
  }
  const orders = getOrders();
  const suggestions = getCoupons()
    .filter((coupon) => coupon.active !== false)
    .filter((coupon) => !coupon.expiresAt || new Date(coupon.expiresAt).getTime() >= Date.now())
    .filter((coupon) => {
      const limit = Number(coupon.usageLimit || 0);
      const used = Number(coupon.usedCount || 0);
      return !limit || used < limit;
    })
    .filter((coupon) => !hasUserUsedCoupon(email, coupon.code, orders))
    .map((coupon) => ({
      code: coupon.code,
      description: coupon.description || "",
      discount: calculateDiscount(subtotal, coupon),
      type: coupon.type,
      value: coupon.value
    }))
    .filter((coupon) => coupon.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 3);
  res.json({ suggestions });
});

app.post("/api/users/sync", (req, res) => {
  const payload = req.body || {};
  if (!payload.email && !payload.phone) {
    return res.status(400).json({ message: "User email or phone required" });
  }
  const users = getUsers();
  const key = payload.email || payload.phone;
  const index = users.findIndex((item) => (item.email || item.phone) === key);
  const nextUser = {
    docId: index >= 0 ? users[index].docId : generateDocId("usr"),
    name: payload.name || "",
    email: payload.email || "",
    phone: payload.phone || "",
    photoUrl: payload.photoUrl || "",
    referralCode: index >= 0 ? users[index].referralCode : buildReferralCode(payload.email, payload.phone),
    referralCount: index >= 0 ? Number(users[index].referralCount || 0) : 0,
    referralCredit: index >= 0 ? Number(users[index].referralCredit || 0) : 0,
    payoutStatus: index >= 0 ? users[index].payoutStatus || "pending" : "pending",
    status: index >= 0 ? users[index].status || "active" : "active",
    loyaltyPoints: index >= 0 ? Number(users[index].loyaltyPoints || 0) : 0,
    updatedAt: nowIso(),
    createdAt: index >= 0 ? users[index].createdAt : nowIso(),
    cloudData: index >= 0 ? users[index].cloudData || {} : {}
  };
  if (index >= 0) {
    users[index] = { ...users[index], ...nextUser };
  } else {
    users.push(nextUser);
    pushNotification({
      type: "user",
      title: "New user synced",
      message: nextUser.email || nextUser.phone || nextUser.name || "User"
    });
  }
  saveUsers(users);
  res.json({ success: true, user: nextUser });
});

app.get("/api/integrations/status", (req, res) => {
  res.json({
    email: Boolean((BREVO_API_KEY && BREVO_SENDER_EMAIL) || (RESEND_API_KEY && RESEND_SENDER_EMAIL)),
    whatsapp: Boolean(WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID),
    cloudStorage: Boolean(CLOUD_DOWNLOAD_BASE_URL),
    backupGateways: true
  });
});

app.get("/api/notifications/inbox", (req, res) => {
  const { email } = req.query;
  const notifications = getNotifications()
    .filter((item) => !email || !item.email || item.email === email)
    .slice(0, 20);
  res.json({ notifications });
});

app.post("/api/user-data/sync", (req, res) => {
  const { email, phone, cart, wishlist, settings } = req.body || {};
  const users = getUsers();
  const user = users.find((item) => (email && item.email === email) || (phone && item.phone === phone));
  if (!user) return res.status(404).json({ message: "User not found" });
  user.cloudData = {
    ...(user.cloudData || {}),
    cart: Array.isArray(cart) ? cart : (user.cloudData && user.cloudData.cart) || [],
    wishlist: Array.isArray(wishlist) ? wishlist : (user.cloudData && user.cloudData.wishlist) || [],
    settings: settings || (user.cloudData && user.cloudData.settings) || {}
  };
  user.updatedAt = nowIso();
  saveUsers(users);
  res.json({ success: true, cloudData: user.cloudData });
});

app.get("/api/user-data", (req, res) => {
  const { email, phone } = req.query;
  const users = getUsers();
  const user = users.find((item) => (email && item.email === email) || (phone && item.phone === phone));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ success: true, cloudData: user.cloudData || {} });
});

app.get("/api/reviews", (req, res) => {
  const { productId, rating } = req.query;
  let reviews = getReviews().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (productId) {
    reviews = reviews.filter((item) => item.productId === productId);
  }
  if (rating) {
    reviews = reviews.filter((item) => Number(item.rating || 0) === Number(rating));
  }
  const averageRating = reviews.length
    ? Number((reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length).toFixed(1))
    : 0;
  res.json({
    reviews,
    averageRating,
    count: reviews.length
  });
});

app.post("/api/reviews", (req, res) => {
  const payload = req.body || {};
  const product = findProductById(payload.productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (!payload.name || !payload.message) {
    return res.status(400).json({ message: "Name and review message required" });
  }
  const rating = Math.max(1, Math.min(5, Number(payload.rating || 5)));
  const reviews = getReviews();
  const review = {
    docId: generateDocId("rev"),
    productId: product.id,
    productTitle: product.title,
    name: String(payload.name || "").trim(),
    email: String(payload.email || "").trim(),
    title: String(payload.title || "").trim(),
    message: String(payload.message || "").trim(),
    mediaUrl: String(payload.mediaUrl || "").trim(),
    mediaType: String(payload.mediaType || "").trim(),
    rating,
    createdAt: nowIso()
  };
  reviews.push(review);
  saveReviews(reviews);
  pushNotification({
    type: "review",
    title: "New review received",
    message: `${review.name} rated ${review.productTitle} ${review.rating}/5`
  });
  res.status(201).json({ success: true, review });
});

app.get("/api/questions", (req, res) => {
  const { productId } = req.query;
  let items = getQuestions().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (productId) {
    items = items.filter((item) => item.productId === productId);
  }
  res.json({ questions: items });
});

app.post("/api/questions", (req, res) => {
  const payload = req.body || {};
  if (!payload.productId || !payload.question) {
    return res.status(400).json({ message: "Product and question required" });
  }
  const items = getQuestions();
  const question = {
    docId: generateDocId("qa"),
    productId: payload.productId,
    name: payload.name || "User",
    email: payload.email || "",
    question: payload.question,
    answer: "",
    createdAt: nowIso()
  };
  items.push(question);
  saveQuestions(items);
  pushNotification({
    type: "question",
    title: "New product question",
    message: `${question.name} asked about ${question.productId}`
  });
  res.status(201).json({ success: true, question });
});

app.post("/api/support-tickets", (req, res) => {
  const payload = req.body || {};
  if (!payload.email || !payload.subject || !payload.message) {
    return res.status(400).json({ message: "Email, subject, and message required" });
  }
  const tickets = getSupportTickets();
  const ticket = {
    docId: generateDocId("tkt"),
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
    status: "open",
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  tickets.push(ticket);
  saveSupportTickets(tickets);
  pushNotification({
    type: "ticket",
    title: "New support ticket",
    message: `${ticket.email} created ${ticket.docId}`
  });
  res.status(201).json({ success: true, ticket });
});

app.post("/api/auth/admin-login", (req, res) => {
  const { username, password } = req.body || {};
  let admin = null;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    admin = { username, role: "super_admin", name: "Primary Admin" };
  } else {
    admin = getAdmins().find((item) => item.username === username && item.password === password && item.active !== false);
  }
  if (!admin) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
  const token = createAuthToken({
    username: admin.username,
    role: admin.role || "manager",
    name: admin.name || admin.username
  });
  pushAuditLog({
    actor: admin.username,
    role: admin.role || "manager",
    action: "admin_login",
    target: admin.username
  });
  return res.json({ token, admin: { username: admin.username, role: admin.role || "manager", name: admin.name || admin.username } });
});

app.get("/api/admin/products", requireAdmin, (req, res) => {
  res.json({ products: getProducts() });
});

app.get("/api/admin/export/products.json", requireAdmin, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", "attachment; filename=products.json");
  res.send(JSON.stringify(getProducts(), null, 2));
});

app.post("/api/admin/import/products", requireAdmin, (req, res) => {
  const payload = req.body || {};
  const products = Array.isArray(payload.products) ? payload.products : [];
  if (!products.length) {
    return res.status(400).json({ message: "Products array required" });
  }
  const sanitized = products.map((product, index) => sanitizeProduct({
    ...product,
    docId: product.docId || generateDocId(`prod${index}`),
    createdAt: product.createdAt || nowIso()
  }));
  saveProducts(sanitized);
  pushNotification({
    type: "import",
    title: "Products imported",
    message: `${sanitized.length} products imported`
  });
  res.json({ success: true, count: sanitized.length });
});

app.get("/api/admin/system-backup", requireAdmin, (req, res) => {
  res.json({
    success: true,
    backup: {
      exportedAt: nowIso(),
      products: getProducts(),
      orders: getOrders(),
      coupons: getCoupons(),
      users: getUsers(),
      reviews: getReviews(),
      notifications: getNotifications(),
      admins: getAdmins(),
      giftCards: getGiftCards(),
      blogPosts: getBlogPosts(),
      auditLog: getAuditLog(),
      supportTickets: getSupportTickets(),
      questions: getQuestions()
    }
  });
});

app.post("/api/admin/system-restore", requireAdmin, (req, res) => {
  const backup = (req.body || {}).backup || {};
  if (!backup || typeof backup !== "object") {
    return res.status(400).json({ message: "Backup payload required" });
  }
  if (Array.isArray(backup.products)) saveProducts(backup.products);
  if (Array.isArray(backup.orders)) saveOrders(backup.orders);
  if (Array.isArray(backup.coupons)) saveCoupons(backup.coupons);
  if (Array.isArray(backup.users)) saveUsers(backup.users);
  if (Array.isArray(backup.reviews)) saveReviews(backup.reviews);
  if (Array.isArray(backup.notifications)) saveNotifications(backup.notifications);
  if (Array.isArray(backup.admins)) saveAdmins(backup.admins);
  if (Array.isArray(backup.giftCards)) saveGiftCards(backup.giftCards);
  if (Array.isArray(backup.blogPosts)) saveBlogPosts(backup.blogPosts);
  if (Array.isArray(backup.auditLog)) saveAuditLog(backup.auditLog);
  if (Array.isArray(backup.supportTickets)) saveSupportTickets(backup.supportTickets);
  if (Array.isArray(backup.questions)) saveQuestions(backup.questions);
  pushAuditLog({
    actor: req.adminSession && req.adminSession.username,
    role: req.adminSession && req.adminSession.role,
    action: "system_restore",
    target: "backup_payload"
  });
  res.json({ success: true });
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

app.put("/api/admin/orders/:docId/status", requireAdmin, (req, res) => {
  const { docId } = req.params;
  const { status } = req.body || {};
  const orders = getOrders();
  const order = orders.find((item) => item.docId === docId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  if ((status || order.status) === "paid") {
    markOrderPaid(order, order.mode || "admin");
  } else {
    order.status = status || order.status;
    order.updatedAt = nowIso();
    order.timeline = Array.isArray(order.timeline) ? order.timeline : [];
    order.timeline.push({
      at: nowIso(),
      status: order.status,
      note: `Order marked ${order.status} by admin`
    });
  }
  saveOrders(orders);
  pushAuditLog({
    actor: req.adminSession && req.adminSession.username,
    role: req.adminSession && req.adminSession.role,
    action: "order_status_updated",
    target: order.docId,
    meta: status || order.status
  });
  res.json({ success: true, order });
});

app.put("/api/admin/orders/:docId/refund", requireAdmin, (req, res) => {
  const { docId } = req.params;
  const orders = getOrders();
  const order = orders.find((item) => item.docId === docId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.status = "refunded";
  order.refundedAt = nowIso();
  order.updatedAt = nowIso();
  order.timeline = Array.isArray(order.timeline) ? order.timeline : [];
  order.timeline.push({
    at: nowIso(),
    status: "refunded",
    note: "Order refunded by admin"
  });
  saveOrders(orders);
  pushNotification({
    type: "refund",
    title: "Order refunded",
    message: `${order.productTitle} refunded`
  });
  pushAuditLog({
    actor: req.adminSession && req.adminSession.username,
    role: req.adminSession && req.adminSession.role,
    action: "order_refunded",
    target: order.docId
  });
  res.json({ success: true, order });
});

app.get("/api/admin/stats", requireAdmin, (req, res) => {
  res.json(computeAdminStats());
});

app.get("/api/admin/coupons", requireAdmin, (req, res) => {
  res.json({ coupons: getCoupons() });
});

app.post("/api/admin/coupons", requireAdmin, (req, res) => {
  const coupons = getCoupons();
  const payload = req.body || {};
  const coupon = {
    docId: generateDocId("cpn"),
    code: String(payload.code || "").toUpperCase(),
    type: payload.type || "flat",
    value: Number(payload.value || 0),
    usageLimit: Number(payload.usageLimit || 0),
    usedCount: Number(payload.usedCount || 0),
    expiresAt: payload.expiresAt || "",
    active: payload.active !== false,
    description: payload.description || ""
  };
  coupons.push(coupon);
  saveCoupons(coupons);
  res.status(201).json({ coupon });
});

app.put("/api/admin/coupons/:docId", requireAdmin, (req, res) => {
  const { docId } = req.params;
  const payload = req.body || {};
  const coupons = getCoupons();
  const index = coupons.findIndex((item) => item.docId === docId);
  if (index === -1) return res.status(404).json({ message: "Coupon not found" });
  coupons[index] = {
    ...coupons[index],
    code: String(payload.code || coupons[index].code).toUpperCase(),
    type: payload.type || coupons[index].type,
    value: Number(payload.value ?? coupons[index].value),
    usageLimit: Number(payload.usageLimit ?? coupons[index].usageLimit ?? 0),
    usedCount: Number(payload.usedCount ?? coupons[index].usedCount ?? 0),
    expiresAt: payload.expiresAt ?? coupons[index].expiresAt ?? "",
    active: payload.active ?? coupons[index].active,
    description: payload.description ?? coupons[index].description
  };
  saveCoupons(coupons);
  res.json({ coupon: coupons[index] });
});

app.delete("/api/admin/coupons/:docId", requireAdmin, (req, res) => {
  const { docId } = req.params;
  const coupons = getCoupons();
  const nextCoupons = coupons.filter((item) => item.docId !== docId);
  if (nextCoupons.length === coupons.length) return res.status(404).json({ message: "Coupon not found" });
  saveCoupons(nextCoupons);
  res.json({ success: true });
});

app.get("/api/admin/users", requireAdmin, (req, res) => {
  const users = getUsers().sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  res.json({ users });
});

app.get("/api/admin/admins", requireAdmin, (req, res) => {
  const admins = getAdmins().map((item) => ({
    docId: item.docId,
    username: item.username,
    name: item.name,
    role: item.role || "manager",
    active: item.active !== false
  }));
  res.json({ admins });
});

app.post("/api/admin/admins", requireAdmin, (req, res) => {
  const payload = req.body || {};
  const admins = getAdmins();
  const admin = {
    docId: generateDocId("adm"),
    username: String(payload.username || "").trim(),
    password: String(payload.password || "").trim(),
    name: String(payload.name || "").trim(),
    role: payload.role || "manager",
    active: payload.active !== false,
    createdAt: nowIso()
  };
  if (!admin.username || !admin.password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  admins.push(admin);
  saveAdmins(admins);
  pushAuditLog({
    actor: req.adminSession && req.adminSession.username,
    role: req.adminSession && req.adminSession.role,
    action: "admin_created",
    target: admin.username
  });
  res.status(201).json({ admin });
});

app.put("/api/admin/users/:docId/status", requireAdmin, (req, res) => {
  const { docId } = req.params;
  const { status, payoutStatus } = req.body || {};
  const users = getUsers();
  const user = users.find((item) => item.docId === docId);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (status) user.status = status;
  if (payoutStatus) user.payoutStatus = payoutStatus;
  user.updatedAt = nowIso();
  saveUsers(users);
  pushAuditLog({
    actor: req.adminSession && req.adminSession.username,
    role: req.adminSession && req.adminSession.role,
    action: "user_updated",
    target: user.email || user.docId,
    meta: status || payoutStatus
  });
  res.json({ success: true, user });
});

app.get("/api/admin/reviews", requireAdmin, (req, res) => {
  const reviews = getReviews().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ reviews });
});

app.get("/api/admin/questions", requireAdmin, (req, res) => {
  res.json({ questions: getQuestions().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

app.put("/api/admin/questions/:docId/answer", requireAdmin, (req, res) => {
  const items = getQuestions();
  const question = items.find((item) => item.docId === req.params.docId);
  if (!question) return res.status(404).json({ message: "Question not found" });
  question.answer = String((req.body || {}).answer || "").trim();
  question.answeredAt = nowIso();
  saveQuestions(items);
  res.json({ success: true, question });
});

app.get("/api/admin/notifications", requireAdmin, (req, res) => {
  const notifications = getNotifications().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ notifications });
});

app.get("/api/admin/support-tickets", requireAdmin, (req, res) => {
  res.json({ tickets: getSupportTickets().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) });
});

app.put("/api/admin/support-tickets/:docId/status", requireAdmin, (req, res) => {
  const tickets = getSupportTickets();
  const ticket = tickets.find((item) => item.docId === req.params.docId);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });
  ticket.status = String((req.body || {}).status || ticket.status);
  ticket.updatedAt = nowIso();
  saveSupportTickets(tickets);
  res.json({ success: true, ticket });
});

app.get("/api/admin/audit-log", requireAdmin, (req, res) => {
  res.json({ entries: getAuditLog() });
});

app.get("/api/admin/gift-cards", requireAdmin, (req, res) => {
  res.json({ giftCards: getGiftCards() });
});

app.post("/api/admin/gift-cards", requireAdmin, (req, res) => {
  const payload = req.body || {};
  const giftCards = getGiftCards();
  const giftCard = {
    docId: generateDocId("gft"),
    code: String(payload.code || generateDocId("GC")).toUpperCase(),
    amount: Number(payload.amount || 0),
    balance: Number(payload.amount || 0),
    active: payload.active !== false,
    expiresAt: payload.expiresAt || "",
    assignedEmail: payload.assignedEmail || "",
    createdAt: nowIso()
  };
  giftCards.push(giftCard);
  saveGiftCards(giftCards);
  pushAuditLog({
    actor: req.adminSession && req.adminSession.username,
    role: req.adminSession && req.adminSession.role,
    action: "gift_card_created",
    target: giftCard.code
  });
  res.status(201).json({ giftCard });
});

app.post("/api/gift-cards/redeem", (req, res) => {
  const { code, email } = req.body || {};
  const giftCards = getGiftCards();
  const giftCard = giftCards.find((item) => item.code === String(code || "").toUpperCase() && item.active);
  if (!giftCard) return res.status(404).json({ message: "Gift card not found" });
  if (giftCard.expiresAt && new Date(giftCard.expiresAt).getTime() < Date.now()) {
    return res.status(400).json({ message: "Gift card expired" });
  }
  if (giftCard.assignedEmail && email && giftCard.assignedEmail !== email) {
    return res.status(403).json({ message: "Gift card assigned to another user" });
  }
  const users = getUsers();
  const user = users.find((item) => item.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.referralCredit = Number(user.referralCredit || 0) + Number(giftCard.balance || 0);
  user.updatedAt = nowIso();
  giftCard.redeemedAt = nowIso();
  giftCard.active = false;
  giftCard.balance = 0;
  saveUsers(users);
  saveGiftCards(giftCards);
  pushNotification({
    type: "giftcard",
    title: "Gift card redeemed",
    message: `${email} redeemed ${giftCard.code}`
  });
  res.json({ success: true, walletBalance: user.referralCredit, amount: giftCard.amount });
});

app.get("/api/blog", (req, res) => {
  const posts = getBlogPosts().sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
  res.json({ posts });
});

app.get("/api/blog/:slug", (req, res) => {
  const post = getBlogPosts().find((item) => item.slug === req.params.slug);
  if (!post) return res.status(404).json({ message: "Blog post not found" });
  res.json({ post });
});

app.get("/api/admin/blog", requireAdmin, (req, res) => {
  res.json({ posts: getBlogPosts() });
});

app.post("/api/admin/blog", requireAdmin, (req, res) => {
  const payload = req.body || {};
  const posts = getBlogPosts();
  const post = {
    docId: generateDocId("blog"),
    title: payload.title || "",
    slug: payload.slug || String(payload.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    excerpt: payload.excerpt || "",
    content: payload.content || "",
    coverImage: payload.coverImage || "",
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    publishedAt: payload.publishedAt || nowIso(),
    createdAt: nowIso()
  };
  posts.push(post);
  saveBlogPosts(posts);
  pushAuditLog({
    actor: req.adminSession && req.adminSession.username,
    role: req.adminSession && req.adminSession.role,
    action: "blog_created",
    target: post.slug
  });
  res.status(201).json({ post });
});

app.get("/api/admin/export/orders.csv", requireAdmin, (req, res) => {
  const rows = getOrders().map((order) => ({
    orderId: order.docId,
    product: order.productTitle,
    email: order.customerEmail,
    amount: order.amount,
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  }));
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=orders.csv");
  res.send(toCsv(rows));
});

app.get("/api/orders/:docId", (req, res) => {
  const order = getOrders().find((item) => item.docId === req.params.docId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json({ success: true, order });
});

app.get("/api/invoices/:docId", (req, res) => {
  const order = getOrders().find((item) => item.docId === req.params.docId);
  if (!order) return res.status(404).json({ message: "Order not found" });
  const invoice = {
    invoiceNo: `INV-${order.docId}`,
    company: {
      name: "GDZ Store",
      email: process.env.BREVO_SENDER_EMAIL || process.env.RESEND_SENDER_EMAIL || "support@gdz.services",
      gstin: "22AAAAA0000A1Z5",
      address: "Digital Service Office, India"
    },
    customer: {
      name: order.customerName || "Customer",
      email: order.customerEmail || ""
    },
    order,
    issuedAt: nowIso()
  };
  res.json({ success: true, invoice });
});

app.get("/api/admin/export/users.csv", requireAdmin, (req, res) => {
  const rows = getUsers().map((user) => ({
    userId: user.docId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    status: user.status || "active",
    referralCount: user.referralCount || 0,
    referralCredit: user.referralCredit || 0,
    payoutStatus: user.payoutStatus || "pending"
  }));
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=users.csv");
  res.send(toCsv(rows));
});

app.delete("/api/admin/reviews/:docId", requireAdmin, (req, res) => {
  const { docId } = req.params;
  const reviews = getReviews();
  const nextReviews = reviews.filter((item) => item.docId !== docId);
  if (nextReviews.length === reviews.length) {
    return res.status(404).json({ message: "Review not found" });
  }
  saveReviews(nextReviews);
  res.json({ success: true });
});

app.post("/api/payments/create-order", async (req, res) => {
  try {
    const { productId, name, email, cartItems, couponCode, referralCode, useWallet } = req.body || {};
    let items = [];

    if (Array.isArray(cartItems) && cartItems.length) {
      items = cartItems
        .map((item) => {
          const product = findProductById(item.productId);
          if (!product) return null;
          return {
            productId: product.id,
            productTitle: product.title,
            amount: getEffectiveProductAmount(product),
            qty: Number(item.qty || 1)
          };
        })
        .filter(Boolean);
    } else {
      const product = findProductById(productId);
      if (product) {
        items = [{
          productId: product.id,
          productTitle: product.title,
          amount: getEffectiveProductAmount(product),
          qty: 1
        }];
      }
    }

    if (!items.length) {
      return res.status(404).json({ message: "Product not found" });
    }

    const subtotal = items.reduce((sum, item) => sum + (item.amount * item.qty), 0);
    const coupon = couponCode ? findCouponByCode(couponCode) : null;
    if (couponCode && !coupon) {
      return res.status(400).json({ message: "Coupon invalid or expired" });
    }
    if (coupon && hasUserUsedCoupon(String(email || ""), coupon.code, getOrders())) {
      return res.status(400).json({ message: "Coupon already used by this user" });
    }
    const discount = calculateDiscount(subtotal, coupon);
    const users = getUsers();
    const user = users.find((item) => item.email && item.email === String(email || ""));
    const walletCredit = useWallet && user
      ? Math.min(Number(user.referralCredit || 0), Math.max(subtotal - discount, 0))
      : 0;
    const finalAmount = Math.max(subtotal - discount - walletCredit, 0);
    const firstProduct = findProductById(items[0].productId);

    const orders = getOrders();
    const orderRecord = {
      docId: generateDocId("ord"),
      productId: items.length === 1 ? items[0].productId : "cart-bundle",
      productTitle: items.length === 1 ? items[0].productTitle : `Cart Checkout (${items.length} items)`,
      customerName: name || "",
      customerEmail: email || "",
      amount: finalAmount,
      subtotal,
      discount,
      walletCredit,
      couponCode: coupon ? coupon.code : "",
      referralCode: referralCode || "",
      items,
      status: "pending",
      mode: RAZORPAY_ENABLED ? "razorpay" : "manual",
      timeline: [{
        at: nowIso(),
        status: "created",
        note: "Order created"
      }],
      createdAt: nowIso(),
      updatedAt: nowIso()
    };

    if (RAZORPAY_ENABLED && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      const razorpayOrder = await createRazorpayOrder({ ...firstProduct, amount: finalAmount, id: orderRecord.productId }, { name, email });
      orderRecord.gatewayOrderId = razorpayOrder.id;
      orders.push(orderRecord);
      saveOrders(orders);
      pushNotification({
        type: "order",
        title: "New order created",
        message: `${orderRecord.productTitle} for ${orderRecord.customerEmail || "customer"}`
      });
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
    pushNotification({
      type: "order",
      title: "Manual order created",
      message: `${orderRecord.productTitle} for ${orderRecord.customerEmail || "customer"}`
    });
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

  const orders = getOrders();
  let order = orderId ? orders.find((item) => item.docId === orderId) : null;
  const product = productId ? findProductById(productId) : null;

  if (!order) {
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    order = {
      docId: generateDocId("ord"),
      productId: product.id,
      productTitle: product.title,
      customerName: "",
      customerEmail: email || "",
      amount: Number(product.amount),
      status: "pending",
      mode: manualFallback ? "manual" : "unknown",
      timeline: [{
        at: nowIso(),
        status: "created",
        note: "Order created from verify fallback"
      }],
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

    markOrderPaid(order, "razorpay", {
      gatewayOrderId: razorpay_order_id,
      gatewayPaymentId: razorpay_payment_id
    });
    saveOrders(orders);
    pushNotification({
      type: "payment",
      title: "Payment verified",
      message: `${order.productTitle} marked paid`
    });
    return res.json({ success: true, mode: "razorpay", order });
  }

  if (MANUAL_PAYMENT_FALLBACK && manualFallback) {
    markOrderPaid(order, "manual");
    saveOrders(orders);
    pushNotification({
      type: "payment",
      title: "Manual payment confirmed",
      message: `${order.productTitle} marked paid`
    });
    return res.json({ success: true, mode: "manual", order });
  }

  return res.status(400).json({ success: false, message: "Payment data not valid" });
});

app.post("/api/payments/webhook", (req, res) => {
  if (RAZORPAY_WEBHOOK_SECRET) {
    const signature = req.headers["x-razorpay-signature"] || "";
    const expected = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(req.rawBody || "")
      .digest("hex");
    if (signature !== expected) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }
  }

  const event = req.body || {};
  if (event && event.event === "payment.captured") {
    const gatewayOrderId = event.payload && event.payload.payment && event.payload.payment.entity && event.payload.payment.entity.order_id;
    if (gatewayOrderId) {
      const orders = getOrders();
      const order = orders.find((item) => item.gatewayOrderId === gatewayOrderId);
      if (order) {
        markOrderPaid(order, "webhook", { gatewayOrderId });
        saveOrders(orders);
        pushNotification({
          type: "webhook",
          title: "Webhook payment captured",
          message: `${order.productTitle} updated by webhook`
        });
      }
    }
  }
  res.json({ received: true });
});

app.post("/api/download-token", (req, res) => {
  const { orderId, productId } = req.body || {};
  const orders = getOrders();
  const order = orders.find((item) => item.docId === orderId && item.status === "paid");
  if (!order) {
    return res.status(404).json({ message: "Paid order not found" });
  }
  const product = findProductById(productId);
  if (!product || product.type !== "download") {
    return res.status(404).json({ message: "Download product not found" });
  }
  const paidTime = new Date(order.updatedAt || order.createdAt).getTime();
  const expiryDays = Number(product.downloadExpiryDays || 30);
  const maxDownloads = Number(product.downloadLimit || 3);
  if (Date.now() > paidTime + (expiryDays * 24 * 60 * 60 * 1000)) {
    return res.status(410).json({ message: "Download access expired" });
  }
  if (Number(order.downloadCount || 0) >= maxDownloads) {
    return res.status(403).json({ message: "Download limit reached" });
  }
  const token = generateDocId("dl");
  const redirectUrl = CLOUD_DOWNLOAD_BASE_URL && (product.cloudFileKey || product.actionUrl)
    ? `${CLOUD_DOWNLOAD_BASE_URL.replace(/\/+$/, "")}/${encodeURIComponent(product.cloudFileKey || product.actionUrl)}${CLOUD_DOWNLOAD_TOKEN ? `?token=${encodeURIComponent(CLOUD_DOWNLOAD_TOKEN)}` : ""}`
    : product.actionUrl;
  downloadTokens.set(token, {
    orderId,
    productId,
    actionUrl: redirectUrl,
    expiresAt: Date.now() + (10 * 60 * 1000)
  });
  res.json({ success: true, token });
});

app.get("/api/protected-download/:token", (req, res) => {
  const { token } = req.params;
  const record = downloadTokens.get(token);
  if (!record) {
    return res.status(404).json({ message: "Invalid token" });
  }
  if (record.expiresAt < Date.now()) {
    downloadTokens.delete(token);
    return res.status(410).json({ message: "Token expired" });
  }
  const orders = getOrders();
  const order = orders.find((item) => item.docId === record.orderId);
  if (order) {
    order.downloadCount = Number(order.downloadCount || 0) + 1;
    order.updatedAt = nowIso();
    saveOrders(orders);
  }
  return res.json({ success: true, redirectUrl: record.actionUrl });
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
