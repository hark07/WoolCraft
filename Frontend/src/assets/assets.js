import {
  FaHeart,
  FaChild,
  FaGift,
  FaBagShopping,
  FaHouse,
  FaWandMagicSparkles,
} from "react-icons/fa6";

import woolCraftHero from "./WoolCraft.png";

// All Assets
const assets = {
  woolCraftHero,
};

// Category Data
export const categoriesData = [
  {
    id: 1,
    name: "Wool Flowers",
    icon: FaHeart,
    slug: "wool-flowers",
    description: "Beautiful handmade wool flowers.",
  },

  {
    id: 2,
    name: "Wool Dolls",
    icon: FaChild,
    slug: "wool-dolls",
    description: "Cute handmade wool dolls.",
  },

  {
    id: 3,
    name: "Bouquets & Hampers",
    icon: FaGift,
    slug: "bouquets-hampers",
    description: "Special bouquets and gift hampers.",
  },

  {
    id: 4,
    name: "Gift Items",
    icon: FaGift,
    slug: "gift-items",
    description: "Unique handmade gift collections.",
  },

  {
    id: 5,
    name: "Wool Accessories",
    icon: FaBagShopping,
    slug: "wool-accessories",
    description: "Handcrafted wool accessories.",
  },

  {
    id: 6,
    name: "Home Decoration",
    icon: FaHouse,
    slug: "home-decoration",
    description: "Decorative handmade wool products.",
  },

  {
    id: 7,
    name: "Custom Crafts",
    icon: FaWandMagicSparkles,
    slug: "custom-crafts",
    description: "Personalized wool craft creations.",
  },
];

export { assets };

export default assets;