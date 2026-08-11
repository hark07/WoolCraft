import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaCreditCard,
  FaLock,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

function Payment() {
  const navigate = useNavigate();

  // =========================
  // PAYMENT FORM STATE
  // =========================
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [loading, setLoading] = useState(false);
  const [flipped, setFlipped] = useState(false);

  // =========================
  // CARD NUMBER FORMAT
  // =========================
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);

    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  // =========================
  // CARD TYPE
  // =========================
  const getCardType = () => {
    const number = cardNumber.replace(/\s/g, "");

    if (number.startsWith("4")) {
      return "VISA";
    }

    if (number.startsWith("5")) {
      return "MASTERCARD";
    }

    return "CARD";
  };

  // =========================
  // EXPIRY FORMAT
  // =========================
  const formatExpiry = (value) => {
    let cleaned = value.replace(/\D/g, "").slice(0, 4);

    if (cleaned.length > 2) {
      cleaned = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    }

    return cleaned;
  };

  // =========================
  // PAYMENT
  // =========================
  const handlePayment = () => {
    // Card holder validation
    if (!cardHolder.trim()) {
      toast.error("Enter card holder name");
      return;
    }

    // Card number validation
    const cleanCardNumber = cardNumber.replace(/\s/g, "");

    if (cleanCardNumber.length !== 16) {
      toast.error("Invalid card number");
      return;
    }

    // Expiry validation
    if (!expiry.trim()) {
      toast.error("Enter expiry date");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      toast.error("Enter valid expiry date");
      return;
    }

    const [month] = expiry.split("/");

    if (Number(month) < 1 || Number(month) > 12) {
      toast.error("Invalid expiry month");
      return;
    }

    // CVV validation
    if (cvv.length < 3) {
      toast.error("Invalid CVV");
      return;
    }

    setLoading(true);

    // Demo payment processing
    setTimeout(() => {
      try {
        const pendingOrder = JSON.parse(localStorage.getItem("pending-order"));

        if (pendingOrder) {
          const existingOrders =
            JSON.parse(localStorage.getItem("woolcraft-orders")) || [];

          const newOrder = {
            ...pendingOrder,

            paymentMethod: "online",
            paymentStatus: "paid",

            // Demo payment details
            cardType: getCardType(),
            cardLast4: cleanCardNumber.slice(-4),

            paidAt: new Date().toISOString(),
          };

          existingOrders.unshift(newOrder);

          localStorage.setItem(
            "woolcraft-orders",
            JSON.stringify(existingOrders),
          );

          localStorage.removeItem("pending-order");

          window.dispatchEvent(new Event("ordersUpdated"));
        }

        toast.success("Payment Successful");

        navigate("/order-success");
      } catch (error) {
        console.error("Payment Error:", error);

        toast.error("Payment Failed");
      }

      setLoading(false);
    }, 2500);
  };

  // =========================
  // CARD DISPLAY VALUES
  // =========================
  const displayCardNumber = cardNumber || "**** **** **** ****";

  const displayHolder = cardHolder || "YOUR NAME";

  const displayExpiry = expiry || "MM/YY";

  const displayCvv = cvv || "***";

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* =========================
            BACK BUTTON
        ========================== */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-pink-600 font-medium mb-8 hover:text-pink-700 transition"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* ==================================================
              LEFT SIDE - CARD PREVIEW
          =================================================== */}
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            <div className="lg:sticky lg:top-10">
              {/* CARD CONTAINER */}
              <div
                className="w-full max-w-[430px] h-[260px] mx-auto"
                style={{
                  perspective: "1200px",
                }}
              >
                <motion.div
                  animate={{
                    rotateY: flipped ? 180 : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                  className="relative w-full h-full"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* ==================================================
                      FRONT OF CARD
                  =================================================== */}
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden text-white shadow-2xl"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",

                      background:
                        "linear-gradient(135deg, #ec4899 0%, #d946ef 50%, #7c3aed 100%)",
                    }}
                  >
                    {/* Decorative circles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute -top-24 -right-20 w-64 h-64 rounded-full bg-white opacity-10" />

                      <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-white opacity-10" />

                      <div className="absolute top-20 right-20 w-20 h-20 rounded-full border border-white opacity-10" />
                    </div>

                    <div className="relative h-full p-7 md:p-8 flex flex-col">
                      {/* Top */}
                      <div className="flex justify-between items-center">
                        <div className="text-4xl">
                          <FaCreditCard />
                        </div>

                        <div className="text-2xl font-bold tracking-widest">
                          {getCardType()}
                        </div>
                      </div>

                      {/* Chip */}
                      <div className="mt-5">
                        <div className="w-12 h-9 rounded-md bg-yellow-200/80 border border-yellow-300/60 relative overflow-hidden">
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-yellow-600/30" />

                          <div className="absolute top-1/2 left-0 right-0 h-px bg-yellow-600/30" />

                          <div className="absolute inset-2 border border-yellow-600/20 rounded" />
                        </div>
                      </div>

                      {/* Card Number */}
                      <div className="mt-5">
                        <p className="text-xl md:text-2xl tracking-[3px] font-semibold whitespace-nowrap">
                          {displayCardNumber}
                        </p>
                      </div>

                      {/* Bottom */}
                      <div className="mt-auto flex justify-between items-end">
                        {/* Holder */}
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase opacity-70 tracking-wider">
                            Card Holder
                          </p>

                          <p className="font-semibold text-base md:text-lg uppercase truncate max-w-[220px]">
                            {displayHolder}
                          </p>
                        </div>

                        {/* Expiry */}
                        <div className="text-right">
                          <p className="text-[10px] uppercase opacity-70 tracking-wider">
                            Expires
                          </p>

                          <p className="font-semibold text-base md:text-lg">
                            {displayExpiry}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ==================================================
                      BACK OF CARD
                  =================================================== */}
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden text-white shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {/* Magnetic stripe */}
                    <div className="mt-7 h-14 bg-black w-full" />

                    <div className="px-7 mt-7">
                      {/* CVV stripe */}
                      <div className="flex items-center">
                        <div className="bg-gray-100 h-11 rounded-l-md flex-1" />

                        <div className="bg-white text-black h-11 min-w-[70px] rounded-r-md flex items-center justify-center px-3">
                          <span className="font-bold text-lg tracking-widest">
                            {displayCvv}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 mt-2">
                        SECURITY CODE (CVV)
                      </p>

                      <p className="text-xs text-gray-500 mt-5 max-w-[300px]">
                        This is a demo payment card for WoolCraft Nepal.
                      </p>

                      <div className="flex justify-end mt-7">
                        <span className="text-2xl font-bold tracking-widest">
                          {getCardType()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* =========================
                  SECURE PAYMENT BOX
              ========================== */}
              <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm max-w-[430px] mx-auto">
                <div className="flex items-center gap-2 text-green-600">
                  <FaCheckCircle />

                  <span className="font-semibold">Secure Payment</span>
                </div>

                <p className="text-sm text-gray-500 mt-3">
                  This is a demo payment page for your WoolCraft Nepal project.
                </p>

                {/* Demo card */}
                <div className="mt-5 space-y-2 text-sm text-gray-600">
                  <p>
                    Test Visa:
                    <strong className="text-gray-900 ml-1">
                      4111 1111 1111 1111
                    </strong>
                  </p>

                  <p>
                    Expiry:
                    <strong className="text-gray-900 ml-1">12/30</strong>
                  </p>

                  <p>
                    CVV:
                    <strong className="text-gray-900 ml-1">123</strong>
                  </p>
                </div>

                <p className="text-xs text-gray-400 mt-5">
                  Click the CVV field to view the back of the card.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ==================================================
              RIGHT SIDE - PAYMENT FORM
          =================================================== */}
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="bg-white rounded-3xl shadow-sm p-6 md:p-8"
          >
            {/* Heading */}
            <h1 className="text-3xl font-bold text-gray-900">Online Payment</h1>

            <p className="mt-2 text-gray-500">Complete your order securely.</p>

            <div className="mt-8 space-y-5">
              {/* =========================
                  CARD HOLDER
              ========================== */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Card Holder Name
                </label>

                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="cc-name"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                />
              </div>

              {/* =========================
                  CARD NUMBER
              ========================== */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Card Number
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(e) => {
                    setCardNumber(formatCardNumber(e.target.value));
                  }}
                  placeholder="4111 1111 1111 1111"
                  autoComplete="cc-number"
                  maxLength={19}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 tracking-wider"
                />

                <p className="text-xs text-gray-400 mt-2">
                  {cardNumber.replace(/\s/g, "").length}
                  /16 digits
                </p>
              </div>

              {/* =========================
                  EXPIRY + CVV
              ========================== */}
              <div className="grid grid-cols-2 gap-4">
                {/* EXPIRY */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Expiry Date
                  </label>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={expiry}
                    onChange={(e) => {
                      setExpiry(formatExpiry(e.target.value));
                    }}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    maxLength={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    CVV
                  </label>

                  <input
                    type="password"
                    inputMode="numeric"
                    value={cvv}
                    onFocus={() => setFlipped(true)}
                    onBlur={() => setFlipped(false)}
                    onChange={(e) => {
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4));
                    }}
                    placeholder="123"
                    autoComplete="cc-csc"
                    maxLength={4}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>

              {/* =========================
                  SECURITY BOX
              ========================== */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <div className="flex items-center gap-2">
                  <FaLock className="text-green-600" />

                  <span className="font-semibold text-gray-800">
                    Secure Checkout
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Your payment information is encrypted and secure.
                </p>
              </div>

              {/* =========================
                  PAYMENT BUTTON
              ========================== */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white py-4 rounded-xl font-semibold transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-pink-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </span>
                ) : (
                  "Pay Now"
                )}
              </button>

              {/* Demo notice */}
              <p className="text-center text-xs text-gray-400">
                Demo payment — no real money will be charged.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Payment;
