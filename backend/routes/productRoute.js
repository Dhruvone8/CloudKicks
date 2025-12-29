const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/productModel");
const { isAdmin } = require("../middlewares/checkAuth");

// Create product - only admins can create products
router.post("/create", isAdmin, upload.single('image'), async (req, res) => {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;


        // Input Validation
        if (!name || !price) {
            req.flash("error", "Product name and price are required");
            return res.redirect("/admin/panel");
        }

        if (!req.file) {
            req.flash("error", "Product image is required");
            return res.redirect("/admin/panel");
        }

        let product = await productModel.create({
            image: req.file.buffer,
            name: name.trim(),
            price,
            discount,
            bgColor: bgcolor || "#ffffff",
            panelColor: panelcolor || "#000000",
            textColor: textcolor || "#000000"
        });

        req.flash("success", "Product created successfully");
        res.redirect("/admin/panel");
    }
    catch (error) {
        console.error("Error creating product:", error);
        req.flash("error", "Failed to create product");
        res.redirect("/admin/panel");
    }
});

// Get all products
router.get("/all", isAdmin, async (req, res) => {
    try {
        const products = await productModel.find().sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Failed to fetch products" });
    }
});

// Delete product
router.post("/delete/:productId", isAdmin, async (req, res) => {
    try {
        const { productId } = req.params;

        const deletedProduct = await productModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            req.flash("error", "Product not found");
            return res.redirect("/admin/panel");
        }

        req.flash("success", "Product deleted successfully");
        res.redirect("/admin/panel");
    } catch (error) {
        console.error("Error deleting product:", error);
        req.flash("error", "Failed to delete product");
        res.redirect("/admin/panel");
    }
});

// Update product
router.post("/update/:productId", isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { productId } = req.params;
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        const updateData = {
            name: name?.trim(),
            price: parseFloat(price),
            discount: discount ? parseFloat(discount) : 0,
            bgColor: bgcolor,
            panelColor: panelcolor,
            textColor: textcolor
        };

        // If new image uploaded, replace it
        if (req.file) {
            updateData.image = req.file.buffer;
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            req.flash("error", "Product not found");
            return res.redirect("/admin/panel");
        }

        req.flash("success", "Product updated successfully");
        res.redirect("/admin/panel");
    } catch (error) {
        console.error("Error updating product:", error);
        req.flash("error", "Failed to update product");
        res.redirect("/admin/panel");
    }
});

module.exports = router;