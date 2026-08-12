import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  FaPlus,
  FaEdit,
  FaTrash,
  FaShieldAlt,
  FaTag,
  FaTimes,
} from "react-icons/fa";

function Checkout() {
  const navigate = useNavigate();

  // =========================================================
  // STORAGE KEYS
  // =========================================================

  const CART_KEY = "woolcraft-cart";
  const USER_KEY = "woolcraft-user";
  const AUTH_KEY = "woolcraft-auth";
  const ORDERS_KEY = "woolcraft-orders";
  const ADDRESSES_KEY = "woolcraft-addresses";
  const COUPON_KEY = "woolcraft-coupon";

  // =========================================================
  // SETTINGS
  // =========================================================

  const FREE_SHIPPING_THRESHOLD = 3000;
  const STANDARD_SHIPPING = 150;
  const EXPRESS_SHIPPING = 250;

  // Set to 0 if you do not want tax.
  const TAX_RATE = 0;

  // Demo coupons.
  const COUPONS = {
    WOOL10: {
      code: "WOOL10",
      type: "percentage",
      value: 10,
      minAmount: 1000,
      maxDiscount: 1000,
    },

    SAVE200: {
      code: "SAVE200",
      type: "fixed",
      value: 200,
      minAmount: 2000,
      maxDiscount: 200,
    },

    WELCOME: {
      code: "WELCOME",
      type: "percentage",
      value: 15,
      minAmount: 1500,
      maxDiscount: 1200,
    },
  };

  // =========================================================
  // STATE
  // =========================================================

  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const [deliveryMethod, setDeliveryMethod] = useState("standard");

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const [addressForm, setAddressForm] = useState({
    label: "Home",
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

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
  // GET CURRENT USER
  // =========================================================

  const getCurrentUser = () => {
    try {
      const auth = JSON.parse(localStorage.getItem(AUTH_KEY) || "false");

      const savedUser = JSON.parse(localStorage.getItem(USER_KEY) || "null");

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
  // SAFE JSON PARSER
  // =========================================================

  const readStorageArray = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");

      return Array.isArray(value) ? value : [];
    } catch (error) {
      console.error(`Unable to load ${key}:`, error);
      return [];
    }
  };

  // =========================================================
  // LOAD CHECKOUT DATA
  // =========================================================

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      toast.error("Please login or register first.");

      navigate("/login", {
        state: {
          from: "/checkout",
        },
        replace: true,
      });

      return;
    }

    setUser(currentUser);

    // -------------------------------------------------------
    // CART
    // -------------------------------------------------------

    const savedCart = readStorageArray(CART_KEY);

    setCart(savedCart);

    if (savedCart.length === 0) {
      setPageLoading(false);
      return;
    }

    // -------------------------------------------------------
    // USER FORM
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

    // -------------------------------------------------------
    // ADDRESSES
    // -------------------------------------------------------

    let savedAddresses = readStorageArray(ADDRESSES_KEY);

    // Create first address from existing user data.
    if (
      savedAddresses.length === 0 &&
      (currentUser.address || currentUser.city)
    ) {
      const defaultAddress = {
        id: `ADDR-${Date.now()}`,
        label: "Home",
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        city: currentUser.city || "",
        postalCode: currentUser.postalCode || "",
        isDefault: true,
      };

      savedAddresses = [defaultAddress];

      localStorage.setItem(ADDRESSES_KEY, JSON.stringify(savedAddresses));
    }

    setAddresses(savedAddresses);

    const defaultAddress =
      savedAddresses.find((item) => item.isDefault) || savedAddresses[0];

    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);

      setFormData((prev) => ({
        ...prev,
        name: defaultAddress.name || prev.name,
        phone: defaultAddress.phone || prev.phone,
        address: defaultAddress.address || prev.address,
        city: defaultAddress.city || prev.city,
        postalCode: defaultAddress.postalCode || prev.postalCode,
      }));
    }

    // -------------------------------------------------------
    // SAVED COUPON
    // -------------------------------------------------------

    try {
      const savedCoupon = JSON.parse(
        localStorage.getItem(COUPON_KEY) || "null",
      );

      if (savedCoupon?.code) {
        setCouponCode(savedCoupon.code);
        setAppliedCoupon(savedCoupon);
      }
    } catch {
      // Ignore invalid coupon storage.
    }

    setPageLoading(false);
  }, [navigate]);

  // =========================================================
  // CART UPDATE LISTENER
  // =========================================================

  useEffect(() => {
    const handleCartUpdate = () => {
      const updatedCart = readStorageArray(CART_KEY);
      setCart(updatedCart);
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

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
  // ADDRESS FORM CHANGE
  // =========================================================

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddressForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SELECT ADDRESS
  // =========================================================

  const selectAddress = (address) => {
    setSelectedAddressId(address.id);

    setFormData((prev) => ({
      ...prev,
      name: address.name || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      postalCode: address.postalCode || "",
    }));
  };

  // =========================================================
  // OPEN NEW ADDRESS
  // =========================================================

  const openNewAddress = () => {
    setEditingAddressId(null);

    setAddressForm({
      label: "Home",
      name: user?.name || "",
      phone: user?.phone || "",
      address: "",
      city: "",
      postalCode: "",
    });

    setIsAddressModalOpen(true);
  };

  // =========================================================
  // OPEN EDIT ADDRESS
  // =========================================================

  const openEditAddress = (address) => {
    setEditingAddressId(address.id);

    setAddressForm({
      label: address.label || "Home",
      name: address.name || "",
      phone: address.phone || "",
      address: address.address || "",
      city: address.city || "",
      postalCode: address.postalCode || "",
    });

    setIsAddressModalOpen(true);
  };

  // =========================================================
  // SAVE ADDRESS
  // =========================================================

  const saveAddress = (e) => {
    e.preventDefault();

    if (!addressForm.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!addressForm.phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    const cleanPhone = addressForm.phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10 digit phone number.");
      return;
    }

    if (!addressForm.address.trim()) {
      toast.error("Please enter your address.");
      return;
    }

    if (!addressForm.city.trim()) {
      toast.error("Please enter your city.");
      return;
    }

    const existingAddresses = readStorageArray(ADDRESSES_KEY);

    let updatedAddresses;

    if (editingAddressId) {
      updatedAddresses = existingAddresses.map((address) =>
        address.id === editingAddressId
          ? {
              ...address,
              ...addressForm,
            }
          : address,
      );
    } else {
      const newAddress = {
        id: `ADDR-${Date.now()}`,
        ...addressForm,
        isDefault: existingAddresses.length === 0,
      };

      updatedAddresses = [...existingAddresses, newAddress];
    }

    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updatedAddresses));

    setAddresses(updatedAddresses);

    const savedAddress = editingAddressId
      ? updatedAddresses.find((address) => address.id === editingAddressId)
      : updatedAddresses[updatedAddresses.length - 1];

    if (savedAddress) {
      selectAddress(savedAddress);
    }

    setIsAddressModalOpen(false);
    setEditingAddressId(null);

    toast.success(editingAddressId ? "Address updated." : "Address added.");
  };

  // =========================================================
  // DELETE ADDRESS
  // =========================================================

  const deleteAddress = (id) => {
    const existingAddresses = readStorageArray(ADDRESSES_KEY);

    if (existingAddresses.length <= 1) {
      toast.error("You must keep at least one address.");
      return;
    }

    const updatedAddresses = existingAddresses.filter(
      (address) => address.id !== id,
    );

    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updatedAddresses));

    setAddresses(updatedAddresses);

    if (selectedAddressId === id) {
      const nextAddress =
        updatedAddresses.find((address) => address.isDefault) ||
        updatedAddresses[0];

      if (nextAddress) {
        selectAddress(nextAddress);
      }
    }

    toast.success("Address deleted.");
  };

  // =========================================================
  // SET DEFAULT ADDRESS
  // =========================================================

  const setDefaultAddress = (id) => {
    const existingAddresses = readStorageArray(ADDRESSES_KEY);

    const updatedAddresses = existingAddresses.map((address) => ({
      ...address,
      isDefault: address.id === id,
    }));

    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(updatedAddresses));

    setAddresses(updatedAddresses);

    const selected = updatedAddresses.find((address) => address.id === id);

    if (selected) {
      selectAddress(selected);
    }

    toast.success("Default address updated.");
  };

  // =========================================================
  // PRICE CALCULATIONS
  // =========================================================

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
  }, [cart]);

  // =========================================================
  // COUPON DISCOUNT
  // =========================================================

  const discount = useMemo(() => {
    if (!appliedCoupon) {
      return 0;
    }

    const coupon = COUPONS[appliedCoupon.code];

    if (!coupon) {
      return 0;
    }

    if (subtotal < coupon.minAmount) {
      return 0;
    }

    if (coupon.type === "percentage") {
      const calculated = (subtotal * coupon.value) / 100;

      return Math.min(calculated, coupon.maxDiscount || calculated);
    }

    return Math.min(coupon.value, coupon.maxDiscount || coupon.value);
  }, [appliedCoupon, subtotal]);

  // =========================================================
  // SHIPPING
  // =========================================================

  const shippingFee = useMemo(() => {
    const amountAfterDiscount = Math.max(subtotal - discount, 0);

    if (deliveryMethod === "standard") {
      return amountAfterDiscount >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING;
    }

    return EXPRESS_SHIPPING;
  }, [subtotal, discount, deliveryMethod]);

  // =========================================================
  // TAX / VAT
  // =========================================================

  const taxableAmount = Math.max(subtotal - discount, 0);

  const taxAmount = useMemo(() => {
    if (!TAX_RATE) {
      return 0;
    }

    return Math.round((taxableAmount * TAX_RATE) / 100);
  }, [taxableAmount]);

  // =========================================================
  // TOTAL
  // =========================================================

  const total = Math.max(subtotal - discount + shippingFee + taxAmount, 0);

  // =========================================================
  // DELIVERY METHOD
  // =========================================================

  const selectedDeliveryMethod =
    deliveryMethod === "express"
      ? {
          name: "Express Delivery",
          estimate: "1–2 business days",
          fee: EXPRESS_SHIPPING,
        }
      : {
          name: "Standard Delivery",
          estimate: "2–5 business days",
          fee: shippingFee,
        };

  // =========================================================
  // APPLY COUPON
  // =========================================================

  const applyCoupon = () => {
    setCouponError("");

    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    const coupon = COUPONS[normalizedCode];

    if (!coupon) {
      setCouponError("Invalid coupon code.");
      return;
    }

    if (subtotal < coupon.minAmount) {
      setCouponError(
        `Minimum order amount is Rs. ${coupon.minAmount.toLocaleString()}.`,
      );
      return;
    }

    const couponData = {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
    };

    setAppliedCoupon(couponData);

    localStorage.setItem(COUPON_KEY, JSON.stringify(couponData));

    toast.success(`Coupon ${coupon.code} applied successfully.`);
  };

  // =========================================================
  // REMOVE COUPON
  // =========================================================

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");

    localStorage.removeItem(COUPON_KEY);

    toast.success("Coupon removed.");
  };

  // =========================================================
  // VALIDATE CART STOCK
  // =========================================================

  const validateStock = () => {
    for (const item of cart) {
      const quantity = Number(item.quantity || 1);

      const stock =
        item.stock === undefined || item.stock === null
          ? null
          : Number(item.stock);

      if (stock !== null && quantity > stock) {
        toast.error(
          `${item.name} has only ${stock} item${
            stock === 1 ? "" : "s"
          } available.`,
        );

        return false;
      }

      if (item.available === false) {
        toast.error(`${item.name} is currently unavailable.`);

        return false;
      }
    }

    return true;
  };

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    if (!user) {
      toast.error("Please login first.");
      return false;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return false;
    }

    if (!validateStock()) {
      return false;
    }

    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email.trim())) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number.");
      return false;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      toast.error("Please enter a valid 10 digit phone number.");
      return false;
    }

    if (!formData.address.trim()) {
      toast.error("Please enter your delivery address.");
      return false;
    }

    if (!formData.city.trim()) {
      toast.error("Please enter your city.");
      return false;
    }

    if (!formData.paymentMethod) {
      toast.error("Please select a payment method.");
      return false;
    }

    if (!deliveryMethod) {
      toast.error("Please select a delivery method.");
      return false;
    }

    if (!termsAccepted) {
      toast.error("Please accept the Terms & Conditions.");
      return false;
    }

    if (!privacyAccepted) {
      toast.error("Please accept the Privacy and Return Policy.");
      return false;
    }

    return true;
  };

  // =========================================================
  // UPDATE USER
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

    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

    setUser(updatedUser);

    window.dispatchEvent(new Event("authUpdated"));
  };

  // =========================================================
  // CREATE ORDER
  // =========================================================

  const createOrder = () => {
    if (!user) {
      toast.error("Please login first.");
      return;
    }

    const now = new Date().toISOString();

    const order = {
      id: `WC-${Date.now()}`,

      userId: user.id || user.email,

      customer: {
        id: user.id || user.email,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim(),
        note: formData.note.trim(),
      },

      paymentMethod: formData.paymentMethod,

      deliveryMethod: {
        type: deliveryMethod,
        name: selectedDeliveryMethod.name,
        estimate: selectedDeliveryMethod.estimate,
      },

      items: cart.map((item) => ({
        ...item,
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
      })),

      coupon: appliedCoupon
        ? {
            ...appliedCoupon,
            discount,
          }
        : null,

      subtotal,

      discount,

      shippingFee,

      taxRate: TAX_RATE,

      taxAmount,

      total,

      status:
        formData.paymentMethod === "online" ? "Payment Pending" : "Pending",

      paymentStatus:
        formData.paymentMethod === "online" ? "Pending" : "Cash on Delivery",

      createdAt: now,

      updatedAt: now,
    };

    return order;
  };

  // =========================================================
  // SAVE ORDER
  // =========================================================

  const saveOrder = (order) => {
    const existingOrders = readStorageArray(ORDERS_KEY);

    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify([order, ...existingOrders]),
    );

    window.dispatchEvent(new Event("ordersUpdated"));
  };

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);

    setCart([]);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // =========================================================
  // OPEN CONFIRMATION
  // =========================================================

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setShowConfirmationModal(true);
  };

  // =========================================================
  // CONFIRM + PLACE ORDER
  // =========================================================

  const confirmAndPlaceOrder = async () => {
    if (loading) {
      return;
    }

    if (!validateForm()) {
      setShowConfirmationModal(false);
      return;
    }

    setLoading(true);

    try {
      const order = createOrder();

      if (!order) {
        throw new Error("Unable to create order.");
      }

      // -----------------------------------------------------
      // ONLINE PAYMENT
      // -----------------------------------------------------

      if (formData.paymentMethod === "online") {
        setShowConfirmationModal(false);

        setLoading(false);

        navigate("/payment", {
          state: {
            order,
            cart,
            user,
            formData,
            subtotal,
            discount,
            shippingFee,
            taxAmount,
            total,
            appliedCoupon,
            deliveryMethod,
          },
        });

        return;
      }

      // -----------------------------------------------------
      // COD
      // -----------------------------------------------------

      saveOrder(order);

      updateUserInformation();

      clearCart();

      localStorage.removeItem(COUPON_KEY);

      setAppliedCoupon(null);

      setShowConfirmationModal(false);

      toast.success("Order placed successfully! 🎉");

      navigate("/order-success", {
        state: {
          order,
        },
      });
    } catch (error) {
      console.error("Order placement error:", error);

      toast.error("Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // PAGE LOADING
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

        {/* MAIN FORM */}

        <form
          onSubmit={handlePlaceOrder}
          className="mt-8 grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8"
        >
          {/* LEFT */}

          <div className="space-y-6">
            {/* DELIVERY INFORMATION */}

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
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Delivery Information
                    </h2>

                    <p className="text-sm text-gray-500">
                      Choose or add your delivery address.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openNewAddress}
                  className="hidden sm:inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  <FaPlus />
                  Add Address
                </button>
              </div>

              {/* SAVED ADDRESSES */}

              {addresses.length > 0 && (
                <div className="mt-6 space-y-3">
                  {addresses.map((address) => {
                    const selected = selectedAddressId === address.id;

                    return (
                      <div
                        key={address.id}
                        className={`border rounded-2xl p-4 transition ${
                          selected
                            ? "border-pink-500 bg-pink-50"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={selected}
                            onChange={() => selectAddress(address)}
                            className="mt-1 accent-pink-600"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-gray-900">
                                {address.label || "Address"}
                              </p>

                              {address.isDefault && (
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                                  DEFAULT
                                </span>
                              )}
                            </div>

                            <p className="text-sm font-medium text-gray-800 mt-2">
                              {address.name}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {address.address}
                            </p>

                            <p className="text-sm text-gray-500">
                              {address.city} {address.postalCode}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              {address.phone}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => openEditAddress(address)}
                                className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-pink-600"
                              >
                                <FaEdit />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteAddress(address.id)}
                                className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                              >
                                <FaTrash />
                                Delete
                              </button>

                              {!address.isDefault && (
                                <button
                                  type="button"
                                  onClick={() => setDefaultAddress(address.id)}
                                  className="text-xs text-pink-600 hover:text-pink-700"
                                >
                                  Make Default
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={openNewAddress}
                className="sm:hidden mt-4 w-full inline-flex items-center justify-center gap-2 border border-pink-200 text-pink-600 px-4 py-3 rounded-xl text-sm font-semibold"
              >
                <FaPlus />
                Add New Address
              </button>

              {/* CONTACT DETAILS */}

              <div className="border-t border-gray-100 mt-6 pt-6">
                <h3 className="font-semibold text-gray-900">Contact Details</h3>

                {/* NAME */}

                <div className="mt-4">
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
                      className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>

                {/* EMAIL */}

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
                      autoComplete="email"
                      className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>

                {/* PHONE */}

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
                      autoComplete="tel"
                      className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>

                {/* ADDRESS */}

                <div className="mt-5">
                  <label className="text-sm font-medium text-gray-700">
                    Delivery Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="House no, street, area..."
                    autoComplete="street-address"
                    className="mt-2 w-full border border-gray-200 rounded-xl p-4 outline-none resize-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                {/* CITY + POSTAL */}

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
                      autoComplete="address-level2"
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
                      autoComplete="postal-code"
                      className="mt-2 w-full border border-gray-200 rounded-xl py-3.5 px-4 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                    />
                  </div>
                </div>

                {/* NOTE */}

                <div className="mt-5">
                  <label className="text-sm font-medium text-gray-700">
                    Order Note
                    <span className="text-gray-400 font-normal">
                      {" "}
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any special delivery instructions?"
                    className="mt-2 w-full border border-gray-200 rounded-xl p-4 outline-none resize-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>
            </motion.div>

            {/* DELIVERY METHOD */}

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
                delay: 0.05,
              }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-7"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                  <FaTruck />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Delivery Method
                  </h2>

                  <p className="text-sm text-gray-500">
                    Choose how you want your order delivered.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {/* STANDARD */}

                <label
                  className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition ${
                    deliveryMethod === "standard"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="standard"
                    checked={deliveryMethod === "standard"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="accent-pink-600"
                  />

                  <FaTruck className="text-pink-600 text-xl" />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Standard Delivery
                    </p>

                    <p className="text-sm text-gray-500">2–5 business days</p>
                  </div>

                  <span className="font-semibold text-gray-900">
                    {shippingFee === 0 ? "FREE" : `Rs. ${STANDARD_SHIPPING}`}
                  </span>
                </label>

                {/* EXPRESS */}

                <label
                  className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition ${
                    deliveryMethod === "express"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="express"
                    checked={deliveryMethod === "express"}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="accent-pink-600"
                  />

                  <FaTruck className="text-blue-600 text-xl" />

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Express Delivery
                    </p>

                    <p className="text-sm text-gray-500">1–2 business days</p>
                  </div>

                  <span className="font-semibold text-gray-900">
                    Rs. {EXPRESS_SHIPPING}
                  </span>
                </label>
              </div>
            </motion.div>

            {/* PAYMENT */}

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
                {/* COD */}

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

                {/* ONLINE */}

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
                      Continue to secure payment.
                    </p>
                  </div>
                </label>
              </div>
            </motion.div>
          </div>

          {/* RIGHT */}

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

              {/* PRODUCTS */}

              <div className="mt-5 space-y-4 max-h-[330px] overflow-y-auto pr-1">
                {cart.map((item) => {
                  const quantity = Number(item.quantity || 1);

                  const itemTotal = Number(item.price || 0) * quantity;

                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl bg-gray-100"
                        />

                        <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-[10px] min-w-5 h-5 rounded-full flex items-center justify-center px-1">
                          {quantity}
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
                          Rs. {itemTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* COUPON */}

              <div className="mt-5">
                <label className="text-sm font-semibold text-gray-800">
                  Coupon Code
                </label>

                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />

                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      placeholder="Enter coupon"
                      disabled={Boolean(appliedCoupon)}
                      className="w-full border border-gray-200 rounded-xl py-3 pl-9 pr-3 text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:bg-gray-50"
                    />
                  </div>

                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="px-4 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {couponError && (
                  <p className="mt-2 text-xs text-red-500">{couponError}</p>
                )}

                {!appliedCoupon && (
                  <p className="mt-2 text-xs text-gray-400">
                    Try: WOOL10, SAVE200 or WELCOME
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 my-5" />

              {/* SUBTOTAL */}

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span className="font-medium text-gray-900">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              {/* DISCOUNT */}

              {discount > 0 && (
                <div className="flex justify-between mt-3 text-green-600">
                  <span>Discount</span>

                  <span className="font-medium">
                    - Rs. {discount.toLocaleString()}
                  </span>
                </div>
              )}

              {/* SHIPPING */}

              <div className="flex justify-between mt-3 text-gray-600">
                <span className="flex items-center gap-2">
                  <FaTruck className="text-pink-600" />
                  Shipping
                </span>

                <span className="font-medium text-gray-900">
                  {shippingFee === 0
                    ? "FREE"
                    : `Rs. ${shippingFee.toLocaleString()}`}
                </span>
              </div>

              {/* TAX */}

              {taxAmount > 0 && (
                <div className="flex justify-between mt-3 text-gray-600">
                  <span>Tax / VAT ({TAX_RATE}%)</span>

                  <span className="font-medium text-gray-900">
                    Rs. {taxAmount.toLocaleString()}
                  </span>
                </div>
              )}

              {/* FREE SHIPPING MESSAGE */}

              {shippingFee > 0 && deliveryMethod === "standard" && (
                <p className="mt-3 text-xs text-gray-500">
                  Add Rs.{" "}
                  {Math.max(
                    FREE_SHIPPING_THRESHOLD - Math.max(subtotal - discount, 0),
                    0,
                  ).toLocaleString()}{" "}
                  more for free standard delivery.
                </p>
              )}

              {/* DELIVERY ESTIMATE */}

              <div className="mt-4 bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <FaTruck className="text-pink-600" />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedDeliveryMethod.name}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Estimated delivery: {selectedDeliveryMethod.estimate}
                    </p>
                  </div>
                </div>
              </div>

              {/* TOTAL */}

              <div className="border-t border-gray-100 my-5 pt-5 flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-gray-900">Total</span>

                  <p className="text-xs text-gray-400 mt-1">
                    Final amount payable
                  </p>
                </div>

                <span className="text-2xl font-bold text-pink-600">
                  Rs. {total.toLocaleString()}
                </span>
              </div>

              {/* AGREEMENTS */}

              <div className="space-y-3 mb-5">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 accent-pink-600"
                  />

                  <span className="text-xs text-gray-600 leading-5">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      target="_blank"
                      className="text-pink-600 font-medium hover:underline"
                    >
                      Terms & Conditions
                    </Link>
                    .
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAccepted}
                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                    className="mt-1 accent-pink-600"
                  />

                  <span className="text-xs text-gray-600 leading-5">
                    I agree to the{" "}
                    <Link
                      to="/privacy"
                      target="_blank"
                      className="text-pink-600 font-medium hover:underline"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/returns"
                      target="_blank"
                      className="text-pink-600 font-medium hover:underline"
                    >
                      Return Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* PLACE ORDER */}

              <button
                type="submit"
                disabled={loading || !termsAccepted || !privacyAccepted}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />

                    {formData.paymentMethod === "online"
                      ? "Continue to Payment"
                      : "Place Order"}
                  </>
                )}
              </button>

              {/* SECURITY */}

              <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FaShieldAlt className="text-green-500" />
                  Secure & trusted checkout
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FaTruck className="text-pink-500" />
                  Reliable delivery
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </div>

      {/* =====================================================
          ADDRESS MODAL
      ===================================================== */}

      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 py-6 overflow-y-auto">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingAddressId ? "Edit Address" : "Add New Address"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Save your delivery address.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="w-9 h-9 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={saveAddress} className="mt-6 space-y-4">
              {/* LABEL */}

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Address Label
                </label>

                <select
                  name="label"
                  value={addressForm.label}
                  onChange={handleAddressChange}
                  className="mt-2 w-full border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-pink-500"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* NAME */}

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={addressForm.name}
                  onChange={handleAddressChange}
                  placeholder="Full name"
                  className="mt-2 w-full border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-pink-500"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={addressForm.phone}
                  onChange={handleAddressChange}
                  placeholder="98XXXXXXXX"
                  maxLength={10}
                  className="mt-2 w-full border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-pink-500"
                />
              </div>

              {/* ADDRESS */}

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={addressForm.address}
                  onChange={handleAddressChange}
                  rows={3}
                  placeholder="House no, street, area..."
                  className="mt-2 w-full border border-gray-200 rounded-xl p-4 outline-none resize-none focus:border-pink-500"
                />
              </div>

              {/* CITY + POSTAL */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    placeholder="Kathmandu"
                    className="mt-2 w-full border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Postal Code
                  </label>

                  <input
                    type="text"
                    name="postalCode"
                    value={addressForm.postalCode}
                    onChange={handleAddressChange}
                    placeholder="44600"
                    className="mt-2 w-full border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* BUTTONS */}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold"
                >
                  {editingAddressId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* =====================================================
          ORDER CONFIRMATION MODAL
      ===================================================== */}

      {showConfirmationModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-4 py-6 overflow-y-auto">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 md:p-8"
          >
            <div className="w-14 h-14 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto">
              <FaCheckCircle className="text-2xl" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900 text-center">
              Confirm Your Order
            </h2>

            <p className="mt-2 text-sm text-gray-500 text-center">
              Please review your order before continuing.
            </p>

            {/* TOTAL BOX */}

            <div className="mt-6 bg-gray-50 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between gap-4">
                <span className="text-sm text-gray-500">Subtotal</span>

                <span className="text-sm font-semibold text-gray-900">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-green-600">Discount</span>

                  <span className="text-sm font-semibold text-green-600">
                    - Rs. {discount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4">
                <span className="text-sm text-gray-500">Shipping</span>

                <span className="text-sm font-semibold text-gray-900">
                  {shippingFee === 0
                    ? "FREE"
                    : `Rs. ${shippingFee.toLocaleString()}`}
                </span>
              </div>

              {taxAmount > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-sm text-gray-500">Tax</span>

                  <span className="text-sm font-semibold text-gray-900">
                    Rs. {taxAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 flex justify-between gap-4">
                <span className="font-bold text-gray-900">Total</span>

                <span className="text-xl font-bold text-pink-600">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* DELIVERY */}

            <div className="mt-5 bg-pink-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-pink-600 mt-1" />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Deliver to
                  </p>

                  <p className="text-xs text-gray-600 mt-1 leading-5">
                    {formData.name}
                    <br />
                    {formData.address}
                    <br />
                    {formData.city} {formData.postalCode}
                    <br />
                    {formData.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* PAYMENT + DELIVERY */}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Payment</p>

                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {formData.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400">Delivery</p>

                <p className="text-sm font-semibold text-gray-900 mt-1">
                  {selectedDeliveryMethod.name}
                </p>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmationModal(false)}
                disabled={loading}
                className="border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl font-semibold transition"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={confirmAndPlaceOrder}
                disabled={loading}
                className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm
                    <FaCheckCircle />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

export default Checkout;
