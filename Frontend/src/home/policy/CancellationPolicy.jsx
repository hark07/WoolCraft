import React from "react";

function CancellationPolicy() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8 text-pink-600">
        Cancellation Policy
      </h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Order Cancellation</h2>
          <p>Orders may be cancelled before production or shipping begins.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Customized Products</h2>
          <p>
            Customized orders cannot be cancelled once production has started.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Refund Eligibility</h2>
          <p>
            Eligible cancellations will receive refunds according to our Return
            & Refund Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Contact Support</h2>
          <p>
            For cancellation requests, please contact us as soon as possible
            after placing your order.
          </p>
        </section>
      </div>
    </div>
  );
}

export default CancellationPolicy;
