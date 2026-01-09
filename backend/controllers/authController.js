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

        // Create User
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
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully"
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
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
            }

            if (!result) {
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
                secure: process.env.NODE_ENV === "production"
            });

            // Send response to frontend
            return res.status(200).json({
                success: true,
                message: "Login successful",
                role: user.role
            });
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
    res.clearCookie("token");
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