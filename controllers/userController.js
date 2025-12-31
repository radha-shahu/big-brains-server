const User = require("../models/User");
const { NotFoundError, BadRequestError, ConflictError, ForbiddenError } = require("../utils/errors");
const { asyncHandler } = require("../middleware/errorHandler");

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
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
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new NotFoundError("User not found");
    }

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
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
        throw new BadRequestError("Name and email are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ConflictError("User with this email already exists");
    }

    const user = await User.create({ name, email });

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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw new NotFoundError("User not found");
    }

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
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        throw new NotFoundError("User not found");
    }

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
    const user = await User.findById(req.user._id);

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

