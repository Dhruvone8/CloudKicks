const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function handleUserRegistration(req, res) {
    try {
        let { email, password, fullname } = req.body;

        // Check whether user exists or not
        let user = await userModel.findOne({ email: email })

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

                    let token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET);
                    res.cookie("token", token);
                    res.redirect("/shop");
                }
            })
        })
    }
    catch (err) {
        res.send(err.message);
    }
}

async function handleUserLogin(req, res) {
    let { email, password } = req.body;

    // Check if user exists or not
    let user = await userModel.findOne({ email: email });

    // If user doesn't exist, return
    if (!user) return res.status(400).send("User with this email doesn't exist");

    // If user exists, check if entered password is correct or not
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            return res.status(500).send("Something went wrong");
        }

        // If password does not match
        if (!result) {
            return res.status(401).send("Invalid email or password");
        }

        //  If Password is correct, generate the JWT
        let token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET);

        // Store the JWT inside the cookie and send it to the user's browser
        res.cookie("token", token);
        res.redirect("/shop");
    });
}

async function handleLogout(req, res) {
    res.clearCookie("token");
    res.redirect("/");
}

async function handleAdminLogin(req, res) {
    let { email, password } = req.body;

    // Check if admin exists or not
    let admin = await adminModel.findOne({ email: email });

    // If admin doesn't exist, return
    if (!admin) return res.status(400).send("Admin with this email doesn't exist");

    // If admin exists, check if entered password is correct or not
    bcrypt.compare(password, admin.password, (err, result) => {
        if(err) {
            return res.status(500).send("Something went wrong");
        }

        if(!result) {
            return res.status(401).send("Invalid email or password");
        }

        let token = jwt.sign({ email, id: admin._id }, process.env.JWT_SECRET);
        res.cookie("token", token);
        res.redirect("/panel");
    })
}

module.exports = { handleUserRegistration, handleUserLogin, handleLogout, handleAdminLogin };