import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaShoppingCart,
  FaCheckCircle,
} from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  // ==========================================
  // CHECK ALREADY LOGGED IN
  // ==========================================

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("woolcraft-auth"));

    const user = JSON.parse(localStorage.getItem("woolcraft-user"));

    if (auth === true && user) {
      navigate(location.state?.from || "/", {
        replace: true,
      });
    }
  }, [navigate, location.state]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // GET SAVED CART
  // ==========================================

  const getCart = () => {
    try {
      const savedCart =
        JSON.parse(localStorage.getItem("woolcraft-cart")) || [];

      return Array.isArray(savedCart) ? savedCart : [];
    } catch {
      return [];
    }
  };

  // ==========================================
  // SAVE CART
  // ==========================================

  const saveCart = (cart) => {
    localStorage.setItem("woolcraft-cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // ==========================================
  // LOGIN / REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    // ========================================
    // REGISTER
    // ========================================

    if (isRegister) {
      const name = form.name.trim();
      const phone = form.phone.trim();
      const address = form.address.trim();

      // -------------------------------
      // VALIDATION
      // -------------------------------

      if (!name) {
        toast.error("Please enter your full name");
        return;
      }

      if (!email) {
        toast.error("Please enter your email");
        return;
      }

      if (!phone) {
        toast.error("Please enter your phone number");
        return;
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        toast.error("Please enter a valid 10 digit phone number");
        return;
      }

      if (!address) {
        toast.error("Please enter your delivery address");
        return;
      }

      if (!password) {
        toast.error("Please enter your password");
        return;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      setLoading(true);

      try {
        // -------------------------------
        // CHECK EXISTING ACCOUNT
        // -------------------------------

        const savedUser = JSON.parse(localStorage.getItem("woolcraft-user"));

        if (savedUser && savedUser.email?.toLowerCase() === email) {
          toast.error("Account already exists. Please login.");

          setIsRegister(false);

          setForm((prev) => ({
            ...prev,
            name: "",
            phone: "",
            address: "",
            password: "",
          }));

          setLoading(false);
          return;
        }

        // -------------------------------
        // IMPORTANT:
        // KEEP CURRENT GUEST CART
        // -------------------------------

        const currentCart = getCart();

        // -------------------------------
        // CREATE USER
        // -------------------------------

        const newUser = {
          id: Date.now(),
          name,
          email,
          phone,
          address,
          password,
          createdAt: new Date().toISOString(),
        };

        // -------------------------------
        // SAVE USER
        // -------------------------------

        localStorage.setItem("woolcraft-user", JSON.stringify(newUser));

        // -------------------------------
        // SAVE AUTH
        // -------------------------------

        localStorage.setItem("woolcraft-auth", JSON.stringify(true));

        // -------------------------------
        // KEEP CART
        // -------------------------------

        if (currentCart.length > 0) {
          saveCart(currentCart);
        }

        // -------------------------------
        // AUTH EVENT
        // -------------------------------

        window.dispatchEvent(new Event("authUpdated"));

        // -------------------------------
        // SUCCESS
        // -------------------------------

        toast.success(`Welcome to WoolCraft, ${name}! 🎉`);

        // -------------------------------
        // REDIRECT
        // -------------------------------

        const redirectTo = location.state?.from || "/";

        setTimeout(() => {
          navigate(redirectTo, {
            replace: true,
          });
        }, 300);
      } catch (error) {
        console.error(error);

        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }

      return;
    }

    // ========================================
    // LOGIN
    // ========================================

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      // -------------------------------
      // GET REGISTERED USER
      // -------------------------------

      const savedUser = JSON.parse(localStorage.getItem("woolcraft-user"));

      // -------------------------------
      // ACCOUNT NOT FOUND
      // -------------------------------

      if (!savedUser) {
        toast.error("Account not found. Please register first.");

        setIsRegister(true);

        setForm((prev) => ({
          ...prev,
          email,
          password: "",
        }));

        setLoading(false);
        return;
      }

      // -------------------------------
      // EMAIL CHECK
      // -------------------------------

      const savedEmail = savedUser.email?.trim().toLowerCase();

      if (savedEmail !== email) {
        toast.error("No account found with this email.");

        setLoading(false);
        return;
      }

      // -------------------------------
      // PASSWORD CHECK
      // -------------------------------

      if (savedUser.password !== password) {
        toast.error("Incorrect password");
        setLoading(false);
        return;
      }

      // -------------------------------
      // KEEP EXISTING CART
      // -------------------------------

      const currentCart = getCart();

      // -------------------------------
      // SET AUTH
      // -------------------------------

      localStorage.setItem("woolcraft-auth", JSON.stringify(true));

      // -------------------------------
      // KEEP CART
      // -------------------------------

      if (currentCart.length > 0) {
        saveCart(currentCart);
      }

      // -------------------------------
      // AUTH EVENT
      // -------------------------------

      window.dispatchEvent(new Event("authUpdated"));

      // -------------------------------
      // SUCCESS
      // -------------------------------

      toast.success(`Welcome back, ${savedUser.name} 👋`);

      // -------------------------------
      // REDIRECT
      // -------------------------------

      const redirectTo = location.state?.from || "/";

      setTimeout(() => {
        navigate(redirectTo, {
          replace: true,
        });
      }, 300);
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SWITCH LOGIN / REGISTER
  // ==========================================

  const switchMode = () => {
    setIsRegister((prev) => !prev);

    setShowPassword(false);

    setForm({
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
    });
  };

  // ==========================================
  // BACK
  // ==========================================

  const handleBack = () => {
    const from = location.state?.from;

    if (from) {
      navigate(from);
    } else {
      navigate("/");
    }
  };

  // ==========================================
  // CART COUNT
  // ==========================================

  const cart = getCart();

  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity || 1),
    0,
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <section className="min-h-[80vh] bg-gradient-to-b from-pink-50 to-white py-10 md:py-16">
      <div className="max-w-md mx-auto px-4">
        {/* ======================================
            BACK BUTTON
        ====================================== */}

        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-pink-600 mb-6 transition"
        >
          <FaArrowLeft />
          Back
        </button>

        {/* ======================================
            CARD
        ====================================== */}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8">
          {/* ====================================
              HEADER
          ==================================== */}

          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
              <FaUser className="text-2xl" />
            </div>

            <h1 className="mt-4 text-2xl md:text-3xl font-bold text-gray-900">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {isRegister
                ? "Create your WoolCraft Nepal account"
                : "Login to continue shopping"}
            </p>
          </div>

          {/* ====================================
              CART NOTICE
          ==================================== */}

          {cartCount > 0 && (
            <div className="mt-6 bg-pink-50 border border-pink-100 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white text-pink-600 flex items-center justify-center">
                  <FaShoppingCart />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    You have {cartCount} {cartCount === 1 ? "item" : "items"} in
                    your cart
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {isRegister
                      ? "Your cart will be saved with your account."
                      : "Login to keep your cart saved."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ====================================
              FORM
          ==================================== */}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {/* ==================================
                NAME
            ================================== */}

            {isRegister && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <div className="relative mt-1">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                  />
                </div>
              </div>
            )}

            {/* ==================================
                EMAIL
            ================================== */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative mt-1">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                />
              </div>
            </div>

            {/* ==================================
                PHONE
            ================================== */}

            {isRegister && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <div className="relative mt-1">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="98XXXXXXXX"
                    maxLength={10}
                    autoComplete="tel"
                    className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                  />
                </div>
              </div>
            )}

            {/* ==================================
                ADDRESS
            ================================== */}

            {isRegister && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Delivery Address
                </label>

                <div className="relative mt-1">
                  <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter your delivery address"
                    rows="3"
                    autoComplete="street-address"
                    className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none resize-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                  />
                </div>
              </div>
            )}

            {/* ==================================
                PASSWORD
            ================================== */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-1">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    isRegister ? "Minimum 6 characters" : "Enter your password"
                  }
                  autoComplete={
                    isRegister ? "new-password" : "current-password"
                  }
                  className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-11 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* ==================================
                SUBMIT
            ================================== */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  <FaCheckCircle />

                  {isRegister ? "Create Account" : "Login"}
                </>
              )}
            </button>
          </form>

          {/* ====================================
              SWITCH
          ==================================== */}

          <div className="mt-6 text-center text-sm text-gray-500">
            {isRegister ? "Already have an account?" : "Don't have an account?"}

            <button
              type="button"
              onClick={switchMode}
              className="ml-1 text-pink-600 font-semibold hover:text-pink-700"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </div>

          {/* ====================================
              FOOTER INFO
          ==================================== */}

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              By continuing, you agree to use WoolCraft Nepal's shopping
              service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
