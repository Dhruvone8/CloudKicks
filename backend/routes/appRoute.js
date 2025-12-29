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
    try {
        let products = await productModel.find();
        let success = req.flash("success");
        res.render("shop", { products, success });
    } catch (error) {
        console.error("Error loading shop:", error);
        req.flash("error", "Failed to load products");
        res.redirect("/");
    }
});

// Add to cart functionality
router.get("/addtocart/:productId", isLoggedIn, async (req, res) => {
    try {
        // Check if product exists
        const product = await productModel.findById(req.params.productId);
        if (!product) {
            req.flash("error", "Product not found");
            return res.redirect("/shop");
        }

        let user = await userModel.findOne({ email: req.user.email });

        // Check if product already exists in cart
        const productIndex = user.cart.indexOf(req.params.productId);
        if (productIndex !== -1) {
            req.flash("error", "Product already in cart");
            return res.redirect("/shop");
        }

        user.cart.push(req.params.productId);
        await user.save();

        req.flash("success", "Product added to cart!");
        res.redirect("/shop");
    } catch (error) {
        console.error("Error adding to cart:", error);
        req.flash("error", "Failed to add product to cart");
        res.redirect("/shop");
    }
});

// Remove from cart functionality
router.get("/removefromcart/:productId", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        // Remove product from cart
        user.cart = user.cart.filter(item => item.toString() !== req.params.productId);
        await user.save();

        req.flash("success", "Product removed from cart");
        res.redirect("/cart");
    } catch (error) {
        console.error("Error removing from cart:", error);
        req.flash("error", "Failed to remove product from cart");
        res.redirect("/cart");
    }
});

router.get("/cart", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate("cart");

        // Calculate cart totals
        let cartTotal = 0;
        let discount = 0;

        if (user.cart && user.cart.length > 0) {
            user.cart.forEach(product => {
                cartTotal += product.price;
                discount += product.discount || 0;
            });
        }

        const platformFee = 20;
        const finalTotal = cartTotal - discount + platformFee;

        let success = req.flash("success");
        let error = req.flash("error");

        res.render("cart", {
            user,
            cartTotal,
            discount,
            platformFee,
            finalTotal,
            success,
            error
        });
    } catch (error) {
        console.error("Error loading cart:", error);
        req.flash("error", "Failed to load cart");
        res.redirect("/shop");
    }
});

// Checkout route
router.post("/checkout", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate("cart");

        if (!user.cart || user.cart.length === 0) {
            req.flash("error", "Your cart is empty");
            return res.redirect("/cart");
        }

        // Calculate order total
        let orderTotal = 0;
        user.cart.forEach(product => {
            orderTotal += product.price - (product.discount || 0);
        });
        orderTotal += 20; // Platform fee

        // Create order object
        const order = {
            products: user.cart,
            total: orderTotal,
            date: new Date()
        };

        // Add to orders and clear cart
        user.orders.push(order);
        user.cart = [];
        await user.save();

        req.flash("success", "Order placed successfully!");
        res.redirect("/shop");
    } catch (error) {
        console.error("Checkout error:", error);
        req.flash("error", "Failed to process order");
        res.redirect("/cart");
    }
});

// My orders route
router.get("/myorders", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        // res.render("orders", { orders: user.orders });
        res.send(user.orders)
    } catch (error) {
        console.error("Error loading orders:", error);
        req.flash("error", "Failed to load orders");
        res.redirect("/shop");
    }
});

module.exports = router;