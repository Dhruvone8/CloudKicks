const userModel = require("../models/userModel");
const adminModel = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function handleUserRegistration(req, res) {
    try {
        let { email, password, fullname } = req.body;

        // Check whether user exists or not
        let user = await userModel.findOne({ email: email });

        // If user exists already, return
        if (user) return res.status(400).send("User Already Exists! Try Logging In");

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message);
                else {
                    let user = await userModel.create({
                        email,
                        password: hash,
                        fullname
                    });

                    let token = jwt.sign({ email, id: user._id, role: 'user' }, process.env.JWT_SECRET);
                    res.cookie("token", token);
                    res.redirect("/shop");
                }
            });
        });
    }
    catch (err) {
        res.send(err.message);
    }
}

async function handleLogin(req, res) {
    try {
        let { email, password } = req.body;

        // First, check if it's a user
        let user = await userModel.findOne({ email: email });

        if (user) {
            // User found, verify password
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).send("Something went wrong");
                }

                if (!result) {
                    return res.status(401).send("Invalid email or password");
                }

                // Password correct, generate token with role
                let token = jwt.sign({ email, id: user._id, role: 'user' }, process.env.JWT_SECRET);
                res.cookie("token", token);
                return res.redirect("/shop");
            });
            return; // Important: prevent further execution
        }

        // If not a user, check if it's an admin
        let admin = await adminModel.findOne({ email: email });

        if (admin) {
            // Admin found, verify password
            bcrypt.compare(password, admin.password, (err, result) => {
                if (err) {
                    return res.status(500).send("Something went wrong");
                }

                if (!result) {
                    return res.status(401).send("Invalid email or password");
                }

                // Password correct, generate token with role
                let token = jwt.sign({ email, id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
                res.cookie("token", token);
                return res.redirect("/admin/panel");
            });
            return; // Important: prevent further execution
        }

        // Neither user nor admin found
        return res.status(400).send("No account found with this email");

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send("An error occurred during login");
    }
}

async function handleLogout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
}

module.exports = {
    handleUserRegistration,
    handleLogin,
    handleLogout
};