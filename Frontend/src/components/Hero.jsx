import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaStar, FaGift, FaTruck, FaHeart } from "react-icons/fa";
import assets from "../assets/assets";

function Hero() {

  return (
    <section className="overflow-hidden bg-gradient-to-b from-pink-50 via-white to-white">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium">
              <FaStar />
              Handmade with Love in Nepal
            </div>

            {/* Heading */}
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Beautiful Handmade
              <span className="block text-pink-600">Wool Crafts</span>
              For Every Occasion
            </h1>

            {/* Description */}
            <p className="mt-5 text-gray-600 text-base md:text-lg leading-relaxed max-w-xl">
              Discover beautiful handmade wool flowers, dolls, bouquets, hampers
              and customized gifts crafted with passion and creativity for your
              special moments.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                Shop Now
                <FaArrowRight />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="border-2 border-pink-600 text-pink-600 px-6 py-3 rounded-xl font-semibold hover:bg-pink-50"
              >
                Custom Order
              </motion.button>
            </div>

            {/* Features */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              <motion.div whileHover={{ y: -4 }} className="text-center">
                <div className="flex justify-center text-pink-600 text-2xl">
                  <FaGift />
                </div>
                <p className="mt-2 text-sm font-medium">Handmade Gifts</p>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="text-center">
                <div className="flex justify-center text-pink-600 text-2xl">
                  <FaTruck />
                </div>
                <p className="mt-2 text-sm font-medium">Fast Delivery</p>
              </motion.div>

              <motion.div whileHover={{ y: -4 }} className="text-center">
                <div className="flex justify-center text-pink-600 text-2xl">
                  <FaHeart />
                </div>
                <p className="mt-2 text-sm font-medium">Made With Love</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <div className="relative">
              <img
                src={assets.woolCraftHero}
                alt="WoolCraft Nepal"
                className="w-full h-[320px] md:h-[500px] object-cover rounded-3xl shadow-2xl"
              />

              {/* Floating Customer Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.8,
                  duration: 0.5,
                }}
                className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-white shadow-xl rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-pink-100 p-3 rounded-full">
                    <FaStar className="text-pink-600" />
                  </div>

                  <div>
                    <h4 className="font-bold text-lg">500+</h4>
                    <p className="text-sm text-gray-500">Happy Customers</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Order Card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 1,
                  duration: 0.5,
                }}
                className="absolute top-4 right-4 md:top-8 md:right-8 bg-white shadow-xl rounded-2xl px-4 py-3"
              >
                <p className="text-sm text-gray-500">Custom Orders</p>
                <h3 className="font-bold text-pink-600">50+</h3>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
