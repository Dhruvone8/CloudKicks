const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

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

module.exports = { isLoggedIn };