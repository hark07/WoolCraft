import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaWhatsapp,
  FaArrowLeft,
  FaQuestionCircle,
  FaShoppingBag,
} from "react-icons/fa";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    // Demo submit
    // Replace this section with your backend/API later.
    setTimeout(() => {
      toast.success("Message sent successfully! 🎉");

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setLoading(false);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="bg-gradient-to-br from-pink-50 via-white to-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              <FaEnvelope />
              WoolCraft Nepal
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
              Contact <span className="text-pink-600">Us</span>
            </h1>

            <p className="mt-5 text-gray-600 text-base md:text-lg leading-8">
              Have a question about our products, orders, delivery, or anything
              else? We would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT CONTENT
      ===================================================== */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* =================================================
                CONTACT INFORMATION
            ================================================= */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">
                  Get in Touch
                </h2>

                <p className="mt-3 text-gray-500 leading-7">
                  Our team is here to help you with your WoolCraft shopping
                  experience.
                </p>

                {/* EMAIL */}
                <div className="mt-8 flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <FaEnvelope />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Email</p>

                    <a
                      href="mailto:hello@woolcraftnepal.com"
                      className="mt-1 block text-sm font-semibold text-gray-800 hover:text-pink-600 break-all"
                    >
                      hello@woolcraftnepal.com
                    </a>
                  </div>
                </div>

                {/* PHONE */}
                <div className="mt-6 flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <FaPhone />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Phone</p>

                    <a
                      href="tel:+9779800000000"
                      className="mt-1 block text-sm font-semibold text-gray-800 hover:text-pink-600"
                    >
                      +977 9800000000
                    </a>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="mt-6 flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Location</p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      Kathmandu, Nepal
                    </p>
                  </div>
                </div>

                {/* HOURS */}
                <div className="mt-6 flex gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <FaClock />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Support Hours</p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      Sun - Fri
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      10:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>

                {/* WHATSAPP */}
                <a
                  href="https://wa.me/9779800000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FaWhatsapp className="text-xl" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* =================================================
                CONTACT FORM
            ================================================= */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8">
                <div>
                  <p className="text-pink-600 text-sm font-bold uppercase tracking-widest">
                    Send a Message
                  </p>

                  <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
                    How can we help?
                  </h2>

                  <p className="mt-3 text-gray-500">
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  {/* NAME + EMAIL */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* NAME */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                      />
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                      />
                    </div>
                  </div>

                  {/* PHONE + SUBJECT */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* PHONE */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="98XXXXXXXX"
                        className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                      />
                    </div>

                    {/* SUBJECT */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Subject <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                      />
                    </div>
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Message <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                      rows="6"
                      className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none resize-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto min-w-[180px] bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white px-7 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          HELP SECTION
      ===================================================== */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-3xl p-7 md:p-10">
            <div className="text-center max-w-2xl mx-auto">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
                <FaQuestionCircle className="text-2xl" />
              </div>

              <h2 className="mt-5 text-2xl md:text-3xl font-bold text-gray-900">
                Need Help With Your Order?
              </h2>

              <p className="mt-3 text-gray-500 leading-7">
                If you have questions about products, delivery, payment,
                returns, or your order, our support team is ready to help.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-pink-300 text-gray-700 hover:text-pink-600 px-5 py-3 rounded-xl font-semibold transition"
                >
                  <FaShoppingBag />
                  My Orders
                </Link>

                <a
                  href="mailto:hello@woolcraftnepal.com"
                  className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                >
                  <FaEnvelope />
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}
      <section className="bg-pink-600">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Looking for something special?
              </h2>

              <p className="mt-2 text-pink-100">
                Explore our handmade wool collection.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-pink-600 hover:bg-pink-50 px-6 py-3.5 rounded-xl font-bold transition"
            >
              Browse Products
              <FaArrowLeft className="rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
