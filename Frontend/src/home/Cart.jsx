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
} from "react-icons/fa";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // =========================================================
  // CART STORAGE KEY
  // =========================================================

  const CART_KEY = "woolcraft-cart";

  // =========================================================
  // CHECK AUTH
  // =========================================================

  const checkAuth = () => {
    try {
      const auth = JSON.parse(
        localStorage.getItem("woolcraft-auth") || "false",
      );

      const user = JSON.parse(
        localStorage.getItem("woolcraft-user") || "null",
      );

      setIsLoggedIn(Boolean(auth && user));
    } catch (error) {
      console.error("Authentication loading error:", error);
      setIsLoggedIn(false);
    }
  };

  // =========================================================
  // LOAD CART
  // =========================================================

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

  // =========================================================
  // SAVE CART
  // =========================================================

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

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    checkAuth();
    loadCart();

    const handleCartUpdate = () => {
      loadCart();
    };

    const handleAuthUpdate = () => {
      checkAuth();
      loadCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("authUpdated", handleAuthUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("authUpdated", handleAuthUpdate);
    };
  }, []);

  // =========================================================
  // TOTAL QUANTITY
  // =========================================================

  const totalQuantity = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0,
    );
  }, [cart]);

  // =========================================================
  // SUBTOTAL
  // =========================================================

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return (
        total +
        Number(item.price || 0) * Number(item.quantity || 1)
      );
    }, 0);
  }, [cart]);

  // =========================================================
  // DELIVERY
  // =========================================================

  const deliveryCharge = subtotal >= 0 ? 0 : 0;

  // =========================================================
  // TOTAL
  // =========================================================

  const total = subtotal + deliveryCharge;

  // =========================================================
  // INCREASE QUANTITY
  // =========================================================

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: Number(item.quantity || 1) + 1,
        };
      }

      return item;
    });

    saveCart(updatedCart);
  };

  // =========================================================
  // DECREASE QUANTITY
  // =========================================================

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

  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const removeItem = (id) => {
    const item = cart.find((product) => product.id === id);

    const updatedCart = cart.filter(
      (product) => product.id !== id,
    );

    saveCart(updatedCart);

    toast.success(
      `${item?.name || "Product"} removed from cart`,
    );
  };

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);

    setCart([]);

    window.dispatchEvent(new Event("cartUpdated"));

    toast.success("Cart cleared");
  };

  // =========================================================
  // MOVE TO WISHLIST
  // =========================================================

  const moveToWishlist = (item) => {
    let wishlist = [];

    try {
      wishlist =
        JSON.parse(
          localStorage.getItem("woolcraft-wishlist") || "[]",
        ) || [];
    } catch {
      wishlist = [];
    }

    const alreadyExists = wishlist.some(
      (product) => product.id === item.id,
    );

    if (!alreadyExists) {
      const updatedWishlist = [...wishlist, item];

      localStorage.setItem(
        "woolcraft-wishlist",
        JSON.stringify(updatedWishlist),
      );

      window.dispatchEvent(new Event("wishlistUpdated"));

      toast.success("Added to wishlist");
    } else {
      toast("Already in wishlist");
    }

    removeItem(item.id);
  };

  // =========================================================
  // CHECKOUT
  // =========================================================

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
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

    navigate("/checkout");
  };

  // =========================================================
  // EMPTY CART
  // =========================================================

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
        </motion.div>
      </section>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

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
              <p className="text-pink-600 font-semibold">
                WOOLCRAFT NEPAL
              </p>

              <h1 className="mt-1 text-3xl md:text-4xl font-bold text-gray-900">
                Shopping Cart
              </h1>

              <p className="mt-2 text-gray-500">
                {totalQuantity}{" "}
                {totalQuantity === 1 ? "item" : "items"} in your cart
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
                    Create an account so your cart stays saved
                    when you return.
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

        {/* MAIN GRID */}

        <div className="mt-8 grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">

          {/* CART ITEMS */}

          <div className="space-y-4">
            {cart.map((item, index) => {
              const quantity = Number(item.quantity || 1);

              const itemTotal =
                Number(item.price || 0) * quantity;

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
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-5"
                >
                  <div className="flex gap-4">

                    {/* IMAGE */}

                    <Link
                      to={`/products/${item.id}`}
                      className="shrink-0"
                    >
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
                            Rs.{" "}
                            {Number(
                              item.price || 0,
                            ).toLocaleString()}
                          </p>
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

                      {/* BOTTOM */}

                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        {/* WISHLIST */}

                        <button
                          onClick={() => moveToWishlist(item)}
                          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600 transition"
                        >
                          <FaHeart />
                          Move to Wishlist
                        </button>

                        <div className="flex items-center justify-between sm:justify-end gap-5">

                          {/* QUANTITY */}

                          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() =>
                                decreaseQuantity(item.id)
                              }
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
                              onClick={() =>
                                increaseQuantity(item.id)
                              }
                              className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                              aria-label="Increase quantity"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                          </div>

                          {/* ITEM TOTAL */}

                          <div className="text-right min-w-[90px]">
                            <p className="text-xs text-gray-400">
                              Total
                            </p>

                            <p className="font-bold text-gray-900">
                              Rs. {itemTotal.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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

              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-5 flex justify-between text-gray-600">
                <span>Items ({totalQuantity})</span>

                <span className="font-medium text-gray-900">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-gray-600">
                <span className="flex items-center gap-2">
                  <FaTruck className="text-pink-600" />
                  Delivery
                </span>

                <span className="font-medium text-gray-900">
                  {deliveryCharge === 0
                    ? "FREE"
                    : `Rs. ${deliveryCharge}`}
                </span>
              </div>

              <div className="border-t border-gray-100 my-5" />

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-pink-600">
                  Rs. {total.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-pink-600 hover:bg-pink-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {isLoggedIn
                  ? "Proceed to Checkout"
                  : "Login to Checkout"}

                <FaArrowRight />
              </button>

              {!isLoggedIn && (
                <p className="mt-3 text-center text-xs text-gray-500">
                  Login or register before placing an order.
                </p>
              )}

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

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
