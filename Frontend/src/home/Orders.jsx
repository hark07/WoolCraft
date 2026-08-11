import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaBoxOpen,
  FaShoppingBag,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaCalendarAlt,
  FaTruck,
  FaMoneyBillWave,
  FaCreditCard,
  FaChevronDown,
  FaChevronUp,
  FaReceipt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaHome,
  FaStar,
  FaCommentDots,
} from "react-icons/fa";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // REVIEW STATES
  // =====================================================

  const [reviews, setReviews] = useState([]);

  const [reviewingProduct, setReviewingProduct] = useState(null);

  const [reviewRating, setReviewRating] = useState(0);

  const [reviewComment, setReviewComment] = useState("");

  // =====================================================
  // LOAD USER ORDERS
  // =====================================================

  const loadOrders = () => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem("woolcraft-user"),
      );

      const isAuthenticated =
        JSON.parse(localStorage.getItem("woolcraft-auth")) === true;

      if (!savedUser || !isAuthenticated) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const allOrders =
        JSON.parse(localStorage.getItem("woolcraft-orders")) || [];

      const userOrders = allOrders.filter((order) => {
        if (!order?.customer) return false;

        const customerEmail = order.customer.email;
        const customerPhone = order.customer.phone;

        if (customerEmail && savedUser.email) {
          return (
            customerEmail.toLowerCase() ===
            savedUser.email.toLowerCase()
          );
        }

        if (customerPhone && savedUser.phone) {
          return customerPhone === savedUser.phone;
        }

        return false;
      });

      setOrders(userOrders);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders([]);
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD REVIEWS
  // =====================================================

  const loadReviews = () => {
    try {
      const savedReviews =
        JSON.parse(
          localStorage.getItem("woolcraft-reviews"),
        ) || [];

      setReviews(savedReviews);
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviews([]);
    }
  };

  // =====================================================
  // INITIAL LOAD + AUTO UPDATE
  // =====================================================

  useEffect(() => {
    loadOrders();
    loadReviews();

    const handleOrderUpdate = () => {
      loadOrders();
    };

    const handleAuthUpdate = () => {
      loadOrders();
    };

    const handleReviewUpdate = () => {
      loadReviews();
    };

    window.addEventListener(
      "ordersUpdated",
      handleOrderUpdate,
    );

    window.addEventListener(
      "authUpdated",
      handleAuthUpdate,
    );

    window.addEventListener(
      "reviewsUpdated",
      handleReviewUpdate,
    );

    const handleStorage = (event) => {
      if (
        event.key === "woolcraft-orders" ||
        event.key === "woolcraft-user" ||
        event.key === "woolcraft-auth"
      ) {
        loadOrders();
      }

      if (event.key === "woolcraft-reviews") {
        loadReviews();
      }
    };

    window.addEventListener("storage", handleStorage);

    const interval = setInterval(() => {
      loadOrders();
      loadReviews();
    }, 3000);

    return () => {
      window.removeEventListener(
        "ordersUpdated",
        handleOrderUpdate,
      );

      window.removeEventListener(
        "authUpdated",
        handleAuthUpdate,
      );

      window.removeEventListener(
        "reviewsUpdated",
        handleReviewUpdate,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );

      clearInterval(interval);
    };
  }, []);

  // =====================================================
  // USER
  // =====================================================

  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("woolcraft-user"),
      );
    } catch {
      return null;
    }
  }, []);

  // =====================================================
  // DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    try {
      return new Date(date).toLocaleDateString("en-NP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Date unavailable";
    }
  };

  const formatTime = (date) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleTimeString("en-NP", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    const normalized = String(status || "Pending").toLowerCase();

    if (
      normalized === "delivered" ||
      normalized === "completed"
    ) {
      return {
        className:
          "bg-green-100 text-green-700 border-green-200",
        icon: <FaCheckCircle />,
      };
    }

    if (
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {
      return {
        className:
          "bg-red-100 text-red-700 border-red-200",
        icon: <FaTimesCircle />,
      };
    }

    if (
      normalized === "shipped" ||
      normalized === "out for delivery"
    ) {
      return {
        className:
          "bg-blue-100 text-blue-700 border-blue-200",
        icon: <FaTruck />,
      };
    }

    if (normalized === "processing") {
      return {
        className:
          "bg-purple-100 text-purple-700 border-purple-200",
        icon: <FaBoxOpen />,
      };
    }

    return {
      className:
        "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <FaClock />,
    };
  };

  // =====================================================
  // STATUS HELPERS
  // =====================================================

  const getNormalizedStatus = (status) => {
    const value = String(status || "Pending")
      .trim()
      .toLowerCase();

    if (value === "completed") return "delivered";
    if (value === "canceled") return "cancelled";

    return value;
  };

  const getStatusStep = (status) => {
    const normalized = getNormalizedStatus(status);

    if (normalized === "pending") return 0;
    if (normalized === "processing") return 1;
    if (normalized === "shipped") return 2;
    if (normalized === "out for delivery") return 3;
    if (normalized === "delivered") return 4;

    if (normalized === "cancelled") return -1;

    return 0;
  };

  // =====================================================
  // TOGGLE ORDER
  // =====================================================

  const toggleOrder = (orderId) => {
    setExpandedOrder((prev) =>
      prev === orderId ? null : orderId,
    );
  };

  // =====================================================
  // CHECK REVIEW
  // =====================================================

  const hasReviewedProduct = (order, item) => {
    if (!user) return false;

    return reviews.some(
      (review) =>
        String(review.orderId) === String(order.orderId || order.id) &&
        String(review.productId) === String(item.id) &&
        String(review.userEmail || "").toLowerCase() ===
          String(user.email || "").toLowerCase(),
    );
  };

  // =====================================================
  // OPEN REVIEW
  // =====================================================

  const openReview = (order, item) => {
    const alreadyReviewed = hasReviewedProduct(
      order,
      item,
    );

    if (alreadyReviewed) {
      toast.error("You have already reviewed this product.");
      return;
    }

    setReviewingProduct({
      order,
      item,
    });

    setReviewRating(0);
    setReviewComment("");
  };

  // =====================================================
  // CLOSE REVIEW
  // =====================================================

  const closeReview = () => {
    setReviewingProduct(null);
    setReviewRating(0);
    setReviewComment("");
  };

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const submitReview = () => {
    if (!reviewingProduct) return;

    const { order, item } = reviewingProduct;

    if (!reviewRating) {
      toast.error("Please select a rating.");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Please write a comment.");
      return;
    }

    if (hasReviewedProduct(order, item)) {
      toast.error(
        "You have already reviewed this product.",
      );
      closeReview();
      return;
    }

    const newReview = {
      id: `review-${Date.now()}`,

      productId: item.id,

      orderId: order.orderId || order.id,

      userEmail: user?.email || "",

      userName: user?.name || "Customer",

      rating: reviewRating,

      comment: reviewComment.trim(),

      createdAt: new Date().toISOString(),
    };

    const existingReviews =
      JSON.parse(
        localStorage.getItem("woolcraft-reviews"),
      ) || [];

    const updatedReviews = [
      ...existingReviews,
      newReview,
    ];

    localStorage.setItem(
      "woolcraft-reviews",
      JSON.stringify(updatedReviews),
    );

    setReviews(updatedReviews);

    window.dispatchEvent(
      new Event("reviewsUpdated"),
    );

    toast.success("Thank you! Your review was added ❤️");

    closeReview();
  };

  // =====================================================
  // ORDER TIMELINE
  // =====================================================

  const OrderTimeline = ({ order }) => {
    const normalizedStatus = getNormalizedStatus(
      order.status,
    );

    const currentStep = getStatusStep(order.status);

    const cancelled =
      normalizedStatus === "cancelled";

    const steps = [
      {
        title: "Order Received",
        description:
          "Your order has been received.",
        icon: <FaCheckCircle />,
      },
      {
        title: "Preparing",
        description:
          "We are preparing your handmade item.",
        icon: <FaBoxOpen />,
      },
      {
        title: "Shipped",
        description:
          "Your package has been shipped.",
        icon: <FaTruck />,
      },
      {
        title: "Out for Delivery",
        description:
          "Your package is on the way to you.",
        icon: <FaTruck />,
      },
      {
        title: "Delivered",
        description:
          "Enjoy your handmade wool craft!",
        icon: <FaHome />,
      },
    ];

    return (
      <div className="border-t border-gray-100 p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              What's Next?
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Track your order progress here.
            </p>
          </div>

          {!cancelled && (
            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 text-xs font-semibold">
              {order.status || "Pending"}
            </span>
          )}
        </div>

        {/* CANCELLED */}

        {cancelled ? (
          <div className="mt-6 p-5 rounded-2xl bg-red-50 border border-red-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <FaTimesCircle className="text-xl" />
              </div>

              <div>
                <h4 className="font-bold text-red-700">
                  Order Cancelled
                </h4>

                <p className="mt-1 text-sm text-red-600">
                  This order has been cancelled.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* DESKTOP TIMELINE */}

            <div className="hidden md:block mt-8">
              <div className="relative">
                <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-gray-200 rounded-full" />

                <div
                  className="absolute top-6 left-[10%] h-1 bg-pink-500 rounded-full transition-all duration-700"
                  style={{
                    width:
                      currentStep === 0
                        ? "0%"
                        : `${(currentStep / 4) * 80}%`,
                  }}
                />

                <div className="relative grid grid-cols-5 gap-2">
                  {steps.map((step, index) => {
                    const completed =
                      index < currentStep;

                    const active =
                      index === currentStep;

                    return (
                      <div
                        key={step.title}
                        className="text-center"
                      >
                        <div
                          className={`
                            mx-auto w-12 h-12 rounded-full
                            flex items-center justify-center
                            border-4 border-white
                            transition-all duration-500
                            ${
                              completed || active
                                ? "bg-pink-600 text-white shadow-lg"
                                : "bg-gray-100 text-gray-400"
                            }
                            ${
                              active
                                ? "ring-4 ring-pink-100 scale-110"
                                : ""
                            }
                          `}
                        >
                          {step.icon}
                        </div>

                        <h4
                          className={`
                            mt-3 text-sm font-semibold
                            ${
                              completed || active
                                ? "text-gray-900"
                                : "text-gray-400"
                            }
                          `}
                        >
                          {step.title}
                        </h4>

                        <p className="mt-1 text-xs text-gray-500 max-w-[150px] mx-auto">
                          {step.description}
                        </p>

                        {active && (
                          <span className="inline-flex mt-2 text-[10px] uppercase tracking-wide font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* MOBILE TIMELINE */}

            <div className="md:hidden mt-7">
              <div className="relative">
                {steps.map((step, index) => {
                  const completed =
                    index < currentStep;

                  const active =
                    index === currentStep;

                  const last =
                    index === steps.length - 1;

                  return (
                    <div
                      key={step.title}
                      className="relative flex gap-4"
                    >
                      {!last && (
                        <div
                          className={`
                            absolute left-[23px] top-12
                            w-1 h-[calc(100%-8px)]
                            rounded-full
                            ${
                              index < currentStep
                                ? "bg-pink-500"
                                : "bg-gray-200"
                            }
                          `}
                        />
                      )}

                      <div
                        className={`
                          relative z-10 w-12 h-12
                          shrink-0 rounded-full
                          flex items-center justify-center
                          border-4 border-white
                          transition-all duration-500
                          ${
                            completed || active
                              ? "bg-pink-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-400"
                          }
                          ${
                            active
                              ? "ring-4 ring-pink-100 scale-105"
                              : ""
                          }
                        `}
                      >
                        {step.icon}
                      </div>

                      <div className="pb-8">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            className={`
                              font-semibold
                              ${
                                completed || active
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }
                            `}
                          >
                            {step.title}
                          </h4>

                          {active && (
                            <span className="text-[10px] uppercase tracking-wide font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                              Current
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CURRENT STATUS */}

            <div className="mt-4 p-4 rounded-2xl bg-pink-50 border border-pink-100">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white text-pink-600 flex items-center justify-center shrink-0">
                  {currentStep === 4 ? (
                    <FaCheckCircle />
                  ) : (
                    <FaClock />
                  )}
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    {currentStep === 0 &&
                      "We have received your order."}

                    {currentStep === 1 &&
                      "Your order is being prepared."}

                    {currentStep === 2 &&
                      "Your order has been shipped."}

                    {currentStep === 3 &&
                      "Your order is out for delivery."}

                    {currentStep === 4 &&
                      "Your order has been delivered."}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    We'll keep your order status updated.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!user) {
    return (
      <section className="min-h-[75vh] bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-sm p-8 md:p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
            <FaUser className="text-3xl" />
          </div>

          <h1 className="mt-6 text-2xl md:text-3xl font-bold text-gray-900">
            Login Required
          </h1>

          <p className="mt-3 text-gray-500">
            Please login or register to view your orders.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <FaUser />
            Login / Register
          </Link>
        </div>
      </section>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <section className="min-h-[75vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Loading your orders...
          </p>
        </div>
      </section>
    );
  }

  // =====================================================
  // EMPTY ORDERS
  // =====================================================

  if (orders.length === 0) {
    return (
      <section className="min-h-[75vh] bg-gray-50 py-10 md:py-14">
        <div className="max-w-5xl mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            <FaArrowLeft />
            Back to Home
          </Link>

          <div className="mt-8 bg-white rounded-3xl shadow-sm p-8 md:p-14 text-center">
            <div className="mx-auto w-24 h-24 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
              <FaBoxOpen className="text-4xl" />
            </div>

            <h1 className="mt-6 text-2xl md:text-3xl font-bold text-gray-900">
              No Orders Yet
            </h1>

            <p className="mt-3 text-gray-500 max-w-md mx-auto">
              You haven't placed any orders yet. Explore
              our handmade wool crafts and place your first
              order.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 mt-7 bg-pink-600 hover:bg-pink-700 text-white px-7 py-3.5 rounded-xl font-semibold transition"
            >
              <FaShoppingBag />
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <>
      <section className="min-h-screen bg-gray-50 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">

          {/* HEADER */}

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                <FaArrowLeft />
                Back to Home
              </Link>

              <div className="mt-5 flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center">
                  <FaBoxOpen className="text-xl" />
                </div>

                <div>
                  <p className="text-sm text-pink-600 font-semibold">
                    WOOLCRAFT NEPAL
                  </p>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                    My Orders
                  </h1>
                </div>
              </div>

              <p className="mt-3 text-gray-500">
                Welcome back,{" "}
                <span className="font-semibold text-gray-700">
                  {user.name}
                </span>
                . Here are your orders.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-xl font-semibold transition"
            >
              <FaShoppingBag />
              Continue Shopping
            </Link>
          </div>

          {/* ORDER COUNT */}

          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Orders
                </p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {orders.length}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <FaReceipt />
              </div>
            </div>
          </div>

          {/* ORDERS */}

          <div className="mt-6 space-y-5">
            {orders.map((order) => {
              const status = getStatusStyle(
                order.status,
              );

              const isExpanded =
                expandedOrder === order.id;

              const isDelivered =
                getNormalizedStatus(order.status) ===
                "delivered";

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* ORDER HEADER */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleOrder(order.id)
                    }
                    className="w-full text-left p-5 md:p-6 hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 shrink-0 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                          <FaBoxOpen />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-bold text-gray-900">
                              {order.orderId ||
                                order.id}
                            </h2>

                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.className}`}
                            >
                              {status.icon}

                              {order.status ||
                                "Pending"}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                            <span className="inline-flex items-center gap-1.5">
                              <FaCalendarAlt />
                              {formatDate(
                                order.createdAt,
                              )}
                            </span>

                            {formatTime(
                              order.createdAt,
                            ) && (
                              <span>
                                {formatTime(
                                  order.createdAt,
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="text-left md:text-right">
                          <p className="text-xs text-gray-500">
                            Order Total
                          </p>

                          <p className="mt-1 text-xl font-bold text-pink-600">
                            Rs.{" "}
                            {Number(
                              order.total || 0,
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          {isExpanded ? (
                            <FaChevronUp />
                          ) : (
                            <FaChevronDown />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* EXPANDED */}

                  {isExpanded && (
                    <div className="border-t border-gray-100">

                      {/* PRODUCTS */}

                      <div className="p-5 md:p-6">
                        <div className="flex items-center gap-2">
                          <FaShoppingBag className="text-pink-600" />

                          <h3 className="font-bold text-gray-900">
                            Ordered Products
                          </h3>
                        </div>

                        <div className="mt-5 space-y-4">
                          {(order.items || []).map(
                            (item, index) => {
                              const alreadyReviewed =
                                hasReviewedProduct(
                                  order,
                                  item,
                                );

                              return (
                                <div
                                  key={`${order.id}-${item.id}-${index}`}
                                  className="p-3 rounded-xl bg-gray-50"
                                >
                                  <div className="flex gap-4">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-white"
                                    />

                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-gray-900 line-clamp-2">
                                        {item.name}
                                      </h4>

                                      {item.category && (
                                        <p className="mt-1 text-xs text-gray-500">
                                          {item.category}
                                        </p>
                                      )}

                                      <div className="mt-2 flex flex-wrap gap-3 text-sm">
                                        <span className="text-gray-500">
                                          Qty:{" "}
                                          <strong className="text-gray-800">
                                            {item.quantity ||
                                              1}
                                          </strong>
                                        </span>

                                        <span className="text-gray-500">
                                          Price:{" "}
                                          <strong className="text-gray-800">
                                            Rs.{" "}
                                            {Number(
                                              item.price ||
                                                0,
                                            ).toLocaleString()}
                                          </strong>
                                        </span>
                                      </div>
                                    </div>

                                    <div className="text-right shrink-0">
                                      <p className="text-sm font-bold text-pink-600">
                                        Rs.{" "}
                                        {(
                                          Number(
                                            item.price ||
                                              0,
                                          ) *
                                          Number(
                                            item.quantity ||
                                              1,
                                          )
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                  </div>

                                  {/* REVIEW BUTTON */}

                                  {isDelivered && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                      {alreadyReviewed ? (
                                        <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                                          <FaCheckCircle />

                                          You reviewed this product
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            openReview(
                                              order,
                                              item,
                                            )
                                          }
                                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
                                        >
                                          <FaStar />

                                          Rate & Review
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>

                      {/* WHAT'S NEXT */}

                      <OrderTimeline order={order} />

                      {/* DELIVERY */}

                      <div className="border-t border-gray-100 p-5 md:p-6">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-pink-600" />

                          <h3 className="font-bold text-gray-900">
                            Delivery Information
                          </h3>
                        </div>

                        <div className="mt-5 grid md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-400 uppercase font-semibold">
                              Customer
                            </p>

                            <div className="mt-2 flex items-start gap-3">
                              <FaUser className="mt-1 text-gray-400" />

                              <div>
                                <p className="font-semibold text-gray-800">
                                  {order.customer?.name ||
                                    user.name}
                                </p>

                                {order.customer?.phone && (
                                  <p className="mt-1 text-sm text-gray-500 flex items-center gap-2">
                                    <FaPhone />
                                    {order.customer.phone}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-400 uppercase font-semibold">
                              Address
                            </p>

                            <div className="mt-2 flex items-start gap-3">
                              <FaMapMarkerAlt className="mt-1 text-gray-400" />

                              <div>
                                <p className="font-medium text-gray-800">
                                  {order.customer?.address ||
                                    "Address unavailable"}
                                </p>

                                {order.customer?.city && (
                                  <p className="mt-1 text-sm text-gray-500">
                                    {order.customer.city}

                                    {order.customer
                                      .postalCode
                                      ? ` - ${order.customer.postalCode}`
                                      : ""}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {order.customer?.note && (
                          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                            <p className="text-xs font-semibold text-yellow-700 uppercase">
                              Order Note
                            </p>

                            <p className="mt-1 text-sm text-gray-700">
                              {order.customer.note}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* PAYMENT + SUMMARY */}

                      <div className="border-t border-gray-100 p-5 md:p-6">
                        <div className="grid md:grid-cols-2 gap-6">

                          {/* PAYMENT */}

                          <div>
                            <div className="flex items-center gap-2">
                              {order.paymentMethod ===
                              "online" ? (
                                <FaCreditCard className="text-blue-600" />
                              ) : (
                                <FaMoneyBillWave className="text-green-600" />
                              )}

                              <h3 className="font-bold text-gray-900">
                                Payment Method
                              </h3>
                            </div>

                            <div className="mt-4 p-4 rounded-xl bg-gray-50">
                              <p className="font-semibold text-gray-800">
                                {order.paymentMethod ===
                                "online"
                                  ? "Online Payment"
                                  : "Cash on Delivery"}
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                {order.paymentMethod ===
                                "online"
                                  ? "Online payment"
                                  : "Pay when your order arrives"}
                              </p>
                            </div>
                          </div>

                          {/* SUMMARY */}

                          <div>
                            <div className="flex items-center gap-2">
                              <FaReceipt className="text-pink-600" />

                              <h3 className="font-bold text-gray-900">
                                Order Summary
                              </h3>
                            </div>

                            <div className="mt-4 space-y-3">
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>

                                <span className="font-medium text-gray-900">
                                  Rs.{" "}
                                  {Number(
                                    order.subtotal || 0,
                                  ).toLocaleString()}
                                </span>
                              </div>

                              <div className="flex justify-between text-sm text-gray-600">
                                <span className="flex items-center gap-2">
                                  <FaTruck className="text-pink-600" />
                                  Delivery
                                </span>

                                <span className="font-medium text-gray-900">
                                  {Number(
                                    order.deliveryCharge ||
                                      0,
                                  ) === 0
                                    ? "FREE"
                                    : `Rs. ${Number(
                                        order.deliveryCharge,
                                      ).toLocaleString()}`}
                                </span>
                              </div>

                              <div className="border-t border-gray-100 pt-3 flex justify-between">
                                <span className="font-bold text-gray-900">
                                  Total
                                </span>

                                <span className="text-xl font-bold text-pink-600">
                                  Rs.{" "}
                                  {Number(
                                    order.total || 0,
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          REVIEW MODAL
      ===================================================== */}

      {reviewingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* MODAL HEADER */}

            <div className="p-5 md:p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FaCommentDots className="text-pink-600" />

                  <h2 className="text-xl font-bold text-gray-900">
                    Rate Your Product
                  </h2>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Share your experience with us.
                </p>
              </div>

              <button
                type="button"
                onClick={closeReview}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center"
              >
                <FaTimesCircle />
              </button>
            </div>

            {/* PRODUCT */}

            <div className="p-5 md:p-6">
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50">
                <img
                  src={reviewingProduct.item.image}
                  alt={reviewingProduct.item.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {reviewingProduct.item.name}
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Order #
                    {reviewingProduct.order.orderId ||
                      reviewingProduct.order.id}
                  </p>
                </div>
              </div>

              {/* STAR RATING */}

              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-700 text-center">
                  How would you rate this product?
                </p>

                <div className="mt-3 flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewRating(star)
                      }
                      className="text-3xl transition-transform hover:scale-110"
                      aria-label={`${star} star`}
                    >
                      <FaStar
                        className={
                          star <= reviewRating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>

                <p className="mt-2 text-center text-sm font-medium text-pink-600">
                  {reviewRating === 1 && "Poor"}
                  {reviewRating === 2 && "Fair"}
                  {reviewRating === 3 && "Good"}
                  {reviewRating === 4 && "Very Good"}
                  {reviewRating === 5 && "Excellent ❤️"}
                </p>
              </div>

              {/* COMMENT */}

              <div className="mt-6">
                <label className="text-sm font-semibold text-gray-700">
                  Your Comment
                </label>

                <textarea
                  value={reviewComment}
                  onChange={(e) =>
                    setReviewComment(e.target.value)
                  }
                  rows={5}
                  maxLength={500}
                  placeholder="Tell us about your experience..."
                  className="w-full mt-2 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500 resize-none"
                />

                <p className="mt-1 text-right text-xs text-gray-400">
                  {reviewComment.length}/500
                </p>
              </div>

              {/* ACTIONS */}

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={closeReview}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={submitReview}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <FaStar />
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;
