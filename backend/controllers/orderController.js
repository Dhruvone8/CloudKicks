const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

const handlePlaceOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.user._id;

        // Input Validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order Items are required"
            });
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid Amount is required"
            });
        }

        if (!address || !address.street || !address.city || !address.state || !address.country || !address.zip) {
            return res.status(400).json({
                success: false,
                message: "Complete Address is required"
            });
        }

        // Validate Stock
        const orderItems = [];
        for (const item of items) {
            const product = await productModel.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            // Check if size exists and has enough stock
            const sizeOption = product.sizes.find(s => s.size === item.size);
            if (!sizeOption) {
                return res.status(400).json({
                    success: false,
                    message: `Size ${item.size} not available for ${product.name}`
                });
            }

            if (sizeOption.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name} in size ${item.size}`
                });
            }

            orderItems.push({
                product: item.product,
                size: item.size,
                quantity: item.quantity,
                price: product.price
            });
        }

        const order = await orderModel.create({
            userId,
            items: orderItems,
            amount,
            address,
            paymentMethod: "COD",
            isPaid: false,
            status: "Order Placed"
        });

        // Update Product Stock
        for (const item of orderItems) {
            const product = await productModel.findById(item.product);
            const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
            product.sizes[sizeIndex].stock -= item.quantity;
            await product.save();
        }

        // Clear user Cart
        const user = await userModel.findById(userId);
        user.cartData = [];
        await user.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Placing orders using Stripe Method
const handleOrderStripe = async (req, res) => {
    try {

    } catch (error) {

    }
}

// Placing orders using Razorpay Method
const handleOrderRazorpay = async (req, res) => {

}

// Get all orders for Admin Panel - Only Admin can access this route
const handleGetAllOrders = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("userId", "name email")
            .populate("items.product", "name images price")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All orders fetched successfully",
            orders,
            count: orders.length
        });

    } catch (error) {
        console.error("Error fetching all orders:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get user orders
const handleGetUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await orderModel
            .find({ userId })
            .populate("items.product", "name images price")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "User orders fetched successfully",
            orders,
            count: orders.length
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};

// Update Order Status - Only Admin can access this route
const handleUpdateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // Validate Input
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required"
            });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const previousStatus = order.status;
        if (status == "Cancelled" || status == "Returned") {
            return res.status(403).json({
                success: false,
                message: "Only users can cancel or return orders"
            })
        }

        // Stock Adjustments
        const wasCancelled = previousStatus === "Cancelled" || previousStatus === "Returned";
        const isBeingCancelled = status === "Cancelled" || status === "Returned";

        // Restore the stock if order is cancelled
        if (isBeingCancelled && !wasCancelled) {
            for (const item of order.items) {
                const product = await productModel.findById(item.product);
                if (product) {
                    const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
                    if (sizeIndex !== -1) {
                        product.sizes[sizeIndex].stock += item.quantity;
                        await product.save();
                    }
                }
            }
        }
        // Decrease the stock again if order is moved from cancelled / returned to any active status
        else if (!isBeingCancelled && wasCancelled) {
            for (const item of order.items) {
                const product = await productModel.findById(item.product);
                if (product) {
                    const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
                    if (sizeIndex !== -1) {
                        // Check if enough stock is available
                        if (product.sizes[sizeIndex].stock < item.quantity) {
                            return res.status(400).json({
                                success: false,
                                message: `Insufficient stock for ${product.name} in size ${item.size}`
                            });
                        }
                        product.sizes[sizeIndex].stock -= item.quantity;
                        await product.save();
                    }
                }
            }
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });

         catch (err) {
            console.error("Error updating order status:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to update order status"
            });
        }
    }

        module.exports = {
        handlePlaceOrder,
        handleOrderStripe,
        handleOrderRazorpay,
        handleGetAllOrders,
        handleGetUserOrders,
        handleUpdateOrderStatus
    }