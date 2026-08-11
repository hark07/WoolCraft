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
} from "react-icons/fa";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD USER ORDERS
  // ==========================================

  const loadOrders = () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("woolcraft-user"));

      const isAuthenticated =
        JSON.parse(localStorage.getItem("woolcraft-auth")) === true;

      if (!savedUser || !isAuthenticated) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const allOrders =
        JSON.parse(localStorage.getItem("woolcraft-orders")) || [];

      // Only show logged-in user's orders
      const userOrders = allOrders.filter((order) => {
        if (!order?.customer) return false;

        const customerEmail = order.customer.email;
        const customerPhone = order.customer.phone;

        // New orders may have email
        if (customerEmail && savedUser.email) {
          return customerEmail.toLowerCase() === savedUser.email.toLowerCase();
        }

        // Fallback for old orders that don't have email
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

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadOrders();

    const handleOrderUpdate = () => {
      loadOrders();
    };

    const handleAuthUpdate = () => {
      loadOrders();
    };

    window.addEventListener("ordersUpdated", handleOrderUpdate);
    window.addEventListener("authUpdated", handleAuthUpdate);

    return () => {
      window.removeEventListener("ordersUpdated", handleOrderUpdate);

      window.removeEventListener("authUpdated", handleAuthUpdate);
    };
  }, []);

  // ==========================================
  // USER
  // ==========================================

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("woolcraft-user"));
    } catch {
      return null;
    }
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================

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

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    const normalized = String(status || "Pending").toLowerCase();

    if (normalized === "delivered" || normalized === "completed") {
      return {
        className: "bg-green-100 text-green-700 border-green-200",
        icon: <FaCheckCircle />,
      };
    }

    if (normalized === "cancelled" || normalized === "canceled") {
      return {
        className: "bg-red-100 text-red-700 border-red-200",
        icon: <FaTimesCircle />,
      };
    }

    if (normalized === "shipped" || normalized === "out for delivery") {
      return {
        className: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <FaTruck />,
      };
    }

    if (normalized === "processing") {
      return {
        className: "bg-purple-100 text-purple-700 border-purple-200",
        icon: <FaBoxOpen />,
      };
    }

    return {
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <FaClock />,
    };
  };

  // ==========================================
  // TOGGLE ORDER
  // ==========================================

  const toggleOrder = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

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

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <section className="min-h-[75vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">Loading your orders...</p>
        </div>
      </section>
    );
  }

  // ==========================================
  // EMPTY ORDERS
  // ==========================================

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
              You haven't placed any orders yet. Explore our handmade wool
              crafts and place your first order.
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

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <section className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* ======================================
            HEADER
        ====================================== */}

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
              <span className="font-semibold text-gray-700">{user.name}</span>.
              Here are your orders.
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

        {/* ======================================
            ORDER COUNT
        ====================================== */}

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <FaReceipt />
            </div>
          </div>
        </div>

        {/* ======================================
            ORDERS LIST
        ====================================== */}

        <div className="mt-6 space-y-5">
          {orders.map((order) => {
            const status = getStatusStyle(order.status);

            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* ==================================
                    ORDER HEADER
                ================================== */}

                <button
                  type="button"
                  onClick={() => toggleOrder(order.id)}
                  className="w-full text-left p-5 md:p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    {/* LEFT */}

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                        <FaBoxOpen />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-bold text-gray-900">
                            {order.id}
                          </h2>

                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${status.className}`}
                          >
                            {status.icon}
                            {order.status || "Pending"}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                          <span className="inline-flex items-center gap-1.5">
                            <FaCalendarAlt />
                            {formatDate(order.createdAt)}
                          </span>

                          {formatTime(order.createdAt) && (
                            <span>{formatTime(order.createdAt)}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-500">Order Total</p>

                        <p className="mt-1 text-xl font-bold text-pink-600">
                          Rs. {Number(order.total || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </div>
                  </div>
                </button>

                {/* ==================================
                    EXPANDED ORDER
                ================================== */}

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
                        {(order.items || []).map((item, index) => (
                          <div
                            key={`${order.id}-${item.id}-${index}`}
                            className="flex gap-4 p-3 rounded-xl bg-gray-50"
                          >
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
                                    {item.quantity || 1}
                                  </strong>
                                </span>

                                <span className="text-gray-500">
                                  Price:{" "}
                                  <strong className="text-gray-800">
                                    Rs.{" "}
                                    {Number(item.price || 0).toLocaleString()}
                                  </strong>
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-sm font-bold text-pink-600">
                                Rs.{" "}
                                {(
                                  Number(item.price || 0) *
                                  Number(item.quantity || 1)
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ==================================
                        DELIVERY INFORMATION
                    ================================== */}

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
                                {order.customer?.name || user.name}
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
                                  {order.customer.postalCode
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

                    {/* ==================================
                        PAYMENT + SUMMARY
                    ================================== */}

                    <div className="border-t border-gray-100 p-5 md:p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* PAYMENT */}

                        <div>
                          <div className="flex items-center gap-2">
                            {order.paymentMethod === "online" ? (
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
                              {order.paymentMethod === "online"
                                ? "Online Payment"
                                : "Cash on Delivery"}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {order.paymentMethod === "online"
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
                                {Number(order.subtotal || 0).toLocaleString()}
                              </span>
                            </div>

                            <div className="flex justify-between text-sm text-gray-600">
                              <span className="flex items-center gap-2">
                                <FaTruck className="text-pink-600" />
                                Delivery
                              </span>

                              <span className="font-medium text-gray-900">
                                {Number(order.deliveryCharge || 0) === 0
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
                                Rs. {Number(order.total || 0).toLocaleString()}
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
  );
}

export default Orders;
