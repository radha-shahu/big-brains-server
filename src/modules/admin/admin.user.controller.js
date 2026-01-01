const adminUserService = require("./admin.user.service");
const adminUserValidation = require("./admin.user.validation");
const { asyncHandler } = require("../../middlewares/error.middleware");
const { validateObjectId, validateNoQueryParams, validateNoUnknownFields } = require("../../utils/validation");
const mongoose = require("mongoose");
const { ValidationError } = require("../../utils/errors");

// @desc    Create new user (Admin only)
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
    // Validate request body
    adminUserValidation.validateCreateUser(req.body);
    
    // Validate no unknown fields (employeeId is auto-generated, so not allowed)
    const allowedFields = [
        "firstName",
        "lastName",
        "email",
        "password",
        "phone",
        "role",
        "designation",
        "department",
        "manager",
        "currentProject",
        "skills",
        "dateOfJoining",
        "totalExperience",
        "location",
    ];
    validateNoUnknownFields(req.body, allowedFields, "POST /api/admin/users");

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
    // Validate query parameters
    adminUserValidation.validateGetAllUsersQuery(req.query);
    
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
    // Validate: must be either MongoDB ObjectId or employeeId format
    const userId = req.params.userId;
    if (!userId || typeof userId !== "string") {
        throw new ValidationError("User ID is required and must be a string");
    }
    
    // Check if it's a valid ObjectId or employeeId format
    const isObjectId = mongoose.Types.ObjectId.isValid(userId) && userId.length === 24;
    const isEmployeeId = /^EMP-\d{4}-\d{4}$/.test(userId);
    
    if (!isObjectId && !isEmployeeId) {
        throw new ValidationError(
            `Invalid User ID: "${userId}". Must be a valid MongoDB ObjectId (24 hex characters) or employeeId (format: EMP-YYYY-XXXX)`
        );
    }
    
    // No query parameters allowed
    validateNoQueryParams(req.query, "GET /api/admin/users/:userId");
    
    const user = await adminUserService.getUserById(userId);

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
    // Validate: must be either MongoDB ObjectId or employeeId format
    const userId = req.params.userId;
    if (!userId || typeof userId !== "string") {
        throw new ValidationError("User ID is required and must be a string");
    }
    
    const isObjectId = mongoose.Types.ObjectId.isValid(userId) && userId.length === 24;
    const isEmployeeId = /^EMP-\d{4}-\d{4}$/.test(userId);
    
    if (!isObjectId && !isEmployeeId) {
        throw new ValidationError(
            `Invalid User ID: "${userId}". Must be a valid MongoDB ObjectId (24 hex characters) or employeeId (format: EMP-YYYY-XXXX)`
        );
    }
    
    // Validate request body
    adminUserValidation.validateUpdateUser(req.body);
    
    // Validate no unknown fields
    const allowedFields = [
        "role",
        "designation",
        "department",
        "manager",
        "currentProject",
        "pastProjects",
        "dateOfJoining",
        "totalExperience",
        "location",
        "isActive",
    ];
    validateNoUnknownFields(req.body, allowedFields, "PATCH /api/admin/users/:userId");
    
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
    // Validate: must be either MongoDB ObjectId or employeeId format
    const userId = req.params.userId;
    if (!userId || typeof userId !== "string") {
        throw new ValidationError("User ID is required and must be a string");
    }
    
    const isObjectId = mongoose.Types.ObjectId.isValid(userId) && userId.length === 24;
    const isEmployeeId = /^EMP-\d{4}-\d{4}$/.test(userId);
    
    if (!isObjectId && !isEmployeeId) {
        throw new ValidationError(
            `Invalid User ID: "${userId}". Must be a valid MongoDB ObjectId (24 hex characters) or employeeId (format: EMP-YYYY-XXXX)`
        );
    }
    
    // Validate request body
    adminUserValidation.validateUpdateStatus(req.body);
    
    // Validate no unknown fields
    validateNoUnknownFields(req.body, ["isActive"], "PATCH /api/admin/users/:userId/status");
    
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
    // Validate: must be either MongoDB ObjectId or employeeId format
    const userId = req.params.userId;
    if (!userId || typeof userId !== "string") {
        throw new ValidationError("User ID is required and must be a string");
    }
    
    const isObjectId = mongoose.Types.ObjectId.isValid(userId) && userId.length === 24;
    const isEmployeeId = /^EMP-\d{4}-\d{4}$/.test(userId);
    
    if (!isObjectId && !isEmployeeId) {
        throw new ValidationError(
            `Invalid User ID: "${userId}". Must be a valid MongoDB ObjectId (24 hex characters) or employeeId (format: EMP-YYYY-XXXX)`
        );
    }
    
    // Validate request body
    adminUserValidation.validateResetPassword(req.body);
    
    // Validate no unknown fields
    validateNoUnknownFields(req.body, ["newPassword"], "POST /api/admin/users/:userId/reset-password");
    
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

