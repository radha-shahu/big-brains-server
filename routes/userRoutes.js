const express = require("express");
const router = express.Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getMyProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

// Public routes
router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

// Protected routes (require authentication)
router.get("/me/profile", protect, getMyProfile);

module.exports = router;

