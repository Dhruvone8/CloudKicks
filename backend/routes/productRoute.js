const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer");
const productModel = require("../models/productModel");
const { isAdmin } = require("../middlewares/checkAuth");
const { handleAddProduct, handleListProducts, handleRemoveProduct, handleUpdateProduct } = require("../controllers/productController");

// Add product - only admins can create products
router.post("/add", isAdmin, upload.array("images", 4), handleAddProduct);

// List all Products - only admins can list products
router.get("/list", isAdmin, handleListProducts);

// Remove product - only admins can remove products
router.delete("/remove/:id", isAdmin, handleRemoveProduct);

// Update a Product - only admins can update products
router.patch("/update/:id", isAdmin, handleUpdateProduct);

module.exports = router;