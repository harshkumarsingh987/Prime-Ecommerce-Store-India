 
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const {
      orderId,
      customer,
      amount,
      paymentMethod,
      status
    } = req.body;

    const order = await Order.create({
      orderId,
      customer,
      amount,
      paymentMethod,
      status
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
