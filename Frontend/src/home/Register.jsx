import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
  FaArrowLeft,
} from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!name) {
      toast.error("Please enter your full name");
      return;
    }

    if (name.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!phone) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10 digit phone number");
      return;
    }

    if (!password) {
      toast.error("Please enter a password");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    // ==========================================
    // GET EXISTING USERS
    // ==========================================

    const existingUsers =
      JSON.parse(localStorage.getItem("woolcraft-users")) || [];

    // ==========================================
    // CHECK DUPLICATE EMAIL
    // ==========================================

    const existingUser = existingUsers.find(
      (user) => user.email.toLowerCase() === email,
    );

    if (existingUser) {
      setLoading(false);
      toast.error("An account with this email already exists");
      return;
    }

    // ==========================================
    // CREATE USER
    // ==========================================

    const newUser = {
      id: `USER-${Date.now()}`,
      name,
      email,
      phone,
      password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // ==========================================
    // SAVE USER
    // ==========================================

    const updatedUsers = [...existingUsers, newUser];

    localStorage.setItem("woolcraft-users", JSON.stringify(updatedUsers));

    // ==========================================
    // SAVE CURRENT LOGGED-IN USER
    // ==========================================

    const currentUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    };

    localStorage.setItem("woolcraft-user", JSON.stringify(currentUser));

    localStorage.setItem("woolcraft-isLoggedIn", "true");

    // ==========================================
    // EVENT FOR NAVBAR / OTHER COMPONENTS
    // ==========================================

    window.dispatchEvent(new Event("userUpdated"));

    // ==========================================
    // SUCCESS
    // ==========================================

    setTimeout(() => {
      setLoading(false);

      toast.success("Account created successfully! 🎉");

      navigate("/");
    }, 700);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* BACK TO HOME */}

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-pink-600 font-medium hover:text-pink-700 mb-5"
        >
          <FaArrowLeft />
          Back to Home
        </Link>

        {/* REGISTER CARD */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="bg-white rounded-3xl shadow-sm p-6 md:p-8"
        >
          {/* HEADER */}

          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
              <FaUserPlus className="text-2xl" />
            </div>

            <p className="mt-5 text-pink-600 font-semibold">WOOLCRAFT NEPAL</p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create your account and start shopping handmade crafts.
            </p>
          </div>

          {/* FORM */}

          <form onSubmit={handleRegister} className="mt-7 space-y-4">
            {/* NAME */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>

              <div className="relative mt-2">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                />
              </div>
            </div>

            {/* EMAIL */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>

              <div className="relative mt-2">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  autoComplete="email"
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                />
              </div>
            </div>

            {/* PHONE */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <div className="relative mt-2">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="98XXXXXXXX"
                  maxLength={10}
                  autoComplete="tel"
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                />
              </div>
            </div>

            {/* PASSWORD */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-2">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-12 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="relative mt-2">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-12 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-600"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* REGISTER BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <FaUserPlus />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* LOGIN */}

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-pink-600 hover:text-pink-700"
            >
              Login
            </Link>
          </div>

          {/* INFO */}

          <div className="mt-5 bg-pink-50 rounded-xl p-3 text-center">
            <p className="text-xs text-pink-700">
              Your account information will be used for faster checkout and
              order management.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Register;
