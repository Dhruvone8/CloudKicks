const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/productModel");

router.post("/create", upload.single('image'), async (req, res) => {
    try {
        let { name, price, discount, bgColor, panelColor, textColor } = req.body;

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgColor,
            panelColor,
            textColor
        });

        req.flash("success", "Product created successfully");
        res.redirect("/admin/panel");
    }
    catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router