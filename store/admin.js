(function () {
  const config = window.STORE_CONFIG || {};
  const apiBaseUrl = (config.apiBaseUrl || "/api").replace(/\/+$/, "");

  const adminLoginForm = document.getElementById("adminLoginForm");
  const adminLoginStatus = document.getElementById("adminLoginStatus");
  const adminDashboard = document.getElementById("adminDashboard");
  const adminLogoutBtn = document.getElementById("adminLogoutBtn");
  const adminProductsList = document.getElementById("adminProductsList");
  const adminOrdersList = document.getElementById("adminOrdersList");
  const productForm = document.getElementById("productForm");
  const productFormStatus = document.getElementById("productFormStatus");
  const adminToast = document.getElementById("adminToast");

  let toastTimer = null;

  function buildApiUrl(path) {
    return apiBaseUrl + (path.startsWith("/") ? path : "/" + path);
  }

  function getToken() {
    return localStorage.getItem("gdz_store_admin_token") || "";
  }

  function setToken(token) {
    localStorage.setItem("gdz_store_admin_token", token);
  }

  function clearToken() {
    localStorage.removeItem("gdz_store_admin_token");
  }

  function showToast(message, type) {
    clearTimeout(toastTimer);
    adminToast.textContent = message;
    adminToast.className = "toast show " + (type || "success");
    toastTimer = setTimeout(() => {
      adminToast.className = "toast";
    }, 2600);
  }

  async function apiFetch(path, options) {
    const response = await fetch(buildApiUrl(path), {
      ...(options || {}),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getToken(),
        ...((options && options.headers) || {})
      }
    });

    if (response.status === 401) {
      clearToken();
      adminDashboard.hidden = true;
      adminLogoutBtn.hidden = true;
      throw new Error("Admin login required");
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      throw new Error((data && data.message) || "Request failed");
    }
    return data;
  }

  function resetProductForm() {
    productForm.reset();
    document.getElementById("productDocId").value = "";
    productFormStatus.textContent = "";
  }

  function fillProductForm(product) {
    document.getElementById("productDocId").value = product.docId || "";
    document.getElementById("productId").value = product.id || "";
    document.getElementById("productTitle").value = product.title || "";
    document.getElementById("productDetails").value = product.details || "";
    document.getElementById("productAmount").value = product.amount || "";
    document.getElementById("productImage").value = product.image || "";
    document.getElementById("productType").value = product.type || "download";
    document.getElementById("productActionLabel").value = product.actionLabel || "";
    document.getElementById("productActionUrl").value = product.actionUrl || "";
    document.getElementById("productFeatures").value = Array.isArray(product.features) ? product.features.join(", ") : "";
  }

  function renderProducts(products) {
    if (!products.length) {
      adminProductsList.innerHTML = '<div class="stack-item"><p>No products found.</p></div>';
      return;
    }

    adminProductsList.innerHTML = products.map((product) => `
      <article class="stack-item">
        <h3>${product.title}</h3>
        <p>${product.details}</p>
        <div class="stack-meta">
          <span>ID: ${product.id}</span>
          <span>Amount: Rs. ${product.amount}</span>
          <span>Type: ${product.type}</span>
        </div>
        <div class="stack-actions">
          <button class="btn btn-secondary" type="button" data-edit="${product.docId}">Edit</button>
          <button class="btn btn-primary" type="button" data-delete="${product.docId}">Delete</button>
        </div>
      </article>
    `).join("");

    products.forEach((product) => {
      const editBtn = adminProductsList.querySelector(`[data-edit="${product.docId}"]`);
      const deleteBtn = adminProductsList.querySelector(`[data-delete="${product.docId}"]`);
      if (editBtn) editBtn.addEventListener("click", () => fillProductForm(product));
      if (deleteBtn) {
        deleteBtn.addEventListener("click", async () => {
          try {
            await apiFetch(`/admin/products/${product.docId}`, { method: "DELETE" });
            showToast("Product deleted.");
            loadProducts();
          } catch (error) {
            showToast(error.message, "error");
          }
        });
      }
    });
  }

  function renderOrders(orders) {
    if (!orders.length) {
      adminOrdersList.innerHTML = '<div class="stack-item"><p>No orders found.</p></div>';
      return;
    }

    adminOrdersList.innerHTML = orders.map((order) => `
      <article class="stack-item">
        <h3>${order.productTitle || order.productId}</h3>
        <p>${order.customerName || "Customer"} | ${order.customerEmail || "No email"}</p>
        <div class="stack-meta">
          <span>Status: ${order.status}</span>
          <span>Amount: Rs. ${order.amount}</span>
          <span>Mode: ${order.mode || "n/a"}</span>
          <span>Date: ${new Date(order.updatedAt || order.createdAt).toLocaleString()}</span>
        </div>
      </article>
    `).join("");
  }

  async function loadProducts() {
    const data = await apiFetch("/admin/products");
    renderProducts(data.products || []);
  }

  async function loadOrders() {
    const data = await apiFetch("/admin/orders");
    renderOrders(data.orders || []);
  }

  async function initDashboard() {
    adminDashboard.hidden = false;
    adminLogoutBtn.hidden = false;
    await Promise.all([loadProducts(), loadOrders()]);
  }

  adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value;

    try {
      const result = await fetch(buildApiUrl("/auth/admin-login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await result.json();
      if (!result.ok) throw new Error(data.message || "Login failed");
      setToken(data.token);
      adminLoginStatus.textContent = "";
      showToast("Admin login successful.");
      initDashboard();
    } catch (error) {
      adminLoginStatus.textContent = error.message;
      showToast(error.message, "error");
    }
  });

  productForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const docId = document.getElementById("productDocId").value.trim();
    const payload = {
      id: document.getElementById("productId").value.trim(),
      title: document.getElementById("productTitle").value.trim(),
      details: document.getElementById("productDetails").value.trim(),
      amount: Number(document.getElementById("productAmount").value),
      image: document.getElementById("productImage").value.trim(),
      type: document.getElementById("productType").value,
      actionLabel: document.getElementById("productActionLabel").value.trim(),
      actionUrl: document.getElementById("productActionUrl").value.trim(),
      features: document.getElementById("productFeatures").value.split(",").map((item) => item.trim()).filter(Boolean)
    };

    try {
      if (docId) {
        await apiFetch(`/admin/products/${docId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch("/admin/products", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      productFormStatus.textContent = "Product saved.";
      showToast("Product saved.");
      resetProductForm();
      loadProducts();
    } catch (error) {
      productFormStatus.textContent = error.message;
      showToast(error.message, "error");
    }
  });

  document.getElementById("resetProductFormBtn").addEventListener("click", resetProductForm);
  document.getElementById("refreshProductsBtn").addEventListener("click", loadProducts);
  document.getElementById("refreshOrdersBtn").addEventListener("click", loadOrders);

  adminLogoutBtn.addEventListener("click", () => {
    clearToken();
    adminDashboard.hidden = true;
    adminLogoutBtn.hidden = true;
    showToast("Admin logout successful.");
  });

  if (getToken()) {
    initDashboard().catch((error) => {
      showToast(error.message, "error");
    });
  }
})();
