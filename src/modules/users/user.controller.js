const userService = require("./user.service");
const userValidation = require("./user.validation");
const { asyncHandler } = require("../../middlewares/error.middleware");

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

// @desc    Create user
// @route   POST /api/users
// @access  Public
const createUser = asyncHandler(async (req, res) => {
    userValidation.validateCreateUser(req.body);
    const user = await userService.createUser(req.body);
    res.status(201).json({
        status: "success",
        data: {
            user,
        },
    });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
const updateUser = asyncHandler(async (req, res) => {
    userValidation.validateUpdateUser(req.body);
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
const deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);
    res.status(204).json({
        status: "success",
        data: null,
    });
});

// @desc    Get current user profile (protected route example)
// @route   GET /api/users/me/profile
// @access  Private
const getMyProfile = asyncHandler(async (req, res) => {
    // req.user is set by protect middleware
    const user = await userService.getUserById(req.user._id);
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getMyProfile,
};

