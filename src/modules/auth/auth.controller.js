const authService = require("./auth.service");
const authValidation = require("./auth.validation");
const { asyncHandler } = require("../../middlewares/error.middleware");

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

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private (Protected)
const changePassword = asyncHandler(async (req, res) => {
    authValidation.validateChangePassword(req.body);
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(
        req.user._id,
        currentPassword,
        newPassword
    );

    res.status(200).json({
        status: "success",
        message: result.message,
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
    login,
    changePassword,
    getMe,
};

