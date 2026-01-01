const adminUserService = require("./admin.user.service");
const adminUserValidation = require("./admin.user.validation");
const { asyncHandler } = require("../../middlewares/error.middleware");

// @desc    Create new user (Admin only)
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
    adminUserValidation.validateCreateUser(req.body);
    const user = await adminUserService.createUser(req.body);

    res.status(201).json({
        status: "success",
        message: "User created successfully",
        data: {
            user,
        },
    });
});

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await adminUserService.getAllUsers(req.query);

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await adminUserService.getUserById(req.params.userId);

    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

// @desc    Update user (Admin only)
// @route   PATCH /api/admin/users/:userId
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    adminUserValidation.validateUpdateUser(req.body);
    const user = await adminUserService.updateUser(req.params.userId, req.body);

    res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: {
            user,
        },
    });
});

// @desc    Update user status (enable/disable)
// @route   PATCH /api/admin/users/:userId/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
    adminUserValidation.validateUpdateStatus(req.body);
    const { isActive } = req.body;
    const user = await adminUserService.updateUserStatus(req.params.userId, isActive);

    res.status(200).json({
        status: "success",
        message: `User ${isActive ? "enabled" : "disabled"} successfully`,
        data: {
            user,
        },
    });
});

// @desc    Reset user password (Admin only)
// @route   POST /api/admin/users/:userId/reset-password
// @access  Private/Admin
const resetPassword = asyncHandler(async (req, res) => {
    adminUserValidation.validateResetPassword(req.body);
    const { newPassword } = req.body;
    const result = await adminUserService.resetPassword(req.params.userId, newPassword);

    res.status(200).json({
        status: "success",
        message: result.message,
    });
});

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    updateUserStatus,
    resetPassword,
};

