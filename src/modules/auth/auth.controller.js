const authService = require("./auth.service");
const authValidation = require("./auth.validation");
const { asyncHandler } = require("../../middlewares/error.middleware");

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    authValidation.validateRegister(req.body);
    const { user, token } = await authService.register(req.body);

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
    authValidation.validateLogin(req.body);
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);

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
    const user = authService.getMe(req.user);
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

module.exports = {
    register,
    login,
    getMe,
};

