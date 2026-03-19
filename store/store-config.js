window.STORE_CONFIG = {
  apiBaseUrl: "https://gdz-store-backend.onrender.com/api",
  adminPanelUrl: "./admin.html",
  brand: {
    name: "GDZ Store",
    shortName: "GS",
    tagline: "Login, pay, then order or download instantly"
  },
  firebase: {
    enabled: true,
    apiKey: "AIzaSyCAoP64KkU26tt_1rheoe67hKV3I3DddpY",
    authDomain: "store-gulshandigitalzone.firebaseapp.com",
    projectId: "store-gulshandigitalzone",
    storageBucket: "store-gulshandigitalzone.firebasestorage.app",
    messagingSenderId: "74385203058",
    appId: "1:74385203058:web:dbfd12e28dde06e29e07eb",
    measurementId: "G-8CKM675KYY"
  },
  payment: {
    provider: "razorpay",
    currency: "INR",
    gatewayLabel: "Razorpay",
    razorpayKey: "rzp_live_RXweAl59zUyOWu",
    paymentLinkUrl: "https://razorpay.me/@GULSHANDIGITALZONE",
    verifyEndpoint: "/payments/verify",
    createOrderEndpoint: "/payments/create-order",
    enableServerVerification: true,
    manualFallback: false
  },
  support: {
    orderEmail: "gulshanshk6@gmail.com",
    orderWhatsapp: "916299050695",
    chatWidgetEnabled: true
  },
  backupPayment: {
    upiId: "",
    cashfreeLink: "",
    phonepeLink: ""
  },
  products: [
    {
      id: "website-pack",
      title: "Website Starter Pack",
      details: "Custom landing page, responsive layout, contact section, and publish-ready setup.",
      amount: 1499,
      image: "../blog.png",
      type: "order",
      actionLabel: "Order Now",
      actionUrl: "mailto:gulshanshk6@gmail.com?subject=Website%20Starter%20Pack%20Order",
      features: [
        "Responsive design",
        "Fast delivery support",
        "Service order after payment"
      ]
    },
    {
      id: "smart-pdf-viewer",
      title: "Smart PDF Viewer",
      details: "Useful document viewer package with simple workflow and instant file access.",
      amount: 299,
      image: "../app pic.jpg",
      type: "download",
      actionLabel: "Download",
      actionUrl: "../simple download file.pdf",
      features: [
        "Instant file access",
        "Download unlock after payment",
        "Digital product card layout"
      ]
    },
    {
      id: "photoshop-kit",
      title: "Photoshop 7.0 Guide",
      details: "Download page access plus easy installation guide for users who need a light editor setup.",
      amount: 199,
      image: "../photoshope.png",
      type: "download",
      actionLabel: "Download Guide",
      actionUrl: "../Photoshop-7.0.html",
      features: [
        "Low-size digital product",
        "Pay and unlock flow",
        "Editable product details"
      ]
    }
  ]
};
