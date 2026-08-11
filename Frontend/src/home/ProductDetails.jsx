import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaHeart,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaStar,
  FaTruck,
  FaGift,
  FaShieldAlt,
  FaCheck,
  FaUser,
  FaRegStar,
} from "react-icons/fa";

// =====================================================
// TEMPORARY FRONTEND PRODUCT DATA
// Later move this data to assets.js / Backend
// =====================================================

const productsData = [
  {
    id: 1,
    name: "Rose Wool Bouquet",
    category: "Wool Flowers",
    price: 1499,
    oldPrice: 1799,
    rating: 4.8,
    reviews: 124,
    stock: 12,
    description:
      "Beautiful handmade rose wool bouquet crafted with care and love. Perfect for birthdays, anniversaries, Valentine's Day and other special occasions.",
    images: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900",
      "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=900",
      "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=900",
    ],
  },

  {
    id: 2,
    name: "Cute Wool Doll",
    category: "Wool Dolls",
    price: 1999,
    oldPrice: 2399,
    rating: 4.9,
    reviews: 98,
    stock: 8,
    description:
      "A cute handmade wool doll made specially for gifting. Soft, beautiful and carefully handcrafted.",
    images: [
      "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=900",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=900",
      "https://images.unsplash.com/photo-1563901935883-cb61fdb5fbd4?w=900",
    ],
  },

  {
    id: 3,
    name: "Luxury Gift Hamper",
    category: "Gift Items",
    price: 2499,
    oldPrice: 2999,
    rating: 4.7,
    reviews: 76,
    stock: 15,
    description:
      "A beautiful handmade gift hamper designed for birthdays, anniversaries and special celebrations.",
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=900",
      "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=900",
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=900",
    ],
  },

  {
    id: 4,
    name: "Tulip Wool Bouquet",
    category: "Bouquets",
    price: 1799,
    oldPrice: 2199,
    rating: 5,
    reviews: 145,
    stock: 10,
    description:
      "Elegant handmade wool tulip bouquet. A perfect long-lasting alternative to fresh flowers.",
    images: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900",
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=900",
      "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=900",
    ],
  },
];

// =====================================================
// COMPONENT
// =====================================================

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = productsData.find((item) => item.id === Number(id));

  const [quantity, setQuantity] = useState(1);

  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || "",
  );

  const [reviews, setReviews] = useState([]);

  // =====================================================
  // LOAD REVIEWS
  // =====================================================

  const loadReviews = () => {
    try {
      const savedReviews =
        JSON.parse(localStorage.getItem("woolcraft-reviews")) || [];

      if (!product) {
        setReviews([]);
        return;
      }

      const productReviews = savedReviews.filter(
        (review) => Number(review.productId) === Number(product.id),
      );

      setReviews(productReviews);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviews([]);
    }
  };

  useEffect(() => {
    loadReviews();

    const handleReviewUpdate = () => {
      loadReviews();
    };

    window.addEventListener("reviewsUpdated", handleReviewUpdate);

    const handleStorage = (event) => {
      if (event.key === "woolcraft-reviews") {
        loadReviews();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("reviewsUpdated", handleReviewUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [product?.id]);

  // =====================================================
  // CALCULATE RATING
  // =====================================================

  const ratingData = useMemo(() => {
    const originalRating = Number(product?.rating || 0);
    const originalReviews = Number(product?.reviews || 0);

    if (reviews.length === 0) {
      return {
        rating: originalRating,
        reviewCount: originalReviews,
      };
    }

    const userRatingTotal = reviews.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0,
    );

    const totalRating =
      originalRating * originalReviews + userRatingTotal;

    const totalReviews = originalReviews + reviews.length;

    return {
      rating:
        totalReviews > 0
          ? Number((totalRating / totalReviews).toFixed(1))
          : originalRating,
      reviewCount: totalReviews,
    };
  }, [product, reviews]);

  // =====================================================
  // ADD PRODUCT TO CART
  // =====================================================

  const addToCart = (product, selectedQuantity = 1) => {
    const existingCart =
      JSON.parse(localStorage.getItem("woolcraft-cart")) || [];

    const existingProduct = existingCart.find(
      (item) => item.id === product.id,
    );

    let updatedCart;

    if (existingProduct) {
      const newQuantity =
        existingProduct.quantity + selectedQuantity;

      if (newQuantity > product.stock) {
        toast.error(`Only ${product.stock} items available`);
        return false;
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
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          oldPrice: product.oldPrice,
          rating: product.rating,
          reviews: product.reviews,
          stock: product.stock,
          image: product.images?.[0],
          quantity: selectedQuantity,
        },
      ];
    }

    localStorage.setItem(
      "woolcraft-cart",
      JSON.stringify(updatedCart),
    );

    window.dispatchEvent(new Event("cartUpdated"));

    return true;
  };

  // =====================================================
  // ADD PRODUCT TO WISHLIST
  // =====================================================

  const addToWishlist = (product) => {
    const wishlist =
      JSON.parse(localStorage.getItem("woolcraft-wishlist")) || [];

    const exists = wishlist.some(
      (item) => item.id === product.id,
    );

    if (exists) {
      toast.error("Product already in wishlist ❤️");
      return;
    }

    const wishlistProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      rating: product.rating,
      reviews: product.reviews,
      stock: product.stock,
      image: product.images?.[0],
    };

    const updatedWishlist = [
      ...wishlist,
      wishlistProduct,
    ];

    localStorage.setItem(
      "woolcraft-wishlist",
      JSON.stringify(updatedWishlist),
    );

    window.dispatchEvent(new Event("wishlistUpdated"));

    toast.success("Added to wishlist ❤️");
  };

  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Product Not Found
          </h1>

          <p className="mt-3 text-gray-500">
            Sorry, this product does not exist.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl"
          >
            <FaArrowLeft />
            Back to Products
          </Link>
        </div>
      </section>
    );
  }

  // =====================================================
  // QUANTITY
  // =====================================================

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error("Maximum available stock reached");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const handleAddToCart = () => {
    const success = addToCart(product, quantity);

    if (success) {
      toast.success(
        `${quantity} × ${product.name} added to cart 🛒`,
      );
    }
  };

  // =====================================================
  // WISHLIST
  // =====================================================

  const handleWishlist = () => {
    addToWishlist(product);
  };

  // =====================================================
  // BUY NOW
  // =====================================================

  const handleBuyNow = () => {
    const success = addToCart(product, quantity);

    if (!success) return;

    toast.success(
      "Product added. Redirecting to checkout 🚀",
    );

    navigate("/checkout");
  };

  // =====================================================
  // TOTAL
  // =====================================================

  const productTotal = product.price * quantity;

  // =====================================================
  // RELATED PRODUCTS
  // =====================================================

  const relatedProducts = productsData.filter(
    (item) =>
      item.id !== product.id &&
      (
        item.category === product.category ||
        item.category.includes("Bouquet") ||
        product.category.includes("Bouquet")
      ),
  );

  // =====================================================
  // FORMAT REVIEW DATE
  // =====================================================

  const formatReviewDate = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString("en-NP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  // =====================================================
  // STAR DISPLAY
  // =====================================================

  const StarRating = ({
    rating = 0,
    size = "text-sm",
  }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`${size} ${
              star <= Math.round(Number(rating))
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="bg-white min-h-screen py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
          <Link
            to="/"
            className="hover:text-pink-600"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="hover:text-pink-600"
          >
            Products
          </Link>

          <span>/</span>

          <span className="text-gray-800 truncate max-w-[180px] sm:max-w-none">
            {product.name}
          </span>
        </div>

        {/* =================================================
            MAIN PRODUCT
        ================================================= */}

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">

          {/* =================================================
              IMAGE SECTION
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-gray-100">

              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-[320px] sm:h-[450px] md:h-[550px] object-cover"
              />

              {product.oldPrice && (
                <span className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  SALE
                </span>
              )}

              <button
                onClick={handleWishlist}
                aria-label="Add to wishlist"
                className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full shadow flex items-center justify-center hover:bg-pink-50 transition"
              >
                <FaHeart className="text-pink-600" />
              </button>
            </div>

            {/* THUMBNAILS */}

            <div className="grid grid-cols-3 gap-3 mt-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setSelectedImage(image)
                  }
                  className={`overflow-hidden rounded-xl border-2 transition ${
                    selectedImage === image
                      ? "border-pink-600"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-20 sm:h-28 object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 40,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
          >
            {/* CATEGORY */}

            <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {product.category}
            </span>

            {/* NAME */}

            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* RATING */}

            <div className="flex flex-wrap items-center gap-2 mt-4">

              <StarRating
                rating={ratingData.rating}
              />

              <span className="font-semibold">
                {ratingData.rating}
              </span>

              <span className="text-gray-500">
                ({ratingData.reviewCount} Reviews)
              </span>
            </div>

            {/* PRICE */}

            <div className="flex flex-wrap items-center gap-3 mt-6">

              <span className="text-3xl font-bold text-pink-600">
                Rs. {product.price.toLocaleString()}
              </span>

              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through">
                  Rs.{" "}
                  {product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* TOTAL */}

            <div className="mt-2 text-sm text-gray-500">
              {quantity} × Rs.{" "}
              {product.price.toLocaleString()}
              {" = "}

              <span className="font-semibold text-gray-800">
                Rs. {productTotal.toLocaleString()}
              </span>
            </div>

            {/* STOCK */}

            <div className="mt-4">
              {product.stock > 0 ? (
                <p className="text-green-600 font-medium flex items-center gap-2">
                  <FaCheck />
                  In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-600 font-medium">
                  Out of Stock
                </p>
              )}
            </div>

            {/* DESCRIPTION */}

            <div className="mt-6">
              <h2 className="font-semibold text-lg">
                Description
              </h2>

              <p className="mt-2 text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* QUANTITY */}

            <div className="mt-7">
              <h3 className="font-semibold mb-3">
                Quantity
              </h3>

              <div className="inline-flex items-center border border-gray-300 rounded-xl overflow-hidden">

                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                >
                  <FaMinus size={12} />
                </button>

                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  disabled={
                    quantity >= product.stock
                  }
                  className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                >
                  <FaPlus size={12} />
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS */}

            <div className="mt-7 flex flex-col sm:flex-row gap-3">

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <FaShoppingCart />
                Add To Cart
              </button>

              <button
                onClick={handleWishlist}
                className="sm:w-14 h-14 border border-pink-200 rounded-xl flex items-center justify-center hover:bg-pink-50 transition"
              >
                <FaHeart className="text-pink-600" />
              </button>
            </div>

            {/* BUY NOW */}

            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full mt-3 bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white py-3.5 rounded-xl font-semibold transition"
            >
              Buy Now
            </button>

            {/* BENEFITS */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">

              <div className="border rounded-xl p-4 text-center">
                <FaTruck className="mx-auto text-pink-600 text-xl" />

                <p className="mt-2 text-sm font-medium">
                  Fast Delivery
                </p>
              </div>

              <div className="border rounded-xl p-4 text-center">
                <FaGift className="mx-auto text-pink-600 text-xl" />

                <p className="mt-2 text-sm font-medium">
                  Gift Packaging
                </p>
              </div>

              <div className="border rounded-xl p-4 text-center">
                <FaShieldAlt className="mx-auto text-pink-600 text-xl" />

                <p className="mt-2 text-sm font-medium">
                  Secure Order
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* =================================================
            REVIEWS
        ================================================= */}

        <section className="mt-16 border-t border-gray-100 pt-12">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div>
              <p className="text-sm font-semibold text-pink-600 uppercase tracking-wide">
                Customer Reviews
              </p>

              <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
                What our customers say
              </h2>

              <p className="mt-2 text-gray-500">
                Reviews from customers who purchased this product.
              </p>
            </div>

            <div className="bg-pink-50 rounded-2xl px-6 py-4">

              <div className="flex items-center gap-3">

                <span className="text-3xl font-bold text-gray-900">
                  {ratingData.rating}
                </span>

                <div>
                  <StarRating
                    rating={ratingData.rating}
                    size="text-base"
                  />

                  <p className="text-xs text-gray-500 mt-1">
                    {ratingData.reviewCount} reviews
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* REVIEW LIST */}

          {reviews.length === 0 ? (
            <div className="mt-8 bg-gray-50 rounded-2xl p-8 text-center">

              <FaRegStar className="mx-auto text-4xl text-gray-300" />

              <h3 className="mt-4 font-semibold text-gray-800">
                No new customer reviews yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Customer reviews will appear here after
                successful purchases.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid md:grid-cols-2 gap-5">

              {reviews.map((review, index) => (
                <motion.div
                  key={review.id || index}
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="border border-gray-100 rounded-2xl p-5 shadow-sm"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                        <FaUser />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {review.userName || "Customer"}
                        </h3>

                        <p className="text-xs text-gray-400">
                          {formatReviewDate(
                            review.createdAt,
                          )}
                        </p>
                      </div>
                    </div>

                    <StarRating
                      rating={review.rating}
                    />
                  </div>

                  {review.comment && (
                    <p className="mt-4 text-gray-600 leading-relaxed">
                      "{review.comment}"
                    </p>
                  )}

                  {review.verifiedPurchase && (
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                      <FaCheck />
                      Verified Purchase
                    </div>
                  )}
                </motion.div>
              ))}

            </div>
          )}
        </section>

        {/* =================================================
            RELATED PRODUCTS
        ================================================= */}

        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-gray-100 pt-12">

            <div className="text-center">

              <p className="text-sm font-semibold text-pink-600 uppercase tracking-wide">
                You may also like
              </p>

              <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
                Related Products
              </h2>

              <p className="mt-2 text-gray-500">
                Discover more beautiful handmade wool crafts.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {relatedProducts.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -5 }}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
                >

                  {/* IMAGE */}

                  <Link
                    to={`/products/${item.id}`}
                    className="block relative overflow-hidden"
                  >

                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                    />

                    {item.oldPrice && (
                      <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        SALE
                      </span>
                    )}
                  </Link>

                  {/* CONTENT */}

                  <div className="p-5">

                    <p className="text-xs text-pink-600 font-medium">
                      {item.category}
                    </p>

                    <Link
                      to={`/products/${item.id}`}
                    >
                      <h3 className="mt-2 font-bold text-lg text-gray-900 group-hover:text-pink-600 transition">
                        {item.name}
                      </h3>
                    </Link>

                    <div className="mt-3 flex items-center gap-2">

                      <StarRating
                        rating={item.rating}
                      />

                      <span className="text-xs text-gray-500">
                        ({item.reviews})
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">

                      <span className="text-xl font-bold text-pink-600">
                        Rs. {item.price.toLocaleString()}
                      </span>

                      {item.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          Rs.{" "}
                          {item.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <Link
                      to={`/products/${item.id}`}
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                      View Product
                    </Link>
                  </div>
                </motion.div>
              ))}

            </div>
          </section>
        )}

        {/* =================================================
            CONTINUE SHOPPING
        ================================================= */}

        <div className="mt-12">

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700"
          >
            <FaArrowLeft />
            Continue Shopping
          </Link>

        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
