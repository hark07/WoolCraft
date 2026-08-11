import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaCheck,
  FaHome,
  FaShoppingBag,
  FaTruck,
  FaBoxOpen,
  FaClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function OrderSuccess() {
  const location = useLocation();

  // =========================================================
  // ORDER
  // =========================================================

  const [order, setOrder] = useState(
    location.state?.order || null,
  );

  // =========================================================
  // ANIMATED ORDER STEP
  // =========================================================

  const [activeStep, setActiveStep] = useState(0);

  // =========================================================
  // LOAD ORDER
  // =========================================================

  useEffect(() => {
    // First priority:
    // Order passed from Checkout using navigate state
    if (location.state?.order) {
      setOrder(location.state.order);

      // Also save it so refresh still works
      localStorage.setItem(
        "woolcraft-last-order",
        JSON.stringify(location.state.order),
      );

      return;
    }

    // Fallback:
    // Load last order from localStorage
    try {
      const savedOrder = JSON.parse(
        localStorage.getItem("woolcraft-last-order") || "null",
      );

      if (savedOrder) {
        setOrder(savedOrder);
      }
    } catch (error) {
      console.error("Last order loading error:", error);
    }
  }, [location.state]);

  // =========================================================
  // ANIMATE ORDER TIMELINE
  // =========================================================

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setActiveStep(1);
    }, 1400);

    const timer2 = setTimeout(() => {
      setActiveStep(2);
    }, 3000);

    const timer3 = setTimeout(() => {
      setActiveStep(3);
    }, 4600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // =========================================================
  // ORDER DATA
  // =========================================================

  const orderId =
    order?.id ||
    order?.orderId ||
    "WC-000000";

  const customerName =
    order?.customer?.name ||
    "Customer";

  const total = Number(order?.total || 0);

  const paymentMethod =
    order?.paymentMethod || "cod";

  const orderStatus =
    order?.status || "Pending";

  // =========================================================
  // TIMELINE DATA
  // =========================================================

  const steps = [
    {
      title: "Order Received",
      description: "Your order has been confirmed.",
      icon: FaCheck,
    },
    {
      title: "Preparing",
      description: "We are preparing your handmade item.",
      icon: FaBoxOpen,
    },
    {
      title: "Shipped",
      description: "Your package is on the way.",
      icon: FaTruck,
    },
    {
      title: "Delivered",
      description: "Enjoy your beautiful handmade craft!",
      icon: FaHome,
    },
  ];

  // =========================================================
  // ANIMATION VARIANTS
  // =========================================================

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },

    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    },
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white flex items-center py-10 md:py-16">

      <div className="max-w-4xl mx-auto w-full px-4">

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
        >

          {/* =================================================
              SUCCESS HEADER
          ================================================= */}

          <div className="text-center px-5 py-10 md:py-14">

            {/* Animated Check */}

            <motion.div
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 180,
                damping: 10,
              }}
              className="relative mx-auto w-24 h-24 md:w-28 md:h-28"
            >

              {/* Outer pulse */}

              <motion.div
                animate={{
                  scale: [1, 1.18, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 bg-green-200 rounded-full"
              />

              {/* Main circle */}

              <div className="relative w-full h-full bg-green-100 rounded-full flex items-center justify-center">

                <motion.div
                  initial={{
                    scale: 0,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    delay: 0.5,
                    type: "spring",
                    stiffness: 220,
                  }}
                  className="w-16 h-16 md:w-20 md:h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-md"
                >
                  <FaCheck className="text-2xl md:text-3xl" />
                </motion.div>

              </div>
            </motion.div>

            {/* BRAND */}

            <motion.p
              variants={itemVariants}
              className="mt-7 text-pink-600 font-semibold"
            >
              WOOLCRAFT NEPAL
            </motion.p>

            {/* TITLE */}

            <motion.h1
              variants={itemVariants}
              className="mt-2 text-3xl md:text-4xl font-bold text-gray-900"
            >
              Order Placed Successfully! 🎉
            </motion.h1>

            {/* MESSAGE */}

            <motion.p
              variants={itemVariants}
              className="mt-3 text-gray-500 max-w-lg mx-auto"
            >
              Thank you{" "}
              <span className="font-semibold text-gray-800">
                {customerName}
              </span>
              ! Your handmade wool craft order has been received
              successfully.
            </motion.p>

            {/* ORDER ID */}

            <motion.div
              variants={itemVariants}
              className="mt-6 inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 bg-gray-50 border border-gray-200 px-5 py-3 rounded-xl"
            >
              <span className="text-sm text-gray-500">
                Order ID:
              </span>

              <span className="font-bold text-pink-600">
                {orderId}
              </span>
            </motion.div>
          </div>

          {/* =================================================
              ORDER DETAILS
          ================================================= */}

          <motion.div
            variants={itemVariants}
            className="border-t border-gray-100 px-5 py-7 md:px-8"
          >
            <h2 className="text-xl font-bold text-gray-900">
              Order Details
            </h2>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* STATUS */}

              <motion.div
                whileHover={{
                  y: -4,
                  scale: 1.02,
                }}
                className="bg-pink-50 rounded-2xl p-4"
              >
                <FaBoxOpen className="text-pink-600 text-xl" />

                <p className="mt-3 text-xs text-gray-500">
                  Order Status
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {orderStatus}
                </p>
              </motion.div>

              {/* PAYMENT */}

              <motion.div
                whileHover={{
                  y: -4,
                  scale: 1.02,
                }}
                className="bg-green-50 rounded-2xl p-4"
              >
                <FaCheck className="text-green-600 text-xl" />

                <p className="mt-3 text-xs text-gray-500">
                  Payment
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </p>
              </motion.div>

              {/* TOTAL */}

              <motion.div
                whileHover={{
                  y: -4,
                  scale: 1.02,
                }}
                className="bg-purple-50 rounded-2xl p-4"
              >
                <FaShoppingBag className="text-purple-600 text-xl" />

                <p className="mt-3 text-xs text-gray-500">
                  Order Total
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  Rs. {total.toLocaleString()}
                </p>
              </motion.div>

            </div>
          </motion.div>

          {/* =================================================
              WHAT'S NEXT
          ================================================= */}

          <div className="border-t border-gray-100 px-5 py-8 md:px-8">

            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                What's Next?
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Follow your order journey from our workshop
                to your doorstep.
              </p>
            </div>

            {/* =================================================
                DESKTOP TIMELINE
            ================================================= */}

            <div className="hidden sm:block mt-10">

              <div className="relative">

                {/* BACKGROUND LINE */}

                <div className="absolute top-6 left-[12.5%] right-[12.5%] h-1 bg-gray-200 rounded-full" />

                {/* ANIMATED PROGRESS LINE */}

                <motion.div
                  initial={{
                    width: "0%",
                  }}
                  animate={{
                    width:
                      activeStep === 0
                        ? "0%"
                        : activeStep === 1
                        ? "33%"
                        : activeStep === 2
                        ? "66%"
                        : "100%",
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                  }}
                  className="absolute top-6 left-[12.5%] h-1 bg-pink-500 rounded-full"
                />

                {/* STEPS */}

                <div className="relative grid grid-cols-4">

                  {steps.map((step, index) => {
                    const Icon = step.icon;

                    const isCompleted =
                      index <= activeStep;

                    const isCurrent =
                      index === activeStep;

                    return (
                      <div
                        key={step.title}
                        className="relative flex flex-col items-center text-center"
                      >

                        {/* ICON */}

                        <motion.div
                          initial={{
                            scale: 0,
                            opacity: 0,
                          }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                          }}
                          transition={{
                            delay: 0.5 + index * 0.15,
                            type: "spring",
                            stiffness: 180,
                          }}
                          className="relative"
                        >

                          {/* CURRENT PULSE */}

                          {isCurrent && (
                            <motion.div
                              animate={{
                                scale: [1, 1.35, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 1.8,
                                repeat: Infinity,
                              }}
                              className="absolute inset-0 bg-pink-300 rounded-full"
                            />
                          )}

                          <motion.div
                            animate={
                              isCurrent
                                ? {
                                    y: [0, -4, 0],
                                  }
                                : {}
                            }
                            transition={
                              isCurrent
                                ? {
                                    duration: 1.4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }
                                : {}
                            }
                            className={`relative w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md transition-all duration-500 ${
                              isCompleted
                                ? "bg-pink-600 text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <Icon className="text-sm" />
                          </motion.div>
                        </motion.div>

                        {/* TITLE */}

                        <motion.h3
                          animate={
                            isCurrent
                              ? {
                                  scale: [1, 1.04, 1],
                                }
                              : {}
                          }
                          transition={{
                            duration: 1.5,
                            repeat: isCurrent
                              ? Infinity
                              : 0,
                          }}
                          className={`mt-4 text-sm font-semibold ${
                            isCompleted
                              ? "text-gray-900"
                              : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </motion.h3>

                        {/* DESCRIPTION */}

                        <p
                          className={`mt-1 text-xs max-w-[150px] ${
                            isCompleted
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          {step.description}
                        </p>

                        {/* CURRENT LABEL */}

                        <AnimatePresence>
                          {isCurrent && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                y: 5,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                                y: -5,
                              }}
                              className="mt-3 inline-flex items-center gap-1 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-[10px] font-semibold"
                            >
                              <FaClock className="text-[9px]" />

                              {index === 0
                                ? "Confirmed"
                                : index === 1
                                ? "Preparing"
                                : index === 2
                                ? "On the way"
                                : "Delivered"}
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    );
                  })}

                </div>
              </div>
            </div>

            {/* =================================================
                MOBILE TIMELINE
            ================================================= */}

            <div className="sm:hidden mt-8">

              <div className="relative">

                {/* VERTICAL LINE */}

                <div className="absolute left-6 top-6 bottom-6 w-1 bg-gray-200 rounded-full" />

                {/* ANIMATED VERTICAL LINE */}

                <motion.div
                  initial={{
                    height: "0%",
                  }}
                  animate={{
                    height:
                      activeStep === 0
                        ? "0%"
                        : activeStep === 1
                        ? "33%"
                        : activeStep === 2
                        ? "66%"
                        : "100%",
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                  }}
                  className="absolute left-6 top-6 w-1 bg-pink-500 rounded-full origin-top"
                />

                <div className="space-y-8">

                  {steps.map((step, index) => {
                    const Icon = step.icon;

                    const isCompleted =
                      index <= activeStep;

                    const isCurrent =
                      index === activeStep;

                    return (
                      <div
                        key={step.title}
                        className="relative flex items-start gap-5"
                      >

                        {/* ICON */}

                        <div className="relative z-10 shrink-0">

                          {isCurrent && (
                            <motion.div
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 1.8,
                                repeat: Infinity,
                              }}
                              className="absolute inset-0 bg-pink-300 rounded-full"
                            />
                          )}

                          <motion.div
                            animate={
                              isCurrent
                                ? {
                                    y: [0, -3, 0],
                                  }
                                : {}
                            }
                            transition={
                              isCurrent
                                ? {
                                    duration: 1.3,
                                    repeat: Infinity,
                                  }
                                : {}
                            }
                            className={`relative w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center ${
                              isCompleted
                                ? "bg-pink-600 text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <Icon />
                          </motion.div>

                        </div>

                        {/* TEXT */}

                        <div className="pt-1">

                          <h3
                            className={`font-semibold ${
                              isCompleted
                                ? "text-gray-900"
                                : "text-gray-400"
                            }`}
                          >
                            {step.title}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {step.description}
                          </p>

                          <AnimatePresence>
                            {isCurrent && (
                              <motion.div
                                initial={{
                                  opacity: 0,
                                  x: -5,
                                }}
                                animate={{
                                  opacity: 1,
                                  x: 0,
                                }}
                                exit={{
                                  opacity: 0,
                                }}
                                className="mt-2 inline-flex items-center gap-1 bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-[10px] font-semibold"
                              >
                                <FaClock className="text-[9px]" />

                                {index === 0
                                  ? "Confirmed"
                                  : index === 1
                                  ? "Preparing"
                                  : index === 2
                                  ? "On the way"
                                  : "Delivered"}
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>

          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="border-t border-gray-100 px-5 py-7 md:px-8">

            <div className="flex flex-col sm:flex-row gap-3">

              <Link
                to="/products"
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <FaShoppingBag />
                Continue Shopping
              </Link>

              <Link
                to="/"
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                <FaHome />
                Back to Home
              </Link>

            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div className="bg-pink-50 px-5 py-5 text-center">

            <p className="text-sm text-gray-600">
              Made with ❤️ by{" "}
              <span className="font-semibold text-pink-600">
                WoolCraft Nepal
              </span>
            </p>

          </div>

        </motion.div>
      </div>
    </section>
  );
}

export default OrderSuccess;
