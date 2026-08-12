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
  FaShareAlt,
  FaMapMarkerAlt,
  FaCamera,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

// ============================================================
// PRODUCT DATA
// ============================================================

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

    variants: {
      colors: ["Pink", "Red", "White", "Purple"],
      sizes: ["Small", "Medium", "Large"],
      customOptions: ["Standard", "Gift Wrapped", "Premium Gift Wrapped"],
    },

    specifications: {
      Material: "Premium Wool",
      Type: "Handmade",
      Occasion: "Birthday, Anniversary, Valentine",
      Care: "Keep dry and away from direct sunlight",
      Handmade: "Yes",
      Origin: "Nepal",
    },

    deliveryDays: {
      Kathmandu: 2,
      Lalitpur: 2,
      Bhaktapur: 3,
      Pokhara: 4,
      Chitwan: 4,
      default: 5,
    },
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

    variants: {
      colors: ["Pink", "Blue", "Yellow"],
      sizes: ["Small", "Medium"],
      customOptions: ["Standard", "Gift Wrapped"],
    },

    specifications: {
      Material: "Soft Wool",
      Type: "Handmade Doll",
      Height: "25 cm",
      Care: "Spot clean only",
      Handmade: "Yes",
      Origin: "Nepal",
    },

    deliveryDays: {
      Kathmandu: 2,
      Lalitpur: 2,
      Bhaktapur: 3,
      Pokhara: 4,
      Chitwan: 4,
      default: 5,
    },
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

    variants: {
      colors: ["Pink", "Red", "Gold"],
      sizes: ["Standard", "Large"],
      customOptions: ["Standard", "Premium Packaging"],
    },

    specifications: {
      Material: "Mixed Handmade Materials",
      Type: "Gift Hamper",
      Occasion: "Birthday, Anniversary, Wedding",
      Packaging: "Premium Gift Box",
      Handmade: "Partially",
      Origin: "Nepal",
    },

    deliveryDays: {
      Kathmandu: 2,
      Lalitpur: 2,
      Bhaktapur: 3,
      Pokhara: 4,
      Chitwan: 5,
      default: 6,
    },
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

    variants: {
      colors: ["Pink", "Yellow", "White", "Purple"],
      sizes: ["Small", "Medium", "Large"],
      customOptions: ["Standard", "Gift Wrapped"],
    },

    specifications: {
      Material: "Premium Wool",
      Type: "Handmade Bouquet",
      Stems: "7 Wool Tulips",
      Care: "Keep dry",
      Handmade: "Yes",
      Origin: "Nepal",
    },

    deliveryDays: {
      Kathmandu: 2,
      Lalitpur: 2,
      Bhaktapur: 3,
      Pokhara: 4,
      Chitwan: 5,
      default: 6,
    },
  },
];

// ============================================================
// HELPERS
// ============================================================

const readStorage = (key, fallback = []) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const formatDate = (date) => {
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

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + Number(days || 0));

  return date.toLocaleDateString("en-NP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ============================================================
// STAR COMPONENT
// ============================================================

function StarRating({
  rating = 0,
  size = "text-sm",
  interactive = false,
  onSelect,
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onSelect?.(star)}
          className={
            interactive
              ? "cursor-pointer hover:scale-110 transition"
              : "cursor-default"
          }
          aria-label={`${star} star`}
        >
          <FaStar
            className={`${size} ${
              star <= Math.round(Number(rating))
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ============================================================
// PRODUCT DETAILS
// ============================================================

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = productsData.find(
    (item) => item.id === Number(id),
  );

  // ==========================================================
  // STATE
  // ==========================================================

  const [quantity, setQuantity] = useState(1);

  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || "",
  );

  const [selectedColor, setSelectedColor] = useState(
    product?.variants?.colors?.[0] || "",
  );

  const [selectedSize, setSelectedSize] = useState(
    product?.variants?.sizes?.[0] || "",
  );

  const [selectedCustomOption, setSelectedCustomOption] = useState(
    product?.variants?.customOptions?.[0] || "",
  );

  const [deliveryLocation, setDeliveryLocation] = useState("");

  const [deliveryResult, setDeliveryResult] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [reviewRating, setReviewRating] = useState(5);

  const [reviewComment, setReviewComment] = useState("");

  const [reviewPhotos, setReviewPhotos] = useState([]);

  const [reviewSort, setReviewSort] = useState("newest");

  const [reviewFilter, setReviewFilter] = useState("all");

  const [showReviewForm, setShowReviewForm] = useState(false);

  const [isSharing, setIsSharing] = useState(false);

  const [recentProducts, setRecentProducts] = useState([]);

  // ==========================================================
  // RESET PRODUCT STATE
  // ==========================================================

  useEffect(() => {
    if (!product) return;

    setQuantity(1);
    setSelectedImage(product.images?.[0] || "");

    setSelectedColor(product.variants?.colors?.[0] || "");
    setSelectedSize(product.variants?.sizes?.[0] || "");
    setSelectedCustomOption(
      product.variants?.customOptions?.[0] || "",
    );
  }, [product?.id]);

  // ==========================================================
  // LOAD REVIEWS
  // ==========================================================

  const loadReviews = () => {
    if (!product) {
      setReviews([]);
      return;
    }

    const savedReviews = readStorage("woolcraft-reviews", []);

    const productReviews = Array.isArray(savedReviews)
      ? savedReviews.filter(
          (review) =>
            Number(review.productId) === Number(product.id),
        )
      : [];

    setReviews(productReviews);
  };

  useEffect(() => {
    loadReviews();

    const handleReviewUpdate = () => {
      loadReviews();
    };

    window.addEventListener(
      "reviewsUpdated",
      handleReviewUpdate,
    );

    const handleStorage = (event) => {
      if (event.key === "woolcraft-reviews") {
        loadReviews();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "reviewsUpdated",
        handleReviewUpdate,
      );

      window.removeEventListener("storage", handleStorage);
    };
  }, [product?.id]);

  // ==========================================================
  // RECENTLY VIEWED PRODUCTS
  // ==========================================================

  useEffect(() => {
    if (!product) return;

    const recent = readStorage(
      "woolcraft-recently-viewed",
      [],
    );

    const withoutCurrent = Array.isArray(recent)
      ? recent.filter(
          (item) => Number(item.id) !== Number(product.id),
        )
      : [];

    const current = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      oldPrice: product.oldPrice,
      rating: product.rating,
      reviews: product.reviews,
      image: product.images?.[0],
    };

    const updated = [current, ...withoutCurrent].slice(0, 6);

    saveStorage("woolcraft-recently-viewed", updated);

    setRecentProducts(
      updated.filter(
        (item) => Number(item.id) !== Number(product.id),
      ),
    );
  }, [product?.id]);

  // ==========================================================
  // RATING DATA
  // ==========================================================

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
      (sum, review) =>
        sum + Number(review.rating || 0),
      0,
    );

    const totalRating =
      originalRating * originalReviews +
      userRatingTotal;

    const totalReviews =
      originalReviews + reviews.length;

    return {
      rating:
        totalReviews > 0
          ? Number(
              (totalRating / totalReviews).toFixed(1),
            )
          : originalRating,

      reviewCount: totalReviews,
    };
  }, [product, reviews]);

  // ==========================================================
  // FILTERED REVIEWS
  // ==========================================================

  const visibleReviews = useMemo(() => {
    let result = [...reviews];

    if (reviewFilter !== "all") {
      result = result.filter(
        (review) =>
          Number(review.rating) === Number(reviewFilter),
      );
    }

    if (reviewSort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt),
      );
    }

    if (reviewSort === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt),
      );
    }

    if (reviewSort === "highest") {
      result.sort(
        (a, b) =>
          Number(b.rating) - Number(a.rating),
      );
    }

    if (reviewSort === "lowest") {
      result.sort(
        (a, b) =>
          Number(a.rating) - Number(b.rating),
      );
    }

    return result;
  }, [reviews, reviewSort, reviewFilter]);

  // ==========================================================
  // QUANTITY
  // ==========================================================

  const increaseQuantity = () => {
    if (!product || product.stock <= 0) return;

    if (quantity >= product.stock) {
      toast.error(
        `Only ${product.stock} items available`,
      );
      return;
    }

    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // ==========================================================
  // VARIANT KEY
  // ==========================================================

  const getVariantKey = () => {
    return [
      product?.id,
      selectedColor || "no-color",
      selectedSize || "no-size",
      selectedCustomOption || "no-option",
    ].join("-");
  };

  // ==========================================================
  // ADD TO CART
  // ==========================================================

  const addToCart = (
    currentProduct,
    selectedQuantity = 1,
  ) => {
    if (!currentProduct) return false;

    if (currentProduct.stock <= 0) {
      toast.error("This product is out of stock.");
      return false;
    }

    if (
      selectedQuantity < 1 ||
      selectedQuantity > currentProduct.stock
    ) {
      toast.error(
        `Only ${currentProduct.stock} items available`,
      );
      return false;
    }

    const existingCart = readStorage(
      "woolcraft-cart",
      [],
    );

    const variantKey = getVariantKey();

    const existingProduct = existingCart.find(
      (item) =>
        Number(item.id) === Number(currentProduct.id) &&
        item.variantKey === variantKey,
    );

    let updatedCart;

    if (existingProduct) {
      const newQuantity =
        Number(existingProduct.quantity || 1) +
        selectedQuantity;

      if (newQuantity > currentProduct.stock) {
        toast.error(
          `Only ${currentProduct.stock} items available`,
        );
        return false;
      }

      updatedCart = existingCart.map((item) =>
        item.variantKey === variantKey &&
        Number(item.id) === Number(currentProduct.id)
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
          id: currentProduct.id,
          name: currentProduct.name,
          category: currentProduct.category,
          price: currentProduct.price,
          oldPrice: currentProduct.oldPrice,
          rating: currentProduct.rating,
          reviews: currentProduct.reviews,
          stock: currentProduct.stock,
          image: currentProduct.images?.[0],
          quantity: selectedQuantity,

          variantKey,

          variant: {
            color: selectedColor,
            size: selectedSize,
            customOption: selectedCustomOption,
          },
        },
      ];
    }

    saveStorage("woolcraft-cart", updatedCart);

    window.dispatchEvent(new Event("cartUpdated"));

    return true;
  };

  // ==========================================================
  // WISHLIST
  // ==========================================================

  const addToWishlist = () => {
    if (!product) return;

    const wishlist = readStorage(
      "woolcraft-wishlist",
      [],
    );

    const exists = wishlist.some(
      (item) => Number(item.id) === Number(product.id),
    );

    if (exists) {
      toast.error(
        "Product already in wishlist ❤️",
      );
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

    saveStorage("woolcraft-wishlist", [
      ...wishlist,
      wishlistProduct,
    ]);

    window.dispatchEvent(
      new Event("wishlistUpdated"),
    );

    toast.success("Added to wishlist ❤️");
  };

  // ==========================================================
  // BUY NOW
  // ==========================================================

  const handleBuyNow = () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    const success = addToCart(product, quantity);

    if (!success) return;

    toast.success(
      "Product added. Redirecting to checkout 🚀",
    );

    navigate("/checkout");
  };

  // ==========================================================
  // DELIVERY LOCATION CHECK
  // ==========================================================

  const checkDelivery = () => {
    const location = deliveryLocation.trim();

    if (!location) {
      toast.error("Please enter your delivery location.");
      return;
    }

    const cityKey = Object.keys(
      product.deliveryDays || {},
    ).find(
      (city) =>
        city.toLowerCase() === location.toLowerCase(),
    );

    const days =
      product.deliveryDays?.[
        cityKey || "default"
      ] || 5;

    setDeliveryResult({
      location,
      days,
      date: addDays(days),
      available: true,
    });

    toast.success(
      `Delivery available to ${location}`,
    );
  };

  // ==========================================================
  // SHARE PRODUCT
  // ==========================================================

  const handleShare = async () => {
    if (!product) return;

    const url = window.location.href;

    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on WoolCraft Nepal.`,
          url,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success(
          "Product link copied to clipboard.",
        );
      } else {
        toast.error(
          "Sharing is not supported on this browser.",
        );
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error("Unable to share product.");
      }
    } finally {
      setIsSharing(false);
    }
  };

  // ==========================================================
  // REVIEW PHOTO UPLOAD
  // ==========================================================

  const handleReviewPhotos = (event) => {
    const files = Array.from(
      event.target.files || [],
    );

    if (files.length === 0) return;

    if (reviewPhotos.length + files.length > 5) {
      toast.error(
        "You can upload maximum 5 photos.",
      );
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(
          `${file.name} is not a valid image.`,
        );
        return false;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error(
          `${file.name} must be below 2MB.`,
        );
        return false;
      }

      return true;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        setReviewPhotos((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            name: file.name,
            data: reader.result,
          },
        ]);
      };

      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  // ==========================================================
  // REMOVE REVIEW PHOTO
  // ==========================================================

  const removeReviewPhoto = (photoId) => {
    setReviewPhotos((prev) =>
      prev.filter((photo) => photo.id !== photoId),
    );
  };

  // ==========================================================
  // SUBMIT REVIEW
  // ==========================================================

  const submitReview = (event) => {
    event.preventDefault();

    if (!product) return;

    if (
      !reviewRating ||
      reviewRating < 1 ||
      reviewRating > 5
    ) {
      toast.error(
        "Please select a rating.",
      );
      return;
    }

    if (reviewComment.trim().length < 3) {
      toast.error(
        "Please write a short review.",
      );
      return;
    }

    const existingReviews = readStorage(
      "woolcraft-reviews",
      [],
    );

    const review = {
      id: `review-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`,

      productId: product.id,

      userName: "Customer",

      rating: Number(reviewRating),

      comment: reviewComment.trim(),

      photos: reviewPhotos.map(
        (photo) => photo.data,
      ),

      verifiedPurchase: false,

      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [
      review,
      ...(Array.isArray(existingReviews)
        ? existingReviews
        : []),
    ];

    saveStorage(
      "woolcraft-reviews",
      updatedReviews,
    );

    setReviews((prev) => [review, ...prev]);

    setReviewRating(5);
    setReviewComment("");
    setReviewPhotos([]);
    setShowReviewForm(false);

    window.dispatchEvent(
      new Event("reviewsUpdated"),
    );

    toast.success(
      "Review published successfully! ⭐",
    );
  };

  // ==========================================================
  // PRODUCT TOTAL
  // ==========================================================

  const productTotal =
    Number(product?.price || 0) *
    Number(quantity || 1);

  // ==========================================================
  // RELATED PRODUCTS
  // ==========================================================

  const relatedProducts = productsData.filter(
    (item) =>
      item.id !== product?.id &&
      (item.category === product?.category ||
        item.category.includes("Bouquet") ||
        product?.category?.includes("Bouquet")),
  );

  // ==========================================================
  // RECOMMENDED PRODUCTS
  // ==========================================================

  const recommendedProducts = productsData.filter(
    (item) =>
      item.id !== product?.id &&
      !relatedProducts.some(
        (related) => related.id === item.id,
      ),
  );

  // ==========================================================
  // PRODUCT NOT FOUND
  // ==========================================================

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

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <section className="bg-white min-h-screen py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

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

          <span className="text-gray-800 truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        {/* =====================================================
            MAIN PRODUCT
        ===================================================== */}

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">

          {/* IMAGE SECTION */}

          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-gray-100">

              <img
                src={selectedImage}
                alt={product.name}
                className={`w-full h-[320px] sm:h-[450px] md:h-[550px] object-cover ${
                  product.stock === 0
                    ? "grayscale opacity-70"
                    : ""
                }`}
              />

              {product.oldPrice && (
                <span className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  SALE
                </span>
              )}

              {product.stock === 0 && (
                <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                  OUT OF STOCK
                </span>
              )}

              <button
                type="button"
                onClick={addToWishlist}
                aria-label="Add to wishlist"
                className="absolute top-4 right-4 w-11 h-11 bg-white rounded-full shadow flex items-center justify-center hover:bg-pink-50 transition"
              >
                <FaHeart className="text-pink-600" />
              </button>

              <button
                type="button"
                onClick={handleShare}
                disabled={isSharing}
                aria-label="Share product"
                className="absolute top-16 right-4 w-11 h-11 bg-white rounded-full shadow flex items-center justify-center hover:bg-pink-50 transition"
              >
                <FaShareAlt className="text-gray-700" />
              </button>
            </div>

            {/* THUMBNAILS */}

            <div className="grid grid-cols-3 gap-3 mt-4">
              {product.images.map(
                (image, index) => (
                  <button
                    type="button"
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
                ),
              )}
            </div>
          </motion.div>

          {/* PRODUCT INFORMATION */}

          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >

            <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {product.category}
            </span>

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
                <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                  <p className="text-red-600 font-bold">
                    Out of Stock
                  </p>

                  <p className="text-sm text-red-500 mt-1">
                    This product is currently unavailable.
                  </p>
                </div>
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

            {/* =================================================
                VARIANTS
            ================================================= */}

            {product.variants?.colors?.length > 0 && (
              <div className="mt-7">
                <h3 className="font-semibold mb-3">
                  Color
                </h3>

                <div className="flex flex-wrap gap-2">
                  {product.variants.colors.map(
                    (color) => (
                      <button
                        type="button"
                        key={color}
                        onClick={() =>
                          setSelectedColor(color)
                        }
                        className={`px-4 py-2 rounded-xl border text-sm transition ${
                          selectedColor === color
                            ? "border-pink-600 bg-pink-50 text-pink-700 font-semibold"
                            : "border-gray-200 hover:border-pink-300"
                        }`}
                      >
                        {color}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}

            {product.variants?.sizes?.length > 0 && (
              <div className="mt-5">
                <h3 className="font-semibold mb-3">
                  Size
                </h3>

                <div className="flex flex-wrap gap-2">
                  {product.variants.sizes.map(
                    (size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() =>
                          setSelectedSize(size)
                        }
                        className={`px-4 py-2 rounded-xl border text-sm transition ${
                          selectedSize === size
                            ? "border-pink-600 bg-pink-50 text-pink-700 font-semibold"
                            : "border-gray-200 hover:border-pink-300"
                        }`}
                      >
                        {size}
                      </button>
                    ),
                  )}
                </div>
              </div>
            )}

            {product.variants?.customOptions?.length >
              0 && (
              <div className="mt-5">
                <h3 className="font-semibold mb-3">
                  Custom Option
                </h3>

                <select
                  value={selectedCustomOption}
                  onChange={(event) =>
                    setSelectedCustomOption(
                      event.target.value,
                    )
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                >
                  {product.variants.customOptions.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ),
                  )}
                </select>
              </div>
            )}

            {/* QUANTITY */}

            <div className="mt-7">
              <h3 className="font-semibold mb-3">
                Quantity
              </h3>

              <div className="inline-flex items-center border border-gray-300 rounded-xl overflow-hidden">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={
                    quantity <= 1 ||
                    product.stock === 0
                  }
                  className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                >
                  <FaMinus size={12} />
                </button>

                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    quantity >= product.stock ||
                    product.stock === 0
                  }
                  className="w-11 h-11 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40"
                >
                  <FaPlus size={12} />
                </button>

              </div>
            </div>

            {/* ACTIONS */}

            <div className="mt-7 flex flex-col sm:flex-row gap-3">

              <button
                type="button"
                onClick={() =>
                  addToCart(product, quantity) &&
                  toast.success(
                    `${quantity} × ${product.name} added to cart 🛒`,
                  )
                }
                disabled={product.stock === 0}
                className="flex-1 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <FaShoppingCart />
                Add To Cart
              </button>

              <button
                type="button"
                onClick={addToWishlist}
                className="sm:w-14 h-14 border border-pink-200 rounded-xl flex items-center justify-center hover:bg-pink-50 transition"
              >
                <FaHeart className="text-pink-600" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full mt-3 bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white py-3.5 rounded-xl font-semibold transition"
            >
              Buy Now
            </button>

            {/* =================================================
                DELIVERY CHECK
            ================================================= */}

            <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-5">

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <h3 className="font-bold text-gray-900">
                    Check Delivery
                  </h3>

                  <p className="text-xs text-gray-500">
                    Enter your city to estimate delivery.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={deliveryLocation}
                  onChange={(event) =>
                    setDeliveryLocation(
                      event.target.value,
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      checkDelivery();
                    }
                  }}
                  placeholder="e.g. Kathmandu"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-pink-500"
                />

                <button
                  type="button"
                  onClick={checkDelivery}
                  className="px-4 sm:px-6 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700"
                >
                  Check
                </button>
              </div>

              {deliveryResult && (
                <div className="mt-4 bg-white border border-green-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <FaCheck />
                    Delivery available
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    Estimated delivery to{" "}
                    <strong>
                      {deliveryResult.location}
                    </strong>{" "}
                    in approximately{" "}
                    <strong>
                      {deliveryResult.days} days
                    </strong>
                    .
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    Expected by{" "}
                    <strong>
                      {deliveryResult.date}
                    </strong>
                  </p>
                </div>
              )}
            </div>

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

        {/* =====================================================
            SPECIFICATIONS
        ===================================================== */}

        <section className="mt-16 border-t border-gray-100 pt-12">

          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-pink-600 uppercase tracking-wide">
              Product Details
            </p>

            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
              Product Specifications
            </h2>

            <div className="mt-6 border rounded-2xl overflow-hidden">

              {Object.entries(
                product.specifications || {},
              ).map(([key, value], index) => (
                <div
                  key={key}
                  className={`grid grid-cols-2 ${
                    index % 2 === 0
                      ? "bg-gray-50"
                      : "bg-white"
                  }`}
                >
                  <div className="px-4 py-4 font-semibold text-gray-700">
                    {key}
                  </div>

                  <div className="px-4 py-4 text-gray-600">
                    {value}
                  </div>
                </div>
              ))}

            </div>
          </div>
        </section>

        {/* =====================================================
            REVIEWS
        ===================================================== */}

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
                Anyone can share their experience with this product.
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

          {/* WRITE REVIEW BUTTON */}

          <div className="mt-8">
            <button
              type="button"
              onClick={() =>
                setShowReviewForm(
                  (previous) => !previous,
                )
              }
              className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              <FaStar />
              {showReviewForm
                ? "Close Review Form"
                : "Write a Review"}
            </button>
          </div>

          {/* REVIEW FORM */}

          {showReviewForm && (
            <motion.form
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              onSubmit={submitReview}
              className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl p-5 md:p-7"
            >

              <h3 className="text-xl font-bold text-gray-900">
                Write Your Review
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Login is not required.
              </p>

              {/* RATING */}

              <div className="mt-6">
                <label className="text-sm font-semibold text-gray-700">
                  Your Rating
                </label>

                <div className="mt-3">
                  <StarRating
                    rating={reviewRating}
                    size="text-2xl"
                    interactive
                    onSelect={setReviewRating}
                  />
                </div>
              </div>

              {/* COMMENT */}

              <div className="mt-6">
                <label className="text-sm font-semibold text-gray-700">
                  Your Review
                </label>

                <textarea
                  value={reviewComment}
                  onChange={(event) =>
                    setReviewComment(
                      event.target.value,
                    )
                  }
                  rows={5}
                  maxLength={1000}
                  placeholder="Tell other customers about your experience..."
                  className="mt-2 w-full border border-gray-200 bg-white rounded-xl p-4 outline-none resize-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />

                <p className="text-xs text-gray-400 mt-1">
                  {reviewComment.length}/1000
                </p>
              </div>

              {/* PHOTOS */}

              <div className="mt-6">

                <label className="text-sm font-semibold text-gray-700">
                  Review Photos
                </label>

                <p className="text-xs text-gray-500 mt-1">
                  Upload up to 5 photos. Maximum 2MB each.
                </p>

                <label className="mt-3 inline-flex items-center gap-2 cursor-pointer border border-dashed border-pink-300 bg-white px-4 py-3 rounded-xl text-pink-600 font-semibold hover:bg-pink-50">
                  <FaCamera />

                  Add Photos

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleReviewPhotos}
                    className="hidden"
                  />
                </label>

                {reviewPhotos.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">

                    {reviewPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="relative w-24 h-24"
                      >
                        <img
                          src={photo.data}
                          alt="Review upload"
                          className="w-full h-full object-cover rounded-xl border"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeReviewPhoto(
                              photo.id,
                            )
                          }
                          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center"
                        >
                          <FaTimes size={11} />
                        </button>
                      </div>
                    ))}

                  </div>
                )}
              </div>

              <button
                type="submit"
                className="mt-7 w-full sm:w-auto bg-gray-900 hover:bg-black text-white px-7 py-3 rounded-xl font-semibold"
              >
                Publish Review
              </button>

            </motion.form>
          )}

          {/* REVIEW FILTERS */}

          {reviews.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row gap-3">

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Sort:
                </span>

                <select
                  value={reviewSort}
                  onChange={(event) =>
                    setReviewSort(
                      event.target.value,
                    )
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                >
                  <option value="newest">
                    Newest
                  </option>

                  <option value="oldest">
                    Oldest
                  </option>

                  <option value="highest">
                    Highest Rated
                  </option>

                  <option value="lowest">
                    Lowest Rated
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Rating:
                </span>

                <select
                  value={reviewFilter}
                  onChange={(event) =>
                    setReviewFilter(
                      event.target.value,
                    )
                  }
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                >
                  <option value="all">
                    All Reviews
                  </option>

                  <option value="5">
                    5 Stars
                  </option>

                  <option value="4">
                    4 Stars
                  </option>

                  <option value="3">
                    3 Stars
                  </option>

                  <option value="2">
                    2 Stars
                  </option>

                  <option value="1">
                    1 Star
                  </option>
                </select>
              </div>

            </div>
          )}

          {/* REVIEW LIST */}

          {visibleReviews.length === 0 ? (
            <div className="mt-8 bg-gray-50 rounded-2xl p-8 text-center">

              <FaRegStar className="mx-auto text-4xl text-gray-300" />

              <h3 className="mt-4 font-semibold text-gray-800">
                {reviews.length === 0
                  ? "No new customer reviews yet"
                  : "No reviews match this filter"}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {reviews.length === 0
                  ? "Be the first customer to share your experience."
                  : "Try another rating filter."}
              </p>

            </div>
          ) : (
            <div className="mt-8 grid md:grid-cols-2 gap-5">

              {visibleReviews.map(
                (review, index) => (
                  <motion.div
                    key={
                      review.id || index
                    }
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
                            {review.userName ||
                              "Customer"}
                          </h3>

                          <p className="text-xs text-gray-400">
                            {formatDate(
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

                    {/* REVIEW PHOTOS */}

                    {Array.isArray(
                      review.photos,
                    ) &&
                      review.photos.length >
                        0 && (
                        <div className="mt-4 flex flex-wrap gap-2">

                          {review.photos.map(
                            (
                              photo,
                              photoIndex,
                            ) => (
                              <img
                                key={
                                  photoIndex
                                }
                                src={photo}
                                alt="Customer review"
                                className="w-20 h-20 object-cover rounded-xl border"
                              />
                            ),
                          )}

                        </div>
                      )}

                    {review.verifiedPurchase && (
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                        <FaCheck />
                        Verified Purchase
                      </div>
                    )}

                  </motion.div>
                ),
              )}

            </div>
          )}
        </section>

        {/* =====================================================
            RELATED PRODUCTS
        ===================================================== */}

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

              {relatedProducts.map(
                (item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                  />
                ),
              )}

            </div>
          </section>
        )}

        {/* =====================================================
            RECOMMENDED PRODUCTS
        ===================================================== */}

        {recommendedProducts.length > 0 && (
          <section className="mt-16 border-t border-gray-100 pt-12">

            <div className="text-center">

              <p className="text-sm font-semibold text-pink-600 uppercase tracking-wide">
                Recommended For You
              </p>

              <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
                You Might Also Like
              </h2>

            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {recommendedProducts.map(
                (item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                  />
                ),
              )}

            </div>
          </section>
        )}

        {/* =====================================================
            RECENTLY VIEWED
        ===================================================== */}

        {recentProducts.length > 0 && (
          <section className="mt-16 border-t border-gray-100 pt-12">

            <div className="flex items-center gap-3">

              <FaSearch className="text-pink-600" />

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Recently Viewed
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Products you viewed recently.
                </p>
              </div>

            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {recentProducts
                .slice(0, 3)
                .map((item) => (
                  <Link
                    key={item.id}
                    to={`/products/${item.id}`}
                    className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition duration-500"
                    />

                    <div className="p-5">

                      <p className="text-xs text-pink-600">
                        {item.category}
                      </p>

                      <h3 className="mt-2 font-bold text-gray-900 group-hover:text-pink-600">
                        {item.name}
                      </h3>

                      <div className="mt-3 flex items-center gap-2">

                        <StarRating
                          rating={item.rating}
                        />

                        <span className="text-xs text-gray-500">
                          ({item.reviews})
                        </span>

                      </div>

                      <p className="mt-3 font-bold text-pink-600">
                        Rs.{" "}
                        {Number(
                          item.price,
                        ).toLocaleString()}
                      </p>

                    </div>
                  </Link>
                ))}

            </div>
          </section>
        )}

        {/* =====================================================
            CONTINUE SHOPPING
        ===================================================== */}

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

// ============================================================
// PRODUCT CARD
// ============================================================

function ProductCard({ item }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
    >

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

        {item.stock === 0 && (
          <span className="absolute inset-x-0 bottom-0 bg-red-600 text-white text-center py-2 text-xs font-bold">
            OUT OF STOCK
          </span>
        )}

      </Link>

      <div className="p-5">

        <p className="text-xs text-pink-600 font-medium">
          {item.category}
        </p>

        <Link to={`/products/${item.id}`}>
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
            Rs.{" "}
            {Number(
              item.price,
            ).toLocaleString()}
          </span>

          {item.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              Rs.{" "}
              {Number(
                item.oldPrice,
              ).toLocaleString()}
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
  );
}

export default ProductDetails;