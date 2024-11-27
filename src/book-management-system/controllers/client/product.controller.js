const Product = require("../../models/product.models");
const mongoose = require("mongoose");
const Joi = require("joi");

// GET /api/products
module.exports.index = async (req, res) => {
    try {
      // Lấy giá trị `page` và `limit` từ query parameters
      const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
      const limit = parseInt(req.query.limit) || 10; // Mặc định là 10 sản phẩm mỗi trang
      const skip = (page - 1) * limit;
  
      // Thêm các bộ lọc (nếu cần, có thể mở rộng)
      const filters = {};
      if (req.query.category) {
        filters.category = req.query.category;
      }
  
      // Tìm các sản phẩm theo bộ lọc, phân trang
      const products = await Product.find(filters).skip(skip).limit(limit);
      const totalProducts = await Product.countDocuments(filters); // Tổng số sản phẩm
  
      res.json({
        products,
        totalPages: Math.ceil(totalProducts / limit), // Tổng số trang
        currentPage: page, // Trang hiện tại
      });
    } catch (error) {
      console.error("Error retrieving products:", error);
      res.status(500).json({ message: "Error retrieving products", error });
    }
  };

// GET /api/products/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving product", error });
  }
};

// GET /api/products/categories
module.exports.getCategories = async (req, res) => {
    try {
        // Lấy danh sách các danh mục duy nhất
        const categories = await Product.distinct('category');
        res.json({ categories });
    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ message: "Error retrieving categories", error });
    }
};
// POST /api/products
module.exports.create = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    authors: Joi.string().required(),
    category: Joi.string().required(),
    publisher: Joi.string().optional(),
    publish_date: Joi.date().optional(),
    price: Joi.number().required(),
    deleted: Joi.boolean().optional(),
    best_seller: Joi.boolean().optional(),
    thumbnail: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newProduct = new Product({
      ...req.body,
      _id: new mongoose.Types.ObjectId(),
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

// PUT /api/products/:id
module.exports.update = async (req, res) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    authors: Joi.string().optional(),
    category: Joi.string().optional(),
    publisher: Joi.string().optional(),
    publish_date: Joi.date().optional(),
    price: Joi.number().optional(),
    deleted: Joi.boolean().optional(),
    best_seller: Joi.boolean().optional(),
    thumbnail: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// DELETE /api/products/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const product = await Product.findByIdAndUpdate(id, { deleted: true }, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
