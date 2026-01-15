const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        images: [
            {
                url: {
                    type: String,
                    required: true
                },
                public_id: {
                    type: String,
                    required: true
                }
            }
        ],

        price: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            index: true
        },

        subCategory: {
            type: String,
            required: true
        },

        sizes: [
            {
                size: {
                    type: String,
                    required: true
                },
                stock: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],

        bestSeller: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
