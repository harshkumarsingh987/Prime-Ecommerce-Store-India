
import Product from "../models/Product.js";

// Escape special regex characters in search input
const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// GET all products with optional search and category filters
export const getProducts = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const category = String(req.query.category || "").trim();

    // Only exclude products explicitly marked inactive.
    // This also supports older products without isActive.
    const filter = {
      isActive: { $ne: false }
    };

    // Case-insensitive exact category matching
    if (category && category.toLowerCase() !== "all") {
      filter.category = {
        $regex: `^${escapeRegex(category)}$`,
        $options: "i"
      };
    }

    // Case-insensitive product name search
    if (search) {
      filter.name = {
        $regex: escapeRegex(search),
        $options: "i"
      };
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch products",
      error: error.message
    });
  }
};


// GET single active product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: { $ne: false }
    }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    console.error("Get Product By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch product",
      error: error.message
    });
  }
};


// CREATE product (development only)
// Add admin authentication and validation before production.
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });

  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
