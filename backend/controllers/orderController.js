const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const Stripe = require("stripe");

// Payment Gateway Initialisation
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
        const { items, amount, address } = req.body;
        const userId = req.user._id;

        // Check if Stripe is configured
        if (!stripe) {
            return res.status(500).json({
                success: false,
                message: "Stripe is not configured"
            });
        }

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

        if (!address || !address.street || !address.city ||
            !address.state || !address.country || !address.zipcode) {
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
                    message: `Insufficient stock for ${product.name} in size ${item.size}. Only ${sizeOption.stock} available`
                });
            }

            orderItems.push({
                product: item.product,
                productName: product.name,
                size: item.size,
                quantity: item.quantity,
                price: product.price
            });
        }

        const order = await orderModel.create({
            userId,
            items: orderItems.map(item => ({
                product: item.product,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            })),
            amount,
            address,
            paymentMethod: "Stripe",
            isPaid: false,
            status: "Order Placed"
        });

        const line_items = orderItems.map(item => ({
            price_data: {
                currency: process.env.CURRENCY || "usd",
                product_data: {
                    name: `${item.productName} - Size: ${item.size}`
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${order._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${order._id}`,
            line_items,
            mode: "payment",
            metadata: {
                orderId: order._id.toString()
            }
        });

        return res.status(200).json({
            success: true,
            session_url: session.url,
            orderId: order._id
        });

    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create payment session"
        });
    }
};

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

        order.status = status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    }

    catch (err) {
        console.error("Error updating order status:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update order status"
        });
    }
};

module.exports = {
    handlePlaceOrder,
    handleOrderStripe,
    handleOrderRazorpay,
    handleGetAllOrders,
    handleGetUserOrders,
    handleUpdateOrderStatus
}