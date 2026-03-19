(function () {
  const config = window.STORE_CONFIG || {};
  const apiBaseUrl = (config.apiBaseUrl || "/api").replace(/\/+$/, "");
  const brandConfig = config.brand || {};
  const paymentConfig = config.payment || {};
  const backupPaymentConfig = config.backupPayment || {};
  let products = Array.isArray(config.products) ? [...config.products] : [];

  const productGrid = document.getElementById("productGrid");
  const userStatus = document.getElementById("userStatus");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const profileBtn = document.getElementById("profileBtn");
  const languageToggleBtn = document.getElementById("languageToggleBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const installAppBtn = document.getElementById("installAppBtn");
  const loginModal = document.getElementById("loginModal");
  const paymentModal = document.getElementById("paymentModal");
  const loginForm = document.getElementById("loginForm");
  const toast = document.getElementById("toast");
  const paymentProductName = document.getElementById("paymentProductName");
  const paymentAmount = document.getElementById("paymentAmount");
  const paymentGatewayName = document.getElementById("paymentGatewayName");
  const paymentFlowType = document.getElementById("paymentFlowType");
  const paymentDescription = document.getElementById("paymentDescription");
  const backupPaymentBox = document.getElementById("backupPaymentBox");
  const upiPaymentBtn = document.getElementById("upiPaymentBtn");
  const cashfreePaymentBtn = document.getElementById("cashfreePaymentBtn");
  const phonepePaymentBtn = document.getElementById("phonepePaymentBtn");
  const gatewayNote = document.getElementById("gatewayNote");
  const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
  const statProductCount = document.getElementById("statProductCount");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortSelect");
  const cartItemsList = document.getElementById("cartItemsList");
  const cartSubtotal = document.getElementById("cartSubtotal");
  const cartDiscount = document.getElementById("cartDiscount");
  const cartTotal = document.getElementById("cartTotal");
  const couponInput = document.getElementById("couponInput");
  const applyCouponBtn = document.getElementById("applyCouponBtn");
  const couponStatus = document.getElementById("couponStatus");
  const checkoutCartBtn = document.getElementById("checkoutCartBtn");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const receiptModal = document.getElementById("receiptModal");
  const receiptContent = document.getElementById("receiptContent");
  const downloadReceiptBtn = document.getElementById("downloadReceiptBtn");
  const invoicePdfBtn = document.getElementById("invoicePdfBtn");
  const emailReceiptBtn = document.getElementById("emailReceiptBtn");
  const whatsappReceiptBtn = document.getElementById("whatsappReceiptBtn");
  const profileMenu = document.getElementById("profileMenu");
  const menuDashboardBtn = document.getElementById("menuDashboardBtn");
  const menuEditProfileBtn = document.getElementById("menuEditProfileBtn");
  const menuUploadImageBtn = document.getElementById("menuUploadImageBtn");
  const menuWishlistBtn = document.getElementById("menuWishlistBtn");
  const menuSettingsBtn = document.getElementById("menuSettingsBtn");
  const authTabs = document.querySelectorAll("[data-auth-tab]");
  const authPanels = document.querySelectorAll("[data-auth-panel]");
  const userDashboard = document.getElementById("userDashboard");
  const profilePhoto = document.getElementById("profilePhoto");
  const profileAvatar = document.getElementById("profileAvatar");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profilePaidCount = document.getElementById("profilePaidCount");
  const profileReceiptCount = document.getElementById("profileReceiptCount");
  const loyaltyPointsValue = document.getElementById("loyaltyPointsValue");
  const walletBalanceValue = document.getElementById("walletBalanceValue");
  const giftCardCodeInput = document.getElementById("giftCardCodeInput");
  const applyWalletCheck = document.getElementById("applyWalletCheck");
  const redeemGiftCardBtn = document.getElementById("redeemGiftCardBtn");
  const myProductsList = document.getElementById("myProductsList");
  const orderHistoryList = document.getElementById("orderHistoryList");
  const wishlistList = document.getElementById("wishlistList");
  const downloadManagerList = document.getElementById("downloadManagerList");
  const notificationInboxList = document.getElementById("notificationInboxList");
  const dashboardWidgetsList = document.getElementById("dashboardWidgetsList");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const openWishlistBtn = document.getElementById("openWishlistBtn");
  const profileModal = document.getElementById("profileModal");
  const profileForm = document.getElementById("profileForm");
  const profileNameInput = document.getElementById("profileNameInput");
  const profileEmailInput = document.getElementById("profileEmailInput");
  const profilePhotoInput = document.getElementById("profilePhotoInput");
  const imageCardModal = document.getElementById("imageCardModal");
  const imageCardForm = document.getElementById("imageCardForm");
  const imageCardUrl = document.getElementById("imageCardUrl");
  const referralLinkInput = document.getElementById("referralLinkInput");
  const referralCountValue = document.getElementById("referralCountValue");
  const referralCreditValue = document.getElementById("referralCreditValue");
  const copyReferralBtn = document.getElementById("copyReferralBtn");
  const shareWhatsappBtn = document.getElementById("shareWhatsappBtn");
  const openSettingsBtn = document.getElementById("openSettingsBtn");
  const exportDataBtn = document.getElementById("exportDataBtn");
  const addressPreviewList = document.getElementById("addressPreviewList");
  const settingsModal = document.getElementById("settingsModal");
  const settingsForm = document.getElementById("settingsForm");
  const addressLineInput = document.getElementById("addressLineInput");
  const notificationEmailInput = document.getElementById("notificationEmailInput");
  const notifyEmailCheck = document.getElementById("notifyEmailCheck");
  const notifyWhatsappCheck = document.getElementById("notifyWhatsappCheck");
  const reviewForm = document.getElementById("reviewForm");
  const reviewProductId = document.getElementById("reviewProductId");
  const reviewRating = document.getElementById("reviewRating");
  const reviewTitle = document.getElementById("reviewTitle");
  const reviewMessage = document.getElementById("reviewMessage");
  const reviewMediaUrl = document.getElementById("reviewMediaUrl");
  const reviewMediaType = document.getElementById("reviewMediaType");
  const reviewFilterRating = document.getElementById("reviewFilterRating");
  const reviewsList = document.getElementById("reviewsList");
  const reviewAverage = document.getElementById("reviewAverage");
  const reviewCountText = document.getElementById("reviewCountText");
  const recentlyViewedList = document.getElementById("recentlyViewedList");
  const recommendedList = document.getElementById("recommendedList");
  const comparePreviewList = document.getElementById("comparePreviewList");
  const blogPreviewList = document.getElementById("blogPreviewList");
  const bundleBuilderList = document.getElementById("bundleBuilderList");
  const bundleSummaryBox = document.getElementById("bundleSummaryBox");
  const couponSuggestionBox = document.getElementById("couponSuggestionBox");
  const newsletterEmail = document.getElementById("newsletterEmail");
  const newsletterBtn = document.getElementById("newsletterBtn");
  const supportWidget = document.getElementById("supportWidget");
  const supportWidgetToggle = document.getElementById("supportWidgetToggle");
  const supportWidgetPanel = document.getElementById("supportWidgetPanel");
  const supportEmailBtn = document.getElementById("supportEmailBtn");
  const supportWhatsappBtn = document.getElementById("supportWhatsappBtn");
  const chatbotPaymentBtn = document.getElementById("chatbotPaymentBtn");
  const chatbotDownloadBtn = document.getElementById("chatbotDownloadBtn");
  const chatbotOrderBtn = document.getElementById("chatbotOrderBtn");
  const chatbotReply = document.getElementById("chatbotReply");
  const supportTicketForm = document.getElementById("supportTicketForm");
  const supportSubject = document.getElementById("supportSubject");
  const supportMessage = document.getElementById("supportMessage");
  const questionForm = document.getElementById("questionForm");
  const questionProductId = document.getElementById("questionProductId");
  const questionText = document.getElementById("questionText");
  const questionsList = document.getElementById("questionsList");

  let selectedProductId = null;
  let toastTimer = null;
  let pendingPaymentContext = null;
  let activeReceipt = null;
  let activeCoupon = null;
  let activeLanguage = localStorage.getItem("gdz_store_lang") || "en";
  let activeTheme = localStorage.getItem("gdz_store_theme") || "dark";
  let reviewsCache = [];
  let deferredInstallPrompt = null;
  let blogPostsCache = [];
  let bundleSelection = [];
  let notificationsCache = [];
  let questionsCache = [];

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

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem("gdz_store_wishlist")) || [];
    } catch {
      return [];
    }
  }

  function setWishlist(ids) {
    localStorage.setItem("gdz_store_wishlist", JSON.stringify(ids));
  }

  function isWishlisted(productId) {
    return getWishlist().includes(productId);
  }

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem("gdz_store_cart")) || [];
    } catch {
      return [];
    }
  }

  function setCart(items) {
    localStorage.setItem("gdz_store_cart", JSON.stringify(items));
  }

  function getCompareProducts() {
    try {
      return JSON.parse(localStorage.getItem("gdz_store_compare")) || [];
    } catch {
      return [];
    }
  }

  function setCompareProducts(ids) {
    localStorage.setItem("gdz_store_compare", JSON.stringify(ids.slice(0, 3)));
  }

  function getRecentlyViewed() {
    try {
      return JSON.parse(localStorage.getItem("gdz_store_recent")) || [];
    } catch {
      return [];
    }
  }

  function setRecentlyViewed(items) {
    localStorage.setItem("gdz_store_recent", JSON.stringify(items.slice(0, 6)));
  }

  function getBundleSummary() {
    const items = bundleSelection.map((id) => getProductById(id)).filter(Boolean);
    const subtotal = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const discount = items.length >= 2 ? Math.round(subtotal * 0.1) : 0;
    return {
      items,
      subtotal,
      discount,
      total: Math.max(subtotal - discount, 0)
    };
  }

  function getSavedCoupon() {
    try {
      return JSON.parse(localStorage.getItem("gdz_store_coupon")) || null;
    } catch {
      return null;
    }
  }

  function setSavedCoupon(coupon) {
    if (!coupon) {
      localStorage.removeItem("gdz_store_coupon");
      return;
    }
    localStorage.setItem("gdz_store_coupon", JSON.stringify(coupon));
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

  function getSettings() {
    try {
      return JSON.parse(localStorage.getItem("gdz_store_settings")) || {
        address: "",
        notificationEmail: "",
        notifyEmail: true,
        notifyWhatsapp: false
      };
    } catch {
      return {
        address: "",
        notificationEmail: "",
        notifyEmail: true,
        notifyWhatsapp: false
      };
    }
  }

  function setSettings(settings) {
    localStorage.setItem("gdz_store_settings", JSON.stringify(settings));
  }

  function translate(key, fallback) {
    const copy = {
      en: {
        guest: "Guest mode active",
        login: "Login",
        logout: "Logout",
        profile: "Profile",
        admin: "Admin",
        dashboard: "Dashboard",
        updateProfile: "Update Profile",
        uploadImage: "Upload Image Card",
        wishlist: "Wishlist",
        settingsShare: "Settings & Share",
        reviewCount: "reviews"
      },
      hi: {
        guest: "Guest mode active",
        login: "लॉगिन",
        logout: "लॉगआउट",
        profile: "प्रोफाइल",
        admin: "एडमिन",
        dashboard: "डैशबोर्ड",
        updateProfile: "प्रोफाइल अपडेट",
        uploadImage: "इमेज कार्ड",
        wishlist: "विशलिस्ट",
        settingsShare: "सेटिंग्स और शेयर",
        reviewCount: "रिव्यू"
      }
    };
    return (copy[activeLanguage] && copy[activeLanguage][key]) || fallback || key;
  }

  function applyLanguage() {
    document.documentElement.lang = activeLanguage === "hi" ? "hi" : "en";
    if (languageToggleBtn) {
      languageToggleBtn.textContent = activeLanguage === "hi" ? "English" : "हिंदी";
    }
    loginBtn.textContent = translate("login", "Login");
    logoutBtn.textContent = translate("logout", "Logout");
    profileBtn.textContent = translate("profile", "Profile");
    const adminLink = document.getElementById("adminLink");
    if (adminLink) adminLink.textContent = translate("admin", "Admin");
    if (!getSession()) {
      userStatus.textContent = translate("guest", "Guest mode active");
    }
    menuDashboardBtn.textContent = translate("dashboard", "Dashboard");
    menuEditProfileBtn.textContent = translate("updateProfile", "Update Profile");
    menuUploadImageBtn.textContent = translate("uploadImage", "Upload Image Card");
    menuWishlistBtn.textContent = translate("wishlist", "Wishlist");
    menuSettingsBtn.textContent = translate("settingsShare", "Settings & Share");
    reviewCountText.textContent = `${reviewsCache.length} ${translate("reviewCount", "reviews")}`;
  }

  function applyTheme() {
    document.body.classList.toggle("light-theme", activeTheme === "light");
    if (themeToggleBtn) {
      themeToggleBtn.textContent = activeTheme === "light" ? "Dark" : "Light";
    }
  }

  function saveReceipt(receipt) {
    const receipts = getReceipts().filter((item) => item.orderDocId !== receipt.orderDocId);
    receipts.unshift(receipt);
    setReceipts(receipts.slice(0, 20));
    activeReceipt = receipt;
  }

  function getReferralCode() {
    return localStorage.getItem("gdz_store_referral_code") || "";
  }

  function setReferralCode(code) {
    if (!code) return;
    localStorage.setItem("gdz_store_referral_code", code);
  }

  function formatAmount(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: paymentConfig.currency || "INR",
      maximumFractionDigits: 0
    }).format(amount || 0);
  }

  function getEffectiveAmount(product) {
    const base = Number((product && product.amount) || 0);
    const dynamicDiscountPercent = Number((product && product.dynamicDiscountPercent) || 0);
    if (!dynamicDiscountPercent) return base;
    return Math.max(base - Math.round(base * (dynamicDiscountPercent / 100)), 0);
  }

  function getProductReviewSummary(productId) {
    const productReviews = reviewsCache.filter((review) => review.productId === productId);
    const average = productReviews.length
      ? Number((productReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / productReviews.length).toFixed(1))
      : 0;
    return {
      reviews: productReviews,
      count: productReviews.length,
      average
    };
  }

  function formatTimeLeft(endAt) {
    if (!endAt) return "";
    const diff = new Date(endAt).getTime() - Date.now();
    if (diff <= 0) return "Offer ended";
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (days > 0) return `${days}d ${hours}h left`;
    return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  }

  function updateCountdownNodes() {
    document.querySelectorAll("[data-countdown-end]").forEach((node) => {
      node.textContent = formatTimeLeft(node.getAttribute("data-countdown-end"));
    });
  }

  function renderCouponSuggestions() {
    if (!couponSuggestionBox) return;
    const summary = computeCartSummary();
    if (!summary.items.length) {
      couponSuggestionBox.textContent = "Cart me products add karoge to yahan auto coupon suggestions aur wallet savings dikhengi.";
      return;
    }
    const session = getSession();
    const walletText = summary.walletCredit > 0
      ? `Wallet applied: ${formatAmount(summary.walletCredit)}`
      : (session && Number(session.referralCredit || 0) > 0)
        ? `Wallet available: ${formatAmount(session.referralCredit || 0)}`
        : "No wallet credit applied";
    couponSuggestionBox.textContent = `Smart checkout tip: ${walletText}. Coupon auto-suggestions subtotal ke hisab se load hoti hain.`;
    fetch(buildApiUrl(`/coupons/suggestions?subtotal=${summary.subtotal}&email=${encodeURIComponent((session && session.email) || "")}`))
      .then((response) => response.json().catch(() => null))
      .then((data) => {
        const suggestions = Array.isArray(data && data.suggestions) ? data.suggestions : [];
        if (!suggestions.length) return;
        couponSuggestionBox.innerHTML = `
          <strong>Suggested coupons:</strong> ${suggestions.map((item) => `
            <button class="btn btn-secondary coupon-chip" type="button" data-suggested-coupon="${item.code}">
              ${item.code} · save ${formatAmount(item.discount || 0)}
            </button>
          `).join("")}
          <div class="helper-note">Best match based on subtotal and coupon rules.</div>
        `;
        couponSuggestionBox.querySelectorAll("[data-suggested-coupon]").forEach((button) => {
          button.addEventListener("click", () => {
            couponInput.value = button.getAttribute("data-suggested-coupon") || "";
            applyCouponCode();
          });
        });
      })
      .catch(() => null);
  }

  function showToast(message, type) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = "toast show " + (type || "success");
    toastTimer = setTimeout(() => {
      toast.className = "toast";
    }, 2800);
  }

  function syncUserToBackend() {
    const session = getSession();
    if (!session) return Promise.resolve();
    return fetch(buildApiUrl("/users/sync"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session)
    })
      .then((response) => response.json().catch(() => null))
      .then((data) => {
        if (data && data.user) {
          setSession({ ...getSession(), ...data.user });
        }
        return data;
      })
      .catch(() => null);
  }

  function openModal(modal) {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  function hideProfileMenu() {
    profileMenu.hidden = true;
  }

  function toggleProfileMenu() {
    profileMenu.hidden = !profileMenu.hidden;
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
    const adminLink = document.getElementById("adminLink");
    if (session) {
      userStatus.textContent = "Logged in: " + session.name;
      loginBtn.hidden = true;
      logoutBtn.hidden = false;
      profileBtn.hidden = false;
      if (adminLink) adminLink.hidden = true;
    } else {
      userStatus.textContent = "Guest mode active";
      loginBtn.hidden = false;
      logoutBtn.hidden = true;
      profileBtn.hidden = true;
      if (adminLink) adminLink.hidden = false;
      userDashboard.hidden = true;
      hideProfileMenu();
    }
    applyLanguage();
    renderUserDashboard();
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

  function renderBackupPayments() {
    const hasAny = Boolean(backupPaymentConfig.upiId || backupPaymentConfig.cashfreeLink || backupPaymentConfig.phonepeLink);
    backupPaymentBox.hidden = !hasAny;
  }

  function syncCloudUserData() {
    const session = getSession();
    if (!session || (!session.email && !session.phone)) return Promise.resolve();
    return fetch(buildApiUrl("/user-data/sync"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.email || "",
        phone: session.phone || "",
        cart: getCart(),
        wishlist: getWishlist(),
        settings: getSettings()
      })
    }).catch(() => null);
  }

  function hydrateCloudUserData() {
    const session = getSession();
    if (!session || (!session.email && !session.phone)) return Promise.resolve();
    const query = `email=${encodeURIComponent(session.email || "")}&phone=${encodeURIComponent(session.phone || "")}`;
    return fetch(buildApiUrl(`/user-data?${query}`))
      .then((response) => response.json().catch(() => null))
      .then((data) => {
        if (!data || !data.cloudData) return;
        if (Array.isArray(data.cloudData.cart)) setCart(data.cloudData.cart);
        if (Array.isArray(data.cloudData.wishlist)) setWishlist(data.cloudData.wishlist);
        if (data.cloudData.settings) setSettings(data.cloudData.settings);
      })
      .catch(() => null);
  }

  function renderProducts() {
    const search = (searchInput.value || "").trim().toLowerCase();
    const category = categoryFilter.value || "all";
    const sort = sortSelect.value || "featured";
    let filteredProducts = products.filter((product) => {
      const matchesSearch = !search || `${product.title} ${product.details} ${(product.features || []).join(" ")}`.toLowerCase().includes(search);
      const matchesCategory = category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sort === "price-asc") filteredProducts.sort((a, b) => Number(a.amount) - Number(b.amount));
    if (sort === "price-desc") filteredProducts.sort((a, b) => Number(b.amount) - Number(a.amount));
    if (sort === "newest") filteredProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    if (sort === "top-rated") {
      filteredProducts.sort((a, b) => {
        const aReviews = reviewsCache.filter((review) => review.productId === a.id);
        const bReviews = reviewsCache.filter((review) => review.productId === b.id);
        const aAvg = aReviews.length ? aReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / aReviews.length : 0;
        const bAvg = bReviews.length ? bReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / bReviews.length : 0;
        return bAvg - aAvg;
      });
    }
    if (sort === "featured") {
      const badgeRank = { featured: 0, trending: 1, new: 2 };
      filteredProducts.sort((a, b) => (badgeRank[a.badge] ?? 9) - (badgeRank[b.badge] ?? 9));
    }

    statProductCount.textContent = String(filteredProducts.length);
    productGrid.innerHTML = filteredProducts.map((product) => {
      const paid = isPaid(product.id);
      const features = Array.isArray(product.features) ? product.features : [];
      const actionLabel = paid ? product.actionLabel : "Order/Download Locked";
      const receiptButton = paid
        ? `<button class="btn btn-secondary" type="button" onclick="window.viewReceipt('${product.id}')">Receipt</button>`
        : "";
      const wishlistLabel = isWishlisted(product.id) ? "Wishlisted" : "Add Wishlist";
      const badgeLabel = product.badge ? String(product.badge).toUpperCase() : "";
      const stockLabel = Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5 ? `Only ${product.stock} left` : (product.offerText || "");
      const reviewSummary = getProductReviewSummary(product.id);
      const reviewAverageText = reviewSummary.count ? reviewSummary.average.toFixed(1) : null;
      const effectiveAmount = getEffectiveAmount(product);
      const hasDynamicPricing = effectiveAmount !== Number(product.amount || 0);
      const countdownText = formatTimeLeft(product.countdownEndsAt);
      const topSeller = reviewSummary.count >= 3;
      const etaText = product.slaText || (product.type === "download" ? "Instant digital access" : "Fast service delivery");
      const recurringText = product.billingCycle ? `${product.billingCycle} plan` : "";
      const galleryCount = Array.isArray(product.productGallery) ? product.productGallery.length : 0;

      return `
        <article class="product-card product-card-animated">
          <div class="product-image-wrap">
            <img class="product-image" src="${product.image}" alt="${product.title}">
            ${badgeLabel ? `<span class="product-badge">${badgeLabel}</span>` : ""}
          </div>
          <div class="product-body">
            <div class="product-top">
              <div>
                <div class="product-meta-top">
                  ${product.category ? `<span class="tiny-pill">${product.category}</span>` : ""}
                  ${stockLabel ? `<span class="tiny-pill">${stockLabel}</span>` : ""}
                  ${topSeller ? `<span class="tiny-pill pill-accent">Top Seller</span>` : ""}
                  ${recurringText ? `<span class="tiny-pill">${recurringText}</span>` : ""}
                  ${countdownText ? `<span class="tiny-pill countdown-pill" data-countdown-end="${product.countdownEndsAt}">${countdownText}</span>` : ""}
                </div>
                <h3>${product.title}</h3>
                <p>${product.details}</p>
              </div>
              <div class="price-stack">
                <div class="price-tag">${formatAmount(effectiveAmount)}</div>
                ${hasDynamicPricing ? `<div class="old-price">${formatAmount(product.amount)} · ${product.dynamicDiscountPercent}% off</div>` : ""}
              </div>
            </div>

            <ul class="meta-list">
              ${features.map((item) => `<li>${item}</li>`).join("")}
              ${etaText ? `<li>${etaText}</li>` : ""}
              ${product.vendorName ? `<li>Seller: ${product.vendorName}</li>` : ""}
              ${galleryCount ? `<li>${galleryCount} gallery assets available</li>` : ""}
            </ul>

            <div class="status-row">
              <div class="status-badge ${paid ? "paid" : ""}">
                <span class="status-dot"></span>
                ${paid ? "Payment received" : "Waiting for payment"}
              </div>
              <span>${product.type === "download" ? "Digital access" : "Service order"}${recurringText ? ` · ${recurringText}` : ""}</span>
            </div>
            <div class="product-rating-row">
              ${reviewAverageText ? `<span class="rating-chip">★ ${reviewAverageText} / 5</span><span class="rating-meta">${reviewSummary.count} reviews</span>` : `<span class="rating-meta">No reviews yet</span>`}
            </div>

            <div class="card-actions">
              <button class="btn btn-secondary" type="button" onclick="window.addToCart('${product.id}')">Add to Cart</button>
              <button class="btn btn-primary" type="button" onclick="window.startPayment('${product.id}')">Pay Now</button>
              <button class="btn ${paid ? "btn-success" : "btn-secondary"}" type="button" ${paid ? "" : "disabled"} onclick="window.handleOrderDownload('${product.id}')">${actionLabel}</button>
            </div>
            <div class="card-actions">
              <button class="btn btn-secondary" type="button" onclick="window.toggleWishlist('${product.id}')">${wishlistLabel}</button>
              <button class="btn btn-secondary" type="button" onclick="window.toggleCompare('${product.id}')">${getCompareProducts().includes(product.id) ? "Remove Compare" : "Compare"}</button>
              ${receiptButton || ""}
            </div>
            <div class="card-actions">
              <button class="btn btn-secondary" type="button" onclick="window.openProductDetail('${product.id}')">View Details</button>
            </div>
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
        email: session ? session.email : "",
        referralCode: getReferralCode()
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
    const timeline = Array.isArray(receipt.timeline) && receipt.timeline.length
      ? `
        <div class="payment-card">
          <strong>Order Timeline</strong>
          ${receipt.timeline.map((item) => `<p>${new Date(item.at).toLocaleString()} - ${item.status} - ${item.note || ""}</p>`).join("")}
        </div>
      `
      : "";
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
      ${timeline}
    `;
  }

  async function fetchInvoice(orderDocId) {
    const response = await fetch(buildApiUrl(`/invoices/${encodeURIComponent(orderDocId)}`));
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Invoice unavailable");
    return data.invoice;
  }

  async function fetchOrder(orderDocId) {
    const response = await fetch(buildApiUrl(`/orders/${encodeURIComponent(orderDocId)}`));
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Order unavailable");
    return data.order;
  }

  function openReceiptModal(receipt) {
    if (!receipt) return;
    activeReceipt = receipt;
    receiptContent.innerHTML = buildReceiptHtml(receipt);
    openModal(receiptModal);
  }

  function renderOrderHistory(receipts) {
    if (!receipts.length) {
      orderHistoryList.innerHTML = `
        <article class="my-product-item">
          <div class="my-product-top">
            <div>
              <h4>No order history yet</h4>
              <p>Payment complete hote hi orders aur receipts yahan dikhne lagenge.</p>
            </div>
          </div>
        </article>
      `;
      return;
    }

    orderHistoryList.innerHTML = receipts.map((receipt) => `
      <article class="my-product-item">
        <div class="my-product-top">
          <div>
            <h4>${receipt.productTitle}</h4>
            <p>Order ID: ${receipt.orderDocId || "-"} | ${new Date(receipt.updatedAt).toLocaleString()}</p>
          </div>
          <div class="price-tag">${formatAmount(receipt.amount)}</div>
        </div>
        <div class="my-product-actions">
          <button class="btn btn-secondary" type="button" onclick="window.viewReceipt('${receipt.productId}')">View Receipt</button>
        </div>
      </article>
    `).join("");
  }

  function renderWishlist() {
    const wishlistIds = getWishlist();
    const wishedProducts = products.filter((product) => wishlistIds.includes(product.id));
    if (!wishedProducts.length) {
      wishlistList.innerHTML = `
        <article class="my-product-item">
          <div class="my-product-top">
            <div>
              <h4>No wishlist item yet</h4>
              <p>Jis product ko baad me lena ho, usse wishlist me add kar sakte ho.</p>
            </div>
          </div>
        </article>
      `;
      return;
    }

    wishlistList.innerHTML = wishedProducts.map((product) => `
      <article class="my-product-item">
        <div class="my-product-top">
          <div>
            <h4>${product.title}</h4>
            <p>${product.details}</p>
          </div>
        <div class="price-tag">${formatAmount(getEffectiveAmount(product))}</div>
        </div>
        <div class="my-product-actions">
          <button class="btn btn-primary" type="button" onclick="window.startPayment('${product.id}')">Pay Now</button>
          <button class="btn btn-secondary" type="button" onclick="window.toggleWishlist('${product.id}')">Remove</button>
        </div>
      </article>
    `).join("");
  }

  function renderDownloadManager(receipts) {
    const downloadReceipts = receipts.filter((receipt) => {
      const product = getProductById(receipt.productId);
      return product && product.type === "download";
    });
    if (!downloadReceipts.length) {
      downloadManagerList.innerHTML = `
        <article class="my-product-item">
          <div class="my-product-top">
            <div>
              <h4>No download item yet</h4>
              <p>Download products purchase karne ke baad manager yahan dikhai dega.</p>
            </div>
          </div>
        </article>
      `;
      return;
    }
    downloadManagerList.innerHTML = downloadReceipts.map((receipt) => {
      const product = getProductById(receipt.productId);
      return `
        <article class="my-product-item">
          <div class="my-product-top">
            <div>
              <h4>${product ? product.title : receipt.productTitle}</h4>
              <p>Order ID: ${receipt.orderDocId || "-"}</p>
            </div>
            <div class="price-tag">${formatAmount(receipt.amount)}</div>
          </div>
          <div class="my-product-actions">
            <button class="btn btn-success" type="button" onclick="window.handleOrderDownload('${receipt.productId}')">Download</button>
            <button class="btn btn-secondary" type="button" onclick="window.viewReceipt('${receipt.productId}')">Receipt</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderAddressPreview() {
    const settings = getSettings();
    const rows = [];
    if (settings.address) rows.push(`<article class="my-product-item"><div class="my-product-top"><div><h4>Saved Address</h4><p>${settings.address}</p></div></div></article>`);
    if (settings.notificationEmail) rows.push(`<article class="my-product-item"><div class="my-product-top"><div><h4>Notification Email</h4><p>${settings.notificationEmail}</p></div></div></article>`);
    if (!rows.length) {
      addressPreviewList.innerHTML = `
        <article class="my-product-item">
          <div class="my-product-top">
            <div>
              <h4>No account settings yet</h4>
              <p>Settings kholkar address aur notification preferences save kar sakte ho.</p>
            </div>
          </div>
        </article>
      `;
      return;
    }
    addressPreviewList.innerHTML = rows.join("");
  }

  function updateReferralLink() {
    const session = getSession();
    const source = session && session.referralCode
      ? encodeURIComponent(session.referralCode)
      : "guest";
    const baseUrl = window.location.origin + window.location.pathname;
    referralLinkInput.value = `${baseUrl}?ref=${source}`;
  }

  function renderReviewSummary(summary) {
    reviewAverage.textContent = Number(summary.averageRating || 0).toFixed(1);
    reviewCountText.textContent = `${summary.count || 0} ${translate("reviewCount", "reviews")}`;
  }

  function renderReviews() {
    const selectedRating = reviewFilterRating ? reviewFilterRating.value : "all";
    const filteredReviews = selectedRating === "all"
      ? reviewsCache
      : reviewsCache.filter((item) => Number(item.rating || 0) === Number(selectedRating));
    if (!filteredReviews.length) {
      reviewsList.innerHTML = `
        <article class="my-product-item">
          <div class="my-product-top">
            <div>
              <h4>No reviews yet</h4>
              <p>Sabse pehla review aapka ho sakta hai.</p>
            </div>
          </div>
        </article>
      `;
      renderReviewSummary({ averageRating: 0, count: 0 });
      return;
    }

    const averageRating = reviewsCache.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviewsCache.length;
    renderReviewSummary({ averageRating, count: reviewsCache.length });
    reviewsList.innerHTML = filteredReviews.slice(0, 8).map((review) => `
      <article class="my-product-item review-item">
        <div class="my-product-top">
          <div>
            <h4>${review.title || review.productTitle}</h4>
            <p>${review.name} • ${"★".repeat(Number(review.rating || 0))}${"☆".repeat(5 - Number(review.rating || 0))}</p>
          </div>
          <div class="tiny-pill">${review.productTitle}</div>
        </div>
        <p class="review-copy">${review.message}</p>
        ${review.mediaUrl ? (review.mediaType === "video"
          ? `<a class="btn btn-secondary" href="${review.mediaUrl}" target="_blank" rel="noopener">Open Video</a>`
          : `<img class="review-media" src="${review.mediaUrl}" alt="Review media">`) : ""}
      </article>
    `).join("");
  }

  function populateReviewProducts() {
    reviewProductId.innerHTML = products.map((product) => `<option value="${product.id}">${product.title}</option>`).join("");
  }

  async function loadReviews() {
    try {
      const response = await fetch(buildApiUrl("/reviews"));
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Reviews unavailable");
      reviewsCache = Array.isArray(data.reviews) ? data.reviews : [];
      renderReviewSummary(data);
      renderProducts();
      renderRecommended();
    } catch (error) {
      reviewsCache = [];
      console.warn("Reviews load skipped:", error.message);
    }
    renderReviews();
  }

  function computeCartSummary() {
    const items = getCart();
    const cartProducts = items.map((item) => {
      const product = getProductById(item.productId);
      return product ? { ...product, qty: Number(item.qty || 1), finalAmount: getEffectiveAmount(product) } : null;
    }).filter(Boolean);
    const subtotal = cartProducts.reduce((sum, item) => sum + (Number(item.finalAmount || item.amount) * item.qty), 0);
    let discount = 0;
    if (activeCoupon) {
      if (activeCoupon.type === "flat") discount = Math.min(Number(activeCoupon.value || 0), subtotal);
      if (activeCoupon.type === "percent") discount = Math.round(subtotal * ((Number(activeCoupon.value || 0) / 100)));
    }
    const session = getSession();
    const walletCredit = applyWalletCheck && applyWalletCheck.checked
      ? Math.min(Number((session && session.referralCredit) || 0), Math.max(subtotal - discount, 0))
      : 0;
    return {
      items: cartProducts,
      subtotal,
      discount,
      walletCredit,
      total: Math.max(subtotal - discount - walletCredit, 0)
    };
  }

  function renderCart() {
    const summary = computeCartSummary();
    cartSubtotal.textContent = formatAmount(summary.subtotal);
    cartDiscount.textContent = "-" + formatAmount(summary.discount + summary.walletCredit);
    cartTotal.textContent = formatAmount(summary.total);
    checkoutCartBtn.disabled = summary.items.length === 0;
    clearCartBtn.disabled = summary.items.length === 0;
    renderCouponSuggestions();

    if (!summary.items.length) {
      cartItemsList.innerHTML = `
        <article class="my-product-item">
          <div class="my-product-top">
            <div>
              <h4>Your cart is empty</h4>
              <p>Products add karne ke baad yahan cart summary dikhne lagegi.</p>
            </div>
          </div>
        </article>
      `;
      return;
    }

    cartItemsList.innerHTML = summary.items.map((item) => `
      <article class="my-product-item">
        <div class="my-product-top">
          <div>
            <h4>${item.title}</h4>
            <p>Qty: ${item.qty} | ${item.offerText || item.category || "Store item"}${item.billingCycle ? ` | ${item.billingCycle}` : ""}</p>
          </div>
          <div class="price-tag">${formatAmount(Number(item.finalAmount || item.amount) * item.qty)}</div>
        </div>
        <div class="my-product-actions">
          <button class="btn btn-secondary" type="button" onclick="window.changeCartQty('${item.id}', -1)">-1</button>
          <button class="btn btn-secondary" type="button" onclick="window.changeCartQty('${item.id}', 1)">+1</button>
          <button class="btn btn-secondary" type="button" onclick="window.removeFromCart('${item.id}')">Remove</button>
        </div>
      </article>
    `).join("");
  }

  function renderRecentlyViewed() {
    const recentIds = getRecentlyViewed();
    const items = recentIds.map((id) => getProductById(id)).filter(Boolean);
    if (!items.length) {
      recentlyViewedList.innerHTML = '<article class="my-product-item"><div class="my-product-top"><div><h4>No recent products</h4><p>Product detail kholne ke baad yahan list banegi.</p></div></div></article>';
      return;
    }
    recentlyViewedList.innerHTML = items.map((product) => `
      <article class="my-product-item">
        <div class="my-product-top">
          <div>
            <h4>${product.title}</h4>
            <p>${product.details}</p>
          </div>
          <div class="price-tag">${formatAmount(getEffectiveAmount(product))}</div>
        </div>
        <div class="my-product-actions">
          <button class="btn btn-secondary" type="button" onclick="window.openProductDetail('${product.id}')">View</button>
        </div>
      </article>
    `).join("");
  }

  function renderRecommended() {
    const recentIds = getRecentlyViewed();
    const recentProducts = recentIds.map((id) => getProductById(id)).filter(Boolean);
    const favoriteCategories = recentProducts.map((item) => item.category).filter(Boolean);
    const source = [...products]
      .sort((a, b) => {
        const aReviews = getProductReviewSummary(a.id);
        const bReviews = getProductReviewSummary(b.id);
        const aScore = (favoriteCategories.includes(a.category) ? 20 : 0) + aReviews.count * 3 + aReviews.average;
        const bScore = (favoriteCategories.includes(b.category) ? 20 : 0) + bReviews.count * 3 + bReviews.average;
        return bScore - aScore || Number(getEffectiveAmount(b)) - Number(getEffectiveAmount(a));
      })
      .slice(0, 3);
    recommendedList.innerHTML = source.map((product) => `
      <article class="my-product-item">
        <div class="my-product-top">
          <div>
            <h4>${product.title}</h4>
            <p>${product.offerText || product.category || product.details}</p>
          </div>
          <div class="price-tag">${formatAmount(getEffectiveAmount(product))}</div>
        </div>
        <div class="my-product-actions">
          <button class="btn btn-primary" type="button" onclick="window.startPayment('${product.id}')">Pay Now</button>
          <button class="btn btn-secondary" type="button" onclick="window.openProductDetail('${product.id}')">Details</button>
        </div>
      </article>
    `).join("");
  }

  function renderComparePreview() {
    const compareIds = getCompareProducts();
    const items = compareIds.map((id) => getProductById(id)).filter(Boolean);
    if (!items.length) {
      comparePreviewList.innerHTML = '<article class="my-product-item"><div class="my-product-top"><div><h4>No compare items</h4><p>2-3 products compare me add karo, phir compare page aur useful lagega.</p></div></div></article>';
      return;
    }
    const minPrice = Math.min(...items.map((item) => Number(getEffectiveAmount(item))));
    comparePreviewList.innerHTML = items.map((product) => `
      <article class="my-product-item">
        <div class="my-product-top">
          <div>
            <h4>${product.title}</h4>
            <p>${product.details}</p>
          </div>
          <div class="price-tag">${formatAmount(getEffectiveAmount(product))}</div>
        </div>
        <div class="stack-meta">
          <span>${Number(getEffectiveAmount(product)) === minPrice ? "Best Price" : "Premium Pick"}</span>
          <span>${(product.features || []).length} features</span>
          <span>${product.category || "general"}</span>
        </div>
        <div class="my-product-actions">
          <button class="btn btn-secondary" type="button" onclick="window.toggleCompare('${product.id}')">Remove</button>
          <button class="btn btn-secondary" type="button" onclick="window.openProductDetail('${product.id}')">Details</button>
        </div>
      </article>
    `).join("");
  }

  function renderBlogPreview() {
    if (!blogPreviewList) return;
    if (!blogPostsCache.length) {
      blogPreviewList.innerHTML = '<article class="my-product-item"><div class="my-product-top"><div><h4>No blog posts yet</h4><p>Blog engine ready hai. Admin se post add kar sakte ho.</p></div></div></article>';
      return;
    }
    blogPreviewList.innerHTML = blogPostsCache.slice(0, 3).map((post) => `
      <article class="my-product-item">
        <div class="my-product-top">
          <div>
            <h4>${post.title}</h4>
            <p>${post.excerpt || ""}</p>
          </div>
          <div class="tiny-pill">${new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</div>
        </div>
        <div class="my-product-actions">
          <a class="btn btn-secondary" href="./blog-post.html?slug=${encodeURIComponent(post.slug)}">Read</a>
        </div>
      </article>
    `).join("");
  }

  async function loadBlogPosts() {
    try {
      const response = await fetch(buildApiUrl("/blog"));
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Blog unavailable");
      blogPostsCache = Array.isArray(data.posts) ? data.posts : [];
    } catch {
      blogPostsCache = [];
    }
    renderBlogPreview();
  }

  function renderNotificationInbox() {
    if (!notificationInboxList) return;
    if (!notificationsCache.length) {
      notificationInboxList.innerHTML = '<article class="my-product-item"><div class="my-product-top"><div><h4>No notifications</h4><p>Latest updates yahan show hongi.</p></div></div></article>';
      return;
    }
    notificationInboxList.innerHTML = notificationsCache.map((item) => `
      <article class="my-product-item">
        <div class="my-product-top">
          <div>
            <h4>${item.title}</h4>
            <p>${item.message}</p>
          </div>
          <div class="tiny-pill">${item.type || "info"}</div>
        </div>
      </article>
    `).join("");
  }

  async function loadNotificationInbox() {
    const session = getSession();
    const query = session && session.email ? `?email=${encodeURIComponent(session.email)}` : "";
    try {
      const response = await fetch(buildApiUrl(`/notifications/inbox${query}`));
      const data = await response.json();
      notificationsCache = Array.isArray(data.notifications) ? data.notifications : [];
    } catch {
      notificationsCache = [];
    }
    renderNotificationInbox();
  }

  function renderDashboardWidgets() {
    if (!dashboardWidgetsList) return;
    const session = getSession();
    if (!session) {
      dashboardWidgetsList.innerHTML = '<article class="my-product-item"><div class="my-product-top"><div><h4>Login required</h4></div></div></article>';
      return;
    }
    const widgets = [];
    if (Number(session.loyaltyPoints || 0) >= 50) widgets.push({ title: "Power Buyer", copy: "Aap loyalty booster zone me ho." });
    if (Number(session.referralCount || 0) > 0) widgets.push({ title: "Affiliate Starter", copy: "Referral reward active hai." });
    if (Number(session.referralCredit || 0) > 0) widgets.push({ title: "Wallet Ready", copy: `${formatAmount(session.referralCredit || 0)} checkout me use ho sakta hai.` });
    if (getPaidProducts().length >= 3) widgets.push({ title: "Premium Club", copy: "Multi-order customer benefits unlock ho rahe hain." });
    if (!widgets.length) widgets.push({ title: "New Explorer", copy: "First purchase aur referral se widgets unlock honge." });
    dashboardWidgetsList.innerHTML = widgets.map((item) => `
      <article class="my-product-item">
        <div class="my-product-top"><div><h4>${item.title}</h4><p>${item.copy}</p></div></div>
      </article>
    `).join("");
  }

  function renderBundleBuilder() {
    if (!bundleBuilderList || !bundleSummaryBox) return;
    bundleBuilderList.innerHTML = products.slice(0, 6).map((product) => `
      <article class="my-product-item">
        <div class="my-product-top">
          <div>
            <h4>${product.title}</h4>
            <p>${product.details}</p>
          </div>
          <div class="price-tag">${formatAmount(getEffectiveAmount(product))}</div>
        </div>
        <div class="my-product-actions">
          <button class="btn btn-secondary" type="button" onclick="window.toggleBundleItem('${product.id}')">${bundleSelection.includes(product.id) ? "Remove" : "Add"}</button>
        </div>
      </article>
    `).join("");
    const summary = getBundleSummary();
    bundleSummaryBox.innerHTML = `
      <article class="my-product-item">
        <div class="my-product-top"><div><h4>${summary.items.length} items selected</h4><p>10% bundle discount on 2 or more items.</p></div></div>
        <div class="stack-meta">
          <span>Subtotal: ${formatAmount(summary.subtotal)}</span>
          <span>Discount: ${formatAmount(summary.discount)}</span>
          <span>Total: ${formatAmount(summary.total)}</span>
        </div>
        <div class="my-product-actions">
          <button class="btn btn-primary" type="button" onclick="window.addBundleToCart()" ${summary.items.length ? "" : "disabled"}>Add Bundle To Cart</button>
        </div>
      </article>
    `;
  }

  async function loadQuestions() {
    try {
      const response = await fetch(buildApiUrl("/questions"));
      const data = await response.json();
      questionsCache = Array.isArray(data.questions) ? data.questions : [];
    } catch {
      questionsCache = [];
    }
    if (!questionsList) return;
    questionsList.innerHTML = questionsCache.slice(0, 8).map((item) => {
      const product = getProductById(item.productId);
      return `
      <article class="my-product-item">
        <div class="my-product-top">
          <div>
            <h4>${(product && product.title) || item.productId}</h4>
            <p>Q: ${item.question}</p>
            <p>${item.answer ? `A: ${item.answer}` : "Waiting for admin answer"}</p>
          </div>
        </div>
      </article>
    `;
    }).join("") || '<article class="my-product-item"><div class="my-product-top"><div><h4>No questions yet</h4></div></div></article>';
  }

  async function applyCouponCode() {
    const code = couponInput.value.trim();
    if (!code) {
      activeCoupon = null;
      setSavedCoupon(null);
      couponStatus.textContent = "Coupon cleared.";
      renderCart();
      return;
    }
    const summary = computeCartSummary();
    if (!summary.items.length) {
      couponStatus.textContent = "Pehle cart me item add kijiye.";
      return;
    }
    try {
      const session = getSession();
      const response = await fetch(buildApiUrl(`/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${summary.subtotal}&email=${encodeURIComponent((session && session.email) || "")}`));
      const data = await response.json();
      if (!response.ok || !data.valid) throw new Error(data.message || "Invalid coupon");
      activeCoupon = {
        code: data.coupon.code,
        discount: Number(data.discount || 0),
        finalTotal: Number(data.finalTotal || summary.subtotal),
        type: data.coupon.type,
        value: data.coupon.value
      };
      setSavedCoupon(activeCoupon);
      couponStatus.textContent = `${activeCoupon.code} applied successfully.`;
      renderCart();
      showToast("Coupon applied.");
    } catch (error) {
      activeCoupon = null;
      setSavedCoupon(null);
      couponStatus.textContent = error.message || "Coupon invalid";
      renderCart();
      showToast(error.message || "Coupon invalid", "error");
    }
  }

  function renderUserDashboard() {
    const session = getSession();
    const paidIds = getPaidProducts();
    const receipts = getReceipts();

    if (!session) {
      userDashboard.hidden = true;
      referralLinkInput.value = "";
      return;
    }
    profileName.textContent = session.name || "User";
    profileEmail.textContent = session.email || "No email";
    profileAvatar.textContent = (session.name || "U").trim().charAt(0).toUpperCase();
    if (session.photoUrl) {
      profilePhoto.src = session.photoUrl;
      profilePhoto.hidden = false;
      profileAvatar.hidden = true;
    } else {
      profilePhoto.hidden = true;
      profileAvatar.hidden = false;
    }
    profilePaidCount.textContent = String(paidIds.length);
    profileReceiptCount.textContent = String(receipts.length);
    referralCountValue.textContent = String(session.referralCount || 0);
    referralCreditValue.textContent = formatAmount(session.referralCredit || 0);
    loyaltyPointsValue.textContent = String(session.loyaltyPoints || 0);
    walletBalanceValue.textContent = formatAmount(session.referralCredit || 0);
    updateReferralLink();
    renderAddressPreview();
    renderNotificationInbox();
    renderDashboardWidgets();
    renderBundleBuilder();

    const paidProducts = products.filter((product) => paidIds.includes(product.id));
    if (!paidProducts.length) {
      myProductsList.innerHTML = `
        <article class="my-product-item">
          <div class="my-product-top">
            <div>
              <h4>No purchased product yet</h4>
              <p>Jab user payment karega, uske paid products yahan dikhne lagenge.</p>
            </div>
          </div>
        </article>
      `;
      renderOrderHistory(receipts);
      renderWishlist();
      renderDownloadManager(receipts);
      return;
    }

    myProductsList.innerHTML = paidProducts.map((product) => `
      <article class="my-product-item">
        <div class="my-product-top">
          <div>
            <h4>${product.title}</h4>
            <p>${product.details}</p>
          </div>
          <div class="price-tag">${formatAmount(getEffectiveAmount(product))}</div>
        </div>
        <div class="my-product-actions">
          <button class="btn btn-success" type="button" onclick="window.handleOrderDownload('${product.id}')">${product.actionLabel}</button>
          <button class="btn btn-secondary" type="button" onclick="window.viewReceipt('${product.id}')">View Receipt</button>
        </div>
      </article>
    `).join("");
    renderOrderHistory(receipts);
    renderWishlist();
    renderDownloadManager(receipts);
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
    paymentAmount.textContent = formatAmount(getEffectiveAmount(product));
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
          const unlockIds = pendingPaymentContext && pendingPaymentContext.cartProductIds && pendingPaymentContext.cartProductIds.length
            ? pendingPaymentContext.cartProductIds
            : [product.id];
          const receipt = {
            productId: unlockIds[0],
            productTitle: product.title,
            amount: Number((result.order && result.order.amount) || getEffectiveAmount(product)),
            orderDocId: (result.order && result.order.docId) || orderResult.orderId || "",
            paymentId: response.razorpay_payment_id || "",
            status: "Paid",
            updatedAt: (result.order && result.order.updatedAt) || new Date().toISOString(),
            productIds: unlockIds
          };
          saveReceipt(receipt);
          unlockIds.forEach((id) => unlockProduct(id));
          if (unlockIds.length > 1) {
            setCart([]);
            activeCoupon = null;
            setSavedCoupon(null);
          }
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

      if (paymentConfig.paymentLinkUrl && paymentConfig.manualFallback) {
        paymentFlowType.textContent = "Payment link mode active. Link new tab me open hoga, uske baad payment confirm karna hoga.";
        paymentDescription.textContent = "Abhi actual Razorpay Key ID missing hai, isliye payment link fallback use ho raha hai. Real auto verification ke liye `rzp_live_...` Key ID chahiye.";
        window.open(paymentConfig.paymentLinkUrl, "_blank", "noopener");
      }

      openModal(paymentModal);
    } catch (error) {
      paymentProductName.textContent = product.title;
      paymentAmount.textContent = formatAmount(getEffectiveAmount(product));
      paymentGatewayName.textContent = paymentConfig.gatewayLabel || "Razorpay";
      paymentDescription.textContent = "Backend unavailable ya Razorpay order create nahi ho pa raha. Live checkout ke liye backend order API sahi chalna zaroori hai.";
      paymentFlowType.textContent = error.message;
      if (paymentConfig.paymentLinkUrl && paymentConfig.manualFallback) {
        window.open(paymentConfig.paymentLinkUrl, "_blank", "noopener");
      }
      openModal(paymentModal);
    }
  };

  window.addToCart = function (productId) {
    const current = getCart();
    const existing = current.find((item) => item.productId === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      current.push({ productId, qty: 1 });
    }
    setCart(current);
    renderCart();
    renderBundleBuilder();
    syncCloudUserData();
    showToast("Added to cart.");
  };

  window.changeCartQty = function (productId, delta) {
    const current = getCart().map((item) => ({ ...item }));
    const existing = current.find((item) => item.productId === productId);
    if (!existing) return;
    existing.qty += delta;
    const next = current.filter((item) => item.qty > 0);
    setCart(next);
    renderCart();
    renderBundleBuilder();
    syncCloudUserData();
  };

  window.removeFromCart = function (productId) {
    setCart(getCart().filter((item) => item.productId !== productId));
    renderCart();
    renderBundleBuilder();
    syncCloudUserData();
    showToast("Removed from cart.");
  };

  window.toggleBundleItem = function (productId) {
    bundleSelection = bundleSelection.includes(productId)
      ? bundleSelection.filter((id) => id !== productId)
      : [...bundleSelection, productId].slice(0, 4);
    renderBundleBuilder();
  };

  window.addBundleToCart = function () {
    if (!bundleSelection.length) {
      showToast("Bundle me kam se kam 1 product select kijiye.", "error");
      return;
    }
    const current = getCart();
    bundleSelection.forEach((productId) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) existing.qty += 1;
      else current.push({ productId, qty: 1 });
    });
    setCart(current);
    bundleSelection = [];
    renderCart();
    renderBundleBuilder();
    syncCloudUserData();
    showToast("Bundle cart me add ho gaya.");
  };

  window.startCartCheckout = async function () {
    if (!requireLogin()) return;
    const summary = computeCartSummary();
    if (!summary.items.length) {
      showToast("Cart empty hai.", "error");
      return;
    }
    selectedProductId = null;
    try {
      const session = getSession();
      const orderResult = await fetch(buildApiUrl(paymentConfig.createOrderEndpoint || "/payments/create-order"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems: summary.items.map((item) => ({ productId: item.id, qty: item.qty })),
          couponCode: activeCoupon ? activeCoupon.code : "",
          useWallet: Boolean(applyWalletCheck && applyWalletCheck.checked),
          name: session ? session.name : "",
          email: session ? session.email : "",
          referralCode: getReferralCode()
        })
      }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Cart order create failed");
        return data;
      });

      pendingPaymentContext = {
        product: {
          id: "cart-bundle",
          title: `Cart Checkout (${summary.items.length} items)`,
          amount: summary.total,
          type: "download"
        },
        orderResult,
        cartProductIds: summary.items.map((item) => item.id)
      };

      paymentProductName.textContent = pendingPaymentContext.product.title;
      paymentAmount.textContent = formatAmount(summary.total);
      paymentGatewayName.textContent = paymentConfig.gatewayLabel || "Razorpay";
      paymentDescription.textContent = "Cart ke sab selected items ek hi checkout me process honge.";
      paymentFlowType.textContent = "Cart checkout order ready.";

      if (orderResult && orderResult.razorpayOrder && paymentConfig.razorpayKey && !paymentConfig.razorpayKey.includes("replace_with_your_key")) {
        await openRazorpayCheckout(pendingPaymentContext.product, orderResult);
        return;
      }
      openModal(paymentModal);
    } catch (error) {
      showToast(error.message || "Cart checkout failed.", "error");
    }
  };

  window.handleOrderDownload = function (productId) {
    const product = getProductById(productId);
    if (!product) return;
    if (!isPaid(productId)) {
      showToast("Pay karne ke baad hi yeh button kaam karega.", "error");
      return;
    }
    const receipt = getReceipts().find((item) => item.productId === productId || (Array.isArray(item.productIds) && item.productIds.includes(productId)));
    if (product.type === "download" && receipt && receipt.orderDocId) {
      fetch(buildApiUrl("/download-token"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: receipt.orderDocId,
          productId
        })
      })
        .then((response) => response.json().then((data) => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
          if (!ok) throw new Error(data.message || "Download token failed");
          return fetch(buildApiUrl(`/protected-download/${data.token}`));
        })
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) throw new Error(data.message || "Protected download failed");
          window.open(data.redirectUrl, "_blank", "noopener");
          showToast("Protected download access opened.");
        })
        .catch((error) => {
          showToast(error.message || "Download failed.", "error");
        });
      return;
    }

    window.open(product.actionUrl, "_blank", "noopener");
    showToast(product.type === "download" ? "Download access opened." : "Order page opened.");
  };

  window.viewReceipt = async function (productId) {
    const receipt = getReceipts().find((item) => item.productId === productId);
    if (!receipt) {
      showToast("Receipt not found.", "error");
      return;
    }
    if (receipt.orderDocId) {
      try {
        const order = await fetchOrder(receipt.orderDocId);
        receipt.timeline = order.timeline || [];
      } catch {}
    }
    openReceiptModal(receipt);
  };

  window.toggleWishlist = function (productId) {
    const session = getSession();
    if (!session) {
      openModal(loginModal);
      showToast("Wishlist use karne ke liye login kijiye.", "error");
      return;
    }
    const current = getWishlist();
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    setWishlist(next);
    renderProducts();
    renderUserDashboard();
    syncCloudUserData();
    showToast(current.includes(productId) ? "Wishlist se remove ho gaya." : "Wishlist me add ho gaya.");
  };

  window.toggleCompare = function (productId) {
    const current = getCompareProducts();
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];
    setCompareProducts(next);
    renderProducts();
    renderComparePreview();
    showToast(current.includes(productId) ? "Compare se remove ho gaya." : "Compare me add ho gaya.");
  };

  window.openProductDetail = function (productId) {
    const current = getRecentlyViewed();
    const next = [productId, ...current.filter((id) => id !== productId)];
    setRecentlyViewed(next);
    renderRecentlyViewed();
    window.location.href = `./product.html?id=${encodeURIComponent(productId)}`;
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
    syncUserToBackend().then(() => updateAuthUI());
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
      const unlockIds = pendingPaymentContext && pendingPaymentContext.cartProductIds && pendingPaymentContext.cartProductIds.length
        ? pendingPaymentContext.cartProductIds
        : [product.id];
      unlockIds.forEach((id) => unlockProduct(id));
      const receipt = {
        productId: unlockIds[0],
        productTitle: product.title,
        amount: Number((result.order && result.order.amount) || getEffectiveAmount(product)),
        orderDocId: (result.order && result.order.docId) || payload.orderId || "",
        paymentId: "",
        status: "Paid",
        updatedAt: (result.order && result.order.updatedAt) || new Date().toISOString(),
        productIds: unlockIds
      };
      saveReceipt(receipt);
      if (unlockIds.length > 1) {
        setCart([]);
        activeCoupon = null;
        setSavedCoupon(null);
      }
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
  logoutBtn.addEventListener("click", async () => {
    try {
      if (window.gdzStoreAuth && window.gdzStoreAuth.enabled) {
        await window.gdzStoreAuth.logout();
      } else {
        clearSession();
      }
      updateAuthUI();
      showToast("Logout successful.");
    } catch (error) {
      showToast(error.message || "Logout failed.", "error");
    }
  });

  profileBtn.addEventListener("click", () => {
    const session = getSession();
    if (!session) return;
    toggleProfileMenu();
  });

  editProfileBtn.addEventListener("click", () => {
    const session = getSession();
    if (!session) return;
    profileNameInput.value = session.name || "";
    profileEmailInput.value = session.email || "";
    profilePhotoInput.value = session.photoUrl || "";
    openModal(profileModal);
  });

  openWishlistBtn.addEventListener("click", () => {
    userDashboard.hidden = false;
    userDashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  menuDashboardBtn.addEventListener("click", () => {
    userDashboard.hidden = false;
    hideProfileMenu();
    userDashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  menuEditProfileBtn.addEventListener("click", () => {
    hideProfileMenu();
    editProfileBtn.click();
  });

  menuUploadImageBtn.addEventListener("click", () => {
    const session = getSession();
    if (!session) return;
    imageCardUrl.value = session.photoUrl || "";
    hideProfileMenu();
    openModal(imageCardModal);
  });

  menuWishlistBtn.addEventListener("click", () => {
    userDashboard.hidden = false;
    hideProfileMenu();
    userDashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  menuSettingsBtn.addEventListener("click", () => {
    hideProfileMenu();
    openSettingsBtn.click();
  });

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const session = getSession();
    if (!session) return;
    const nextSession = {
      ...session,
      name: profileNameInput.value.trim(),
      email: profileEmailInput.value.trim(),
      photoUrl: profilePhotoInput.value.trim()
    };
    setSession(nextSession);
    syncUserToBackend();
    updateAuthUI();
    closeModal(profileModal);
    showToast("Profile updated.");
  });

  imageCardForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const session = getSession();
    if (!session) return;
    const nextSession = {
      ...session,
      photoUrl: imageCardUrl.value.trim()
    };
    setSession(nextSession);
    syncUserToBackend();
    updateAuthUI();
    closeModal(imageCardModal);
    showToast("Profile image updated.");
  });

  openSettingsBtn.addEventListener("click", () => {
    const settings = getSettings();
    addressLineInput.value = settings.address || "";
    notificationEmailInput.value = settings.notificationEmail || "";
    notifyEmailCheck.checked = settings.notifyEmail !== false;
    notifyWhatsappCheck.checked = Boolean(settings.notifyWhatsapp);
    userDashboard.hidden = false;
    openModal(settingsModal);
  });

  copyReferralBtn.addEventListener("click", async () => {
    updateReferralLink();
    try {
      await navigator.clipboard.writeText(referralLinkInput.value);
      showToast("Referral link copied.");
    } catch {
      referralLinkInput.select();
      document.execCommand("copy");
      showToast("Referral link copied.");
    }
  });

  shareWhatsappBtn.addEventListener("click", () => {
    updateReferralLink();
    const text = encodeURIComponent(`Check this store: ${referralLinkInput.value}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
  });

  exportDataBtn.addEventListener("click", () => {
    const session = getSession();
    if (!session) {
      showToast("Login required.", "error");
      return;
    }
    const payload = {
      profile: session,
      settings: getSettings(),
      cart: getCart(),
      wishlist: getWishlist(),
      receipts: getReceipts(),
      paidProducts: getPaidProducts()
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gdz-store-account-data.json";
    link.click();
    URL.revokeObjectURL(url);
    showToast("Account data exported.");
  });

  newsletterBtn.addEventListener("click", () => {
    const email = newsletterEmail.value.trim();
    if (!email || !email.includes("@")) {
      showToast("Valid email dijiye.", "error");
      return;
    }
    const existing = JSON.parse(localStorage.getItem("gdz_store_newsletter") || "[]");
    if (!existing.includes(email)) {
      existing.push(email);
      localStorage.setItem("gdz_store_newsletter", JSON.stringify(existing));
    }
    newsletterEmail.value = "";
    showToast("Newsletter subscribed.");
  });

  redeemGiftCardBtn.addEventListener("click", async () => {
    const session = getSession();
    const code = giftCardCodeInput.value.trim();
    if (!session || !session.email) {
      showToast("Login with email required.", "error");
      return;
    }
    if (!code) {
      showToast("Gift card code dijiye.", "error");
      return;
    }
    try {
      const response = await fetch(buildApiUrl("/gift-cards/redeem"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email: session.email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Redeem failed");
      const nextSession = { ...session, referralCredit: Number(data.walletBalance || session.referralCredit || 0) };
      setSession(nextSession);
      giftCardCodeInput.value = "";
      renderUserDashboard();
      showToast("Gift card redeemed.");
    } catch (error) {
      showToast(error.message || "Redeem failed", "error");
    }
  });

  supportWidgetToggle.addEventListener("click", () => {
    supportWidgetPanel.hidden = !supportWidgetPanel.hidden;
  });

  chatbotPaymentBtn.addEventListener("click", () => {
    chatbotReply.textContent = "Payment issue ho to receipt modal se invoice/support use kijiye, ya payment status admin se verify karwaiye.";
  });
  chatbotDownloadBtn.addEventListener("click", () => {
    chatbotReply.textContent = "Download manager me jaake product kholiye. Limit ya expiry ho to support se contact kijiye.";
  });
  chatbotOrderBtn.addEventListener("click", () => {
    chatbotReply.textContent = "Service orders ke liye order history aur WhatsApp support best rahega. Order ID saath rakhiye.";
  });

  supportEmailBtn.addEventListener("click", () => {
    const subject = encodeURIComponent("Store Support Request");
    const body = encodeURIComponent("Hello, I need help with payment/order/access.");
    window.location.href = `mailto:${(config.support && config.support.orderEmail) || ""}?subject=${subject}&body=${body}`;
  });

  supportWhatsappBtn.addEventListener("click", () => {
    const number = (config.support && config.support.orderWhatsapp) || "";
    const text = encodeURIComponent("Hello, I need help with payment/order/access.");
    window.open(`https://wa.me/${number}?text=${text}`, "_blank", "noopener");
  });

  upiPaymentBtn.addEventListener("click", () => {
    if (!backupPaymentConfig.upiId) return showToast("UPI not configured.", "error");
    const amountText = encodeURIComponent(String((pendingPaymentContext && pendingPaymentContext.product && pendingPaymentContext.product.amount) || 0));
    const payee = encodeURIComponent(brandConfig.name || "GDZ Store");
    window.open(`upi://pay?pa=${encodeURIComponent(backupPaymentConfig.upiId)}&pn=${payee}&am=${amountText}&cu=INR`, "_blank", "noopener");
  });

  cashfreePaymentBtn.addEventListener("click", () => {
    if (!backupPaymentConfig.cashfreeLink) return showToast("Cashfree link not configured.", "error");
    window.open(backupPaymentConfig.cashfreeLink, "_blank", "noopener");
  });

  phonepePaymentBtn.addEventListener("click", () => {
    if (!backupPaymentConfig.phonepeLink) return showToast("PhonePe link not configured.", "error");
    window.open(backupPaymentConfig.phonepeLink, "_blank", "noopener");
  });

  languageToggleBtn.addEventListener("click", () => {
    activeLanguage = activeLanguage === "hi" ? "en" : "hi";
    localStorage.setItem("gdz_store_lang", activeLanguage);
    applyLanguage();
  });

  themeToggleBtn.addEventListener("click", () => {
    activeTheme = activeTheme === "light" ? "dark" : "light";
    localStorage.setItem("gdz_store_theme", activeTheme);
    applyTheme();
  });

  installAppBtn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice.catch(() => null);
    deferredInstallPrompt = null;
    installAppBtn.hidden = true;
  });

  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const settings = {
      address: addressLineInput.value.trim(),
      notificationEmail: notificationEmailInput.value.trim(),
      notifyEmail: notifyEmailCheck.checked,
      notifyWhatsapp: notifyWhatsappCheck.checked
    };
    setSettings(settings);
    renderAddressPreview();
    syncCloudUserData();
    closeModal(settingsModal);
    showToast("Account settings saved.");
  });

  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const session = getSession();
    if (!session) {
      openModal(loginModal);
      showToast("Review dene ke liye login kijiye.", "error");
      return;
    }
    try {
      const response = await fetch(buildApiUrl("/reviews"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: reviewProductId.value,
          rating: Number(reviewRating.value || 5),
          title: reviewTitle.value.trim(),
          message: reviewMessage.value.trim(),
          mediaUrl: reviewMediaUrl.value.trim(),
          mediaType: reviewMediaType.value,
          name: session.name || "User",
          email: session.email || ""
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Review submit failed");
      reviewForm.reset();
      reviewRating.value = "5";
      reviewMediaType.value = "";
      await loadReviews();
      showToast("Review submitted.");
    } catch (error) {
      showToast(error.message || "Review submit failed", "error");
    }
  });

  applyCouponBtn.addEventListener("click", applyCouponCode);
  if (applyWalletCheck) {
    applyWalletCheck.addEventListener("change", () => {
      renderCart();
    });
  }
  checkoutCartBtn.addEventListener("click", () => window.startCartCheckout());
  clearCartBtn.addEventListener("click", () => {
    setCart([]);
    activeCoupon = null;
    setSavedCoupon(null);
    couponInput.value = "";
    couponStatus.textContent = "Cart cleared.";
    renderCart();
  });

  if (supportTicketForm) {
    supportTicketForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const session = getSession();
      if (!session || !session.email) {
        showToast("Support ticket ke liye login with email zaroori hai.", "error");
        openModal(loginModal);
        return;
      }
      try {
        const response = await fetch(buildApiUrl("/support-tickets"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.email,
            subject: supportSubject.value.trim(),
            message: supportMessage.value.trim()
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Ticket create failed");
        supportTicketForm.reset();
        showToast(`Ticket created: ${data.ticket.docId}`);
        loadNotificationInbox();
      } catch (error) {
        showToast(error.message || "Ticket create failed", "error");
      }
    });
  }

  if (questionForm) {
    questionForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const session = getSession();
      if (!session) {
        showToast("Question puchhne ke liye login kijiye.", "error");
        openModal(loginModal);
        return;
      }
      try {
        const response = await fetch(buildApiUrl("/questions"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: questionProductId.value,
            question: questionText.value.trim(),
            name: session.name || "User",
            email: session.email || ""
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Question submit failed");
        questionForm.reset();
        await loadQuestions();
        showToast("Question submitted.");
      } catch (error) {
        showToast(error.message || "Question submit failed", "error");
      }
    });
  }

  [searchInput, categoryFilter, sortSelect].forEach((element) => {
    element.addEventListener("input", renderProducts);
    element.addEventListener("change", renderProducts);
  });

  document.getElementById("closeLoginModal").addEventListener("click", () => closeModal(loginModal));
  document.getElementById("cancelLoginBtn").addEventListener("click", () => closeModal(loginModal));
  document.getElementById("closePaymentModal").addEventListener("click", () => closeModal(paymentModal));
  document.getElementById("cancelPaymentBtn").addEventListener("click", () => closeModal(paymentModal));
  document.getElementById("closeReceiptModal").addEventListener("click", () => closeModal(receiptModal));
  document.getElementById("closeReceiptBtn").addEventListener("click", () => closeModal(receiptModal));
  document.getElementById("closeProfileModal").addEventListener("click", () => closeModal(profileModal));
  document.getElementById("cancelProfileBtn").addEventListener("click", () => closeModal(profileModal));
  document.getElementById("closeImageCardModal").addEventListener("click", () => closeModal(imageCardModal));
  document.getElementById("cancelImageCardBtn").addEventListener("click", () => closeModal(imageCardModal));
  document.getElementById("closeSettingsModal").addEventListener("click", () => closeModal(settingsModal));
  document.getElementById("cancelSettingsBtn").addEventListener("click", () => closeModal(settingsModal));
  downloadReceiptBtn.addEventListener("click", () => downloadReceipt(activeReceipt));
  reviewFilterRating.addEventListener("change", renderReviews);
  emailReceiptBtn.addEventListener("click", () => {
    if (!activeReceipt) return;
    const subject = encodeURIComponent(`Order Receipt - ${activeReceipt.productTitle}`);
    const body = encodeURIComponent(`Hello,\n\nI need support for order ${activeReceipt.orderDocId}.\nProduct: ${activeReceipt.productTitle}\nAmount: ${formatAmount(activeReceipt.amount)}\n\nThanks`);
    window.location.href = `mailto:${(config.support && config.support.orderEmail) || ""}?subject=${subject}&body=${body}`;
  });
  whatsappReceiptBtn.addEventListener("click", () => {
    if (!activeReceipt) return;
    const number = (config.support && config.support.orderWhatsapp) || "";
    const text = encodeURIComponent(`Hello, I need support for order ${activeReceipt.orderDocId} (${activeReceipt.productTitle}) amount ${formatAmount(activeReceipt.amount)}.`);
    window.open(`https://wa.me/${number}?text=${text}`, "_blank", "noopener");
  });
  invoicePdfBtn.addEventListener("click", async () => {
    if (!activeReceipt || !window.jspdf || !window.jspdf.jsPDF) return;
    try {
      const invoice = await fetchInvoice(activeReceipt.orderDocId);
      const pdf = new window.jspdf.jsPDF();
      pdf.setFontSize(18);
      pdf.text(invoice.company.name, 14, 18);
      pdf.setFontSize(11);
      pdf.text(`Invoice No: ${invoice.invoiceNo}`, 14, 28);
      pdf.text(`GSTIN: ${invoice.company.gstin}`, 14, 35);
      pdf.text(`Customer: ${invoice.customer.name}`, 14, 45);
      pdf.text(`Email: ${invoice.customer.email}`, 14, 52);
      pdf.text(`Product: ${invoice.order.productTitle}`, 14, 62);
      pdf.text(`Amount: Rs. ${invoice.order.amount}`, 14, 69);
      pdf.text(`Issued: ${new Date(invoice.issuedAt).toLocaleString()}`, 14, 76);
      pdf.save(`${invoice.invoiceNo}.pdf`);
      showToast("PDF invoice downloaded.");
    } catch (error) {
      showToast(error.message || "Invoice PDF failed.", "error");
    }
  });

  [loginModal, paymentModal, receiptModal, profileModal, imageCardModal, settingsModal].forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("click", (event) => {
    if (profileMenu.hidden) return;
    if (event.target === profileBtn || profileBtn.contains(event.target)) return;
    if (event.target === profileMenu || profileMenu.contains(event.target)) return;
    hideProfileMenu();
  });

  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-auth-tab");
      authTabs.forEach((item) => item.classList.toggle("is-active", item === tab));
      authPanels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.getAttribute("data-auth-panel") === target);
      });
    });
  });

  document.addEventListener("gdz-auth-message", (event) => {
    if (!event.detail) return;
    showToast(event.detail.message, event.detail.type || "success");
  });

  document.addEventListener("gdz-auth-changed", () => {
    syncUserToBackend();
    hydrateCloudUserData().then(() => {
      renderCart();
      renderUserDashboard();
      renderProducts();
      loadNotificationInbox();
      loadQuestions();
    });
    updateAuthUI();
    closeModal(loginModal);
  });

  updateBrandUI();
  applyLanguage();
  applyTheme();
  renderBackupPayments();
  if (config.support && config.support.chatWidgetEnabled) {
    supportWidget.hidden = false;
  }
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installAppBtn.hidden = false;
  });
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => null);
    });
  }
  const initialParams = new URLSearchParams(window.location.search);
  if (initialParams.get("ref")) {
    setReferralCode(initialParams.get("ref"));
  }
  if (initialParams.get("category")) {
    categoryFilter.value = initialParams.get("category");
  }
  activeCoupon = getSavedCoupon();
  if (activeCoupon && activeCoupon.code) {
    couponInput.value = activeCoupon.code;
    couponStatus.textContent = `${activeCoupon.code} applied.`;
  }
  updateAuthUI();
  renderGatewayNote();
  renderBundleBuilder();
  renderDashboardWidgets();
  if (questionProductId) {
    questionProductId.innerHTML = reviewProductId.innerHTML;
  }
  updateCountdownNodes();
  window.setInterval(updateCountdownNodes, 1000);
  productGrid.innerHTML = `
    <article class="product-card skeleton-card"></article>
    <article class="product-card skeleton-card"></article>
    <article class="product-card skeleton-card"></article>
  `;
  loadProducts().then(() => {
    renderProducts();
    renderCart();
    renderUserDashboard();
    renderRecentlyViewed();
    renderRecommended();
    renderComparePreview();
    renderBundleBuilder();
    loadBlogPosts();
    populateReviewProducts();
    if (questionProductId) {
      questionProductId.innerHTML = reviewProductId.innerHTML;
    }
    loadReviews();
    loadNotificationInbox();
    loadQuestions();
    handleSuccessRedirect();
  });
  hydrateCloudUserData().then(() => {
    renderCart();
    renderUserDashboard();
    renderProducts();
    renderBundleBuilder();
  });
})();
