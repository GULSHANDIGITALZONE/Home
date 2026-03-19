(function () {
  const config = window.STORE_CONFIG || {};
  const apiBaseUrl = (config.apiBaseUrl || "/api").replace(/\/+$/, "");

  const adminLoginForm = document.getElementById("adminLoginForm");
  const adminLoginStatus = document.getElementById("adminLoginStatus");
  const adminDashboard = document.getElementById("adminDashboard");
  const adminLogoutBtn = document.getElementById("adminLogoutBtn");
  const adminStatsGrid = document.getElementById("adminStatsGrid");
  const lowStockList = document.getElementById("lowStockList");
  const recentOrdersList = document.getElementById("recentOrdersList");
  const adminProductsList = document.getElementById("adminProductsList");
  const adminOrdersList = document.getElementById("adminOrdersList");
  const adminCouponsList = document.getElementById("adminCouponsList");
  const adminUsersList = document.getElementById("adminUsersList");
  const adminReviewsList = document.getElementById("adminReviewsList");
  const adminNotificationsList = document.getElementById("adminNotificationsList");
  const adminAnalyticsChart = document.getElementById("adminAnalyticsChart");
  const adminGiftCardsList = document.getElementById("adminGiftCardsList");
  const adminBlogList = document.getElementById("adminBlogList");
  const adminAdminsList = document.getElementById("adminAdminsList");
  const adminAuditList = document.getElementById("adminAuditList");
  const adminSupportTicketsList = document.getElementById("adminSupportTicketsList");
  const adminQuestionsList = document.getElementById("adminQuestionsList");
  const adminPermissionMatrix = document.getElementById("adminPermissionMatrix");
  const adminVendorPanel = document.getElementById("adminVendorPanel");
  const productForm = document.getElementById("productForm");
  const productFormStatus = document.getElementById("productFormStatus");
  const productImageInput = document.getElementById("productImage");
  const productImagePreview = document.getElementById("productImagePreview");
  const productImportJson = document.getElementById("productImportJson");
  const couponForm = document.getElementById("couponForm");
  const giftCardForm = document.getElementById("giftCardForm");
  const blogForm = document.getElementById("blogForm");
  const adminCreateForm = document.getElementById("adminCreateForm");
  const adminToast = document.getElementById("adminToast");
  const exportUsersBtn = document.getElementById("exportUsersBtn");
  const exportOrdersBtn = document.getElementById("exportOrdersBtn");
  const exportProductsBtn = document.getElementById("exportProductsBtn");
  const importProductsBtn = document.getElementById("importProductsBtn");
  const exportBackupBtn = document.getElementById("exportBackupBtn");
  const restoreBackupBtn = document.getElementById("restoreBackupBtn");
  const backupRestoreJson = document.getElementById("backupRestoreJson");

  let toastTimer = null;
  window.__adminWidgets = {};

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
    productImagePreview.textContent = "Image preview will appear here";
  }

  function fillProductForm(product) {
    document.getElementById("productDocId").value = product.docId || "";
    document.getElementById("productId").value = product.id || "";
    document.getElementById("productTitle").value = product.title || "";
    document.getElementById("productDetails").value = product.details || "";
    document.getElementById("productAmount").value = product.amount || "";
    document.getElementById("productImage").value = product.image || "";
    document.getElementById("productCategory").value = product.category || "digital";
    document.getElementById("productBadge").value = product.badge || "";
    document.getElementById("productStock").value = product.stock || "";
    document.getElementById("productOfferText").value = product.offerText || "";
    document.getElementById("productType").value = product.type || "download";
    document.getElementById("productActionLabel").value = product.actionLabel || "";
    document.getElementById("productActionUrl").value = product.actionUrl || "";
    document.getElementById("productFeatures").value = Array.isArray(product.features) ? product.features.join(", ") : "";
    document.getElementById("productTags").value = Array.isArray(product.tags) ? product.tags.join(", ") : "";
    document.getElementById("productBillingCycle").value = product.billingCycle || "";
    document.getElementById("productCountdownEndsAt").value = product.countdownEndsAt ? String(product.countdownEndsAt).slice(0, 16) : "";
    document.getElementById("productDynamicDiscountPercent").value = product.dynamicDiscountPercent || "";
    document.getElementById("productSlaText").value = product.slaText || "";
    document.getElementById("productVendorName").value = product.vendorName || "";
    document.getElementById("productGallery").value = Array.isArray(product.productGallery) ? product.productGallery.join(", ") : "";
    renderImagePreview(product.image || "");
  }

  function renderImagePreview(url) {
    if (!url) {
      productImagePreview.textContent = "Image preview will appear here";
      return;
    }
    productImagePreview.innerHTML = `<img src="${url}" alt="Preview">`;
  }

  function renderStats(stats) {
    const totals = (stats && stats.totals) || {};
    const widgets = (stats && stats.widgets) || {};
    adminStatsGrid.innerHTML = `
      <div class="admin-stat-card"><strong>${totals.products || 0}</strong><span>Products</span></div>
      <div class="admin-stat-card"><strong>${totals.orders || 0}</strong><span>Total Orders</span></div>
      <div class="admin-stat-card"><strong>${totals.paidOrders || 0}</strong><span>Paid Orders</span></div>
      <div class="admin-stat-card"><strong>${totals.refundedOrders || 0}</strong><span>Refunded</span></div>
      <div class="admin-stat-card"><strong>${totals.users || 0}</strong><span>Users</span></div>
      <div class="admin-stat-card"><strong>${totals.suspendedUsers || 0}</strong><span>Suspended</span></div>
      <div class="admin-stat-card"><strong>Rs. ${totals.revenue || 0}</strong><span>Revenue</span></div>
      <div class="admin-stat-card"><strong>${totals.reviews || 0}</strong><span>Reviews</span></div>
      <div class="admin-stat-card"><strong>${totals.averageRating || 0}</strong><span>Avg Rating</span></div>
      <div class="admin-stat-card"><strong>${totals.abandonedCarts || 0}</strong><span>Abandoned Carts</span></div>
      <div class="admin-stat-card"><strong>${totals.tickets || 0}</strong><span>Support Tickets</span></div>
      <div class="admin-stat-card"><strong>${totals.questions || 0}</strong><span>Questions</span></div>
    `;
    const lowStock = widgets.lowStock || [];
    lowStockList.innerHTML = lowStock.length
      ? lowStock.map((item) => `<article class="stack-item"><h3>${item.title}</h3><p>Only ${item.stock} left</p></article>`).join("")
      : '<div class="stack-item"><p>No low-stock products.</p></div>';
    const recentOrders = widgets.recentOrders || [];
    recentOrdersList.innerHTML = recentOrders.length
      ? recentOrders.map((item) => `<article class="stack-item"><h3>${item.productTitle}</h3><p>${item.customerEmail || "No email"} | ${item.status}</p></article>`).join("")
      : '<div class="stack-item"><p>No recent orders.</p></div>';
    window.__adminWidgets = widgets;
    renderAnalyticsChart(totals, widgets.salesTrend || []);
    renderPermissionMatrix();
    renderVendorPanel();
  }

  function renderAnalyticsChart(totals, salesTrend) {
    const data = [
      { label: "Orders", value: Number(totals.orders || 0) },
      { label: "Paid", value: Number(totals.paidOrders || 0) },
      { label: "Users", value: Number(totals.users || 0) },
      { label: "Reviews", value: Number(totals.reviews || 0) }
    ];
    const max = Math.max(...data.map((item) => item.value), 1);
    const summaryBars = data.map((item) => `
      <div class="chart-row">
        <span>${item.label}</span>
        <div class="chart-bar"><i style="width:${Math.max((item.value / max) * 100, 8)}%"></i></div>
        <strong>${item.value}</strong>
      </div>
    `).join("");
    const trendMax = Math.max(...salesTrend.map((item) => Number(item.revenue || 0)), 1);
    const trendBars = salesTrend.length ? `
      <div class="trend-grid">
        ${salesTrend.map((item) => `
          <div class="trend-card">
            <span>${item.day}</span>
            <div class="chart-bar"><i style="width:${Math.max((Number(item.revenue || 0) / trendMax) * 100, 8)}%"></i></div>
            <strong>Rs. ${Number(item.revenue || 0)}</strong>
          </div>
        `).join("")}
      </div>
    ` : "";
    const leaders = `
      <div class="leader-grid">
        <div class="leader-card">
          <h4>Top Products</h4>
          ${(window.__adminWidgets.topProducts || []).map((item) => `<p>${item.label} • Rs. ${item.revenue}</p>`).join("") || "<p>No data</p>"}
        </div>
        <div class="leader-card">
          <h4>Top Coupons</h4>
          ${(window.__adminWidgets.topCoupons || []).map((item) => `<p>${item.label} • ${item.uses} uses</p>`).join("") || "<p>No data</p>"}
        </div>
        <div class="leader-card">
          <h4>Top Referrers</h4>
          ${(window.__adminWidgets.topReferrers || []).map((item) => `<p>${item.label} • ${item.referrals} refs</p>`).join("") || "<p>No data</p>"}
        </div>
      </div>
    `;
    adminAnalyticsChart.innerHTML = summaryBars + trendBars + leaders;
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
          <span>Category: ${product.category || "-"}</span>
          <span>Stock: ${product.stock || 0}</span>
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
        <div class="stack-actions">
          <button class="btn btn-secondary" type="button" data-order-status="${order.docId}" data-status="paid">Mark Paid</button>
          <button class="btn btn-secondary" type="button" data-order-status="${order.docId}" data-status="delivered">Mark Delivered</button>
          <button class="btn btn-secondary" type="button" data-order-status="${order.docId}" data-status="failed">Mark Failed</button>
          <button class="btn btn-secondary" type="button" data-order-status="${order.docId}" data-status="pending">Mark Pending</button>
          <button class="btn btn-primary" type="button" data-order-refund="${order.docId}">Refund</button>
        </div>
      </article>
    `).join("");

    orders.forEach((order) => {
      adminOrdersList.querySelectorAll(`[data-order-status="${order.docId}"]`).forEach((button) => {
        button.addEventListener("click", async () => {
          try {
            await apiFetch(`/admin/orders/${order.docId}/status`, {
              method: "PUT",
              body: JSON.stringify({ status: button.getAttribute("data-status") })
            });
            showToast("Order status updated.");
            loadOrders();
            loadStats();
          } catch (error) {
            showToast(error.message, "error");
          }
        });
      });
      const refundBtn = adminOrdersList.querySelector(`[data-order-refund="${order.docId}"]`);
      if (refundBtn) {
        refundBtn.addEventListener("click", async () => {
          try {
            await apiFetch(`/admin/orders/${order.docId}/refund`, { method: "PUT" });
            showToast("Order refunded.");
            loadOrders();
            loadStats();
          } catch (error) {
            showToast(error.message, "error");
          }
        });
      }
    });
  }

  function renderCoupons(coupons) {
    if (!coupons.length) {
      adminCouponsList.innerHTML = '<div class="stack-item"><p>No coupons found.</p></div>';
      return;
    }
    adminCouponsList.innerHTML = coupons.map((coupon) => `
      <article class="stack-item">
        <h3>${coupon.code}</h3>
        <p>${coupon.description || "No description"}</p>
        <div class="stack-meta">
          <span>Type: ${coupon.type}</span>
          <span>Value: ${coupon.value}</span>
          <span>Used: ${coupon.usedCount || 0}/${coupon.usageLimit || "Unlimited"}</span>
          <span>Active: ${coupon.active ? "Yes" : "No"}</span>
        </div>
        <div class="stack-actions">
          <button class="btn btn-secondary" type="button" data-coupon-edit="${coupon.docId}">Edit</button>
          <button class="btn btn-primary" type="button" data-coupon-delete="${coupon.docId}">Delete</button>
        </div>
      </article>
    `).join("");

    coupons.forEach((coupon) => {
      const editBtn = adminCouponsList.querySelector(`[data-coupon-edit="${coupon.docId}"]`);
      const deleteBtn = adminCouponsList.querySelector(`[data-coupon-delete="${coupon.docId}"]`);
      if (editBtn) {
        editBtn.addEventListener("click", () => {
          document.getElementById("couponDocId").value = coupon.docId;
          document.getElementById("couponCode").value = coupon.code;
          document.getElementById("couponType").value = coupon.type;
          document.getElementById("couponValue").value = coupon.value;
          document.getElementById("couponUsageLimit").value = coupon.usageLimit || 0;
          document.getElementById("couponExpiresAt").value = coupon.expiresAt ? String(coupon.expiresAt).slice(0, 16) : "";
          document.getElementById("couponDescription").value = coupon.description || "";
        });
      }
      if (deleteBtn) {
        deleteBtn.addEventListener("click", async () => {
          try {
            await apiFetch(`/admin/coupons/${coupon.docId}`, { method: "DELETE" });
            showToast("Coupon deleted.");
            loadCoupons();
          } catch (error) {
            showToast(error.message, "error");
          }
        });
      }
    });
  }

  function renderUsers(users) {
    if (!users.length) {
      adminUsersList.innerHTML = '<div class="stack-item"><p>No users synced yet.</p></div>';
      return;
    }
    adminUsersList.innerHTML = users.map((user) => `
      <article class="stack-item">
        <h3>${user.name || "User"}</h3>
        <p>${user.email || user.phone || "No contact info"}</p>
        <div class="stack-meta">
          <span>Updated: ${new Date(user.updatedAt || user.createdAt).toLocaleString()}</span>
          <span>Status: ${user.status || "active"}</span>
          <span>Refs: ${user.referralCount || 0}</span>
          <span>Credit: Rs. ${user.referralCredit || 0}</span>
          <span>Payout: ${user.payoutStatus || "pending"}</span>
        </div>
        <div class="stack-actions">
          <button class="btn btn-secondary" type="button" data-user-status="${user.docId}" data-status="${user.status === "suspended" ? "active" : "suspended"}">${user.status === "suspended" ? "Activate" : "Suspend"}</button>
          <button class="btn btn-secondary" type="button" data-user-payout="${user.docId}" data-payout="paid">Mark Payout Paid</button>
        </div>
      </article>
    `).join("");

    users.forEach((user) => {
      const statusBtn = adminUsersList.querySelector(`[data-user-status="${user.docId}"]`);
      const payoutBtn = adminUsersList.querySelector(`[data-user-payout="${user.docId}"]`);
      if (statusBtn) {
        statusBtn.addEventListener("click", async () => {
          try {
            await apiFetch(`/admin/users/${user.docId}/status`, {
              method: "PUT",
              body: JSON.stringify({ status: statusBtn.getAttribute("data-status") })
            });
            showToast("User status updated.");
            loadUsers();
            loadStats();
          } catch (error) {
            showToast(error.message, "error");
          }
        });
      }
      if (payoutBtn) {
        payoutBtn.addEventListener("click", async () => {
          try {
            await apiFetch(`/admin/users/${user.docId}/status`, {
              method: "PUT",
              body: JSON.stringify({ payoutStatus: payoutBtn.getAttribute("data-payout") })
            });
            showToast("Payout status updated.");
            loadUsers();
          } catch (error) {
            showToast(error.message, "error");
          }
        });
      }
    });
  }

  function renderReviews(reviews) {
    if (!reviews.length) {
      adminReviewsList.innerHTML = '<div class="stack-item"><p>No reviews found.</p></div>';
      return;
    }
    adminReviewsList.innerHTML = reviews.map((review) => `
      <article class="stack-item">
        <h3>${review.title || review.productTitle}</h3>
        <p>${review.message}</p>
        <div class="stack-meta">
          <span>${review.name || "User"}</span>
          <span>${review.productTitle}</span>
          <span>${review.rating}/5</span>
        </div>
        <div class="stack-actions">
          <button class="btn btn-primary" type="button" data-review-delete="${review.docId}">Delete</button>
        </div>
      </article>
    `).join("");

    reviews.forEach((review) => {
      const button = adminReviewsList.querySelector(`[data-review-delete="${review.docId}"]`);
      if (!button) return;
      button.addEventListener("click", async () => {
        try {
          await apiFetch(`/admin/reviews/${review.docId}`, { method: "DELETE" });
          showToast("Review deleted.");
          loadReviews();
          loadStats();
        } catch (error) {
          showToast(error.message, "error");
        }
      });
    });
  }

  function renderNotifications(notifications) {
    if (!notifications.length) {
      adminNotificationsList.innerHTML = '<div class="stack-item"><p>No notifications yet.</p></div>';
      return;
    }
    adminNotificationsList.innerHTML = notifications.map((item) => `
      <article class="stack-item">
        <h3>${item.title}</h3>
        <p>${item.message}</p>
        <div class="stack-meta">
          <span>${item.type || "system"}</span>
          <span>${new Date(item.createdAt).toLocaleString()}</span>
        </div>
      </article>
    `).join("");
  }

  function renderGiftCards(giftCards) {
    adminGiftCardsList.innerHTML = giftCards.length
      ? giftCards.map((item) => `
        <article class="stack-item">
          <h3>${item.code}</h3>
          <p>Balance: Rs. ${item.balance}</p>
          <div class="stack-meta">
            <span>Assigned: ${item.assignedEmail || "Open"}</span>
            <span>Active: ${item.active ? "Yes" : "No"}</span>
          </div>
        </article>
      `).join("")
      : '<div class="stack-item"><p>No gift cards yet.</p></div>';
  }

  function renderBlog(posts) {
    adminBlogList.innerHTML = posts.length
      ? posts.map((post) => `
        <article class="stack-item">
          <h3>${post.title}</h3>
          <p>${post.excerpt || ""}</p>
          <div class="stack-meta">
            <span>${post.slug}</span>
            <span>${new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
          </div>
        </article>
      `).join("")
      : '<div class="stack-item"><p>No blog posts yet.</p></div>';
  }

  function renderAdmins(admins) {
    adminAdminsList.innerHTML = admins.length
      ? admins.map((admin) => `
        <article class="stack-item">
          <h3>${admin.name || admin.username}</h3>
          <p>${admin.username}</p>
          <div class="stack-meta">
            <span>Role: ${admin.role}</span>
            <span>Active: ${admin.active ? "Yes" : "No"}</span>
          </div>
        </article>
      `).join("")
      : '<div class="stack-item"><p>No extra admins yet.</p></div>';
  }

  function renderAudit(entries) {
    adminAuditList.innerHTML = entries.length
      ? entries.map((entry) => `
        <article class="stack-item">
          <h3>${entry.action}</h3>
          <p>${entry.target || "No target"}</p>
          <div class="stack-meta">
            <span>${entry.actor || "system"}</span>
            <span>${entry.role || "-"}</span>
            <span>${new Date(entry.at).toLocaleString()}</span>
          </div>
        </article>
      `).join("")
      : '<div class="stack-item"><p>No audit entries yet.</p></div>';
  }

  function renderSupportTickets(tickets) {
    if (!adminSupportTicketsList) return;
    adminSupportTicketsList.innerHTML = tickets.length
      ? tickets.map((ticket) => `
        <article class="stack-item">
          <h3>${ticket.subject}</h3>
          <p>${ticket.message}</p>
          <div class="stack-meta">
            <span>${ticket.email}</span>
            <span>${ticket.status}</span>
            <span>${new Date(ticket.updatedAt || ticket.createdAt).toLocaleString()}</span>
          </div>
          <div class="stack-actions">
            <button class="btn btn-secondary" type="button" data-ticket-status="${ticket.docId}" data-status="in_progress">In Progress</button>
            <button class="btn btn-secondary" type="button" data-ticket-status="${ticket.docId}" data-status="closed">Close</button>
          </div>
        </article>
      `).join("")
      : '<div class="stack-item"><p>No support tickets yet.</p></div>';

    tickets.forEach((ticket) => {
      adminSupportTicketsList.querySelectorAll(`[data-ticket-status="${ticket.docId}"]`).forEach((button) => {
        button.addEventListener("click", async () => {
          try {
            await apiFetch(`/admin/support-tickets/${ticket.docId}/status`, {
              method: "PUT",
              body: JSON.stringify({ status: button.getAttribute("data-status") })
            });
            showToast("Ticket updated.");
            loadSupportTickets();
            loadStats();
          } catch (error) {
            showToast(error.message, "error");
          }
        });
      });
    });
  }

  function renderQuestions(questions) {
    if (!adminQuestionsList) return;
    adminQuestionsList.innerHTML = questions.length
      ? questions.map((item) => `
        <article class="stack-item">
          <h3>${item.productId}</h3>
          <p>Q: ${item.question}</p>
          <div class="stack-meta">
            <span>${item.name || item.email || "User"}</span>
            <span>${item.answer ? "Answered" : "Pending"}</span>
          </div>
          <div class="field">
            <label for="answer-${item.docId}">Answer</label>
            <textarea id="answer-${item.docId}" class="admin-textarea" placeholder="Type answer here">${item.answer || ""}</textarea>
          </div>
          <div class="stack-actions">
            <button class="btn btn-primary" type="button" data-question-answer="${item.docId}">Save Answer</button>
          </div>
        </article>
      `).join("")
      : '<div class="stack-item"><p>No product questions yet.</p></div>';

    questions.forEach((item) => {
      const button = adminQuestionsList.querySelector(`[data-question-answer="${item.docId}"]`);
      if (!button) return;
      button.addEventListener("click", async () => {
        const answerField = document.getElementById(`answer-${item.docId}`);
        try {
          await apiFetch(`/admin/questions/${item.docId}/answer`, {
            method: "PUT",
            body: JSON.stringify({ answer: answerField ? answerField.value.trim() : "" })
          });
          showToast("Answer saved.");
          loadQuestions();
          loadStats();
        } catch (error) {
          showToast(error.message, "error");
        }
      });
    });
  }

  function renderPermissionMatrix() {
    if (!adminPermissionMatrix) return;
    adminPermissionMatrix.innerHTML = `
      <article class="stack-item"><h3>Super Admin</h3><p>Full products, orders, refunds, backup/restore, admins management.</p></article>
      <article class="stack-item"><h3>Manager</h3><p>Products, coupons, users, analytics, tickets, questions.</p></article>
      <article class="stack-item"><h3>Editor</h3><p>Products, blog, reviews moderation, content updates.</p></article>
      <article class="stack-item"><h3>Support</h3><p>Tickets, Q&A, notifications, order follow-up.</p></article>
    `;
  }

  function renderVendorPanel() {
    if (!adminVendorPanel) return;
    const abandoned = window.__adminWidgets.abandonedCarts || [];
    const topReferrers = window.__adminWidgets.topReferrers || [];
    adminVendorPanel.innerHTML = `
      <article class="stack-item">
        <h3>Affiliate / Franchise Leaders</h3>
        ${topReferrers.map((item) => `<p>${item.label} · ${item.referrals} refs · ${item.payoutStatus}</p>`).join("") || "<p>No referral leaders yet.</p>"}
      </article>
      <article class="stack-item">
        <h3>Abandoned Cart Watch</h3>
        ${abandoned.map((item) => `<p>${item.email} · ${item.count} items pending</p>`).join("") || "<p>No abandoned carts right now.</p>"}
      </article>
    `;
  }

  async function loadProducts() {
    const data = await apiFetch("/admin/products");
    renderProducts(data.products || []);
  }

  async function loadOrders() {
    const data = await apiFetch("/admin/orders");
    renderOrders(data.orders || []);
  }

  async function loadStats() {
    const data = await apiFetch("/admin/stats");
    renderStats(data || {});
  }

  async function loadCoupons() {
    const data = await apiFetch("/admin/coupons");
    renderCoupons(data.coupons || []);
  }

  async function loadUsers() {
    const data = await apiFetch("/admin/users");
    renderUsers(data.users || []);
  }

  async function loadReviews() {
    const data = await apiFetch("/admin/reviews");
    renderReviews(data.reviews || []);
  }

  async function loadNotifications() {
    const data = await apiFetch("/admin/notifications");
    renderNotifications(data.notifications || []);
  }

  async function loadGiftCards() {
    const data = await apiFetch("/admin/gift-cards");
    renderGiftCards(data.giftCards || []);
  }

  async function loadBlog() {
    const data = await apiFetch("/admin/blog");
    renderBlog(data.posts || []);
  }

  async function loadAdmins() {
    const data = await apiFetch("/admin/admins");
    renderAdmins(data.admins || []);
  }

  async function loadAudit() {
    const data = await apiFetch("/admin/audit-log");
    renderAudit(data.entries || []);
  }

  async function loadSupportTickets() {
    const data = await apiFetch("/admin/support-tickets");
    renderSupportTickets(data.tickets || []);
  }

  async function loadQuestions() {
    const data = await apiFetch("/admin/questions");
    renderQuestions(data.questions || []);
  }

  async function initDashboard() {
    adminDashboard.hidden = false;
    adminLogoutBtn.hidden = false;
    await Promise.all([loadStats(), loadProducts(), loadOrders(), loadCoupons(), loadUsers(), loadReviews(), loadNotifications(), loadGiftCards(), loadBlog(), loadAdmins(), loadAudit(), loadSupportTickets(), loadQuestions()]);
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
      category: document.getElementById("productCategory").value,
      badge: document.getElementById("productBadge").value,
      stock: Number(document.getElementById("productStock").value || 0),
      offerText: document.getElementById("productOfferText").value.trim(),
      type: document.getElementById("productType").value,
      actionLabel: document.getElementById("productActionLabel").value.trim(),
      actionUrl: document.getElementById("productActionUrl").value.trim(),
      features: document.getElementById("productFeatures").value.split(",").map((item) => item.trim()).filter(Boolean),
      tags: document.getElementById("productTags").value.split(",").map((item) => item.trim()).filter(Boolean),
      billingCycle: document.getElementById("productBillingCycle").value.trim(),
      countdownEndsAt: document.getElementById("productCountdownEndsAt").value || "",
      dynamicDiscountPercent: Number(document.getElementById("productDynamicDiscountPercent").value || 0),
      slaText: document.getElementById("productSlaText").value.trim(),
      vendorName: document.getElementById("productVendorName").value.trim(),
      productGallery: document.getElementById("productGallery").value.split(",").map((item) => item.trim()).filter(Boolean)
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
      loadStats();
    } catch (error) {
      productFormStatus.textContent = error.message;
      showToast(error.message, "error");
    }
  });

  couponForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const docId = document.getElementById("couponDocId").value.trim();
    const payload = {
      code: document.getElementById("couponCode").value.trim(),
      type: document.getElementById("couponType").value,
      value: Number(document.getElementById("couponValue").value || 0),
      usageLimit: Number(document.getElementById("couponUsageLimit").value || 0),
      expiresAt: document.getElementById("couponExpiresAt").value || "",
      description: document.getElementById("couponDescription").value.trim(),
      active: true
    };
    try {
      if (docId) {
        await apiFetch(`/admin/coupons/${docId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch("/admin/coupons", {
          method: "POST",
          body: JSON.stringify(payload)
        });
      }
      couponForm.reset();
      document.getElementById("couponDocId").value = "";
      document.getElementById("couponUsageLimit").value = "";
      document.getElementById("couponExpiresAt").value = "";
      showToast("Coupon saved.");
      loadCoupons();
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  giftCardForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await apiFetch("/admin/gift-cards", {
        method: "POST",
        body: JSON.stringify({
          code: document.getElementById("giftCardCode").value.trim(),
          amount: Number(document.getElementById("giftCardAmount").value || 0),
          assignedEmail: document.getElementById("giftCardEmail").value.trim(),
          expiresAt: document.getElementById("giftCardExpiresAt").value || ""
        })
      });
      giftCardForm.reset();
      showToast("Gift card created.");
      loadGiftCards();
      loadAudit();
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  blogForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await apiFetch("/admin/blog", {
        method: "POST",
        body: JSON.stringify({
          title: document.getElementById("blogTitle").value.trim(),
          slug: document.getElementById("blogSlug").value.trim(),
          excerpt: document.getElementById("blogExcerpt").value.trim(),
          coverImage: document.getElementById("blogCoverImage").value.trim(),
          tags: document.getElementById("blogTags").value.split(",").map((item) => item.trim()).filter(Boolean),
          content: document.getElementById("blogContent").value.trim()
        })
      });
      blogForm.reset();
      showToast("Blog published.");
      loadBlog();
      loadAudit();
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  adminCreateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await apiFetch("/admin/admins", {
        method: "POST",
        body: JSON.stringify({
          name: document.getElementById("newAdminName").value.trim(),
          username: document.getElementById("newAdminUsername").value.trim(),
          password: document.getElementById("newAdminPassword").value,
          role: document.getElementById("newAdminRole").value
        })
      });
      adminCreateForm.reset();
      showToast("Admin created.");
      loadAdmins();
      loadAudit();
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  document.getElementById("resetProductFormBtn").addEventListener("click", resetProductForm);
  document.getElementById("refreshProductsBtn").addEventListener("click", loadProducts);
  document.getElementById("refreshOrdersBtn").addEventListener("click", loadOrders);
  document.getElementById("refreshUsersBtn").addEventListener("click", loadUsers);
  document.getElementById("refreshReviewsBtn").addEventListener("click", loadReviews);
  document.getElementById("refreshNotificationsBtn").addEventListener("click", loadNotifications);
  document.getElementById("refreshAuditBtn").addEventListener("click", loadAudit);
  document.getElementById("refreshSupportTicketsBtn").addEventListener("click", loadSupportTickets);
  document.getElementById("refreshQuestionsBtn").addEventListener("click", loadQuestions);
  productImageInput.addEventListener("input", () => renderImagePreview(productImageInput.value.trim()));
  exportUsersBtn.addEventListener("click", async () => {
    const response = await fetch(buildApiUrl("/admin/export/users.csv"), {
      headers: { Authorization: "Bearer " + getToken() }
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.csv";
    link.click();
    URL.revokeObjectURL(url);
  });
  exportOrdersBtn.addEventListener("click", async () => {
    const response = await fetch(buildApiUrl("/admin/export/orders.csv"), {
      headers: { Authorization: "Bearer " + getToken() }
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  });
  exportProductsBtn.addEventListener("click", async () => {
    const response = await fetch(buildApiUrl("/admin/export/products.json"), {
      headers: { Authorization: "Bearer " + getToken() }
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "products.json";
    link.click();
    URL.revokeObjectURL(url);
  });
  importProductsBtn.addEventListener("click", async () => {
    try {
      const products = JSON.parse(productImportJson.value || "[]");
      await apiFetch("/admin/import/products", {
        method: "POST",
        body: JSON.stringify({ products })
      });
      showToast("Products imported.");
      productImportJson.value = "";
      loadProducts();
      loadStats();
    } catch (error) {
      showToast(error.message || "Import failed", "error");
    }
  });
  exportBackupBtn.addEventListener("click", async () => {
    try {
      const data = await apiFetch("/admin/system-backup");
      const blob = new Blob([JSON.stringify(data.backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "gdz-store-backup.json";
      link.click();
      URL.revokeObjectURL(url);
      showToast("Backup exported.");
    } catch (error) {
      showToast(error.message, "error");
    }
  });
  restoreBackupBtn.addEventListener("click", async () => {
    try {
      const backup = JSON.parse(backupRestoreJson.value || "{}");
      await apiFetch("/admin/system-restore", {
        method: "POST",
        body: JSON.stringify({ backup })
      });
      showToast("Backup restored.");
      backupRestoreJson.value = "";
      initDashboard();
    } catch (error) {
      showToast(error.message || "Restore failed", "error");
    }
  });

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
