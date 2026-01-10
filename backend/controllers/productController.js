const productModel = require("../models/productModel");
const uploadToCloudinary = require("../utils/CloudinaryUpload");

// Add Product
const handleAddProduct = async (req, res) => {
    try {
        const { name, price, category, subCategory, sizes, bestSeller } = req.body;

        // Input validation
        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: "Product name and price are required"
            });
        }

        // Image Input Validation
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product image is required"
            });
        }

        // Upload the images to cloudinary
        const images = []
        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer, "productImages");

            images.push({
                url: result.secure_url,
                public_id: result.public_id
            });
        }

        // Parse sizes if it's a string
        let parsedSizes = sizes;
        if (typeof sizes === "string") {
            try {
                parsedSizes = JSON.parse(sizes);
            } catch {
                return res.status(400).json({
                    success: false,
                    message: "Invalid sizes format"
                });
            }
        }

        // Prepare product Data
        const productData = {
            name,
            price: Number(price),
            category,
            subCategory,
            bestSeller: bestSeller === "true" ? true : false,
            sizes: parsedSizes,
            images
        }

        // Save product to the database
        const product = await productModel.create(productData);

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create product"
        });
    }
};

// List all Products
const handleListProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({
            success: true,
            message: "Products fetched successfully",
            products
        })
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        })
    }
}

// Remove Product
const handleRemoveProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        res.json({
            sucess: true,
            message: "Product removed successfully"
        })
    } catch (error) {
        console.error("Error removing product:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to remove product"
        })
    }
}

// Update a Product Information
const handleUpdateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Find product
        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const {
            name,
            price,
            category,
            subCategory,
            sizes,
            bestSeller
        } = req.body;

        // Update only if provided
        if (name !== undefined) product.name = name;
        if (price !== undefined) product.price = price;
        if (category !== undefined) product.category = category;
        if (subCategory !== undefined) product.subCategory = subCategory;
        if (bestSeller !== undefined) product.bestSeller = bestSeller;

        // Handle sizes
        if (sizes !== undefined) {
            if (typeof sizes === "string") {
                try {
                    product.sizes = JSON.parse(sizes);
                } catch (err) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid sizes format"
                    });
                }
            } else {
                product.sizes = sizes;
            }
        }

        // Save updated product
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update product"
        });
    }
};

module.exports = {
    handleAddProduct,
    handleListProducts,
    handleRemoveProduct,
    handleUpdateProduct
}