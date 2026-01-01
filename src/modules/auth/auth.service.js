const User = require("../users/user.model");
const { BadRequestError, UnauthorizedError, ERROR_CODES } = require("../../utils/errors");
const { generateToken } = require("../../utils/jwt");
const { userDTO } = require("../users/user.dto");

// Login user
const login = async (email, password) => {
    // Find user and include password (since it's select: false by default)
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists
    if (!user) {
        throw new UnauthorizedError("Invalid email or password", ERROR_CODES.INVALID_CREDENTIALS);
    }

    // Check if user is active
    if (!user.isActive) {
        throw new UnauthorizedError("Your account has been disabled. Please contact administrator.", ERROR_CODES.ACCOUNT_DISABLED);
    }

    // Check if password is correct
    if (!(await user.comparePassword(password))) {
        throw new UnauthorizedError("Invalid email or password", ERROR_CODES.INVALID_CREDENTIALS);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    return {
        user: userDTO(user),
        token,
    };
};

// Change password
const changePassword = async (userId, currentPassword, newPassword) => {
    // Find user and include password
    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new BadRequestError("User not found", ERROR_CODES.RESOURCE_NOT_FOUND);
    }

    // Check if user is active
    if (!user.isActive) {
        throw new UnauthorizedError("Your account has been disabled. Please contact administrator.", ERROR_CODES.ACCOUNT_DISABLED);
    }

    // Verify current password
    if (!(await user.comparePassword(currentPassword))) {
        throw new UnauthorizedError("Current password is incorrect", ERROR_CODES.INVALID_CREDENTIALS);
    }

    // Update password
    user.password = newPassword;
    user.isFirstLogin = false; // Mark that user has changed password
    await user.save();

    return {
        message: "Password changed successfully",
    };
};

// Get current user
const getMe = (user) => {
    return userDTO(user);
};

module.exports = {
    login,
    changePassword,
    getMe,
};

