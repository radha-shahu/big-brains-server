const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");

// Health check route
router.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API is running 🚀",
        version: "1.0.0",
    });
});

// API routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;

