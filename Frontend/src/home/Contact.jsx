import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaWhatsapp,
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
  const [ticketNumber, setTicketNumber] = useState("");

  const now = new Date();
  const currentHour = now.getHours();
  const isOpen = currentHour >= 10 && currentHour < 18;

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

    const ticket = "WC-" + Math.floor(100000 + Math.random() * 900000);

    setTicketNumber(ticket);

    setTimeout(() => {
      toast.success(`Message sent successfully! Ticket #${ticket}`);

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
      {/* HERO */}
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
              else? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* CONTACT INFO */}
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
                  <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <FaEnvelope />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Email</p>

                    <a
                      href="mailto:hello@woolcraftnepal.com"
                      className="mt-1 block text-sm font-semibold text-gray-800 hover:text-pink-600"
                    >
                      hello@woolcraftnepal.com
                    </a>
                  </div>
                </div>

                {/* PHONE */}
                <div className="mt-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <FaPhone />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Phone</p>

                    <a
                      href="tel:+9779862460586"
                      className="mt-1 block text-sm font-semibold text-gray-800 hover:text-pink-600"
                    >
                      +977 9862460586
                    </a>
                  </div>
                </div>

                {/* ADDRESS */}
                <div className="mt-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <FaMapMarkerAlt />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Business Address</p>

                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      WoolCraft
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Kathmandu, Nepal
                    </p>
                  </div>
                </div>

                {/* BUSINESS HOURS */}
                <div className="mt-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                    <FaClock />
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Business Hours</p>

                    <p
                      className={`mt-1 text-sm font-bold ${
                        isOpen ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {isOpen ? "Open Now" : "Closed Now"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Sun - Fri | 10:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>

                {/* WHATSAPP */}
                <a
                  href="https://wa.me/9779862460586"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 transition"
                >
                  <FaWhatsapp className="text-xl" />
                  Chat on WhatsApp
                </a>

                {/* GOOGLE MAP */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
                  <iframe
                    title="WoolCraft Nepal"
                    src="https://maps.google.com/maps?q=Kathmandu,Nepal&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* CONTACT FORM */}
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
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Full Name
                        <span className="text-red-500"> *</span>
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-3.5 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email Address
                        <span className="text-red-500"> *</span>
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

                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Subject
                        <span className="text-red-500"> *</span>
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
                      Message
                      <span className="text-red-500"> *</span>
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

                  {/* SUBMIT BUTTON */}
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

                  {/* TICKET NUMBER */}
                  {ticketNumber && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <h4 className="font-bold text-green-700">
                        Support Ticket Generated
                      </h4>

                      <p className="mt-2 text-green-600 font-medium">
                        Ticket Number: {ticketNumber}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Please save this ticket number for future communication
                        with our support team.
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;
