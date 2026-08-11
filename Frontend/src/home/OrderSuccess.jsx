import React from "react";
import { Link } from "react-router-dom";
import {
  FaCheck,
  FaHome,
  FaShoppingBag,
  FaTruck,
  FaBoxOpen,
} from "react-icons/fa";
import { motion } from "framer-motion";

function OrderSuccess() {
  const order = JSON.parse(localStorage.getItem("woolcraft-last-order"));

  const orderId = order?.orderId || "WC-000000";
  const customerName = order?.customer?.name || "Customer";
  const total = order?.total || 0;
  const paymentMethod = order?.paymentMethod || "cod";

  return (
    <section className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center py-10 md:py-16">
      <div className="max-w-4xl mx-auto w-full px-4">
        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          {/* Top Success Section */}
          <div className="text-center px-5 py-10 md:py-14">
            {/* Animated Check */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 180,
              }}
              className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-500 text-white rounded-full flex items-center justify-center">
                <FaCheck className="text-2xl md:text-3xl" />
              </div>
            </motion.div>

            <p className="mt-6 text-pink-600 font-semibold">WOOLCRAFT NEPAL</p>

            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
              Order Placed Successfully! 🎉
            </h1>

            <p className="mt-3 text-gray-500 max-w-lg mx-auto">
              Thank you,{" "}
              <span className="font-semibold text-gray-800">
                {customerName}
              </span>
              ! Your handmade wool craft order has been received successfully.
            </p>

            {/* Order ID */}
            <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 bg-gray-50 border border-gray-200 px-5 py-3 rounded-xl">
              <span className="text-sm text-gray-500">Order ID:</span>

              <span className="font-bold text-pink-600">{orderId}</span>
            </div>
          </div>

          {/* Order Info */}
          <div className="border-t border-gray-100 px-5 py-7 md:px-8">
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Status */}
              <div className="bg-pink-50 rounded-2xl p-4">
                <FaBoxOpen className="text-pink-600 text-xl" />

                <p className="mt-3 text-xs text-gray-500">Order Status</p>

                <p className="mt-1 font-semibold text-gray-900">Pending</p>
              </div>

              {/* Payment */}
              <div className="bg-green-50 rounded-2xl p-4">
                <FaCheck className="text-green-600 text-xl" />

                <p className="mt-3 text-xs text-gray-500">Payment</p>

                <p className="mt-1 font-semibold text-gray-900">
                  {paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </p>
              </div>

              {/* Total */}
              <div className="bg-purple-50 rounded-2xl p-4">
                <FaShoppingBag className="text-purple-600 text-xl" />

                <p className="mt-3 text-xs text-gray-500">Order Total</p>

                <p className="mt-1 font-semibold text-gray-900">
                  Rs. {total.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="border-t border-gray-100 px-5 py-7 md:px-8">
            <h2 className="text-xl font-bold text-gray-900">What's Next?</h2>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-5">
              {/* Step 1 */}
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                  <FaCheck />
                </div>

                <h3 className="mt-3 text-sm font-semibold">Order Received</h3>

                <p className="mt-1 text-xs text-gray-500">
                  Your order is confirmed.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                  <FaBoxOpen />
                </div>

                <h3 className="mt-3 text-sm font-semibold">Preparing</h3>

                <p className="mt-1 text-xs text-gray-500">
                  We prepare your handmade item.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                  <FaTruck />
                </div>

                <h3 className="mt-3 text-sm font-semibold">Shipped</h3>

                <p className="mt-1 text-xs text-gray-500">
                  Your package is on the way.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center">
                  <FaHome />
                </div>

                <h3 className="mt-3 text-sm font-semibold">Delivered</h3>

                <p className="mt-1 text-xs text-gray-500">
                  Enjoy your handmade craft!
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
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

          {/* Footer Message */}
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
