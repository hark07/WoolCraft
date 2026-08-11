import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaStar,
  FaSlidersH,
  FaTimes,
} from "react-icons/fa";

const productsData = [
  {
    id: 1,
    name: "Rose Wool Bouquet",
    category: "Wool Flowers",
    price: 1499,
    oldPrice: 1799,
    rating: 4.8,
    reviews: 124,
    stock: 12,
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=700",
  },
  {
    id: 2,
    name: "Cute Wool Doll",
    category: "Wool Dolls",
    price: 1999,
    oldPrice: 2399,
    rating: 4.9,
    reviews: 98,
    stock: 8,
    image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=700",
  },
  {
    id: 3,
    name: "Luxury Gift Hamper",
    category: "Gift Items",
    price: 2499,
    oldPrice: 2999,
    rating: 4.7,
    reviews: 76,
    stock: 15,
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=700",
  },
  {
    id: 4,
    name: "Tulip Wool Bouquet",
    category: "Bouquets",
    price: 1799,
    oldPrice: 2199,
    rating: 5,
    reviews: 145,
    stock: 10,
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=700",
  },
  {
    id: 5,
    name: "Handmade Wool Heart",
    category: "Gift Items",
    price: 999,
    oldPrice: 1199,
    rating: 4.6,
    reviews: 64,
    stock: 20,
    image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=700",
  },
  {
    id: 6,
    name: "Custom Wool Gift",
    category: "Custom Crafts",
    price: 2999,
    oldPrice: 3499,
    rating: 5,
    reviews: 52,
    stock: 6,
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=700",
  },
  {
    id: 7,
    name: "Wool Flower Basket",
    category: "Wool Flowers",
    price: 1899,
    oldPrice: 2199,
    rating: 4.8,
    reviews: 87,
    stock: 9,
    image: "https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?w=700",
  },
  {
    id: 8,
    name: "Premium Gift Box",
    category: "Gift Items",
    price: 3499,
    oldPrice: 3999,
    rating: 4.9,
    reviews: 112,
    stock: 5,
    image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=700",
  },
];

const categories = [
  "All",
  "Wool Flowers",
  "Wool Dolls",
  "Bouquets",
  "Gift Items",
  "Custom Crafts",
];

function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");
  const [showFilter, setShowFilter] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = productsData.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, category, sort]);

  const addToCart = (product) => {
    const existingCart =
      JSON.parse(localStorage.getItem("woolcraft-cart")) || [];

    const existingProduct = existingCart.find((item) => item.id === product.id);

    let updatedCart;

    if (existingProduct) {
      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          oldPrice: product.oldPrice,
          rating: product.rating,
          reviews: product.reviews,
          stock: product.stock,
          image: product.image,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem("woolcraft-cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));

    toast.success(`${product.name} added to cart 🛒`);
  };

  const addToWishlist = (product) => {
    const existingWishlist =
      JSON.parse(localStorage.getItem("woolcraft-wishlist")) || [];

    const alreadyExists = existingWishlist.some(
      (item) => item.id === product.id,
    );

    if (alreadyExists) {
      toast.error("Product already in wishlist ❤️");
      return;
    }

    const updatedWishlist = [
      ...existingWishlist,
      {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        oldPrice: product.oldPrice,
        rating: product.rating,
        reviews: product.reviews,
        stock: product.stock,
        image: product.image,
      },
    ];

    localStorage.setItem("woolcraft-wishlist", JSON.stringify(updatedWishlist));

    window.dispatchEvent(new Event("wishlistUpdated"));

    toast.success(`${product.name} added to wishlist ❤️`);
  };

  return (
    <section className="bg-gray-50 min-h-screen py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-pink-600 font-semibold">WOOLCRAFT NEPAL</p>

          <h1 className="mt-2 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Our Products
          </h1>

          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Explore our beautiful collection of handmade wool crafts, gifts,
            bouquets and customized products.
          </p>
        </motion.div>

        {/* Search */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-11 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
            />

            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="mt-5 md:hidden w-full bg-white border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 font-medium"
        >
          <FaSlidersH />
          {showFilter ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Filters */}
        <div
          className={`${
            showFilter ? "block" : "hidden"
          } md:flex mt-5 items-center justify-between gap-5`}
        >
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium transition ${
                  category === item
                    ? "bg-pink-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-pink-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="mt-3 md:mt-0 min-w-[180px]">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-pink-500"
            >
              <option value="default">Sort By</option>

              <option value="low">Price: Low to High</option>

              <option value="high">Price: High to Low</option>

              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Count */}
        <div className="mt-8 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
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
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -5,
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition"
              >
                {/* Image */}
                <div className="relative overflow-hidden">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-44 sm:h-52 md:h-60 object-cover hover:scale-105 transition duration-500"
                    />
                  </Link>

                  {/* Sale Badge */}
                  {product.oldPrice && (
                    <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                      SALE
                    </span>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={() => addToWishlist(product)}
                    className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center hover:bg-pink-50 transition"
                  >
                    <FaHeart className="text-pink-500 text-sm" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3 md:p-4">
                  <p className="text-xs text-pink-600 font-medium">
                    {product.category}
                  </p>

                  <Link to={`/product/${product.id}`}>
                    <h2 className="mt-1 font-semibold text-gray-900 text-sm md:text-base line-clamp-2 hover:text-pink-600 transition">
                      {product.name}
                    </h2>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-2">
                    <FaStar className="text-yellow-400 text-xs" />

                    <span className="text-xs md:text-sm font-medium">
                      {product.rating}
                    </span>

                    <span className="text-xs text-gray-400">
                      ({product.reviews})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-pink-600 font-bold text-base md:text-lg">
                      Rs. {product.price.toLocaleString()}
                    </span>

                    {product.oldPrice && (
                      <span className="text-gray-400 line-through text-xs md:text-sm">
                        Rs. {product.oldPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Stock */}
                  <p
                    className={`text-xs mt-1 ${
                      product.stock <= 5 ? "text-orange-500" : "text-green-600"
                    }`}
                  >
                    {product.stock <= 5
                      ? `Only ${product.stock} left`
                      : "In Stock"}
                  </p>

                  {/* Add Cart */}
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-3 bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FaShoppingCart />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center">
            <div className="text-5xl">🔍</div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No Products Found
            </h2>

            <p className="mt-2 text-gray-500">
              Try another product name or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-5 bg-pink-600 text-white px-6 py-3 rounded-xl font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;
