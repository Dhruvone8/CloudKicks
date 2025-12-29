const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Middleware to check if user is logged in
async function isLoggedIn(req, res, next) {
    // If the user trying to access the route does not have the token
    if (!req.cookies.token) {
        req.flash("error", "You need to login to access this page");
        return res.redirect("/");
    }

    // If the user has the token
    try {
        const decoded_user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        // Don't fetch user's password from the database
        const user = await userModel.findOne({ email: decoded_user.email }).select("-password");

        // If the user doesn't exist
        if (!user) {
            req.flash("error", "User not found. Please login again.");
            return res.redirect("/");
        }

        req.user = user;
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            req.flash("error", "Session expired. Please login again.");
        } else {
            req.flash("error", "Invalid token. Please login again.");
        }
        return res.redirect("/");
    }
}

// Middleware to check if user is an admin
async function isAdmin(req, res, next) {
    // First check if user is logged in
    if (!req.cookies.token) {
        req.flash("error", "You need to login to access this page");
        return res.redirect("/");
    }

    try {
        const decoded_user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        // Fetch user without password
        const user = await userModel.findOne({ email: decoded_user.email }).select("-password");

        // If the user doesn't exist
        if (!user) {
            req.flash("error", "User not found. Please login again.");
            return res.redirect("/");
        }

        // Check if user has admin role
        if (user.role !== 'admin') {
            req.flash("error", "You don't have permission to access this page");
            return res.redirect("/shop");
        }

        req.user = user;
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            req.flash("error", "Session expired. Please login again.");
        } else {
            req.flash("error", "Invalid token. Please login again.");
        }
        return res.redirect("/");
    }
}

// Middleware to check if user is a normal user (not admin)
async function isNormalUser(req, res, next) {
    // First check if user is logged in
    if (!req.cookies.token) {
        req.flash("error", "You need to login to access this page");
        return res.redirect("/");
    }

    try {
        const decoded_user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);

        // Fetch user without password
        const user = await userModel.findOne({ email: decoded_user.email }).select("-password");

        // If the user doesn't exist
        if (!user) {
            req.flash("error", "User not found. Please login again.");
            return res.redirect("/");
        }

        // Check if user has normal role
        if (user.role !== 'normal') {
            req.flash("error", "This page is only accessible to regular users");
            return res.redirect("/admin/panel");
        }

        req.user = user;
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            req.flash("error", "Session expired. Please login again.");
        } else {
            req.flash("error", "Invalid token. Please login again.");
        }
        return res.redirect("/");
    }
}

module.exports = { isLoggedIn, isAdmin, isNormalUser };