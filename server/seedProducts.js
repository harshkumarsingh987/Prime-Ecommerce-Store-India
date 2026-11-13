 
import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";

const products = [
  {
    name: "Classic Black T-Shirt",
    description: "Premium cotton everyday black t-shirt.",
    price: 599,
    category: "Men",
    image: "https://placehold.co/600x750?text=Black+T-Shirt",
    stock: 25,
    isActive: true
  },
  {
    name: "Men Casual Shirt",
    description: "Smart casual shirt for everyday wear.",
    price: 999,
    category: "Men",
    image: "https://placehold.co/600x750?text=Casual+Shirt",
    stock: 15,
    isActive: true
  },
  {
    name: "Women Floral Dress",
    description: "Elegant floral dress for casual occasions.",
    price: 1499,
    category: "Women",
    image: "https://placehold.co/600x750?text=Floral+Dress",
    stock: 12,
    isActive: true
  },
  {
    name: "Women Casual Top",
    description: "Comfortable and stylish casual top.",
    price: 799,
    category: "Women",
    image: "https://placehold.co/600x750?text=Casual+Top",
    stock: 20,
    isActive: true
  },
  {
    name: "Classic White Sneakers",
    description: "Minimal everyday sneakers.",
    price: 1999,
    category: "Shoes",
    image: "https://placehold.co/600x750?text=White+Sneakers",
    stock: 10,
    isActive: true
  },
  {
    name: "Premium Wrist Watch",
    description: "Modern wrist watch with a classic finish.",
    price: 2499,
    category: "Accessories",
    image: "https://placehold.co/600x750?text=Wrist+Watch",
    stock: 8,
    isActive: true
  },
  {
    name: "Leather Wallet",
    description: "Compact everyday leather wallet.",
    price: 699,
    category: "Accessories",
    image: "https://placehold.co/600x750?text=Wallet",
    stock: 30,
    isActive: true
  },
  {
    name: "Men Denim Jeans",
    description: "Comfortable slim-fit denim jeans.",
    price: 1299,
    category: "Men",
    image: "https://placehold.co/600x750?text=Denim+Jeans",
    stock: 18,
    isActive: true
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/prime_ecommerce"
    );

    console.log("MongoDB connected!");

    const operations = products.map((product) => ({
      updateOne: {
        filter: {
          name: product.name,
          category: product.category
        },
        update: {
          $setOnInsert: product
        },
        upsert: true
      }
    }));

    const result = await Product.bulkWrite(operations);

    console.log("Product seeding completed!");
    console.log("New products inserted:", result.upsertedCount);
    console.log("Existing products skipped:", result.matchedCount);

  } catch (error) {
    console.error("Seeding error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed.");
  }
};

seedProducts();
