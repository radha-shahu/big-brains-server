const userService = require("./user.service");
const userValidation = require("./user.validation");
const { asyncHandler } = require("../../middlewares/error.middleware");
const { validateObjectId, validateNoQueryParams, validateNoUnknownFields } = require("../../utils/validation");

// @desc    Get all users (Employee directory - read-only)
// @route   GET /api/users
// @access  Private (All authenticated users)
const getUsers = asyncHandler(async (req, res) => {
    // This endpoint doesn't accept query parameters
    validateNoQueryParams(req.query, "GET /api/users");
    
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
// @access  Private
const getUser = asyncHandler(async (req, res) => {
    // Validate ObjectId
    validateObjectId(req.params.id, "User ID");
    
    // No query parameters allowed
    validateNoQueryParams(req.query, "GET /api/users/:id");
    
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getMyProfile = asyncHandler(async (req, res) => {
    // No query parameters allowed
    validateNoQueryParams(req.query, "GET /api/users/me");
    
    const user = await userService.getMyProfile(req.user._id);
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});

// @desc    Update own profile (restricted fields only)
// @route   PATCH /api/users/me
// @access  Private
const updateMyProfile = asyncHandler(async (req, res) => {
    const allowedFields = ["firstName", "lastName", "email", "phone", "skills"];
    
    // Validate request body
    userValidation.validateUpdateMyProfile(req.body);
    
    // Validate no unknown fields
    validateNoUnknownFields(req.body, allowedFields, "PATCH /api/users/me");
    
    const user = await userService.updateMyProfile(req.user._id, req.body);
    res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: {
            user,
        },
    });
});

module.exports = {
    getUsers,
    getUser,
    getMyProfile,
    updateMyProfile,
};
