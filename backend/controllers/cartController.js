const userModel = require("../models/userModel");
const productModel = require("../models/productModel");

// Add item to cart
const handleAddToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, size } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        // Check if product exists
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // If size is provided, verify it exists and has stock
        if (size) {
            const sizeOption = product.sizes.find(s => s.size === size);
            if (!sizeOption) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid size selected"
                });
            }
            if (sizeOption.stock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${sizeOption.stock} items available in size ${size}`
                });
            }
        }

        // Get user's cart
        const user = await userModel.findById(userId);

        // Check if item already exists in cart
        const existingItemIndex = user.cartData.findIndex(
            item => item.product.toString() === productId && 
                   (size ? item.size === size : !item.size)
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            const newQuantity = user.cartData[existingItemIndex].quantity + quantity;
            
            // Check stock again for new quantity
            if (size) {
                const sizeOption = product.sizes.find(s => s.size === size);
                if (sizeOption.stock < newQuantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Cannot add more items. Only ${sizeOption.stock} available`
                    });
                }
            }
            
            user.cartData[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item to cart
            user.cartData.push({
                product: productId,
                quantity,
                size: size || undefined
            });
        }

        await user.save();

        // Populate cart with product details
        await user.populate({
            path: 'cartData.product',
            select: 'name price images category'
        });

        return res.status(200).json({
            success: true,
            message: "Item added to cart",
            cartData: user.cartData
        });

    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add item to cart"
        });
    }
};

// Get user's cart
const handleGetCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId).populate({
            path: 'cartData.product',
            select: 'name price images category sizes'
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Filter out any items where product no longer exists
        const validCartItems = user.cartData.filter(item => item.product);

        return res.status(200).json({
            success: true,
            cartData: validCartItems,
            cartCount: validCartItems.length
        });

    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart"
        });
    }
};

// Update cart item quantity
const handleUpdateCartItem = async (req, res) => {
    try {
        const { productId, quantity, size } = req.body;
        const userId = req.user._id;

        if (!productId || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "Product ID and quantity are required"
            });
        }

        if (quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity cannot be negative"
            });
        }

        // Get product to check stock
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check stock availability
        if (size) {
            const sizeOption = product.sizes.find(s => s.size === size);
            if (!sizeOption) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid size"
                });
            }
            if (sizeOption.stock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${sizeOption.stock} items available`
                });
            }
        }

        const user = await userModel.findById(userId);

        // Find the item in cart
        const itemIndex = user.cartData.findIndex(
            item => item.product.toString() === productId && 
                   (size ? item.size === size : !item.size)
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        // Update quantity or remove if quantity is 0
        if (quantity === 0) {
            user.cartData.splice(itemIndex, 1);
        } else {
            user.cartData[itemIndex].quantity = quantity;
        }

        await user.save();

        // Populate cart with product details
        await user.populate({
            path: 'cartData.product',
            select: 'name price images category'
        });

        return res.status(200).json({
            success: true,
            message: quantity === 0 ? "Item removed from cart" : "Cart updated",
            cartData: user.cartData
        });

    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update cart"
        });
    }
};

// Remove item from cart
const handleRemoveFromCart = async (req, res) => {
    try {
        const { productId, size } = req.body;
        const userId = req.user._id;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required"
            });
        }

        const user = await userModel.findById(userId);

        // Find and remove the item
        const itemIndex = user.cartData.findIndex(
            item => item.product.toString() === productId && 
                   (size ? item.size === size : !item.size)
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        user.cartData.splice(itemIndex, 1);
        await user.save();

        // Populate cart with product details
        await user.populate({
            path: 'cartData.product',
            select: 'name price images category'
        });

        return res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cartData: user.cartData
        });

    } catch (error) {
        console.error("Error removing from cart:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove item from cart"
        });
    }
};

// Clear entire cart
const handleClearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId);
        user.cartData = [];
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cartData: []
        });

    } catch (error) {
        console.error("Error clearing cart:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to clear cart"
        });
    }
};

// Get cart count
const handleGetCartCount = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId);
        
        const totalItems = user.cartData.reduce((total, item) => {
            return total + item.quantity;
        }, 0);

        return res.status(200).json({
            success: true,
            count: totalItems,
            uniqueItems: user.cartData.length
        });

    } catch (error) {
        console.error("Error getting cart count:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get cart count"
        });
    }
};

module.exports = {
    handleAddToCart,
    handleGetCart,
    handleUpdateCartItem,
    handleRemoveFromCart,
    handleClearCart,
    handleGetCartCount
};