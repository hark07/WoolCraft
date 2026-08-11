import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./home/Home";
import Products from "./components/Products";
import ProductDetails from "./home/ProductDetails";
import Cart from "./home/Cart";
import Checkout from "./home/Checkout";
import OrderSuccess from "./home/OrderSuccess";
import Wishlist from "./home/Wishlist";
import Orders from "./home/Orders";
import Settings from "./home/Settings";
import Login from "./home/Login";
import Account from "./home/Account";
import Register from "./home/Register";
import About from "./home/About";
import Contact from "./home/Contact";
import Help from "./home/Help";

function App() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Products */}
          <Route path="/products" element={<Products />} />

          {/* Product Details */}
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/orders" element={<Orders />} />

          <Route path="/settings" element={<Settings />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/account" element={<Account />} />

          <Route path="/about" element={<About />} />
          
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/help" element={<Help />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
