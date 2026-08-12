import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaQuestionCircle,
  FaShoppingBag,
  FaTruck,
  FaCreditCard,
  FaUndo,
  FaUser,
  FaShoppingCart,
  FaEnvelope,
  FaPhone,
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaHeadset,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaTicketAlt,
} from "react-icons/fa";

function Help() {
  const [openFaq, setOpenFaq] = useState(null);

  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    issue: "",
  });

  const [ticketNumber, setTicketNumber] = useState("");

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();

    if (
      !ticketForm.name.trim() ||
      !ticketForm.email.trim() ||
      !ticketForm.issue.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    const ticket = "WC-" + Math.floor(100000 + Math.random() * 900000);

    setTicketNumber(ticket);

    setTicketForm({
      name: "",
      email: "",
      issue: "",
    });
  };

  const helpCategories = [
    {
      icon: <FaShoppingBag />,
      title: "Order Help",
      description: "Track, manage and get support for your orders.",
      link: "/orders",
    },
    {
      icon: <FaTruck />,
      title: "Delivery Help",
      description: "Shipping and delivery related information.",
      link: "/shipping-policy",
    },
    {
      icon: <FaCreditCard />,
      title: "Payment Help",
      description: "Payment methods and transaction support.",
      link: "/contact",
    },
    {
      icon: <FaUndo />,
      title: "Return & Refund",
      description: "Learn about return and refund policies.",
      link: "/return-refund-policy",
    },
    {
      icon: <FaUser />,
      title: "Account Help",
      description: "Manage your WoolCraft account.",
      link: "/login",
    },
    {
      icon: <FaShoppingCart />,
      title: "Cart Help",
      description: "Get help with your shopping cart.",
      link: "/cart",
    },
  ];

  const faqs = [
    {
      question: "How can I place an order?",
      answer:
        "Browse products, add items to your cart, proceed to checkout and complete payment.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery usually takes 2–7 business days within Nepal depending on location.",
    },
    {
      question: "What payment methods are available?",
      answer:
        "Available payment methods depend on your checkout configuration.",
    },
    {
      question: "Can I cancel my order?",
      answer: "Orders can be cancelled before production or shipping starts.",
    },
    {
      question: "Can I return a product?",
      answer: "Return eligibility depends on product condition and order type.",
    },
    {
      question: "Do you accept custom orders?",
      answer: "Yes. We create customized wool flowers, bouquets and gifts.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can contact us through email, phone, WhatsApp or the contact page.",
    },
    {
      question: "Can I track my order?",
      answer:
        "Yes. You can view available order information from your account.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
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
              Find answers to common questions about orders, payment, delivery,
              returns, refunds and support.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK HELP */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <p className="text-pink-600 text-sm font-bold uppercase tracking-widest">
              Quick Help
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              What do you need help with?
            </h2>

            <p className="mt-3 text-gray-500">Choose a topic below.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10">
            {helpCategories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-pink-100 hover:-translate-y-1 transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl group-hover:bg-pink-600 group-hover:text-white transition">
                  {category.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  {category.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500 leading-6">
                  {category.description}
                </p>

                <div className="mt-4 text-pink-600 text-sm font-semibold flex items-center gap-2">
                  Learn More
                  <FaArrowRight className="text-xs" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center">
              <FaQuestionCircle className="text-2xl" />
            </div>

            <h2 className="mt-5 text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>

            <p className="mt-3 text-gray-500">
              Find quick answers to common questions.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl border ${
                    isOpen ? "border-pink-200 shadow-sm" : "border-gray-100"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-5 flex justify-between items-center text-left"
                  >
                    <span className="font-semibold text-gray-800">
                      {faq.question}
                    </span>

                    <span className="text-gray-400">
                      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5">
                      <p className="text-gray-500 leading-7">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT SUPPORT */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Contact Support
            </h2>

            <p className="mt-3 text-gray-500">
              Need additional help? Reach our support team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-10">
            {/* SUPPORT INFO */}
            <div className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">
                Support Channels
              </h3>

              <div className="mt-6 space-y-5">
                <a
                  href="mailto:hello@woolcraftnepal.com"
                  className="flex items-center gap-3 text-gray-700 hover:text-pink-600"
                >
                  <FaEnvelope />
                  hello@woolcraftnepal.com
                </a>

                <a
                  href="tel:+9779862460586"
                  className="flex items-center gap-3 text-gray-700 hover:text-pink-600"
                >
                  <FaPhone />
                  +977 9862460586
                </a>

                <a
                  href="https://wa.me/9779862460586"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-green-600 font-semibold"
                >
                  <FaWhatsapp />
                  WhatsApp Support
                </a>

                <div className="flex items-center gap-3 text-gray-700">
                  <FaMapMarkerAlt />
                  Kathmandu, Nepal
                </div>
              </div>
            </div>

            {/* TICKET SYSTEM */}
            <div className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">
                Complaint / Ticket System
              </h3>

              <form onSubmit={handleTicketSubmit} className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={ticketForm.name}
                  onChange={(e) =>
                    setTicketForm({
                      ...ticketForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={ticketForm.email}
                  onChange={(e) =>
                    setTicketForm({
                      ...ticketForm,
                      email: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <textarea
                  rows="5"
                  placeholder="Describe your issue"
                  value={ticketForm.issue}
                  onChange={(e) =>
                    setTicketForm({
                      ...ticketForm,
                      issue: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-3"
                />

                <button
                  type="submit"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Submit Ticket
                </button>
              </form>

              {ticketNumber && (
                <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 font-bold text-green-700">
                    <FaTicketAlt />
                    Ticket Generated
                  </div>

                  <p className="mt-2 text-green-700">
                    Ticket Number:
                    <span className="font-bold ml-2">{ticketNumber}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Help;
