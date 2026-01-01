const authService = require("./auth.service");
const authValidation = require("./auth.validation");
const { asyncHandler } = require("../../middlewares/error.middleware");
const { validateNoUnknownFields, validateNoQueryParams } = require("../../utils/validation");

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    // Validate request body
    authValidation.validateLogin(req.body);
    
    // Validate no unknown fields
    validateNoUnknownFields(req.body, ["email", "password"], "POST /api/auth/login");
    
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
    // Validate request body
    authValidation.validateChangePassword(req.body);
    
    // Validate no unknown fields
    validateNoUnknownFields(req.body, ["currentPassword", "newPassword"], "POST /api/auth/change-password");
    
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
    // No query parameters allowed
    validateNoQueryParams(req.query, "GET /api/auth/me");
    
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

