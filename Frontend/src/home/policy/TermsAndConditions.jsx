import React from "react";

function TermsAndConditions() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-pink-600">
        Terms & Conditions
      </h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          By using WoolCraft Nepal, you agree to the following terms and
          conditions.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Products</h2>
          <p>
            All handmade products may vary slightly in color, size, and design
            from the images displayed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Pricing</h2>
          <p>
            Prices are subject to change without prior notice. We reserve the
            right to modify product pricing at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Orders</h2>
          <p>
            We reserve the right to accept, reject, or cancel orders based on
            availability or other circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Intellectual Property</h2>
          <p>
            All website content, images, logos, and designs belong to WoolCraft
            Nepal and may not be copied without permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Limitation of Liability
          </h2>
          <p>
            WoolCraft Nepal shall not be responsible for indirect or incidental
            damages arising from product use.
          </p>
        </section>
      </div>
    </div>
  );
}

export default TermsAndConditions;
