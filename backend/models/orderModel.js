const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                size: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                }
            }
        ],

        amount: {
            type: Number,
            required: true
        },

        address: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
            phone: String
        },

        paymentMethod: {
            type: String,
            required: true
        },

        isPaid: {
            type: Boolean,
            default: false
        },

        status: {
            type: String,
            enum: ["Order Placed", "Item Packed", "Out for Delivery", "Delivered"],
            default: "Order Placed"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
