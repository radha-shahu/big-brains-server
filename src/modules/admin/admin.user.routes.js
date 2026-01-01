const express = require("express");
const router = express.Router();
const adminUserController = require("./admin.user.controller");
const { protect, requireAdmin } = require("../../middlewares/auth.middleware");

// All routes require authentication and admin role
router.use(protect, requireAdmin);

router.post("/", adminUserController.createUser);
router.get("/", adminUserController.getAllUsers);
router.get("/:userId", adminUserController.getUserById);
router.patch("/:userId", adminUserController.updateUser);
router.patch("/:userId/status", adminUserController.updateUserStatus);
router.post("/:userId/reset-password", adminUserController.resetPassword);

module.exports = router;

