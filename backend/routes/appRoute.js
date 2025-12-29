const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/checkAuth");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

router.get("/", (req, res) => {
    let error = req.flash("error");
    res.render("index", { error, isLoggedIn: false });
});

router.get("/shop", isLoggedIn, async (req, res) => {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success });
});

// Add to cart functionality
router.get("/addtocart/:productId", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productId);
    await user.save();
    req.flash("success", "Product added to cart!");
    res.redirect("/shop");
});

router.get("/cart", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({email : req.user.email}).populate("cart");
    res.render("cart", { user });
});

module.exports = router;