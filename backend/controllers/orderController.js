const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const Stripe = require("stripe");

// Payment Gateway Initialisation
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Constants
const DELIVERY_CHARGE = 7;
const ALLOWED_ORDER_STATUSES = [
    "Order Placed",
    "Packing",
    "Shipped",
    "Out for delivery",
    "Delivered"
];

// Helper function to validate and prepare order items
const validateAndPrepareOrderItems = async (items) => {
    const orderItems = [];

    for (const item of items) {
        const product = await productModel.findById(item.product);

        if (!product) {
            throw new Error("Product not found");
        }

        const sizeOption = product.sizes.find(s => s.size === item.size);
        if (!sizeOption) {
            throw new Error(`Size ${item.size} not available for ${product.name}`);
        }

        if (sizeOption.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${product.name} in size ${item.size}. Only ${sizeOption.stock} available`);
        }

        orderItems.push({
            product: item.product,
            productName: product.name,
            size: item.size,
            quantity: item.quantity,
            price: product.price
        });
    }

    return orderItems;
};

// Helper function to calculate order amount
const calculateOrderAmount = (orderItems) => {
    const subtotal = orderItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    return subtotal + DELIVERY_CHARGE;
};

const handlePlaceOrder = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.user._id;

        // Input Validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order Items are required"
            });
        }

        if (!address || !address.street || !address.city || !address.state || !address.country || !address.zipcode) {
            return res.status(400).json({
                success: false,
                message: "Complete Address is required"
            });
        }

        // Validate Stock and prepare items
        const orderItems = await validateAndPrepareOrderItems(items);

        const calculatedAmount = calculateOrderAmount(orderItems);

        const order = await orderModel.create({
            userId,
            items: orderItems.map(item => ({
                product: item.product,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            })),
            amount: calculatedAmount,
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
        const { items, address } = req.body;
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

        if (!address || !address.street || !address.city ||
            !address.state || !address.country || !address.zipcode) {
            return res.status(400).json({
                success: false,
                message: "Complete Address is required"
            });
        }

        // Validate Stock and prepare items
        const orderItems = await validateAndPrepareOrderItems(items);

        const calculatedAmount = calculateOrderAmount(orderItems);

        // Stock will be reduced after payment verification
        const order = await orderModel.create({
            userId,
            items: orderItems.map(item => ({
                product: item.product,
                size: item.size,
                quantity: item.quantity,
                price: item.price
            })),
            amount: calculatedAmount,
            address,
            paymentMethod: "Stripe",
            isPaid: false,
            status: "Pending Payment"
        });

        const line_items = orderItems.map(item => ({
            price_data: {
                currency: process.env.CURRENCY || "inr",
                product_data: {
                    name: `${item.productName} - Size: ${item.size}`
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: process.env.CURRENCY || "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: DELIVERY_CHARGE * 100
            },
            quantity: 1
        })

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
            message: error.message
        });
    }
};

const handleVerifyStripe = async (req, res) => {
    try {
        const { orderId, success } = req.body;
        const userId = req.user._id;

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

        // Verify order belongs to user
        if (order.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        if (success === "true") {
            // Payment successful - update order and reduce stock
            order.isPaid = true;
            order.status = "Order Placed";
            await order.save();

            // Update Product Stock
            for (const item of order.items) {
                const product = await productModel.findById(item.product);
                const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
                product.sizes[sizeIndex].stock -= item.quantity;
                await product.save();
            }

            // Clear user Cart
            const user = await userModel.findById(userId);
            user.cartData = [];
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            // Payment failed - delete order
            await orderModel.findByIdAndDelete(orderId);

            return res.status(400).json({
                success: false,
                message: "Payment failed"
            });
        }

    } catch (error) {
        console.error("Error verifying payment:", error);
        return res.status(500).json({
            success: false,
            message: "Payment verification failed"
        });
    }
};

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

        if (!status || !ALLOWED_ORDER_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${ALLOWED_ORDER_STATUSES.join(", ")}`
            });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (!order.isPaid) {
            return res.status(403).json({
                success: false,
                message: "Cannot update status. Payment not confirmed."
            });
        }
        if (order.status === "Delivered") {
            return res.status(403).json({
                success: false,
                message: "Cannot change status of delivered orders"
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
    handleVerifyStripe,
    handleGetAllOrders,
    handleGetUserOrders,
    handleUpdateOrderStatus
}