const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const { handleLogin, handleLogout } = require("../controllers/authController");
const { isAdmin } = require("../middlewares/checkAuth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

router.get("/panel", isAdmin, (req, res) => {
    let success = req.flash("success");
    res.render("createproducts", { success });
});

if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {
        try {
            // Check if any admin already exists
            const adminExists = await userModel.findOne({ role: 'admin' });
            if (adminExists) {
                return res.status(403).send("An admin already exists. You don't have permission to create another admin");
            }

            const { fullname, email, password } = req.body;

            // Check if email already exists
            const userExists = await userModel.findOne({ email });
            if (userExists) {
                return res.status(400).send("Email already in use");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const createdAdmin = await userModel.create({
                fullname,
                email,
                password: hashedPassword,
                role: 'admin' // Set role to admin
            });

            const token = jwt.sign(
                { id: createdAdmin._id, email, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"
            });

            res.status(201).json({
                message: "Admin created successfully",
                admin: {
                    id: createdAdmin._id,
                    fullname,
                    email,
                    role: createdAdmin.role
                }
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    });
}

// Admin login route
router.post("/login", handleLogin);

module.exports = router;