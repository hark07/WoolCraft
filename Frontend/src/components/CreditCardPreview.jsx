import { motion } from "framer-motion";

function CreditCardPreview({ cardHolder, cardNumber, expiry, cvv, flipped }) {
  const getCardType = () => {
    const number = cardNumber.replace(/\s/g, "");

    if (number.startsWith("4")) return "VISA";
    if (number.startsWith("5")) return "MASTERCARD";

    return "CARD";
  };

  return (
    <div className="flex justify-center">
      <div
        className="relative w-full max-w-[430px] h-[260px]"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl text-white"
            style={{
              backfaceVisibility: "hidden",
              background:
                "linear-gradient(135deg,#ec4899 0%,#d946ef 50%,#7c3aed 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white" />
            </div>

            <div className="relative h-full p-8 flex flex-col">
              <div className="flex justify-between items-center">
                <div className="text-4xl">💳</div>

                <h2 className="text-2xl font-bold tracking-widest">
                  {getCardType()}
                </h2>
              </div>

              <div className="mt-12">
                <p className="text-2xl tracking-[4px] font-semibold">
                  {cardNumber || "**** **** **** ****"}
                </p>
              </div>

              <div className="mt-auto flex justify-between">
                <div>
                  <p className="text-xs opacity-70 uppercase">Card Holder</p>

                  <p className="font-semibold text-lg uppercase">
                    {cardHolder || "YOUR NAME"}
                  </p>
                </div>

                <div>
                  <p className="text-xs opacity-70 uppercase">Expires</p>

                  <p className="font-semibold text-lg">{expiry || "MM/YY"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-r from-gray-800 to-black text-white"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="h-14 bg-black mt-6" />

            <div className="px-6 mt-8">
              <div className="bg-white h-12 rounded flex items-center justify-end px-4">
                <span className="text-black text-lg font-bold">
                  {cvv || "***"}
                </span>
              </div>

              <p className="text-sm text-gray-300 mt-3">Security Code (CVV)</p>

              <div className="flex justify-end mt-10">
                <h2 className="text-2xl font-bold">{getCardType()}</h2>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default CreditCardPreview;
