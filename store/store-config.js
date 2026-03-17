window.STORE_CONFIG = {
  apiBaseUrl: "http://localhost:8080/api",
  adminPanelUrl: "./admin.html",
  brand: {
    name: "GDZ Store",
    shortName: "GS",
    tagline: "Login, pay, then order or download instantly"
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
    manualFallback: true
  },
  support: {
    orderEmail: "gulshanshk6@gmail.com",
    orderWhatsapp: "916299050695"
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
