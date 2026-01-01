const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { protect } = require("../../middlewares/auth.middleware");

// All routes require authentication
router.use(protect);

// Employee directory (read-only, limited info)
router.get("/", userController.getUsers);

// Get own profile
router.get("/me", userController.getMyProfile);

// Update own profile (restricted fields only)
router.patch("/me", userController.updateMyProfile);

// Get single user by ID
router.get("/:id", userController.getUser);

module.exports = router;

