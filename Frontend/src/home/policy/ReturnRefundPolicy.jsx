import React from "react";

function ReturnRefundPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-pink-600">
        Return & Refund Policy
      </h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          Customer satisfaction is important to us. Please read our return and
          refund policy carefully.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Custom Orders</h2>
          <p>
            Customized and personalized products are non-returnable and
            non-refundable once production has started.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Damaged or Incorrect Items
          </h2>
          <p>
            If you receive a damaged or incorrect product, please contact us
            within 3 days of delivery with photos of the item.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Refund Process</h2>
          <p>
            Approved refunds will be processed within 7–10 business days using
            the original payment method whenever possible.
          </p>
        </section>
      </div>
    </div>
  );
}

export default ReturnRefundPolicy;
