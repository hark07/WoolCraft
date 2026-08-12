import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14">
        {/* Top Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-pink-500">
              WoolCraft Nepal
            </h2>

            <p className="mt-4 text-gray-400 leading-relaxed">
              Handmade wool flowers, dolls, bouquets, gift hampers, and
              customized gifts crafted with love and creativity.
            </p>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition"
              >
                <FaInstagram />
              </a>

              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition"
              >
                <FaTiktok />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-5">Quick Links</h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link to="/" className="hover:text-pink-500 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/products" className="hover:text-pink-500 transition">
                  Products
                </Link>
              </li>

              <li>
                <Link
                  to="/custom-order"
                  className="hover:text-pink-500 transition"
                >
                  Custom Order
                </Link>
              </li>

              <li>
                <Link to="/wishlist" className="hover:text-pink-500 transition">
                  Wishlist
                </Link>
              </li>

              <li>
                <Link to="/contact" className="hover:text-pink-500 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-semibold mb-5">Categories</h3>

            <ul className="space-y-3 text-gray-400">
              <li>🌸 Wool Flowers</li>
              <li>🧸 Wool Dolls</li>
              <li>🎁 Gift Hampers</li>
              <li>💐 Bouquets</li>
              <li>👜 Accessories</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-5">Contact Us</h3>

            <div className="space-y-4 text-gray-400">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-pink-500 mt-1" />
                <p>Kathmandu, Nepal</p>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-pink-500" />
                <p>+977 98XXXXXXXX</p>
              </div>

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-pink-500" />
                <p>info@woolcraftnepal.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 border-t border-gray-800 pt-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} WoolCraft Nepal. All Rights Reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/privacy-policy"
                className="hover:text-pink-500 transition"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms-and-conditions"
                className="hover:text-pink-500 transition"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/return-refund-policy"
                className="hover:text-pink-500 transition"
              >
                Return & Refund Policy
              </Link>

              <Link
                to="/shipping-policy"
                className="hover:text-pink-500 transition"
              >
                Shipping Policy
              </Link>

              <Link
                to="/cancellation-policy"
                className="hover:text-pink-500 transition"
              >
                Cancellation Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
