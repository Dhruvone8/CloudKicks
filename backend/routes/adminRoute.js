const express = require("express");
const router = express.Router()
const adminModel = require("../models/adminModel");
const { handleLogin } = require("../controllers/authController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

router.get("/panel", (req, res) => {
    res.send("adminPanel");
})

if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {
        try {
            const adminExists = await adminModel.findOne();
            if (adminExists) {
                return res.status(403).send("You don't have permission to create admin");
            }

            const { fullname, email, password } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const createdAdmin = await adminModel.create({
                fullname,
                email,
                password: hashedPassword
            });

            const token = jwt.sign(
                { id: createdAdmin._id, email },
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
                    email
                }
            });
        } catch (err) {
            res.status(500).send(err.message);
        }
    });
}

router.post("/login", handleLogin);

module.exports = router