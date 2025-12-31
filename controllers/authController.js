const User = require("../models/User");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const { asyncHandler } = require("../middleware/errorHandler");
const { generateToken } = require("../utils/jwt");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        throw new BadRequestError("Name, email, and password are required");
    }

    if (password.length < 6) {
        throw new BadRequestError("Password must be at least 6 characters");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new BadRequestError("User with this email already exists");
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
    });

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(201).json({
        status: "success",
        message: "User registered successfully",
        token,
        data: {
            user,
        },
    });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        throw new BadRequestError("Email and password are required");
    }

    // Find user and include password (since it's select: false by default)
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
        throw new UnauthorizedError("Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
        status: "success",
        message: "Login successful",
        token,
        data: {
            user,
        },
    });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private (Protected)
const getMe = asyncHandler(async (req, res) => {
    // User is already attached to req by protect middleware
    res.status(200).json({
        status: "success",
        data: {
            user: req.user,
        },
    });
});

module.exports = {
    register,
    login,
    getMe,
};

