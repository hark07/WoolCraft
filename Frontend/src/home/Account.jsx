import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaSignOutAlt,
  FaShoppingBag,
  FaHeart,
} from "react-icons/fa";

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("woolcraft-auth")) || false;

    const savedUser = JSON.parse(localStorage.getItem("woolcraft-user"));

    if (!auth || !savedUser) {
      navigate("/login");
      return;
    }

    setUser(savedUser);

    setForm({
      name: savedUser.name || "",
      email: savedUser.email || "",
      phone: savedUser.phone || "",
      address: savedUser.address || "",
    });
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill all information");
      return;
    }

    const updatedUser = {
      ...user,
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
    };

    localStorage.setItem("woolcraft-user", JSON.stringify(updatedUser));

    setUser(updatedUser);
    setEditing(false);

    window.dispatchEvent(new Event("authUpdated"));

    toast.success("Profile updated successfully");
  };

  const logout = () => {
    localStorage.removeItem("woolcraft-auth");

    window.dispatchEvent(new Event("authUpdated"));

    toast.success("Logged out successfully");

    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-7">
          <p className="text-pink-600 font-semibold">WOOLCRAFT NEPAL</p>

          <h1 className="mt-1 text-3xl md:text-4xl font-bold text-gray-900">
            My Account
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your account and delivery information.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                <FaUser className="text-4xl" />
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {user.name}
              </h2>

              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="mt-7 space-y-2">
              <Link
                to="/orders"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition"
              >
                <FaShoppingBag className="text-pink-600" />
                <span>My Orders</span>
              </Link>

              <Link
                to="/wishlist"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-pink-50 transition"
              >
                <FaHeart className="text-pink-600" />
                <span>My Wishlist</span>
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-5 md:p-7 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Account Information
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  This information will be used for your orders.
                </p>
              </div>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-xl text-sm font-semibold"
                >
                  <FaEdit />
                  Edit
                </button>
              )}
            </div>

            <div className="mt-7 grid md:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <div className="relative mt-2">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    disabled={!editing}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none disabled:bg-gray-50 focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>

                <div className="relative mt-2">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    disabled
                    className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <div className="relative mt-2">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    disabled={!editing}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none disabled:bg-gray-50 focus:border-pink-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Delivery Address
                </label>

                <div className="relative mt-2">
                  <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />

                  <textarea
                    name="address"
                    value={form.address}
                    disabled={!editing}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 outline-none resize-none disabled:bg-gray-50 focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Save */}
            {editing && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={saveProfile}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <FaSave />
                  Save Changes
                </button>

                <button
                  onClick={() => {
                    setEditing(false);

                    setForm({
                      name: user.name,
                      email: user.email,
                      phone: user.phone,
                      address: user.address,
                    });
                  }}
                  className="sm:w-32 border border-gray-200 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Account;
