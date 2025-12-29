const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/productModel");
const { isAdmin } = require("../middlewares/checkAuth");

// Create product - only admins can create products
router.post("/create", isAdmin, upload.single('image'), async (req, res) => {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgColor: bgcolor,
            panelColor: panelcolor,
            textColor: textcolor
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

module.exports = router;