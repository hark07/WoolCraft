import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FaUser,
  FaMapMarkerAlt,
  FaBell,
  FaBoxOpen,
  FaLock,
  FaShieldAlt,
  FaTrash,
  FaSignOutAlt,
  FaSave,
  FaChevronRight,
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaEdit,
} from "react-icons/fa";

function Settings() {
  const navigate = useNavigate();

  // ==========================================
  // USER DATA
  // ==========================================

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // ==========================================
  // DELIVERY ADDRESS
  // ==========================================

  const [address, setAddress] = useState({
    province: "",
    district: "",
    city: "",
    ward: "",
    street: "",
    landmark: "",
  });

  // ==========================================
  // NOTIFICATION SETTINGS
  // ==========================================

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    deliveryUpdates: true,
    offers: false,
  });

  // ==========================================
  // ORDER SETTINGS
  // ==========================================

  const [orderSettings, setOrderSettings] = useState({
    saveAddress: true,
    orderConfirmation: true,
  });

  // ==========================================
  // PASSWORD
  // ==========================================

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ==========================================
  // ACTIVE SECTION
  // ==========================================

  const [activeSection, setActiveSection] = useState("account");

  // ==========================================
  // LOAD SAVED DATA
  // ==========================================

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("woolcraft-user")) || {};

    const savedAddress =
      JSON.parse(localStorage.getItem("woolcraft-address")) || {};

    const savedNotifications =
      JSON.parse(localStorage.getItem("woolcraft-notifications")) || {};

    const savedOrderSettings =
      JSON.parse(localStorage.getItem("woolcraft-order-settings")) || {};

    setUser((prev) => ({
      ...prev,
      ...savedUser,
    }));

    setAddress((prev) => ({
      ...prev,
      ...savedAddress,
    }));

    setNotifications((prev) => ({
      ...prev,
      ...savedNotifications,
    }));

    setOrderSettings((prev) => ({
      ...prev,
      ...savedOrderSettings,
    }));
  }, []);

  // ==========================================
  // USER INPUT
  // ==========================================

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // ADDRESS INPUT
  // ==========================================

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // NOTIFICATION INPUT
  // ==========================================

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;

    setNotifications((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // ==========================================
  // ORDER SETTINGS INPUT
  // ==========================================

  const handleOrderSettingChange = (e) => {
    const { name, checked } = e.target;

    setOrderSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // ==========================================
  // SAVE ACCOUNT
  // ==========================================

  const saveAccount = () => {
    localStorage.setItem("woolcraft-user", JSON.stringify(user));

    window.dispatchEvent(new Event("userUpdated"));

    toast.success("Account information updated ✓");
  };

  // ==========================================
  // SAVE ADDRESS
  // ==========================================

  const saveAddress = () => {
    localStorage.setItem("woolcraft-address", JSON.stringify(address));

    window.dispatchEvent(new Event("addressUpdated"));

    toast.success("Delivery address updated ✓");
  };

  // ==========================================
  // SAVE NOTIFICATIONS
  // ==========================================

  const saveNotifications = () => {
    localStorage.setItem(
      "woolcraft-notifications",
      JSON.stringify(notifications),
    );

    toast.success("Notification settings updated ✓");
  };

  // ==========================================
  // SAVE ORDER SETTINGS
  // ==========================================

  const saveOrderSettings = () => {
    localStorage.setItem(
      "woolcraft-order-settings",
      JSON.stringify(orderSettings),
    );

    toast.success("Order preferences updated ✓");
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handleChangePassword = () => {
    if (
      !password.current ||
      !password.newPassword ||
      !password.confirmPassword
    ) {
      toast.error("Please fill all password fields");
      return;
    }

    if (password.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    /*
      Frontend only.

      Backend आएपछि actual password API
      यहाँबाट call गर्ने।
    */

    localStorage.setItem(
      "woolcraft-password",
      JSON.stringify({
        password: password.newPassword,
      }),
    );

    setPassword({
      current: "",
      newPassword: "",
      confirmPassword: "",
    });

    toast.success("Password updated successfully ✓");
  };

  // ==========================================
  // CLEAR DATA
  // ==========================================

  const clearLocalData = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to clear your WoolCraft local data?",
    );

    if (!confirmDelete) return;

    localStorage.removeItem("woolcraft-cart");
    localStorage.removeItem("woolcraft-wishlist");
    localStorage.removeItem("woolcraft-orders");
    localStorage.removeItem("woolcraft-user");
    localStorage.removeItem("woolcraft-address");
    localStorage.removeItem("woolcraft-notifications");
    localStorage.removeItem("woolcraft-order-settings");

    window.dispatchEvent(new Event("cartUpdated"));
    window.dispatchEvent(new Event("wishlistUpdated"));
    window.dispatchEvent(new Event("ordersUpdated"));
    window.dispatchEvent(new Event("userUpdated"));

    toast.success("All local data cleared");

    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("woolcraft-user");

    window.dispatchEvent(new Event("userUpdated"));

    toast.success("Logged out successfully");

    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  // ==========================================
  // MENU
  // ==========================================

  const menuItems = [
    {
      id: "account",
      title: "Account Information",
      description: "Name, email & phone",
      icon: FaUser,
    },
    {
      id: "address",
      title: "Delivery Address",
      description: "Where we deliver your order",
      icon: FaMapMarkerAlt,
    },
    {
      id: "notifications",
      title: "Notifications",
      description: "Order & delivery updates",
      icon: FaBell,
    },
    {
      id: "orders",
      title: "Order Preferences",
      description: "Manage order settings",
      icon: FaBoxOpen,
    },
    {
      id: "security",
      title: "Security",
      description: "Password & account security",
      icon: FaLock,
    },
    {
      id: "privacy",
      title: "Privacy & Data",
      description: "Manage your local data",
      icon: FaShieldAlt,
    },
  ];

  return (
    <section className="min-h-screen bg-gray-50 py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* ==========================================
            HEADER
        ========================================== */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-600"
          >
            <FaArrowLeft />
            Back to Home
          </Link>

          <div className="mt-5">
            <p className="text-pink-600 font-semibold text-sm">
              WOOLCRAFT NEPAL
            </p>

            <h1 className="mt-1 text-3xl md:text-4xl font-bold text-gray-900">
              My Account
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your profile, delivery address and orders.
            </p>
          </div>
        </motion.div>

        {/* ==========================================
            MAIN
        ========================================== */}

        <div className="mt-7 grid lg:grid-cols-[290px_1fr] gap-6">
          {/* ========================================
              SIDEBAR
          ======================================== */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 h-fit">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 scrollbar-hide">
              {menuItems.map((item) => {
                const Icon = item.icon;

                const active = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`min-w-[175px] lg:min-w-0 w-full flex items-center gap-3 p-3 rounded-xl text-left transition ${
                      active
                        ? "bg-pink-50 text-pink-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        active ? "bg-pink-100" : "bg-gray-100"
                      }`}
                    >
                      <Icon />
                    </span>

                    <span className="flex-1">
                      <span className="block text-sm font-semibold">
                        {item.title}
                      </span>

                      <span className="hidden lg:block text-xs text-gray-400 mt-0.5">
                        {item.description}
                      </span>
                    </span>

                    <FaChevronRight className="hidden lg:block text-xs text-gray-300" />
                  </button>
                );
              })}
            </div>

            {/* Desktop Logout */}

            <div className="hidden lg:block mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-red-500 hover:bg-red-50 transition"
              >
                <span className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <FaSignOutAlt />
                </span>

                <span className="font-semibold text-sm">Logout</span>
              </button>
            </div>
          </div>

          {/* ========================================
              CONTENT
          ======================================== */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-7">
            {/* ======================================
                ACCOUNT INFORMATION
            ====================================== */}

            {activeSection === "account" && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <SectionHeader
                  icon={FaUser}
                  title="Account Information"
                  description="Update the information used for your orders."
                />

                <div className="mt-7 grid md:grid-cols-2 gap-5">
                  <Input
                    label="Full Name"
                    name="name"
                    value={user.name}
                    onChange={handleUserChange}
                    placeholder="Your full name"
                  />

                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleUserChange}
                    placeholder="example@email.com"
                  />

                  <Input
                    label="Phone Number"
                    name="phone"
                    value={user.phone}
                    onChange={handleUserChange}
                    placeholder="98XXXXXXXX"
                  />
                </div>

                <div className="mt-7 flex justify-end">
                  <SaveButton onClick={saveAccount} />
                </div>
              </motion.div>
            )}

            {/* ======================================
                DELIVERY ADDRESS
            ====================================== */}

            {activeSection === "address" && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <SectionHeader
                  icon={FaMapMarkerAlt}
                  title="Delivery Address"
                  description="This address can be used during checkout."
                />

                <div className="mt-7 grid md:grid-cols-2 gap-5">
                  <SelectInput
                    label="Province"
                    name="province"
                    value={address.province}
                    onChange={handleAddressChange}
                    options={[
                      "Koshi Province",
                      "Madhesh Province",
                      "Bagmati Province",
                      "Gandaki Province",
                      "Lumbini Province",
                      "Karnali Province",
                      "Sudurpashchim Province",
                    ]}
                  />

                  <Input
                    label="District"
                    name="district"
                    value={address.district}
                    onChange={handleAddressChange}
                    placeholder="e.g. Kaski"
                  />

                  <Input
                    label="City / Municipality"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="e.g. Pokhara"
                  />

                  <Input
                    label="Ward Number"
                    name="ward"
                    value={address.ward}
                    onChange={handleAddressChange}
                    placeholder="e.g. 8"
                  />

                  <Input
                    label="Street / Tole"
                    name="street"
                    value={address.street}
                    onChange={handleAddressChange}
                    placeholder="Street or Tole"
                  />

                  <Input
                    label="Landmark"
                    name="landmark"
                    value={address.landmark}
                    onChange={handleAddressChange}
                    placeholder="Nearby landmark (optional)"
                  />
                </div>

                <div className="mt-6 p-4 bg-pink-50 rounded-xl">
                  <div className="flex gap-3">
                    <FaMapMarkerAlt className="text-pink-600 mt-1" />

                    <div>
                      <p className="font-semibold text-gray-800">
                        Delivery Address Preview
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {address.street || "Street / Tole"},{" "}
                        {address.city || "City"},{" "}
                        {address.district || "District"}
                        {address.ward && ` - Ward ${address.ward}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex justify-end">
                  <SaveButton onClick={saveAddress} />
                </div>
              </motion.div>
            )}

            {/* ======================================
                NOTIFICATIONS
            ====================================== */}

            {activeSection === "notifications" && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <SectionHeader
                  icon={FaBell}
                  title="Notifications"
                  description="Choose which updates you want to receive."
                />

                <div className="mt-7 divide-y divide-gray-100">
                  <Toggle
                    title="Order Updates"
                    description="Get updates when your order is confirmed or prepared."
                    name="orderUpdates"
                    checked={notifications.orderUpdates}
                    onChange={handleNotificationChange}
                  />

                  <Toggle
                    title="Delivery Updates"
                    description="Receive shipping and delivery notifications."
                    name="deliveryUpdates"
                    checked={notifications.deliveryUpdates}
                    onChange={handleNotificationChange}
                  />

                  <Toggle
                    title="Special Offers"
                    description="Receive discounts, new product and special offer notifications."
                    name="offers"
                    checked={notifications.offers}
                    onChange={handleNotificationChange}
                  />
                </div>

                <div className="mt-7 flex justify-end">
                  <SaveButton onClick={saveNotifications} />
                </div>
              </motion.div>
            )}

            {/* ======================================
                ORDER PREFERENCES
            ====================================== */}

            {activeSection === "orders" && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <SectionHeader
                  icon={FaBoxOpen}
                  title="Order Preferences"
                  description="Manage your checkout and order preferences."
                />

                <div className="mt-7 divide-y divide-gray-100">
                  <Toggle
                    title="Save Delivery Address"
                    description="Automatically use your saved address during checkout."
                    name="saveAddress"
                    checked={orderSettings.saveAddress}
                    onChange={handleOrderSettingChange}
                  />

                  <Toggle
                    title="Order Confirmation"
                    description="Show confirmation after successfully placing an order."
                    name="orderConfirmation"
                    checked={orderSettings.orderConfirmation}
                    onChange={handleOrderSettingChange}
                  />
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/orders"
                    className="inline-flex items-center gap-2 border border-gray-200 px-5 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    <FaBoxOpen />
                    My Orders
                  </Link>

                  <div className="ml-auto">
                    <SaveButton onClick={saveOrderSettings} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================================
                SECURITY
            ====================================== */}

            {activeSection === "security" && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <SectionHeader
                  icon={FaLock}
                  title="Security"
                  description="Update your account password."
                />

                <div className="mt-7 max-w-xl space-y-5">
                  <Input
                    label="Current Password"
                    name="current"
                    type="password"
                    value={password.current}
                    onChange={(e) =>
                      setPassword((prev) => ({
                        ...prev,
                        current: e.target.value,
                      }))
                    }
                    placeholder="Enter current password"
                  />

                  <Input
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={password.newPassword}
                    onChange={(e) =>
                      setPassword((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Enter new password"
                  />

                  <Input
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={password.confirmPassword}
                    onChange={(e) =>
                      setPassword((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                  />

                  <button
                    onClick={handleChangePassword}
                    className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                  >
                    <FaLock />
                    Update Password
                  </button>
                </div>

                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <p className="text-sm text-yellow-700">
                    <strong>Frontend mode:</strong> Password changes are
                    currently stored locally. When the backend is added, this
                    section should use secure authentication APIs.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ======================================
                PRIVACY
            ====================================== */}

            {activeSection === "privacy" && (
              <motion.div
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <SectionHeader
                  icon={FaShieldAlt}
                  title="Privacy & Data"
                  description="Manage data stored in this browser."
                />

                <div className="mt-7 space-y-5">
                  <div className="p-5 rounded-2xl bg-gray-50">
                    <div className="flex gap-4">
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                        <FaShieldAlt />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Local Storage
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                          Cart, wishlist, user profile, delivery address, orders
                          and preferences are currently stored in your browser
                          because the backend has not been connected yet.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-red-100 rounded-2xl p-5">
                    <div className="flex gap-4">
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-red-100 text-red-500 flex items-center justify-center">
                        <FaTrash />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          Clear All Data
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Delete cart, wishlist, orders, profile and delivery
                          information from this browser.
                        </p>

                        <button
                          onClick={clearLocalData}
                          className="mt-4 inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold"
                        >
                          <FaTrash />
                          Clear Local Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================================
                MOBILE LOGOUT
            ====================================== */}

            <div className="lg:hidden mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 py-3 rounded-xl font-semibold"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// SECTION HEADER
// =====================================================

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 shrink-0 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
        <Icon />
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>

        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

// =====================================================
// INPUT
// =====================================================

function Input({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-gray-200 bg-white text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 transition"
        />
      </div>
    </div>
  );
}

// =====================================================
// SELECT
// =====================================================

function SelectInput({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-200 bg-white text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
      >
        <option value="">Select {label}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

// =====================================================
// TOGGLE
// =====================================================

function Toggle({ title, description, name, checked, onChange }) {
  return (
    <div className="py-5 flex items-center justify-between gap-5">
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>

        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />

        <div className="w-12 h-7 bg-gray-200 peer-checked:bg-pink-600 rounded-full transition" />

        <div className="absolute left-[3px] top-[3px] w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
      </label>
    </div>
  );
}

// =====================================================
// SAVE BUTTON
// =====================================================

function SaveButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-xl font-semibold transition"
    >
      <FaSave />
      Update Information
    </button>
  );
}

export default Settings;
