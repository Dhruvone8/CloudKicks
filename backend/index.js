require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const db = require("./config/connection");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const expressSession = require("express-session");
const flash = require("connect-flash")
const appRoute = require("./routes/appRoute")
const connectCloudinary = require("./config/cloudinary");
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET
    })
)
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs")

// Routes
app.use("/admin", adminRoute)
app.use("/users", userRoute)
app.use("/products", productRoute)

app.use("/", appRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} ✅`)
})