import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
  FaArrowLeft,
  FaMinus,
  FaPlus,
  FaTrash,
  FaShoppingBag,
  FaHeart,
  FaArrowRight,
  FaTruck,
  FaShieldAlt,
  FaSignInAlt,
  FaTag,
  FaClock,
  FaBookmark,
  FaUndo,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

// =========================================================
// CONFIGURATION
// =========================================================

const CART_KEY = "woolcraft-cart";
const WISHLIST_KEY = "woolcraft-wishlist";
const SAVED_KEY = "woolcraft-saved-for-later";

// Shipping configuration
const SHIPPING_FEE = 150;
const FREE_SHIPPING_THRESHOLD = 3000;

// VAT / Tax
// Set to 0 if your product prices already include VAT
const TAX_RATE = 0.13;

// Delivery estimate
const DELIVERY_MIN_DAYS = 2;
const DELIVERY_MAX_DAYS = 5;

// Coupon configuration
const COUPONS = {
  WOOL10: {
    type: "percentage",
    value: 10,
    minOrder: 1000,
    description: "10% off",
  },

  SAVE500: {
    type: "fixed",
    value: 500,
    minOrder: 3000,
    description: "Rs. 500 off",
  },

  WOOL20: {
    type: "percentage",
    value: 20,
    minOrder: 5000,
    description: "20% off",
  },
};

// =========================================================
// HELPER
// =========================================================

const formatPrice = (amount) => {
  return `Rs. ${Number(amount || 0).toLocaleString()}`;
};

// =========================================================
// CART COMPONENT
// =========================================================

function Cart() {
  const navigate = useNavigate();

  // =======================================================
  // STATE
  // =======================================================

  const [cart, setCart] = useState([]);
  const [savedItems, setSavedItems] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  // =======================================================
  // AUTH CHECK
  // =======================================================

  const checkAuth = () => {
    try {
      const auth = JSON.parse(
        localStorage.getItem("woolcraft-auth") || "false",
      );

      const user = JSON.parse(localStorage.getItem("woolcraft-user") || "null");

      setIsLoggedIn(Boolean(auth && user));
    } catch (error) {
      console.error("Authentication loading error:", error);
      setIsLoggedIn(false);
    }
  };

  // =======================================================
  // LOAD CART
  // =======================================================

  const loadCart = () => {
    try {
      const savedCart =
        JSON.parse(localStorage.getItem(CART_KEY) || "[]") || [];

      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch (error) {
      console.error("Cart loading error:", error);
      setCart([]);
    }
  };

  // =======================================================
  // LOAD SAVED ITEMS
  // =======================================================

  const loadSavedItems = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]") || [];

      setSavedItems(Array.isArray(saved) ? saved : []);
    } catch (error) {
      console.error("Saved items loading error:", error);
      setSavedItems([]);
    }
  };

  // =======================================================
  // SAVE CART
  // =======================================================

  const saveCart = (updatedCart) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));

      setCart(updatedCart);

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Cart saving error:", error);
      toast.error("Unable to update cart");
    }
  };

  // =======================================================
  // SAVE SAVED ITEMS
  // =======================================================

  const saveSavedItems = (updatedItems) => {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(updatedItems));

      setSavedItems(updatedItems);
    } catch (error) {
      console.error("Saved items error:", error);
      toast.error("Unable to save item");
    }
  };

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    checkAuth();
    loadCart();
    loadSavedItems();

    const handleCartUpdate = () => {
      loadCart();
    };

    const handleAuthUpdate = () => {
      checkAuth();
      loadCart();
      loadSavedItems();
    };

    const handleStorage = () => {
      loadCart();
      loadSavedItems();
      checkAuth();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    window.addEventListener("authUpdated", handleAuthUpdate);

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);

      window.removeEventListener("authUpdated", handleAuthUpdate);

      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // =======================================================
  // TOTAL QUANTITY
  // =======================================================

  const totalQuantity = useMemo(() => {
    return cart.reduce((total, item) => total + Number(item.quantity || 1), 0);
  }, [cart]);

  // =======================================================
  // SUBTOTAL
  // =======================================================

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 1);

      return total + price * quantity;
    }, 0);
  }, [cart]);

  // =======================================================
  // COUPON DISCOUNT
  // =======================================================

  const discount = useMemo(() => {
    if (!appliedCoupon) {
      return 0;
    }

    const coupon = COUPONS[appliedCoupon];

    if (!coupon) {
      return 0;
    }

    let discountAmount = 0;

    if (coupon.type === "percentage") {
      discountAmount = subtotal * (coupon.value / 100);
    }

    if (coupon.type === "fixed") {
      discountAmount = coupon.value;
    }

    return Math.min(Math.max(discountAmount, 0), subtotal);
  }, [subtotal, appliedCoupon]);

  // =======================================================
  // AFTER DISCOUNT
  // =======================================================

  const discountedSubtotal = Math.max(subtotal - discount, 0);

  // =======================================================
  // SHIPPING
  // =======================================================

  const deliveryCharge = useMemo(() => {
    if (discountedSubtotal <= 0) {
      return 0;
    }

    if (discountedSubtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0;
    }

    return SHIPPING_FEE;
  }, [discountedSubtotal]);

  // =======================================================
  // TAX
  // =======================================================

  const tax = useMemo(() => {
    return discountedSubtotal * TAX_RATE;
  }, [discountedSubtotal]);

  // =======================================================
  // TOTAL
  // =======================================================

  const total = useMemo(() => {
    return discountedSubtotal + deliveryCharge + tax;
  }, [discountedSubtotal, deliveryCharge, tax]);

  // =======================================================
  // FREE SHIPPING REMAINING
  // =======================================================

  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_THRESHOLD - discountedSubtotal,
    0,
  );

  // =======================================================
  // INCREASE QUANTITY
  // =======================================================

  const increaseQuantity = (id) => {
    const item = cart.find((product) => product.id === id);

    if (!item) {
      return;
    }

    const currentQuantity = Number(item.quantity || 1);

    const stock =
      item.stock !== undefined && item.stock !== null
        ? Number(item.stock)
        : null;

    if (stock !== null && currentQuantity >= stock) {
      toast.error(`Only ${stock} item${stock === 1 ? "" : "s"} available`);

      return;
    }

    const updatedCart = cart.map((product) => {
      if (product.id === id) {
        return {
          ...product,
          quantity: currentQuantity + 1,
        };
      }

      return product;
    });

    saveCart(updatedCart);
  };

  // =======================================================
  // DECREASE QUANTITY
  // =======================================================

  const decreaseQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const currentQuantity = Number(item.quantity || 1);

        return {
          ...item,
          quantity: Math.max(currentQuantity - 1, 1),
        };
      }

      return item;
    });

    saveCart(updatedCart);
  };

  // =======================================================
  // REMOVE ITEM
  // =======================================================

  const removeItem = (id) => {
    const item = cart.find((product) => product.id === id);

    const updatedCart = cart.filter((product) => product.id !== id);

    saveCart(updatedCart);

    toast.success(`${item?.name || "Product"} removed from cart`);
  };

  // =======================================================
  // CLEAR CART
  // =======================================================

  const clearCart = () => {
    if (cart.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?",
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(CART_KEY);

    setCart([]);

    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");

    window.dispatchEvent(new Event("cartUpdated"));

    toast.success("Cart cleared");
  };

  // =======================================================
  // MOVE TO WISHLIST
  // =======================================================

  const moveToWishlist = (item) => {
    let wishlist = [];

    try {
      wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]") || [];
    } catch {
      wishlist = [];
    }

    const alreadyExists = wishlist.some((product) => product.id === item.id);

    if (!alreadyExists) {
      const updatedWishlist = [...wishlist, item];

      localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));

      window.dispatchEvent(new Event("wishlistUpdated"));

      toast.success("Added to wishlist");
    } else {
      toast("Already in wishlist");
    }

    removeItem(item.id);
  };

  // =======================================================
  // SAVE FOR LATER
  // =======================================================

  const saveForLater = (item) => {
    const alreadySaved = savedItems.some((product) => product.id === item.id);

    if (alreadySaved) {
      toast("Already saved for later");
      return;
    }

    const updatedSavedItems = [...savedItems, item];

    saveSavedItems(updatedSavedItems);

    const updatedCart = cart.filter((product) => product.id !== item.id);

    saveCart(updatedCart);

    toast.success(`${item.name} saved for later`);
  };

  // =======================================================
  // MOVE SAVED ITEM BACK TO CART
  // =======================================================

  const moveBackToCart = (item) => {
    const alreadyInCart = cart.some((product) => product.id === item.id);

    if (alreadyInCart) {
      toast("Product is already in cart");
      return;
    }

    const updatedCart = [
      ...cart,
      {
        ...item,
        quantity: Number(item.quantity || 1),
      },
    ];

    saveCart(updatedCart);

    const updatedSavedItems = savedItems.filter(
      (product) => product.id !== item.id,
    );

    saveSavedItems(updatedSavedItems);

    toast.success(`${item.name} moved to cart`);
  };

  // =======================================================
  // REMOVE SAVED ITEM
  // =======================================================

  const removeSavedItem = (id) => {
    const updatedSavedItems = savedItems.filter((item) => item.id !== id);

    saveSavedItems(updatedSavedItems);

    toast.success("Removed from saved items");
  };

  // =======================================================
  // APPLY COUPON
  // =======================================================

  const applyCoupon = () => {
    setCouponError("");

    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a coupon code.");

      return;
    }

    const coupon = COUPONS[code];

    if (!coupon) {
      setCouponError("Invalid coupon code.");

      setAppliedCoupon(null);

      return;
    }

    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order is ${formatPrice(coupon.minOrder)}.`);

      setAppliedCoupon(null);

      return;
    }

    setAppliedCoupon(code);
    setCouponCode(code);
    setCouponError("");

    toast.success(`Coupon ${code} applied successfully`);
  };

  // =======================================================
  // REMOVE COUPON
  // =======================================================

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");

    toast.success("Coupon removed");
  };

  // =======================================================
  // STOCK VALIDATION
  // =======================================================

  const stockIssues = useMemo(() => {
    return cart.filter((item) => {
      if (item.stock === undefined || item.stock === null) {
        return false;
      }

      return Number(item.quantity || 1) > Number(item.stock);
    });
  }, [cart]);

  const hasStockIssue = stockIssues.length > 0;

  // =======================================================
  // CHECKOUT
  // =======================================================

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");

      return;
    }

    if (hasStockIssue) {
      toast.error("Please fix stock issues before checkout.");

      return;
    }

    if (!isLoggedIn) {
      toast("Please login or register before checkout");

      navigate("/login", {
        state: {
          from: "/checkout",
        },
      });

      return;
    }

    navigate("/checkout", {
      state: {
        subtotal,
        discount,
        deliveryCharge,
        tax,
        total,
        appliedCoupon,
      },
    });
  };

  // =======================================================
  // EMPTY CART
  // =======================================================

  if (cart.length === 0) {
    return (
      <section className="min-h-[75vh] bg-gray-50 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 text-center max-w-lg w-full"
        >
          <div className="mx-auto w-20 h-20 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
            <FaShoppingBag className="text-3xl" />
          </div>

          <h1 className="mt-6 text-2xl md:text-3xl font-bold text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-500">
            Looks like you haven't added anything to your cart yet.
          </p>

          {!isLoggedIn && (
            <div className="mt-5 bg-pink-50 border border-pink-100 rounded-xl p-4">
              <p className="text-sm text-pink-700">
                Login or register to save your cart between visits.
              </p>
            </div>
          )}

          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <FaArrowLeft />
            Continue Shopping
          </Link>

          {savedItems.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100 text-left">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <FaBookmark className="text-pink-600" />
                Saved for Later
              </div>

              <div className="mt-4 space-y-3">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 border border-gray-100 rounded-xl p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 line-clamp-1">
                        {item.name}
                      </p>

                      <p className="text-sm text-pink-600 font-semibold">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => moveBackToCart(item)}
                      className="text-xs font-semibold text-pink-600 hover:text-pink-700"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </section>
    );
  }

  // =======================================================
  // MAIN UI
  // =======================================================

  return (
    <section className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}

        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-pink-600 font-medium hover:text-pink-700"
          >
            <FaArrowLeft />
            Continue Shopping
          </Link>

          <div className="mt-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-pink-600 font-semibold">WOOLCRAFT NEPAL</p>

              <h1 className="mt-1 text-3xl md:text-4xl font-bold text-gray-900">
                Shopping Cart
              </h1>

              <p className="mt-2 text-gray-500">
                {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your
                cart
              </p>
            </div>

            <button
              onClick={clearCart}
              className="inline-flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium"
            >
              <FaTrash />
              Clear Cart
            </button>
          </div>
        </motion.div>

        {/* FREE SHIPPING NOTICE */}

        {remainingForFreeShipping > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-6 bg-pink-50 border border-pink-100 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <FaTruck className="mt-1 text-pink-600" />

              <div className="flex-1">
                <p className="text-sm font-semibold text-pink-800">
                  Add {formatPrice(remainingForFreeShipping)} more for FREE
                  delivery!
                </p>

                <div className="mt-3 h-2 bg-white rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pink-600 rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (discountedSubtotal / FREE_SHIPPING_THRESHOLD) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* FREE SHIPPING ACHIEVED */}

        {remainingForFreeShipping === 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-6 bg-green-50 border border-green-100 rounded-2xl p-4"
          >
            <div className="flex items-center gap-3 text-green-700">
              <FaCheckCircle />

              <p className="text-sm font-semibold">
                Congratulations! You qualify for FREE delivery.
              </p>
            </div>
          </motion.div>
        )}

        {/* GUEST NOTICE */}

        {!isLoggedIn && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-6 bg-white border border-pink-100 rounded-2xl p-4 md:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <FaSignInAlt />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Login to save your cart
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Create an account so your cart stays saved when you return.
                  </p>
                </div>
              </div>

              <Link
                to="/login"
                state={{ from: "/cart" }}
                className="inline-flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Login / Register
              </Link>
            </div>
          </motion.div>
        )}

        {/* STOCK WARNING */}

        {hasStockIssue && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <FaExclamationTriangle className="text-red-500 mt-1" />

              <div>
                <p className="font-semibold text-red-700">
                  Stock issue detected
                </p>

                <p className="text-sm text-red-600 mt-1">
                  Please reduce the quantity of products that exceed available
                  stock.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* MAIN GRID */}

        <div className="mt-8 grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
          {/* CART ITEMS */}

          <div className="space-y-4">
            {cart.map((item, index) => {
              const quantity = Number(item.quantity || 1);

              const price = Number(item.price || 0);

              const itemTotal = price * quantity;

              const stock =
                item.stock !== undefined && item.stock !== null
                  ? Number(item.stock)
                  : null;

              const stockProblem = stock !== null && quantity > stock;

              return (
                <motion.div
                  key={item.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className={`bg-white rounded-2xl shadow-sm border p-4 md:p-5 ${
                    stockProblem ? "border-red-200" : "border-gray-100"
                  }`}
                >
                  <div className="flex gap-4">
                    {/* IMAGE */}

                    <Link to={`/products/${item.id}`} className="shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl bg-gray-100"
                      />
                    </Link>

                    {/* INFO */}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/products/${item.id}`}
                            className="font-semibold text-gray-900 hover:text-pink-600 transition line-clamp-2"
                          >
                            {item.name}
                          </Link>

                          {item.category && (
                            <p className="text-xs text-gray-500 mt-1">
                              {item.category}
                            </p>
                          )}

                          <p className="mt-2 text-pink-600 font-bold">
                            {formatPrice(price)}
                          </p>

                          {stock !== null && (
                            <p
                              className={`mt-1 text-xs font-medium ${
                                stockProblem
                                  ? "text-red-500"
                                  : stock <= 5
                                    ? "text-orange-500"
                                    : "text-green-600"
                              }`}
                            >
                              {stockProblem
                                ? `Only ${stock} available`
                                : stock <= 5
                                  ? `Only ${stock} left`
                                  : "In stock"}
                            </p>
                          )}
                        </div>

                        {/* REMOVE */}

                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-9 h-9 shrink-0 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition"
                          aria-label={`Remove ${item.name}`}
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>

                      {/* STOCK WARNING */}

                      {stockProblem && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                          <FaExclamationTriangle />
                          Quantity exceeds available stock.
                        </div>
                      )}

                      {/* BOTTOM */}

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* ACTIONS */}

                        <div className="flex flex-wrap gap-4">
                          <button
                            onClick={() => moveToWishlist(item)}
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition"
                          >
                            <FaHeart />
                            Wishlist
                          </button>

                          <button
                            onClick={() => saveForLater(item)}
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition"
                          >
                            <FaBookmark />
                            Save for Later
                          </button>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          {/* QUANTITY */}

                          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={quantity <= 1}
                              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Decrease quantity"
                            >
                              <FaMinus className="text-xs" />
                            </button>

                            <span className="w-10 text-center text-sm font-semibold text-gray-900">
                              {quantity}
                            </span>

                            <button
                              onClick={() => increaseQuantity(item.id)}
                              disabled={stock !== null && quantity >= stock}
                              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Increase quantity"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>

                          {/* ITEM TOTAL */}

                          <div className="text-right min-w-[90px]">
                            <p className="text-xs text-gray-400">Total</p>

                            <p className="font-bold text-gray-900">
                              {formatPrice(itemTotal)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* SAVED FOR LATER */}

            {savedItems.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FaBookmark className="text-pink-600" />
                      Saved for Later
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {savedItems.length} saved{" "}
                      {savedItems.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {savedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 border border-gray-100 rounded-xl p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover bg-gray-100"
                      />

                      <div className="flex-1">
                        <Link
                          to={`/products/${item.id}`}
                          className="font-semibold text-gray-900 hover:text-pink-600"
                        >
                          {item.name}
                        </Link>

                        <p className="text-pink-600 font-bold mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => moveBackToCart(item)}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 text-sm font-semibold"
                        >
                          <FaUndo />
                          Move to Cart
                        </button>

                        <button
                          onClick={() => removeSavedItem(item.id)}
                          className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center"
                          aria-label="Remove saved item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ORDER SUMMARY */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

              {/* COUPON */}

              <div className="mt-5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FaTag className="text-pink-600" />
                  Coupon Code
                </label>

                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(event) => {
                      setCouponCode(event.target.value);
                      setCouponError("");
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        applyCoupon();
                      }
                    }}
                    placeholder="Enter coupon"
                    disabled={Boolean(appliedCoupon)}
                    className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:bg-gray-50"
                  />

                  {appliedCoupon ? (
                    <button
                      onClick={removeCoupon}
                      className="px-4 py-2.5 rounded-xl bg-red-50 text-red-500 text-sm font-semibold hover:bg-red-100"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {couponError && (
                  <p className="mt-2 text-xs text-red-500">{couponError}</p>
                )}

                {appliedCoupon && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-green-600 font-medium">
                    <FaCheckCircle />
                    {appliedCoupon} applied successfully
                  </div>
                )}

                <p className="mt-3 text-xs text-gray-400">
                  Try: WOOL10, SAVE500 or WOOL20
                </p>
              </div>

              {/* SUMMARY */}

              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({totalQuantity})</span>

                  <span className="font-medium text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>

                    <span className="font-semibold">
                      - {formatPrice(discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <FaTruck className="text-pink-600" />
                    Delivery
                  </span>

                  <span className="font-medium text-gray-900">
                    {deliveryCharge === 0
                      ? "FREE"
                      : formatPrice(deliveryCharge)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>VAT / Tax ({TAX_RATE * 100}%)</span>

                  <span className="font-medium text-gray-900">
                    {formatPrice(tax)}
                  </span>
                </div>
              </div>

              {/* TAX NOTE */}

              <p className="mt-3 text-xs text-gray-400">
                Tax is calculated on the discounted subtotal.
              </p>

              <div className="border-t border-gray-100 my-5" />

              {/* TOTAL */}

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>

                <span className="text-2xl font-bold text-pink-600">
                  {formatPrice(total)}
                </span>
              </div>

              {/* DELIVERY ESTIMATE */}

              <div className="mt-5 bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FaClock className="text-pink-600 mt-1" />

                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      Estimated Delivery
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {DELIVERY_MIN_DAYS}–{DELIVERY_MAX_DAYS} business days
                      after order confirmation.
                    </p>
                  </div>
                </div>
              </div>

              {/* CHECKOUT */}

              <button
                onClick={handleCheckout}
                disabled={hasStockIssue}
                className="w-full mt-5 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}

                <FaArrowRight />
              </button>

              {!isLoggedIn && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  Login or register before placing an order.
                </p>
              )}

              {/* SECURITY INFO */}

              <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FaShieldAlt className="text-green-500" />
                  Secure checkout
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FaTruck className="text-pink-500" />
                  Reliable delivery
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FaShoppingBag className="text-pink-500" />
                  Handmade WoolCraft products
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <FaCheckCircle className="text-green-500" />
                  Easy order tracking
                </div>
              </div>

              {/* FREE SHIPPING INFO */}

              <div className="mt-5 bg-pink-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FaTruck className="text-pink-600 mt-1" />

                  <div>
                    <p className="text-sm font-semibold text-pink-800">
                      Free Shipping
                    </p>

                    <p className="text-xs text-pink-700 mt-1">
                      Orders above {formatPrice(FREE_SHIPPING_THRESHOLD)} get
                      free delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
