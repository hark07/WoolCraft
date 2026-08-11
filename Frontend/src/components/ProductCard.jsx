import { motion } from "framer-motion";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

function ProductCard({ product }) {
  const addToCart = () => {
    toast.success(`${product.name} added to cart 🛒`);
  };

  const addToWishlist = () => {
    toast.success("Added to Wishlist ❤️");
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
      }}
      whileHover={{
        y: -6,
      }}
      transition={{
        duration: 0.4,
      }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition relative"
    >
      {/* Wishlist */}
      <button
        onClick={addToWishlist}
        aria-label="Add to wishlist"
        className="absolute top-3 right-3 z-10 bg-white p-2.5 rounded-full shadow hover:bg-pink-50 transition"
      >
        <FaHeart className="text-pink-500" />
      </button>

      {/* Image */}
      <div className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 md:h-56 object-cover hover:scale-105 transition duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-sm md:text-base line-clamp-2 text-gray-800">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <FaStar className="text-yellow-400" />

          <span className="text-sm text-gray-600">{product.rating}</span>
        </div>

        {/* Price */}
        <h4 className="text-pink-600 font-bold text-lg mt-2">
          Rs. {product.price}
        </h4>

        {/* Cart Button */}
        <button
          onClick={addToCart}
          className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition"
        >
          <FaShoppingCart />
          Add To Cart
        </button>
      </div>
    </motion.div>
  );
}

export default ProductCard;
