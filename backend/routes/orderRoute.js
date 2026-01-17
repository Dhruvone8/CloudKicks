const express = require("express");
const router = express.Router();
const { isAdmin, isLoggedIn } = require("../middlewares/checkAuth");
const { handlePlaceOrder,
    handleOrderStripe,
    handleOrderRazorpay,
    handleGetAllOrders,
    handleGetUserOrders,
    handleUpdateOrderStatus } from "../controllers/orderController";

// Admin Features
router.get("/allOrders", isAdmin, handleGetAllOrders);
router.post("/status", isAdmin, handleUpdateOrderStatus);

// Payment Features
router.post("/cod", isLoggedIn, handlePlaceOrder);
router.post("/stripe", isLoggedIn, handleOrderStripe);
router.post("/razorpay", isLoggedIn, handleOrderRazorpay);

// User Features
router.get("/userOrders", isLoggedIn, handleGetUserOrders);

module.exports = router;
