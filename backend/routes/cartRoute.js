const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/checkAuth");
const {
    handleAddToCart,
    handleGetCart,
    handleUpdateCartItem,
    handleRemoveFromCart,
    handleClearCart,
    handleGetCartCount
} = require("../controllers/cartController");

// Add item to cart
router.post("/add", isLoggedIn, handleAddToCart);

// Get user's cart
router.get("/", isLoggedIn, handleGetCart);

// Get cart count
router.get("/count", isLoggedIn, handleGetCartCount);

// Update cart item quantity
router.patch("/update", isLoggedIn, handleUpdateCartItem);

// Remove item from cart
router.delete("/remove", isLoggedIn, handleRemoveFromCart);

// Clear entire cart
router.delete("/clear", isLoggedIn, handleClearCart);

module.exports = router;