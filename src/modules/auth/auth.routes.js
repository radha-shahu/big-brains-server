const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { protect } = require("../../middlewares/auth.middleware");

// Public routes
router.post("/login", authController.login);

// Protected routes (require authentication)
router.post("/change-password", protect, authController.changePassword);
router.get("/me", protect, authController.getMe);

module.exports = router;

