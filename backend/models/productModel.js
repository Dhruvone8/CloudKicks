const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: Buffer,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    bgColor: {
        type: String,
        default: "#fffff"
    },
    panelColor: {
        type: String,
        default: "#000000"
    },
    textColor: {
        type: String,
        default: "#000000"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Product", productSchema) 