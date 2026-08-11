import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaTrash,
  FaTimes,
  FaStar,
} from "react-icons/fa";
import { motion } from "framer-motion";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  // =====================================================
  // LOAD WISHLIST
  // =====================================================

  const loadWishlist = () => {
    const savedWishlist =
      JSON.parse(localStorage.getItem("woolcraft-wishlist")) || [];

    setWishlist(savedWishlist);
  };

  // =====================================================
  // INITIAL LOAD + LISTENER
  // =====================================================

  useEffect(() => {
    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, []);

  // =====================================================
  // REMOVE FROM WISHLIST
  // =====================================================

  const removeFromWishlist = (id, name) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);

    setWishlist(updatedWishlist);

    localStorage.setItem("woolcraft-wishlist", JSON.stringify(updatedWishlist));

    window.dispatchEvent(new Event("wishlistUpdated"));

    toast.success(`${name} removed from wishlist`);
  };

  // =====================================================
  // CLEAR WISHLIST
  // =====================================================

  const clearWishlist = () => {
    if (wishlist.length === 0) return;

    setWishlist([]);

    localStorage.setItem("woolcraft-wishlist", JSON.stringify([]));

    window.dispatchEvent(new Event("wishlistUpdated"));

    toast.success("Wishlist cleared ❤️");
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (product) => {
    const existingCart =
      JSON.parse(localStorage.getItem("woolcraft-cart")) || [];

    const existingProduct = existingCart.find((item) => item.id === product.id);

    let updatedCart;

    if (existingProduct) {
      const newQuantity = existingProduct.quantity + 1;

      if (product.stock && newQuantity > product.stock) {
        toast.error(`Only ${product.stock} items available`);

        return;
      }

      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item,
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("woolcraft-cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));

    toast.success(`${product.name} added to cart 🛒`);
  };

  // =====================================================
  // ADD ALL TO CART
  // =====================================================

  const addAllToCart = () => {
    if (wishlist.length === 0) return;

    let cart = JSON.parse(localStorage.getItem("woolcraft-cart")) || [];

    wishlist.forEach((product) => {
      const existingProduct = cart.find((item) => item.id === product.id);

      if (existingProduct) {
        cart = cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      } else {
        cart.push({
          ...product,
          quantity: 1,
        });
      }
    });

    localStorage.setItem("woolcraft-cart", JSON.stringify(cart));

    window.dispatchEvent(new Event("cartUpdated"));

    toast.success("All wishlist products added to cart 🛒");
  };

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (wishlist.length === 0) {
    return (
      <section className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}

          <div>
            <p className="text-pink-600 font-semibold">WOOLCRAFT NEPAL</p>

            <div className="flex items-center gap-3 mt-1">
              <FaHeart className="text-pink-600 text-2xl" />

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                My Wishlist
              </h1>
            </div>

            <p className="mt-2 text-gray-500">
              Save your favorite handmade crafts for later.
            </p>
          </div>

          {/* Empty Card */}

          <div className="mt-8 bg-white rounded-3xl shadow-sm px-5 py-14 md:py-20 text-center">
            <motion.div
              initial={{
                scale: 0.7,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: 0.4,
              }}
              className="mx-auto w-20 h-20 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center"
            >
              <FaRegHeart className="text-3xl" />
            </motion.div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Your Wishlist is Empty
            </h2>

            <p className="mt-2 max-w-md mx-auto text-gray-500">
              You haven't saved any products yet. Explore our handmade
              collection and add your favorites here.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <FaArrowLeft />
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN WISHLIST
  // =====================================================

  return (
    <section className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-pink-600 font-semibold">WOOLCRAFT NEPAL</p>

            <div className="flex items-center gap-3 mt-1">
              <FaHeart className="text-pink-600 text-2xl" />

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                My Wishlist
              </h1>
            </div>

            <p className="mt-2 text-gray-500">
              Save your favorite handmade crafts for later.
            </p>
          </div>

          {/* Header Actions */}

          <div className="flex flex-wrap gap-3">
            {/* Add All */}

            <button
              onClick={addAllToCart}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
            >
              <FaShoppingCart />
              Add All to Cart
            </button>

            {/* Clear */}

            <button
              onClick={clearWishlist}
              className="text-red-500 hover:text-red-600 border border-red-100 bg-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition"
            >
              <FaTrash />
              Clear Wishlist
            </button>
          </div>
        </div>

        {/* =================================================
            COUNT
        ================================================= */}

        <div className="mt-7">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">
              {wishlist.length}
            </span>{" "}
            {wishlist.length === 1 ? "item" : "items"} saved
          </p>
        </div>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlist.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
              }}
              whileHover={{
                y: -5,
              }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >
              {/* =================================================
                    IMAGE
                ================================================= */}

              <div className="relative overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-44 sm:h-52 md:h-60 object-cover hover:scale-105 transition duration-500"
                  />
                </Link>

                {/* Remove */}

                <button
                  onClick={() => removeFromWishlist(product.id, product.name)}
                  aria-label="Remove from wishlist"
                  className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center text-pink-600 hover:bg-pink-50 transition"
                >
                  <FaTimes />
                </button>

                {/* Sale */}

                {product.oldPrice && (
                  <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                    SALE
                  </span>
                )}
              </div>

              {/* =================================================
                    PRODUCT INFO
                ================================================= */}

              <div className="p-3 md:p-4">
                {/* Category */}

                <p className="text-xs text-pink-600 font-medium">
                  {product.category}
                </p>

                {/* Product Name */}

                <Link to={`/product/${product.id}`}>
                  <h2 className="mt-1 font-semibold text-gray-900 text-sm md:text-base line-clamp-2 hover:text-pink-600 transition">
                    {product.name}
                  </h2>
                </Link>

                {/* Rating */}

                <div className="flex items-center gap-1 mt-2">
                  <FaStar className="text-yellow-400 text-xs" />

                  <span className="text-xs md:text-sm font-medium">
                    {product.rating}
                  </span>

                  <span className="text-xs text-gray-400">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-pink-600 font-bold text-base md:text-lg">
                    Rs. {product.price.toLocaleString()}
                  </span>

                  {product.oldPrice && (
                    <span className="text-gray-400 line-through text-xs md:text-sm">
                      Rs. {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock */}

                <p
                  className={`text-xs mt-1 ${
                    product.stock <= 5 ? "text-orange-500" : "text-green-600"
                  }`}
                >
                  {product.stock <= 5
                    ? `Only ${product.stock} left`
                    : "In Stock"}
                </p>

                {/* Add Cart */}

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full mt-3 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FaShoppingCart />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* =================================================
            BOTTOM NAVIGATION
        ================================================= */}

        <div className="mt-10 flex justify-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 border border-gray-200 bg-white hover:bg-pink-50 hover:border-pink-200 text-gray-700 hover:text-pink-600 px-6 py-3 rounded-xl font-semibold transition"
          >
            <FaArrowLeft />
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Wishlist;
