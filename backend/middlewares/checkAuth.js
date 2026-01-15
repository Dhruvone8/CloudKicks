const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Middleware to check if user is logged in
async function isLoggedIn(req, res, next) {
    try {
        const token = req.cookies?.token;

        // If the user is not logged in
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const decoded_user = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded_user.email }).select("-password");

        // If the token is valid but the user doesn't exist
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

// Middleware to check if user is an admin
async function isAdmin(req, res, next) {
    try {
        // Check for token in cookies first, then in Authorization header
        let token = req.cookies?.token;

        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin Access Required"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

// Middleware to check if user is a normal user (not admin)
async function isNormalUser(req, res, next) {
    try {
        const token = req.cookies?.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found"
            });
        }

        if (user.role !== "normal") {
            return res.status(401).json({
                success: false,
                message: "Normal User Access Required"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

module.exports = { isLoggedIn, isAdmin, isNormalUser };