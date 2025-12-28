const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    name: String,
    image: Buffer,
    price: Number,
    discount: {
        type: Number,
        default: 0
    },
    bgColor: String,
    panelColor: String,
    textColor: String
})

module.exports = mongoose.model("Product", productSchema) 