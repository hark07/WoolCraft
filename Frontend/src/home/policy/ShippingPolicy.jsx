import React from "react";

function ShippingPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-pink-600">Shipping Policy</h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Order Processing Time</h2>
          <p>
            Orders are typically processed within 1–3 business days. Customized
            orders may require additional production time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Delivery Time</h2>
          <p>
            Delivery within Nepal usually takes 2–7 business days depending on
            the destination.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Shipping Charges</h2>
          <p>
            Shipping fees may vary depending on location, package size, and
            delivery method.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Delays</h2>
          <p>
            Delivery times may be affected by weather conditions, public
            holidays, or courier service delays.
          </p>
        </section>
      </div>
    </div>
  );
}

export default ShippingPolicy;
