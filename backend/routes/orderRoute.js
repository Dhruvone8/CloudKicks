const express = require("express");
const router = express.Router();
const { isAdmin, isLoggedIn, isNormalUser } = require("../middlewares/checkAuth");
const { handlePlaceOrder,
    handleOrderStripe,
    handleVerifyStripe,
    handleGetAllOrders,
    handleGetUserOrders,
    handleUpdateOrderStatus
} = require("../controllers/orderController");

// Admin Features
router.get("/allOrders", isAdmin, handleGetAllOrders);
router.post("/status", isAdmin, handleUpdateOrderStatus);

// Payment Features
router.post("/cod", isLoggedIn, handlePlaceOrder);
router.post("/stripe", isLoggedIn, handleOrderStripe);
router.post("/verifyStripe", isLoggedIn, handleVerifyStripe);

// User Features
router.get("/userOrders", isLoggedIn, handleGetUserOrders);

module.exports = router;
