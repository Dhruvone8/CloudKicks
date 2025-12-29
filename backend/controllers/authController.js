const userModel = require("../models/userModel");
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
                        fullname,
                        role: 'normal' // Explicitly set role to normal
                    });

                    let token = jwt.sign({ email, id: user._id, role: user.role }, process.env.JWT_SECRET);
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

        // Find user by email
        let user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).send("No account found with this email");
        }

        // Verify password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).send("Something went wrong");
            }

            if (!result) {
                return res.status(401).send("Invalid email or password");
            }

            // Password correct, generate token with role
            let token = jwt.sign({ email, id: user._id, role: user.role }, process.env.JWT_SECRET);
            res.cookie("token", token);

            // Redirect based on role
            if (user.role === 'admin') {
                return res.redirect("/admin/panel");
            } else {
                return res.redirect("/shop");
            }
        });

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