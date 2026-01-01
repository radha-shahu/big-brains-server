const { ValidationError } = require("../../utils/errors");
const { ROLES } = require("../../constants/roles");

// Validate create user data
const validateCreateUser = (data) => {
    const {
        firstName,
        lastName,
        email,
        password,
        role,
        phone,
    } = data;

    if (!firstName || !lastName) {
        throw new ValidationError("First name and last name are required");
    }

    if (!email) {
        throw new ValidationError("Email is required");
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError("Please provide a valid email");
    }

    if (!password) {
        throw new ValidationError("Password is required");
    }

    if (password.length < 6) {
        throw new ValidationError("Password must be at least 6 characters");
    }

    // Validate role if provided
    if (role && !Object.values(ROLES).includes(role)) {
        throw new ValidationError(`Role must be one of: ${Object.values(ROLES).join(", ")}`);
    }

    // Validate phone format if provided
    if (phone && phone.trim().length > 0) {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(phone)) {
            throw new ValidationError("Please provide a valid phone number");
        }
    }

    return true;
};

// Validate update user data
const validateUpdateUser = (data) => {
    const { role, phone, totalExperience } = data;

    // Validate role if provided
    if (role && !Object.values(ROLES).includes(role)) {
        throw new ValidationError(`Role must be one of: ${Object.values(ROLES).join(", ")}`);
    }

    // Validate phone format if provided
    if (phone && phone.trim().length > 0) {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(phone)) {
            throw new ValidationError("Please provide a valid phone number");
        }
    }

    // Validate totalExperience if provided
    if (totalExperience !== undefined) {
        if (typeof totalExperience !== "number" || totalExperience < 0) {
            throw new ValidationError("Total experience must be a non-negative number");
        }
    }

    return true;
};

// Validate update status
const validateUpdateStatus = (data) => {
    const { isActive } = data;

    if (typeof isActive !== "boolean") {
        throw new ValidationError("isActive must be a boolean value");
    }

    return true;
};

// Validate reset password
const validateResetPassword = (data) => {
    const { newPassword } = data;

    if (!newPassword) {
        throw new ValidationError("New password is required");
    }

    if (newPassword.length < 6) {
        throw new ValidationError("New password must be at least 6 characters");
    }

    return true;
};

module.exports = {
    validateCreateUser,
    validateUpdateUser,
    validateUpdateStatus,
    validateResetPassword,
};

