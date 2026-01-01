const { BadRequestError, ValidationError } = require("../../utils/errors");

// Validate login data
const validateLogin = (data) => {
    const { email, password } = data;

    if (!email || !password) {
        throw new ValidationError("Email and password are required");
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError("Please provide a valid email");
    }

    return true;
};

// Validate change password data
const validateChangePassword = (data) => {
    const { currentPassword, newPassword } = data;

    if (!currentPassword || !newPassword) {
        throw new ValidationError("Current password and new password are required");
    }

    if (newPassword.length < 6) {
        throw new ValidationError("New password must be at least 6 characters");
    }

    if (currentPassword === newPassword) {
        throw new ValidationError("New password must be different from current password");
    }

    return true;
};

module.exports = {
    validateLogin,
    validateChangePassword,
};

