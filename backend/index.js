require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/connection");
const adminRoute = require("./routes/adminRoute");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const expressSession = require("express-session");
const flash = require("connect-flash");
const connectCloudinary = require("./config/cloudinary");
connectCloudinary();

const allowedOrigins = [
    // Development
    "http://localhost:5173",
    "http://localhost:5174",
    // Production
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
].filter(Boolean);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());

app.use(cookieParser());
app.set("trust proxy", 1);

app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    cookie: {
      secure: true,
      sameSite: "none"    
    }
  })
);

app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
app.use("/admin", adminRoute);
app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/cart", cartRoute);
app.use("/orders", orderRoute);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CloudKicks Backend is running 🚀"
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} ✅`);
});