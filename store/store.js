(function () {
  const config = window.STORE_CONFIG || {};
  const apiBaseUrl = (config.apiBaseUrl || "/api").replace(/\/+$/, "");
  const brandConfig = config.brand || {};
  const paymentConfig = config.payment || {};
  let products = Array.isArray(config.products) ? [...config.products] : [];

  const productGrid = document.getElementById("productGrid");
  const userStatus = document.getElementById("userStatus");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginModal = document.getElementById("loginModal");
  const paymentModal = document.getElementById("paymentModal");
  const loginForm = document.getElementById("loginForm");
  const toast = document.getElementById("toast");
  const paymentProductName = document.getElementById("paymentProductName");
  const paymentAmount = document.getElementById("paymentAmount");
  const paymentGatewayName = document.getElementById("paymentGatewayName");
  const paymentFlowType = document.getElementById("paymentFlowType");
  const paymentDescription = document.getElementById("paymentDescription");
  const gatewayNote = document.getElementById("gatewayNote");
  const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
  const statProductCount = document.getElementById("statProductCount");
  const receiptModal = document.getElementById("receiptModal");
  const receiptContent = document.getElementById("receiptContent");
  const downloadReceiptBtn = document.getElementById("downloadReceiptBtn");

  let selectedProductId = null;
  let toastTimer = null;
  let pendingPaymentContext = null;
  let activeReceipt = null;

  function buildApiUrl(path) {
    if (!path) return apiBaseUrl;
    if (/^https?:\/\//i.test(path)) return path;
    return apiBaseUrl + (path.startsWith("/") ? path : "/" + path);
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem("gdz_store_user")) || null;
    } catch {
      return null;
    }
  }

  function setSession(data) {
    localStorage.setItem("gdz_store_user", JSON.stringify(data));
  }

  function clearSession() {
    localStorage.removeItem("gdz_store_user");
  }

  function getPaidProducts() {
    try {
      return JSON.parse(localStorage.getItem("gdz_store_paid")) || [];
    } catch {
      return [];
    }
  }

  function setPaidProducts(ids) {
    localStorage.setItem("gdz_store_paid", JSON.stringify(ids));
  }

  function isPaid(productId) {
    return getPaidProducts().includes(productId);
  }

  function getReceipts() {
    try {
      return JSON.parse(localStorage.getItem("gdz_store_receipts")) || [];
    } catch {
      return [];
    }
  }

  function setReceipts(receipts) {
    localStorage.setItem("gdz_store_receipts", JSON.stringify(receipts));
  }

  function saveReceipt(receipt) {
    const receipts = getReceipts().filter((item) => item.orderDocId !== receipt.orderDocId);
    receipts.unshift(receipt);
    setReceipts(receipts.slice(0, 20));
    activeReceipt = receipt;
  }

  function formatAmount(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: paymentConfig.currency || "INR",
      maximumFractionDigits: 0
    }).format(amount || 0);
  }

  function showToast(message, type) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = "toast show " + (type || "success");
    toastTimer = setTimeout(() => {
      toast.className = "toast";
    }, 2800);
  }

  function openModal(modal) {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  function updateBrandUI() {
    document.title = (brandConfig.name || "Store") + " | Buy Products";
    const brandName = document.querySelector(".brand-text strong");
    const brandTag = document.querySelector(".brand-text span");
    const badge = document.querySelector(".brand-badge");
    const adminLink = document.getElementById("adminLink");

    if (brandName) brandName.textContent = brandConfig.name || "GDZ Store";
    if (brandTag) brandTag.textContent = brandConfig.tagline || "Login, pay, then order or download instantly";
    if (badge) badge.textContent = brandConfig.shortName || "GS";
    if (adminLink && config.adminPanelUrl) adminLink.href = config.adminPanelUrl;
  }

  function updateAuthUI() {
    const session = getSession();
    if (session) {
      userStatus.textContent = "Logged in: " + session.name;
      loginBtn.hidden = true;
      logoutBtn.hidden = false;
    } else {
      userStatus.textContent = "Guest mode active";
      loginBtn.hidden = false;
      logoutBtn.hidden = true;
    }
  }

  function renderGatewayNote() {
    const keyConfigured = paymentConfig.razorpayKey && !paymentConfig.razorpayKey.includes("replace_with_your_key");
    const verificationEnabled = Boolean(paymentConfig.enableServerVerification);

    if (keyConfigured && verificationEnabled) {
      gatewayNote.textContent = "Razorpay key configured hai. Backend verify endpoint ready ho to secure live payment start ho jayega.";
      return;
    }

    if (keyConfigured) {
      gatewayNote.textContent = "Gateway key present hai, lekin secure verification abhi disabled hai. Production ke liye backend verify enable kijiye.";
      return;
    }

    gatewayNote.textContent = "Abhi placeholder config laga hai. `store-config.js` aur backend `.env` me real IDs/keys replace karni hain.";
  }

  function renderProducts() {
    statProductCount.textContent = String(products.length);
    productGrid.innerHTML = products.map((product) => {
      const paid = isPaid(product.id);
      const features = Array.isArray(product.features) ? product.features : [];
      const actionLabel = paid ? product.actionLabel : "Order/Download Locked";
      const receiptButton = paid
        ? `<button class="btn btn-secondary" type="button" onclick="window.viewReceipt('${product.id}')">Receipt</button>`
        : "";

      return `
        <article class="product-card">
          <img class="product-image" src="${product.image}" alt="${product.title}">
          <div class="product-body">
            <div class="product-top">
              <div>
                <h3>${product.title}</h3>
                <p>${product.details}</p>
              </div>
              <div class="price-tag">${formatAmount(product.amount)}</div>
            </div>

            <ul class="meta-list">
              ${features.map((item) => `<li>${item}</li>`).join("")}
            </ul>

            <div class="status-row">
              <div class="status-badge ${paid ? "paid" : ""}">
                <span class="status-dot"></span>
                ${paid ? "Payment received" : "Waiting for payment"}
              </div>
              <span>${product.type === "download" ? "Digital access" : "Service order"}</span>
            </div>

            <div class="card-actions">
              <button class="btn btn-primary" type="button" onclick="window.startPayment('${product.id}')">Pay Now</button>
              <button class="btn ${paid ? "btn-success" : "btn-secondary"}" type="button" ${paid ? "" : "disabled"} onclick="window.handleOrderDownload('${product.id}')">${actionLabel}</button>
            </div>
            ${receiptButton ? `<div class="card-actions">${receiptButton}</div>` : ""}
          </div>
        </article>
      `;
    }).join("");
  }

  async function loadProducts() {
    try {
      const response = await fetch(buildApiUrl("/products"));
      if (!response.ok) throw new Error("Product API unavailable");
      const data = await response.json();
      if (Array.isArray(data) && data.length) {
        products = data;
      }
    } catch (error) {
      console.warn("Using local config products:", error.message);
    }
  }

  function requireLogin() {
    if (!getSession()) {
      openModal(loginModal);
      showToast("Pehle login kijiye.", "error");
      return false;
    }
    return true;
  }

  function getProductById(productId) {
    return products.find((item) => item.id === productId);
  }

  async function createOrder(product) {
    const session = getSession();
    const createOrderEndpoint = paymentConfig.createOrderEndpoint || "/payments/create-order";

    const response = await fetch(buildApiUrl(createOrderEndpoint), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        name: session ? session.name : "",
        email: session ? session.email : ""
      })
    });

    if (!response.ok) {
      throw new Error("Order create failed");
    }

    return response.json();
  }

  async function verifyPayment(payload) {
    const verifyEndpoint = paymentConfig.verifyEndpoint || "/payments/verify";
    const response = await fetch(buildApiUrl(verifyEndpoint), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(text || "Payment verification failed");
    }

    return response.json();
  }

  function unlockProduct(productId) {
    const paidProducts = getPaidProducts();
    if (!paidProducts.includes(productId)) {
      paidProducts.push(productId);
      setPaidProducts(paidProducts);
    }
    renderProducts();
  }

  function buildReceiptHtml(receipt) {
    return `
      <div class="payment-grid">
        <div class="payment-card">
          <strong>Product</strong>
          <p>${receipt.productTitle}</p>
        </div>
        <div class="payment-card">
          <strong>Amount</strong>
          <p>${formatAmount(receipt.amount)}</p>
        </div>
      </div>
      <div class="payment-grid">
        <div class="payment-card">
          <strong>Order ID</strong>
          <p>${receipt.orderDocId || "-"}</p>
        </div>
        <div class="payment-card">
          <strong>Payment ID</strong>
          <p>${receipt.paymentId || "Manual / Not available"}</p>
        </div>
      </div>
      <div class="payment-grid">
        <div class="payment-card">
          <strong>Status</strong>
          <p>${receipt.status}</p>
        </div>
        <div class="payment-card">
          <strong>Date</strong>
          <p>${new Date(receipt.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    `;
  }

  function openReceiptModal(receipt) {
    if (!receipt) return;
    activeReceipt = receipt;
    receiptContent.innerHTML = buildReceiptHtml(receipt);
    openModal(receiptModal);
  }

  function downloadReceipt(receipt) {
    if (!receipt) return;
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Receipt - ${receipt.productTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
          .box { border: 1px solid #ccc; border-radius: 12px; padding: 20px; max-width: 640px; }
          h1 { margin-top: 0; }
          p { margin: 8px 0; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Payment Receipt</h1>
          <p><strong>Product:</strong> ${receipt.productTitle}</p>
          <p><strong>Amount:</strong> ${formatAmount(receipt.amount)}</p>
          <p><strong>Order ID:</strong> ${receipt.orderDocId || "-"}</p>
          <p><strong>Payment ID:</strong> ${receipt.paymentId || "Manual / Not available"}</p>
          <p><strong>Status:</strong> ${receipt.status}</p>
          <p><strong>Date:</strong> ${new Date(receipt.updatedAt).toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${receipt.productId || "receipt"}-receipt.html`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleSuccessRedirect() {
    const params = new URLSearchParams(window.location.search);
    const receiptOrderId = params.get("receipt");
    if (!receiptOrderId) return;

    const receipt = getReceipts().find((item) => item.orderDocId === receiptOrderId);
    if (receipt) {
      openReceiptModal(receipt);
      showToast("Payment successful. Receipt ready.");
    }

    const cleanUrl = window.location.pathname;
    window.history.replaceState({}, document.title, cleanUrl);
  }

  function configurePaymentModal(product, orderResult) {
    paymentProductName.textContent = product.title;
    paymentAmount.textContent = formatAmount(product.amount);
    paymentGatewayName.textContent = paymentConfig.gatewayLabel || "Razorpay";

    if (orderResult && orderResult.manualFallback) {
      paymentDescription.textContent = "Manual fallback mode active hai. Real payment IDs daalne ke baad is flow ko live gateway se connect kar dena.";
      paymentFlowType.textContent = "Fallback mode active.";
      confirmPaymentBtn.hidden = false;
      confirmPaymentBtn.textContent = "Confirm Payment";
      return;
    }

    paymentDescription.textContent = "Checkout create ho chuka hai. Confirm ya gateway completion ke baad unlock hoga.";
    paymentFlowType.textContent = "Gateway order ready.";
    confirmPaymentBtn.hidden = false;
    confirmPaymentBtn.textContent = "Confirm Payment";
  }

  async function openRazorpayCheckout(product, orderResult) {
    if (!window.Razorpay || !orderResult || !orderResult.razorpayOrder) {
      openModal(paymentModal);
      return;
    }

    const session = getSession();
    const razorpayOrder = orderResult.razorpayOrder;
    const options = {
      key: paymentConfig.razorpayKey,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: brandConfig.name || "GDZ Store",
      description: product.title,
      order_id: razorpayOrder.id,
      handler: async function (response) {
        try {
          const result = await verifyPayment({
            productId: product.id,
            email: session ? session.email : "",
            orderId: orderResult.orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          if (!result.success) throw new Error(result.message || "Payment verify failed");
          const receipt = {
            productId: product.id,
            productTitle: product.title,
            amount: product.amount,
            orderDocId: (result.order && result.order.docId) || orderResult.orderId || "",
            paymentId: response.razorpay_payment_id || "",
            status: "Paid",
            updatedAt: (result.order && result.order.updatedAt) || new Date().toISOString()
          };
          saveReceipt(receipt);
          unlockProduct(product.id);
          window.location.href = `./index.html?receipt=${encodeURIComponent(receipt.orderDocId)}`;
        } catch (error) {
          showToast(error.message || "Verification failed.", "error");
        }
      },
      prefill: {
        name: session ? session.name : "",
        email: session ? session.email : ""
      },
      theme: {
        color: "#ffd84d"
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }

  window.startPayment = async function (productId) {
    if (!requireLogin()) return;
    const product = getProductById(productId);
    if (!product) return;

    selectedProductId = productId;
    pendingPaymentContext = null;

    try {
      const orderResult = await createOrder(product);
      pendingPaymentContext = { product, orderResult };
      configurePaymentModal(product, orderResult);

      if (orderResult && orderResult.razorpayOrder && paymentConfig.razorpayKey && !paymentConfig.razorpayKey.includes("replace_with_your_key")) {
        await openRazorpayCheckout(product, orderResult);
        return;
      }

      if (paymentConfig.paymentLinkUrl) {
        paymentFlowType.textContent = "Payment link mode active. Link new tab me open hoga, uske baad payment confirm karna hoga.";
        paymentDescription.textContent = "Abhi actual Razorpay Key ID missing hai, isliye payment link fallback use ho raha hai. Real auto verification ke liye `rzp_live_...` Key ID chahiye.";
        window.open(paymentConfig.paymentLinkUrl, "_blank", "noopener");
      }

      openModal(paymentModal);
    } catch (error) {
      paymentProductName.textContent = product.title;
      paymentAmount.textContent = formatAmount(product.amount);
      paymentGatewayName.textContent = paymentConfig.gatewayLabel || "Razorpay";
      paymentDescription.textContent = "Backend unavailable ya config incomplete hai. Payment link fallback available ho to use open kiya ja sakta hai.";
      paymentFlowType.textContent = error.message;
      if (paymentConfig.paymentLinkUrl) {
        window.open(paymentConfig.paymentLinkUrl, "_blank", "noopener");
      }
      openModal(paymentModal);
    }
  };

  window.handleOrderDownload = function (productId) {
    const product = getProductById(productId);
    if (!product) return;
    if (!isPaid(productId)) {
      showToast("Pay karne ke baad hi yeh button kaam karega.", "error");
      return;
    }

    window.open(product.actionUrl, "_blank", "noopener");
    showToast(product.type === "download" ? "Download access opened." : "Order page opened.");
  };

  window.viewReceipt = function (productId) {
    const receipt = getReceipts().find((item) => item.productId === productId);
    if (!receipt) {
      showToast("Receipt not found.", "error");
      return;
    }
    openReceiptModal(receipt);
  };

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim();

    if (!name || !email) {
      showToast("Name aur email dono bhariye.", "error");
      return;
    }

    setSession({ name, email });
    updateAuthUI();
    closeModal(loginModal);
    showToast("Login successful.");
  });

  confirmPaymentBtn.addEventListener("click", async () => {
    if (!selectedProductId) return;
    const product = getProductById(selectedProductId);
    if (!product) return;

    confirmPaymentBtn.disabled = true;
    confirmPaymentBtn.textContent = "Processing...";

    try {
      const session = getSession();
      const payload = {
        productId: product.id,
        email: session ? session.email : "",
        manualFallback: true
      };

      const orderResult = pendingPaymentContext ? pendingPaymentContext.orderResult : null;
      if (orderResult && orderResult.orderId) {
        payload.orderId = orderResult.orderId;
      }

      const result = await verifyPayment(payload);
      if (!result.success) throw new Error(result.message || "Payment not verified");

      unlockProduct(product.id);
      const receipt = {
        productId: product.id,
        productTitle: product.title,
        amount: product.amount,
        orderDocId: (result.order && result.order.docId) || payload.orderId || "",
        paymentId: "",
        status: "Paid",
        updatedAt: (result.order && result.order.updatedAt) || new Date().toISOString()
      };
      saveReceipt(receipt);
      closeModal(paymentModal);
      window.location.href = `./index.html?receipt=${encodeURIComponent(receipt.orderDocId)}`;
    } catch (error) {
      showToast(error.message || "Payment verification failed.", "error");
    } finally {
      confirmPaymentBtn.disabled = false;
      confirmPaymentBtn.textContent = "Confirm Payment";
    }
  });

  loginBtn.addEventListener("click", () => openModal(loginModal));
  logoutBtn.addEventListener("click", () => {
    clearSession();
    updateAuthUI();
    showToast("Logout successful.");
  });

  document.getElementById("closeLoginModal").addEventListener("click", () => closeModal(loginModal));
  document.getElementById("cancelLoginBtn").addEventListener("click", () => closeModal(loginModal));
  document.getElementById("closePaymentModal").addEventListener("click", () => closeModal(paymentModal));
  document.getElementById("cancelPaymentBtn").addEventListener("click", () => closeModal(paymentModal));
  document.getElementById("closeReceiptModal").addEventListener("click", () => closeModal(receiptModal));
  document.getElementById("closeReceiptBtn").addEventListener("click", () => closeModal(receiptModal));
  downloadReceiptBtn.addEventListener("click", () => downloadReceipt(activeReceipt));

  [loginModal, paymentModal, receiptModal].forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  updateBrandUI();
  updateAuthUI();
  renderGatewayNote();
  loadProducts().then(() => {
    renderProducts();
    handleSuccessRedirect();
  });
})();
