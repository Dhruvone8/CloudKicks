const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { handleUserRegistration, handleLogin, handleLogout } = require("../controllers/authController");

router.get("/", (req, res) => {
    res.send("User Page")
})

router.post("/register", handleUserRegistration);
router.post("/login", handleLogin);
router.get("/logout", handleLogout);

module.exports = router;