import React from "react";

function PrivacyPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-pink-600">Privacy Policy</h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          WoolCraft Nepal values your privacy and is committed to protecting
          your personal information.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Information We Collect
          </h2>
          <p>
            We may collect your name, phone number, email address, delivery
            address, and order details when you place an order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            How We Use Information
          </h2>
          <ul className="list-disc pl-6">
            <li>Process and deliver orders</li>
            <li>Provide customer support</li>
            <li>Improve our products and services</li>
            <li>Contact you regarding your orders</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Data Protection</h2>
          <p>
            We take reasonable measures to protect your information from
            unauthorized access, misuse, or disclosure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Third-Party Services</h2>
          <p>
            We do not sell your personal information. Information may be shared
            with delivery partners only when required for order fulfillment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy, please
            contact us.
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
