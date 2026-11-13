 import express from "express";

import {
  getProducts,
  getProductById,
  createProduct
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

// Development endpoint. Protect this before production deployment.
router.post("/", createProduct);

export default router;