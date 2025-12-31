const express = require("express");
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const { errorHandler, notFoundHandler } = require("./middlewares/error.middleware");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/api", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API is running 🚀",
        version: "1.0.0",
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 404 Handler - must be after all routes
app.use(notFoundHandler);

// Error Handler - must be last middleware
app.use(errorHandler);

module.exports = app;

