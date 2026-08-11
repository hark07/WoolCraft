import React from "react";
import { Link } from "react-router-dom";
import {
  FaGift,
  FaHeart,
  FaHandsHelping,
  FaLeaf,
  FaStar,
  FaArrowRight,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaCheckCircle,
} from "react-icons/fa";

function About() {
  const features = [
    {
      icon: <FaHandsHelping />,
      title: "Handmade with Love",
      description:
        "Every WoolCraft product is carefully made with patience, creativity, and love.",
    },
    {
      icon: <FaLeaf />,
      title: "Natural & Quality",
      description:
        "We focus on beautiful wool products with quality materials and thoughtful designs.",
    },
    {
      icon: <FaHeart />,
      title: "Made for You",
      description:
        "Our products are designed to bring warmth, comfort, and a special handmade feeling.",
    },
  ];

  const values = [
    "Authentic handmade wool products",
    "Carefully selected materials",
    "Beautiful and practical designs",
    "Support for local craftsmanship",
    "Friendly customer service",
    "Quality-focused products",
  ];

  return (
    <main className="bg-white">
      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-white to-pink-100">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
                <FaGift />
                WoolCraft Nepal
              </div>

              <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Handmade with{" "}
                <span className="text-pink-600">Love & Warmth</span>
              </h1>

              <p className="mt-6 text-gray-600 text-base md:text-lg leading-8 max-w-xl">
                Welcome to WoolCraft Nepal — a place where beautiful wool
                crafts, creativity, and traditional handmade skills come
                together.
              </p>

              <p className="mt-4 text-gray-500 leading-7 max-w-xl">
                We believe that handmade products are more than just products.
                They carry creativity, care, warmth, and the unique touch of the
                person who made them.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-pink-100"
                >
                  Shop Products
                  <FaArrowRight />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-pink-300 text-gray-700 hover:text-pink-600 px-6 py-3.5 rounded-xl font-semibold transition"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            <div className="relative">
              <div className="bg-white rounded-[2rem] shadow-2xl border border-pink-100 p-6 md:p-8">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto w-28 h-28 md:w-36 md:h-36 bg-white rounded-full shadow-lg flex items-center justify-center text-pink-600">
                      <FaGift className="text-5xl md:text-6xl" />
                    </div>

                    <h2 className="mt-7 text-2xl md:text-3xl font-bold text-gray-900">
                      WoolCraft
                    </h2>

                    <p className="mt-2 text-pink-600 font-semibold tracking-widest">
                      NEPAL
                    </p>

                    <p className="mt-4 text-gray-500 text-sm max-w-xs mx-auto">
                      Handmade wool crafts created with creativity and care.
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-5 -left-3 md:-left-8 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-4 flex items-center gap-3">
                <div className="w-11 h-11 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                  <FaHeart />
                </div>

                <div>
                  <p className="font-bold text-gray-900">Made with Love</p>
                  <p className="text-xs text-gray-500">Handcrafted in Nepal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR STORY
      ===================================================== */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* CARD */}
            <div className="bg-pink-50 rounded-[2rem] p-7 md:p-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <FaGift className="mx-auto text-3xl text-pink-600" />

                  <h3 className="mt-4 font-bold text-gray-900">Handmade</h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Crafted with care
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <FaHeart className="mx-auto text-3xl text-pink-600" />

                  <h3 className="mt-4 font-bold text-gray-900">Heartfelt</h3>

                  <p className="mt-1 text-xs text-gray-500">Made with love</p>
                </div>

                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <FaLeaf className="mx-auto text-3xl text-pink-600" />

                  <h3 className="mt-4 font-bold text-gray-900">Quality</h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Carefully selected
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                  <FaStar className="mx-auto text-3xl text-pink-600" />

                  <h3 className="mt-4 font-bold text-gray-900">Special</h3>

                  <p className="mt-1 text-xs text-gray-500">Unique designs</p>
                </div>
              </div>
            </div>

            {/* TEXT */}
            <div>
              <p className="text-pink-600 font-bold text-sm uppercase tracking-widest">
                Our Story
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
                Bringing Nepal's handmade spirit to your home
              </h2>

              <p className="mt-6 text-gray-600 leading-8">
                WoolCraft Nepal was created with a simple idea: to make
                beautiful handmade wool products accessible to everyone while
                celebrating the creativity behind handmade craftsmanship.
              </p>

              <p className="mt-4 text-gray-600 leading-8">
                From cozy wool creations to thoughtful handmade gifts, we want
                every WoolCraft product to feel personal, warm, and meaningful.
              </p>

              <p className="mt-4 text-gray-600 leading-8">
                Our goal is not only to sell products, but also to share the
                beauty of handmade work and create a shopping experience that
                customers can trust.
              </p>

              <div className="mt-7 flex items-center gap-3 text-gray-700">
                <FaMapMarkerAlt className="text-pink-600" />

                <span className="font-semibold">
                  Proudly connected with Nepal
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          WHAT WE BELIEVE
      ===================================================== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-pink-600 font-bold text-sm uppercase tracking-widest">
              What We Believe
            </p>

            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
              More than just wool crafts
            </h2>

            <p className="mt-4 text-gray-500 leading-7">
              We care about craftsmanship, quality, creativity, and the people
              who make and enjoy handmade products.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-gray-500 leading-7">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR VALUES
      ===================================================== */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-pink-600 font-bold text-sm uppercase tracking-widest">
                Our Promise
              </p>

              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
                Why choose WoolCraft?
              </h2>

              <p className="mt-5 text-gray-500 leading-8">
                We want every customer to feel confident when choosing a
                WoolCraft product. That's why we focus on quality, thoughtful
                design, and a friendly shopping experience.
              </p>

              <div className="mt-7 grid sm:grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
                  >
                    <FaCheckCircle className="text-pink-600 mt-0.5 shrink-0" />

                    <span className="text-sm font-medium text-gray-700">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-600 to-pink-500 rounded-[2rem] p-8 md:p-10 text-white shadow-xl">
              <FaStar className="text-4xl text-pink-100" />

              <h3 className="mt-6 text-2xl md:text-3xl font-bold">
                Handmade feels different.
              </h3>

              <p className="mt-5 text-pink-50 leading-8">
                Every handmade item has its own character. When you choose
                WoolCraft, you are choosing something created with attention,
                creativity, and care.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FaHeart />
                </div>

                <div>
                  <p className="font-bold">Thank you for supporting</p>
                  <p className="text-sm text-pink-100">
                    handmade craftsmanship
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SHOP CTA
      ===================================================== */}
      <section className="pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-[2rem] bg-gradient-to-r from-pink-50 to-pink-100 p-8 md:p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm text-pink-600 flex items-center justify-center">
              <FaShoppingBag className="text-2xl" />
            </div>

            <h2 className="mt-6 text-3xl md:text-4xl font-bold text-gray-900">
              Ready to discover WoolCraft?
            </h2>

            <p className="mt-4 max-w-xl mx-auto text-gray-500 leading-7">
              Explore our collection of handmade wool crafts and find something
              special for yourself or someone you love.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3.5 rounded-xl font-semibold transition"
              >
                Explore Products
                <FaArrowRight />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-pink-300 text-gray-700 hover:text-pink-600 px-6 py-3.5 rounded-xl font-semibold transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
