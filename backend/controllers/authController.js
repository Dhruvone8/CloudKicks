const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function handleUserRegistration(req, res) {
    try {
        let { email, password, fullname } = req.body;

        // Check whether user exists or not
        let user = await userModel.findOne({ email: email });

        // If user exists already, return
        if (user) {
            req.flash("error", "User Already Exists! Try Logging In");
            return res.redirect("/");
        }

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message);
                else {
                    let user = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                        role: 'normal'
                    });

                    let token = jwt.sign(
                        { email: user.email, id: user._id, role: user.role },
                        process.env.JWT_SECRET,
                        { expiresIn: "7d" }
                    );

                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production"
                    });
                    res.redirect("/shop");
                }
            });
        });
    }
    catch (err) {
        console.error("Registration error:", err);
        req.flash("error", "An error occurred during registration");
        res.redirect("/");
    }
}

async function handleLogin(req, res) {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            req.flash("error", "Email and password are required");
            return res.redirect("/");
        }

        // Find user by email
        let user = await userModel.findOne({ email: email });

        if (!user) {
            req.flash("error", "Invalid email or password");
            return res.redirect("/");
        }

        // Verify password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).send("Something went wrong");
            }

            if (!result) {
                req.flash("error", "Invalid email or password");
                return res.redirect("/");
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

            // Redirect based on role
            if (user.role === 'admin') {
                return res.redirect("/admin/panel");
            } else {
                return res.redirect("/shop");
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        req.flash("error", "An error occurred during login");
        res.redirect("/");
    }
}

async function handleLogout(req, res) {
    res.clearCookie("token");
    req.flash("success", "Logged out successfully");
    res.redirect("/");
}

module.exports = {
    handleUserRegistration,
    handleLogin,
    handleLogout
};