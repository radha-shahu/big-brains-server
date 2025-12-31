const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { protect } = require("../../middlewares/auth.middleware");

// Public routes
router.route("/").get(userController.getUsers).post(userController.createUser);
router.route("/:id").get(userController.getUser).put(userController.updateUser).delete(userController.deleteUser);

// Protected routes (require authentication)
router.get("/me/profile", protect, userController.getMyProfile);

module.exports = router;

