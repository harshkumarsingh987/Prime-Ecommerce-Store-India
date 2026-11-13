 
import dotenv from "dotenv";
import mongoose from "mongoose";
import Order from "./models/Order.js";

dotenv.config();

try {
  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB connected");

  const count = await Order.countDocuments();
  console.log("Total orders:", count);

  const orders = await Order.find().limit(5).lean();
  console.log("Existing orders:");
  console.log(JSON.stringify(orders, null, 2));

} catch (error) {
  console.error("Database error:", error.message);
} finally {
  await mongoose.disconnect();
}
