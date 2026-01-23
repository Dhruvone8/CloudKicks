const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

async function handleUserRegistration(req, res) {
    try {
        let { email, password, name } = req.body;

        // Input Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Email Validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email address"
            });
        }

        // Password Validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Check whether user exists or not
        let userExists = await userModel.findOne({ email: email });

        // If user exists already, return
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "User already exists. Try logging in."
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User (always as 'normal' role for frontend registration)
        let user = await userModel.create({
            email,
            password: hashedPassword,
            name,
            role: 'normal'
        });

        // Generate JWT
        let token = jwt.sign(
            { email: user.email, id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000

        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            role: user.role
        });
    }
    catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({
            success: false,
            message: "An error occurred during registration"
        });
    }
}

async function handleLogin(req, res) {
    try {
        let { email, password } = req.body;

        // Validate Input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        let user = await userModel.findOne({ email: email });

        // If user doesn't exist
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Password correct, generate token with role
        let token = jwt.sign(
            { email: user.email, id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none", // Required for cross-origin cookies
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Send response to frontend
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            role: user.role,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({
            success: false,
            message: "An error occurred during login"
        });
    }
}

async function handleLogout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none", // Required for cross-origin cookies
        maxAge: 0
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
}

module.exports = {
    handleUserRegistration,
    handleLogin,
    handleLogout
};