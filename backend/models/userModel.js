const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
    role: {
        type: String,
        enum: ['normal', 'admin'],
        default: 'normal'
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    orders: {
        type: Array,
        default: []
    },
    contact: Number,
    picture: String,
    
    // Admin-specific fields (only used when role is 'admin')
    products: {
        type: Array,
        default: []
    },
    gstin: String
});

module.exports = mongoose.model("User", userSchema);