import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaQuestionCircle,
  FaShoppingBag,
  FaTruck,
  FaCreditCard,
  FaUndo,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaEnvelope,
  FaPhone,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaHeadset,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Help() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const helpCategories = [
    {
      icon: <FaShoppingBag />,
      title: "Orders",
      description: "Check your orders and order status.",
      link: "/orders",
    },
    {
      icon: <FaTruck />,
      title: "Delivery",
      description: "Learn about delivery and shipping.",
      link: "/contact",
    },
    {
      icon: <FaCreditCard />,
      title: "Payment",
      description: "Get help with payment questions.",
      link: "/contact",
    },
    {
      icon: <FaUndo />,
      title: "Returns",
      description: "Questions about returns and refunds.",
      link: "/contact",
    },
    {
      icon: <FaUser />,
      title: "Account",
      description: "Manage your WoolCraft account.",
      link: "/login",
    },
    {
      icon: <FaShoppingCart />,
      title: "Cart",
      description: "Get help with your shopping cart.",
      link: "/cart",
    },
  ];

  const faqs = [
    {
      question: "How can I place an order?",
      answer:
        "Browse our products, select the product you want, choose the quantity, and add it to your cart. Then open your cart and continue to checkout to complete your order.",
    },
    {
      question: "Do I need an account to shop?",
      answer:
        "You can browse products without an account. However, creating an account helps you save your cart, manage orders, and access your account information more easily.",
    },
    {
      question: "How can I check my order?",
      answer:
        "After logging into your WoolCraft account, open My Orders from the account menu. You can use this section to view your available order information.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery time can vary depending on your location and the product. For the latest delivery information, please contact our support team before or after placing your order.",
    },
    {
      question: "What payment methods are available?",
      answer:
        "Available payment options may depend on your checkout setup. If you have questions about a specific payment method, please contact WoolCraft support.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Order cancellation depends on the current order status. Please contact our support team as soon as possible if you need to cancel or change an order.",
    },
    {
      question: "Can I return a product?",
      answer:
        "Return eligibility can depend on the product and its condition. Please contact support with your order details so we can guide you through the available options.",
    },
    {
      question: "How can I contact WoolCraft?",
      answer:
        "You can contact us through the Contact page. You can send us a message using the contact form or use the available email and phone support options.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="bg-gradient-to-br from-pink-50 via-white to-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <FaHeadset className="text-3xl" />
            </div>

            <p className="mt-6 text-pink-600 text-sm font-bold uppercase tracking-widest">
              WoolCraft Nepal
            </p>

            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-gray-900">
              Help & <span className="text-pink-600">Support</span>
            </h1>

            <p className="mt-5 text-gray-600 text-base md:text-lg leading-8">
              Find answers to common questions about your account, orders,
              delivery, payment, cart, wishlist, and more.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK HELP
      ===================================================== */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-pink-600 text-sm font-bold uppercase tracking-widest">
              Quick Help
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              What do you need help with?
            </h2>

            <p className="mt-3 text-gray-500">
              Choose a topic to quickly find the information you need.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-10">
            {helpCategories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group bg-white border border-gray-100 rounded-2xl md:rounded-3xl p-5 md:p-7 shadow-sm hover:shadow-lg hover:border-pink-100 hover:-translate-y-1 transition"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-xl md:text-2xl group-hover:bg-pink-600 group-hover:text-white transition">
                  {category.icon}
                </div>

                <h3 className="mt-5 text-base md:text-xl font-bold text-gray-900">
                  {category.title}
                </h3>

                <p className="mt-2 text-xs md:text-sm text-gray-500 leading-6">
                  {category.description}
                </p>

                <div className="mt-4 text-pink-600 text-sm font-semibold flex items-center gap-2">
                  Learn more
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}
      <section className="py-14 md:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <FaQuestionCircle className="text-2xl" />
            </div>

            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>

            <p className="mt-3 text-gray-500">
              Here are answers to some common WoolCraft questions.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl border transition ${
                    isOpen ? "border-pink-200 shadow-sm" : "border-gray-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 md:px-6 py-5 flex items-center justify-between gap-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 text-pink-600">
                        <FaQuestionCircle />
                      </span>

                      <span className="font-semibold text-gray-800">
                        {faq.question}
                      </span>
                    </div>

                    <span className="shrink-0 text-gray-400">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 md:px-6 pb-5">
                      <div className="ml-7 border-l-2 border-pink-100 pl-4">
                        <p className="text-sm md:text-base text-gray-500 leading-7">
                          {faq.answer}
                        </p>
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
          ACCOUNT HELP
      ===================================================== */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* ACCOUNT */}
            <div className="rounded-3xl bg-pink-50 border border-pink-100 p-7 md:p-9">
              <div className="w-14 h-14 rounded-2xl bg-white text-pink-600 flex items-center justify-center shadow-sm">
                <FaUser className="text-2xl" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                Account Help
              </h3>

              <p className="mt-3 text-gray-500 leading-7">
                Need to login, register, or manage your WoolCraft account? Start
                here.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  Login / Register
                  <FaArrowRight />
                </Link>

                <Link
                  to="/settings"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-pink-300 text-gray-700 hover:text-pink-600 px-5 py-3 rounded-xl font-semibold transition"
                >
                  Settings
                </Link>
              </div>
            </div>

            {/* ORDER */}
            <div className="rounded-3xl bg-gray-50 border border-gray-100 p-7 md:p-9">
              <div className="w-14 h-14 rounded-2xl bg-white text-pink-600 flex items-center justify-center shadow-sm">
                <FaShoppingBag className="text-2xl" />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-gray-900">
                Order Help
              </h3>

              <p className="mt-3 text-gray-500 leading-7">
                Check your orders or contact us if you have questions about
                delivery, cancellation, returns, or your order status.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  My Orders
                  <FaArrowRight />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-pink-300 text-gray-700 hover:text-pink-600 px-5 py-3 rounded-xl font-semibold transition"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT SUPPORT
      ===================================================== */}
      <section className="pb-14 md:pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-[2rem] bg-gradient-to-br from-pink-600 to-pink-500 p-8 md:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              {/* LEFT */}
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <FaHeadset className="text-2xl" />
                </div>

                <h2 className="mt-6 text-3xl md:text-4xl font-bold">
                  Still need help?
                </h2>

                <p className="mt-4 text-pink-100 leading-7 max-w-xl">
                  Can't find the answer you're looking for? Our support team is
                  happy to help you with your WoolCraft questions.
                </p>

                <Link
                  to="/contact"
                  className="mt-7 inline-flex items-center gap-2 bg-white text-pink-600 hover:bg-pink-50 px-6 py-3.5 rounded-xl font-bold transition"
                >
                  Contact Us
                  <FaArrowRight />
                </Link>
              </div>

              {/* RIGHT */}
              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href="mailto:hello@woolcraftnepal.com"
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-5 transition"
                >
                  <FaEnvelope className="text-2xl" />

                  <p className="mt-4 text-sm text-pink-100">Email Support</p>

                  <p className="mt-1 font-semibold break-all">
                    hello@woolcraftnepal.com
                  </p>
                </a>

                <a
                  href="tel:+9779800000000"
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-5 transition"
                >
                  <FaPhone className="text-2xl" />

                  <p className="mt-4 text-sm text-pink-100">Call Us</p>

                  <p className="mt-1 font-semibold">+977 9800000000</p>
                </a>

                <div className="sm:col-span-2 bg-white/10 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-xl" />

                    <div>
                      <p className="text-sm text-pink-100">Location</p>

                      <p className="font-semibold">Kathmandu, Nepal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM
      ===================================================== */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Need more information about WoolCraft products?
            </p>

            <Link
              to="/products"
              className="mt-3 inline-flex items-center gap-2 text-pink-600 font-bold hover:text-pink-700"
            >
              Explore Products
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Help;
