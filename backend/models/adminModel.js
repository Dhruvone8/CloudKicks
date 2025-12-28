const mongoose = require("mongoose")

const adminSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    products: {
        type: Array,
        default: []
    },
    picture: String,
    gstin: String
})

module.exports = mongoose.model("Admin", adminSchema)