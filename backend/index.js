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
const connectCloudinary = require("./config/cloudinary");
connectCloudinary();

const allowedOrigins = [
    "http://localhost:5174",
    "http://localhost:5173"
].filter(Boolean);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"]
}));
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} ✅`)
})