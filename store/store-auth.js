import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const config = window.STORE_CONFIG || {};
const firebaseConfig = config.firebase || {};

if (!firebaseConfig.enabled) {
  window.gdzStoreAuth = {
    enabled: false,
    logout: async () => {}
  };
} else {
  const hasFirebaseConfig =
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("replace_") &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId;

  if (!hasFirebaseConfig) {
    console.warn("Firebase config incomplete. Google/OTP login disabled until real config is added.");
    window.gdzStoreAuth = {
      enabled: false,
      logout: async () => {}
    };
  } else {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    let confirmationResult = null;
    let recaptchaVerifier = null;

    const googleLoginBtn = document.getElementById("googleLoginBtn");
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    const verifyOtpBtn = document.getElementById("verifyOtpBtn");
    const phoneNumberInput = document.getElementById("phoneNumber");
    const otpCodeInput = document.getElementById("otpCode");
    const loginNameInput = document.getElementById("loginName");
    const loginEmailInput = document.getElementById("loginEmail");

    function notify(message, type) {
      document.dispatchEvent(new CustomEvent("gdz-auth-message", {
        detail: { message, type: type || "success" }
      }));
    }

    function syncUser(user) {
      if (!user) {
        localStorage.removeItem("gdz_store_user");
        document.dispatchEvent(new CustomEvent("gdz-auth-changed", {
          detail: { user: null }
        }));
        return;
      }

      const sessionUser = {
        name: user.displayName || loginNameInput.value.trim() || "User",
        email: user.email || loginEmailInput.value.trim() || user.phoneNumber || "",
        photoUrl: user.photoURL || ""
      };
      localStorage.setItem("gdz_store_user", JSON.stringify(sessionUser));
      document.dispatchEvent(new CustomEvent("gdz-auth-changed", {
        detail: { user: sessionUser }
      }));
    }

    function getRecaptcha() {
      if (!recaptchaVerifier) {
        recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "normal"
        });
      }
      return recaptchaVerifier;
    }

    googleLoginBtn.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, provider);
        syncUser(result.user);
        notify("Google login successful.");
      } catch (error) {
        notify(error.message || "Google login failed.", "error");
      }
    });

    sendOtpBtn.addEventListener("click", async () => {
      const phoneNumber = phoneNumberInput.value.trim();
      if (!phoneNumber) {
        notify("Phone number bhariye.", "error");
        return;
      }

      try {
        const verifier = getRecaptcha();
        confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        notify("OTP sent successfully.");
      } catch (error) {
        notify(error.message || "OTP send failed.", "error");
      }
    });

    verifyOtpBtn.addEventListener("click", async () => {
      if (!confirmationResult) {
        notify("Pehle OTP send kijiye.", "error");
        return;
      }

      const otpCode = otpCodeInput.value.trim();
      if (!otpCode) {
        notify("OTP code daliyega.", "error");
        return;
      }

      try {
        const result = await confirmationResult.confirm(otpCode);
        syncUser(result.user);
        notify("Phone login successful.");
      } catch (error) {
        notify(error.message || "OTP verify failed.", "error");
      }
    });

    onAuthStateChanged(auth, (user) => {
      syncUser(user);
    });

    window.gdzStoreAuth = {
      enabled: true,
      logout: async () => {
        await signOut(auth);
      }
    };
  }
}
