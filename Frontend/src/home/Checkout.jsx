import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaTruck,
  FaMoneyBillWave,
  FaCreditCard,
  FaShoppingBag,
  FaEnvelope,
} from "react-icons/fa";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // =========================================================
  // FORM
  // =========================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "cod",
    note: "",
  });

  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================

  const getCurrentUser = () => {
    try {
      const auth = JSON.parse(
        localStorage.getItem("woolcraft-auth") || "false",
      );

      const savedUser = JSON.parse(
        localStorage.getItem("woolcraft-user") || "null",
      );

      if (!auth || !savedUser) {
        return null;
      }

      return savedUser;
    } catch (error) {
      console.error("User loading error:", error);
      return null;
    }
  };

  // =========================================================
  // USER CART KEY
  // =========================================================

  const getUserCartKey = (currentUser) => {
    if (!currentUser?.id) {
      return null;
    }

    return `woolcraft-cart-user-${currentUser.id}`;
  };

  // =========================================================
  // LOAD USER + CART
  // =========================================================

  useEffect(() => {
    const currentUser = getCurrentUser();

    // -------------------------------------------------------
    // LOGIN REQUIRED
    // -------------------------------------------------------

    if (!currentUser) {
      toast.error("Please login or register first.");

      navigate("/login", {
        state: {
          from: location.pathname,
        },
        replace: true,
      });

      return;
    }

    setUser(currentUser);

    // -------------------------------------------------------
    // LOAD USER CART
    // -------------------------------------------------------

    const cartKey = getUserCartKey(currentUser);

    let savedCart = [];

    try {
      savedCart = JSON.parse(localStorage.getItem(cartKey) || "[]") || [];
    } catch (error) {
      console.error("Cart loading error:", error);
      savedCart = [];
    }

    setCart(savedCart);

    // -------------------------------------------------------
    // AUTO-FILL USER INFORMATION
    // -------------------------------------------------------

    setFormData({
      name: currentUser.name || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      city: currentUser.city || "",
      postalCode: currentUser.postalCode || "",
      paymentMethod: "cod",
      note: "",
    });

    setPageLoading(false);
  }, [navigate, location.pathname]);

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // PRICE CALCULATION
  // =========================================================

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
  }, [cart]);

  const deliveryCharge = subtotal >= 3000 ? 0 : 150;

  const total = subtotal + deliveryCharge;

  // =========================================================
  // UPDATE USER INFORMATION
  // =========================================================

  const updateUserInformation = () => {
    if (!user) {
      return;
    }

    const updatedUser = {
      ...user,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      postalCode: formData.postalCode.trim(),
    };

    localStorage.setItem("woolcraft-user", JSON.stringify(updatedUser));

    setUser(updatedUser);

    window.dispatchEvent(new Event("authUpdated"));
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10 digit phone number");
      return false;
    }

    if (!formData.address.trim()) {
      toast.error("Please enter your delivery address");
      return false;
    }

    if (!formData.city.trim()) {
      toast.error("Please enter your city");
      return false;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    return true;
  };

  // =========================================================
  // PLACE ORDER
  // =========================================================

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // =======================================================
    // CREATE ORDER
    // =======================================================

    const order = {
      id: `WC-${Date.now()}`,

      userId: user.id,

      customer: {
        id: user.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim(),
        note: formData.note.trim(),
      },

      paymentMethod: formData.paymentMethod,

      items: cart.map((item) => ({
        ...item,
        quantity: Number(item.quantity || 1),
      })),

      subtotal,

      deliveryCharge,

      total,

      status: "Pending",

      createdAt: new Date().toISOString(),

      updatedAt: new Date().toISOString(),
    };

    // =======================================================
    // SAVE ORDER
    // =======================================================

    let existingOrders = [];

    try {
      existingOrders =
        JSON.parse(localStorage.getItem("woolcraft-orders") || "[]") || [];
    } catch {
      existingOrders = [];
    }

    localStorage.setItem(
      "woolcraft-orders",
      JSON.stringify([order, ...existingOrders]),
    );

    // =======================================================
    // UPDATE USER INFORMATION
    // =======================================================

    updateUserInformation();

    // =======================================================
    // CLEAR USER CART
    // =======================================================

    const cartKey = getUserCartKey(user);

    if (cartKey) {
      localStorage.removeItem(cartKey);
    }

    // -------------------------------------------------------
    // ALSO CLEAR OLD GUEST CART
    // -------------------------------------------------------

    localStorage.removeItem("woolcraft-cart");

    // =======================================================
    // UPDATE NAVBAR
    // =======================================================

    window.dispatchEvent(new Event("cartUpdated"));

    window.dispatchEvent(new Event("ordersUpdated"));

    // =======================================================
    // SUCCESS
    // =======================================================

    setTimeout(() => {
      setLoading(false);

      toast.success("Order placed successfully! 🎉");

      navigate("/order-success", {
        state: {
          order,
        },
      });
    }, 700);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (pageLoading) {
    return (
      <section className="min-h-[75vh] bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
      </section>
    );
  }

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
            Add some beautiful handmade wool crafts before proceeding to
            checkout.
          </p>

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
  // UI
  // =========================================================

  return (
    <section className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* =================================================
            HEADER
        ================================================= */}

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
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-pink-600 font-medium hover:text-pink-700"
          >
            <FaArrowLeft />
            Back to Cart
          </Link>

          <div className="mt-5">
            <p className="text-pink-600 font-semibold">WOOLCRAFT NEPAL</p>

            <h1 className="mt-1 text-3xl md:text-4xl font-bold text-gray-900">
              Checkout
            </h1>

            <p className="mt-2 text-gray-500">
              Complete your delivery details and place your order.
            </p>
          </div>
        </motion.div>

        {/* =================================================
            MAIN
        ================================================= */}

        <form
          onSubmit={handlePlaceOrder}
          className="mt-8 grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8"
        >
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">
            {/* =================================================
                DELIVERY INFORMATION
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-7"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Delivery Information
                  </h2>

                  <p className="text-sm text-gray-500">
                    Your saved account information is already filled in.
                  </p>
                </div>
              </div>

              {/* =================================================
                  NAME
              ================================================= */}

              <div className="mt-6">
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
                    className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>

              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="mt-5">
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
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>

              {/* =================================================
                  PHONE
              ================================================= */}

              <div className="mt-5">
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
                    className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>

              {/* =================================================
                  ADDRESS
              ================================================= */}

              <div className="mt-5">
                <label className="text-sm font-medium text-gray-700">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="House no, street, area..."
                  className="mt-2 w-full border border-gray-200 rounded-xl p-4 outline-none resize-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              {/* =================================================
                  CITY + POSTAL
              ================================================= */}

              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Kathmandu"
                    className="mt-2 w-full border border-gray-200 rounded-xl py-3.5 px-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Postal Code
                  </label>

                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="44600"
                    className="mt-2 w-full border border-gray-200 rounded-xl py-3.5 px-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>

              {/* =================================================
                  NOTE
              ================================================= */}

              <div className="mt-5">
                <label className="text-sm font-medium text-gray-700">
                  Order Note
                  <span className="text-gray-400 font-normal"> (Optional)</span>
                </label>

                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any special delivery instructions?"
                  className="mt-2 w-full border border-gray-200 rounded-xl p-4 outline-none resize-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </motion.div>

            {/* =================================================
                PAYMENT
            ================================================= */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-7"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <FaCreditCard />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Payment Method
                  </h2>

                  <p className="text-sm text-gray-500">
                    Choose your preferred payment method.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {/* =================================================
                    COD
                ================================================= */}

                <label
                  className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition ${
                    formData.paymentMethod === "cod"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    className="accent-pink-600"
                  />

                  <FaMoneyBillWave className="text-green-600 text-xl" />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-gray-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>

                {/* =================================================
                    ONLINE
                ================================================= */}

                <label
                  className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition ${
                    formData.paymentMethod === "online"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleChange}
                    className="accent-pink-600"
                  />

                  <FaCreditCard className="text-blue-600 text-xl" />

                  <div>
                    <p className="font-semibold text-gray-900">
                      Online Payment
                    </p>

                    <p className="text-sm text-gray-500">
                      Online payment integration can be added later.
                    </p>
                  </div>
                </label>
              </div>
            </motion.div>
          </div>

          {/* =================================================
              RIGHT - ORDER SUMMARY
          ================================================= */}

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

              {/* =================================================
                  PRODUCTS
              ================================================= */}

              <div className="mt-5 space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl bg-gray-100"
                      />

                      <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] min-w-5 h-5 rounded-full flex items-center justify-center px-1">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {item.name}
                      </h3>

                      {item.category && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.category}
                        </p>
                      )}

                      <p className="mt-1 text-pink-600 font-semibold text-sm">
                        Rs.{" "}
                        {(
                          Number(item.price || 0) * Number(item.quantity || 1)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <div className="border-t border-gray-100 my-5" />

              {/* =================================================
                  SUBTOTAL
              ================================================= */}

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span className="font-medium text-gray-900">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              {/* =================================================
                  DELIVERY
              ================================================= */}

              <div className="flex justify-between mt-3 text-gray-600">
                <span className="flex items-center gap-2">
                  <FaTruck className="text-pink-600" />
                  Delivery
                </span>

                <span className="font-medium text-gray-900">
                  {deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge}`}
                </span>
              </div>

              {/* =================================================
                  FREE DELIVERY MESSAGE
              ================================================= */}

              {subtotal < 3000 && (
                <p className="mt-2 text-xs text-gray-500">
                  Add Rs. {(3000 - subtotal).toLocaleString()} more for free
                  delivery.
                </p>
              )}

              {/* =================================================
                  TOTAL
              ================================================= */}

              <div className="border-t border-gray-100 my-5 pt-5 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>

                <span className="text-2xl font-bold text-pink-600">
                  Rs. {total.toLocaleString()}
                </span>
              </div>

              {/* =================================================
                  PLACE ORDER
              ================================================= */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Place Order
                  </>
                )}
              </button>

              {/* =================================================
                  SECURITY
              ================================================= */}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <FaCheckCircle className="text-green-500" />
                Secure & trusted checkout
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </section>
  );
}

export default Checkout;
