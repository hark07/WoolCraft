import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaChevronDown,
  FaUserCircle,
  FaBoxOpen,
  FaSignOutAlt,
  FaCog,
  FaHome,
  FaGift,
  FaInfoCircle,
  FaPhone,
  FaQuestionCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [user, setUser] = useState(null);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef(null);

  // =====================================================
  // GET CURRENT USER
  // =====================================================

  const getCurrentUser = () => {
    try {
      const auth = JSON.parse(
        localStorage.getItem("woolcraft-auth") || "false",
      );

      const savedUser = JSON.parse(
        localStorage.getItem("woolcraft-user") || "null",
      );

      if (auth === true && savedUser) {
        setUser(savedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth read error:", error);
      setUser(null);
    }
  };

  // =====================================================
  // UPDATE CART COUNT
  // =====================================================

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("woolcraft-cart")) || [];

      const totalQuantity = cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      );

      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Cart read error:", error);
      setCartCount(0);
    }
  };

  // =====================================================
  // UPDATE WISHLIST COUNT
  // =====================================================

  const updateWishlistCount = () => {
    try {
      const wishlist =
        JSON.parse(localStorage.getItem("woolcraft-wishlist")) || [];

      setWishlistCount(wishlist.length);
    } catch (error) {
      console.error("Wishlist read error:", error);
      setWishlistCount(0);
    }
  };

  // =====================================================
  // INITIAL LOAD + CUSTOM EVENTS
  // =====================================================

  useEffect(() => {
    getCurrentUser();
    updateCartCount();
    updateWishlistCount();

    const handleAuthUpdate = () => {
      getCurrentUser();
    };

    const handleCartUpdate = () => {
      updateCartCount();
    };

    const handleWishlistUpdate = () => {
      updateWishlistCount();
    };

    window.addEventListener("authUpdated", handleAuthUpdate);
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("authUpdated", handleAuthUpdate);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, []);

  // =====================================================
  // STORAGE EVENT
  // =====================================================

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "woolcraft-user" || event.key === "woolcraft-auth") {
        getCurrentUser();
      }

      if (event.key === "woolcraft-cart") {
        updateCartCount();
      }

      if (event.key === "woolcraft-wishlist") {
        updateWishlistCount();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // =====================================================
  // CLOSE ACCOUNT WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =====================================================
  // ESC KEY
  // =====================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
        setMobileMenu(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // =====================================================
  // CLOSE MENUS
  // =====================================================

  const closeMenus = () => {
    setAccountOpen(false);
    setMobileMenu(false);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("woolcraft-auth");
    localStorage.removeItem("woolcraft-user");

    setUser(null);
    setAccountOpen(false);
    setMobileMenu(false);

    window.dispatchEvent(new Event("authUpdated"));

    toast.success("Logged out successfully");

    navigate("/");
  };

  // =====================================================
  // USER DISPLAY NAME
  // =====================================================

  const displayName = user?.name ? user.name.split(" ")[0] : "Account";

  return (
    <>
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 md:h-[72px] flex items-center justify-between gap-4">
            {/* =================================================
                LOGO
            ================================================= */}

            <Link to="/" onClick={closeMenus} className="shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                  <FaGift />
                </div>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-none">
                    WoolCraft
                  </h1>

                  <p className="text-[10px] md:text-xs text-pink-600 font-semibold">
                    NEPAL
                  </p>
                </div>
              </div>
            </Link>

            {/* =================================================
                DESKTOP MENU
            ================================================= */}

            <div className="hidden md:flex items-center gap-5">
              {/* HOME */}

              <Link
                to="/"
                className="text-sm font-medium text-gray-700 hover:text-pink-600 transition"
              >
                Home
              </Link>

              {/* PRODUCTS */}

              <Link
                to="/products"
                className="text-sm font-medium text-gray-700 hover:text-pink-600 transition"
              >
                Products
              </Link>

              {/* ABOUT */}

              <Link
                to="/about"
                className="text-sm font-medium text-gray-700 hover:text-pink-600 transition"
              >
                About
              </Link>

              {/* CONTACT */}

              <Link
                to="/contact"
                className="text-sm font-medium text-gray-700 hover:text-pink-600 transition"
              >
                Contact
              </Link>

              {/* HELP & SUPPORT */}

              <Link
                to="/help"
                className="text-sm font-medium text-gray-700 hover:text-pink-600 transition"
              >
                Help & Support
              </Link>

              {/* =================================================
                  WISHLIST
              ================================================= */}

              <Link
                to="/wishlist"
                className="relative text-gray-700 hover:text-pink-600 transition"
                aria-label="Wishlist"
              >
                <FaHeart className="text-xl" />

                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* =================================================
                  CART
              ================================================= */}

              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-pink-600 transition"
                aria-label="Shopping Cart"
              >
                <FaShoppingCart className="text-xl" />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* =================================================
                  ACCOUNT
              ================================================= */}

              <div ref={accountRef} className="relative">
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition ${
                    accountOpen
                      ? "bg-pink-50 text-pink-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FaUser className="text-lg" />

                  <span className="text-sm font-semibold max-w-[120px] truncate">
                    {displayName}
                  </span>

                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* =================================================
                    ACCOUNT DROPDOWN
                ================================================= */}

                {accountOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* HEADER */}

                    <div className="bg-gradient-to-r from-pink-50 to-white p-5 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                          <FaUserCircle className="text-3xl" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">
                            {user
                              ? `Hello, ${user.name}`
                              : "Welcome to WoolCraft"}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {user ? user.email : "Manage your account"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MENU */}

                    <div className="p-2">
                      {/* LOGIN */}

                      {!user && (
                        <Link
                          to="/login"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 group transition"
                        >
                          <span className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center">
                            <FaUser className="text-gray-500 group-hover:text-pink-600" />
                          </span>

                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              Login / Register
                            </p>

                            <p className="text-xs text-gray-400">
                              Access your account
                            </p>
                          </div>
                        </Link>
                      )}

                      {/* ORDERS */}

                      <Link
                        to="/orders"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 group transition"
                      >
                        <span className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center">
                          <FaBoxOpen className="text-gray-500 group-hover:text-pink-600" />
                        </span>

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            My Orders
                          </p>

                          <p className="text-xs text-gray-400">
                            Track your orders
                          </p>
                        </div>
                      </Link>

                      {/* WISHLIST */}

                      <Link
                        to="/wishlist"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 group transition"
                      >
                        <span className="relative w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center">
                          <FaHeart className="text-gray-500 group-hover:text-pink-600" />

                          {wishlistCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                              {wishlistCount}
                            </span>
                          )}
                        </span>

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Wishlist
                          </p>

                          <p className="text-xs text-gray-400">
                            {wishlistCount} saved items
                          </p>
                        </div>
                      </Link>

                      {/* CART */}

                      <Link
                        to="/cart"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 group transition"
                      >
                        <span className="relative w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-pink-100 flex items-center justify-center">
                          <FaShoppingCart className="text-gray-500 group-hover:text-pink-600" />

                          {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                              {cartCount}
                            </span>
                          )}
                        </span>

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            Shopping Cart
                          </p>

                          <p className="text-xs text-gray-400">
                            {cartCount} items
                          </p>
                        </div>
                      </Link>

                      <div className="border-t border-gray-100 my-2" />

                      {/* ABOUT */}

                      <Link
                        to="/about"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
                      >
                        <span className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center">
                          <FaInfoCircle className="text-pink-600" />
                        </span>

                        <span className="text-sm font-medium text-gray-700">
                          About WoolCraft
                        </span>
                      </Link>

                      {/* CONTACT */}

                      <Link
                        to="/contact"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
                      >
                        <span className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center">
                          <FaPhone className="text-pink-600" />
                        </span>

                        <span className="text-sm font-medium text-gray-700">
                          Contact Us
                        </span>
                      </Link>

                      {/* HELP */}

                      <Link
                        to="/help"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 transition"
                      >
                        <span className="w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center">
                          <FaQuestionCircle className="text-pink-600" />
                        </span>

                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            Help & Support
                          </p>

                          <p className="text-xs text-gray-400">
                            Need help? We're here
                          </p>
                        </div>
                      </Link>

                      {/* SETTINGS */}

                      <Link
                        to="/settings"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition"
                      >
                        <span className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                          <FaCog className="text-gray-500" />
                        </span>

                        <span className="text-sm font-medium text-gray-700">
                          Settings
                        </span>
                      </Link>

                      {/* LOGOUT */}

                      {user && (
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-left transition"
                        >
                          <span className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                            <FaSignOutAlt className="text-red-500" />
                          </span>

                          <span className="text-sm font-medium text-red-500">
                            Logout
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* =================================================
                MOBILE RIGHT SIDE
            ================================================= */}

            <div className="flex md:hidden items-center gap-3">
              {/* WISHLIST */}

              <Link to="/wishlist" className="relative text-gray-700">
                <FaHeart className="text-lg" />

                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* CART */}

              <Link to="/cart" className="relative text-gray-700">
                <FaShoppingCart className="text-lg" />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[9px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* ACCOUNT */}

              <button
                onClick={() => setAccountOpen(true)}
                className={`h-9 px-2 rounded-full flex items-center justify-center gap-1 transition ${
                  accountOpen
                    ? "bg-pink-100 text-pink-600"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <FaUser />

                {user && (
                  <span className="max-w-[70px] truncate text-xs font-semibold">
                    {displayName}
                  </span>
                )}
              </button>

              {/* MENU */}

              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="w-9 h-9 flex items-center justify-center text-gray-700"
              >
                {mobileMenu ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* =================================================
              MOBILE MENU
          ================================================= */}

          {mobileMenu && (
            <div className="md:hidden pb-5 border-t border-gray-100 pt-3">
              <div className="flex flex-col gap-1">
                {/* HOME */}

                <Link
                  to="/"
                  onClick={closeMenus}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 text-gray-700"
                >
                  <FaHome className="text-pink-600" />
                  Home
                </Link>

                {/* PRODUCTS */}

                <Link
                  to="/products"
                  onClick={closeMenus}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 text-gray-700"
                >
                  <FaGift className="text-pink-600" />
                  Products
                </Link>

                {/* ABOUT */}

                <Link
                  to="/about"
                  onClick={closeMenus}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 text-gray-700"
                >
                  <FaInfoCircle className="text-pink-600" />
                  About
                </Link>

                {/* CONTACT */}

                <Link
                  to="/contact"
                  onClick={closeMenus}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 text-gray-700"
                >
                  <FaPhone className="text-pink-600" />
                  Contact
                </Link>

                {/* HELP */}

                <Link
                  to="/help"
                  onClick={closeMenus}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 text-gray-700"
                >
                  <FaQuestionCircle className="text-pink-600" />
                  Help & Support
                </Link>

                {/* WISHLIST */}

                <Link
                  to="/wishlist"
                  onClick={closeMenus}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-pink-50 text-gray-700"
                >
                  <span className="flex items-center gap-3">
                    <FaHeart className="text-pink-600" />
                    Wishlist
                  </span>

                  {wishlistCount > 0 && (
                    <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* CART */}

                <Link
                  to="/cart"
                  onClick={closeMenus}
                  className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-pink-50 text-gray-700"
                >
                  <span className="flex items-center gap-3">
                    <FaShoppingCart className="text-pink-600" />
                    Cart
                  </span>

                  {cartCount > 0 && (
                    <span className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* MY ACCOUNT */}

                <button
                  onClick={() => {
                    setMobileMenu(false);
                    setAccountOpen(true);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-pink-50 text-gray-700 text-left"
                >
                  <FaUser className="text-pink-600" />

                  {user ? `My Account (${displayName})` : "My Account"}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* =====================================================
          MOBILE ACCOUNT MODAL
      ===================================================== */}

      {accountOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          {/* BACKDROP */}

          <div
            onClick={() => setAccountOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* MODAL */}

          <div className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* HANDLE */}

            <div className="pt-3 flex justify-center">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* HEADER */}

            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                  <FaUserCircle className="text-3xl" />
                </div>

                <div className="min-w-0">
                  <h2 className="font-bold text-gray-900 truncate">
                    {user ? `Hello, ${user.name}` : "My Account"}
                  </h2>

                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {user ? user.email : "Welcome to WoolCraft Nepal"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAccountOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0"
              >
                <FaTimes />
              </button>
            </div>

            {/* MENU */}

            <div className="px-4 pb-7">
              {/* LOGIN */}

              {!user && (
                <Link
                  to="/login"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-pink-50 text-pink-600"
                >
                  <FaUser />

                  <div>
                    <p className="font-semibold">Login / Register</p>

                    <p className="text-xs text-pink-500 mt-1">
                      Sign in to your account
                    </p>
                  </div>
                </Link>
              )}

              {/* QUICK LINKS */}

              <div className="grid grid-cols-2 gap-3 mt-3">
                {/* ORDERS */}

                <Link
                  to="/orders"
                  onClick={() => setAccountOpen(false)}
                  className="border border-gray-100 rounded-2xl p-4 hover:bg-gray-50"
                >
                  <FaBoxOpen className="text-pink-600 text-xl" />

                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    My Orders
                  </p>

                  <p className="text-xs text-gray-400 mt-1">Track orders</p>
                </Link>

                {/* WISHLIST */}

                <Link
                  to="/wishlist"
                  onClick={() => setAccountOpen(false)}
                  className="border border-gray-100 rounded-2xl p-4 hover:bg-gray-50"
                >
                  <FaHeart className="text-pink-600 text-xl" />

                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    Wishlist
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {wishlistCount} saved
                  </p>
                </Link>

                {/* CART */}

                <Link
                  to="/cart"
                  onClick={() => setAccountOpen(false)}
                  className="border border-gray-100 rounded-2xl p-4 hover:bg-gray-50"
                >
                  <FaShoppingCart className="text-pink-600 text-xl" />

                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    Cart
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {cartCount} items
                  </p>
                </Link>

                {/* SETTINGS */}

                <Link
                  to="/settings"
                  onClick={() => setAccountOpen(false)}
                  className="border border-gray-100 rounded-2xl p-4 hover:bg-gray-50"
                >
                  <FaCog className="text-pink-600 text-xl" />

                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    Settings
                  </p>

                  <p className="text-xs text-gray-400 mt-1">Account settings</p>
                </Link>
              </div>

              {/* ABOUT */}

              <Link
                to="/about"
                onClick={() => setAccountOpen(false)}
                className="mt-3 flex items-center gap-4 border border-gray-100 rounded-2xl p-4 hover:bg-pink-50"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                  <FaInfoCircle className="text-pink-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    About WoolCraft
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Learn about our store
                  </p>
                </div>
              </Link>

              {/* CONTACT */}

              <Link
                to="/contact"
                onClick={() => setAccountOpen(false)}
                className="mt-3 flex items-center gap-4 border border-gray-100 rounded-2xl p-4 hover:bg-pink-50"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                  <FaPhone className="text-pink-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Contact Us
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Get in touch with us
                  </p>
                </div>
              </Link>

              {/* HELP & SUPPORT */}

              <Link
                to="/help"
                onClick={() => setAccountOpen(false)}
                className="mt-3 flex items-center gap-4 border border-gray-100 rounded-2xl p-4 hover:bg-pink-50"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                  <FaQuestionCircle className="text-pink-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    Help & Support
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    FAQs and customer support
                  </p>
                </div>
              </Link>

              {/* LOGOUT */}

              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full mt-3 border border-red-100 text-red-500 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-50"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
