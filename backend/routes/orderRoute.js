const express = require("express");
const router = express.Router();
const { isAdmin, isLoggedIn, isNormalUser } = require("../middlewares/checkAuth");
const { handlePlaceOrder,
    handleOrderStripe,
    handleOrderRazorpay,
    handleGetAllOrders,
    handleGetUserOrders,
    handleUpdateOrderStatus,
    handleUserCancelOrder
} = require("../controllers/orderController");

// Admin Features
router.get("/allOrders", isAdmin, handleGetAllOrders);
router.post("/status", isAdmin, handleUpdateOrderStatus);

// Payment Features
router.post("/cod", isLoggedIn, handlePlaceOrder);
router.post("/stripe", isLoggedIn, handleOrderStripe);
router.post("/razorpay", isLoggedIn, handleOrderRazorpay);

// User Features
router.get("/userOrders", isLoggedIn, handleGetUserOrders);
router.post("/cancel", isNormalUser, handleUserCancelOrder);

module.exports = router;
