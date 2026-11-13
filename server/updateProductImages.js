 
import "dotenv/config";
import mongoose from "mongoose";
import Product from "./models/Product.js";

const imageUpdates = [
  {
    name: "Classic Black T-Shirt",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Men Casual Shirt",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Women Floral Dress",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Women Casual Top",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Classic White Sneakers",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Premium Wrist Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Leather Wallet",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Men Denim Jeans",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80"
  }
];

async function updateProductImages() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/prime_ecommerce"
    );

    console.log("MongoDB connected!");

    for (const item of imageUpdates) {
      const result = await Product.updateOne(
        { name: item.name },
        { $set: { image: item.image } }
      );

      console.log(
        `${item.name}: ${
          result.matchedCount ? "Updated" : "Product not found"
        }`
      );
    }

    console.log("Product images updated successfully!");

  } catch (error) {
    console.error("Image update error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

updateProductImages();
