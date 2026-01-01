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

// Validate query parameters for get all users
const validateGetAllUsersQuery = (queryParams) => {
    const allowedParams = ["role", "isActive", "search"];
    const providedParams = Object.keys(queryParams);

    // Check for unknown parameters
    const unknownParams = providedParams.filter((param) => !allowedParams.includes(param));
    if (unknownParams.length > 0) {
        throw new ValidationError(
            `Invalid query parameter(s): ${unknownParams.join(", ")}. Allowed parameters are: ${allowedParams.join(", ")}`
        );
    }

    // Validate role if provided
    if (queryParams.role !== undefined && queryParams.role !== null && queryParams.role !== "") {
        if (!Object.values(ROLES).includes(queryParams.role)) {
            throw new ValidationError(
                `Invalid role value: "${queryParams.role}". Role must be one of: ${Object.values(ROLES).join(", ")}`
            );
        }
    }

    // Validate isActive if provided
    if (queryParams.isActive !== undefined && queryParams.isActive !== null && queryParams.isActive !== "") {
        const isActiveStr = String(queryParams.isActive).toLowerCase();
        if (isActiveStr !== "true" && isActiveStr !== "false") {
            throw new ValidationError(
                `Invalid isActive value: "${queryParams.isActive}". isActive must be "true" or "false"`
            );
        }
    }

    // Validate search if provided (should be a non-empty string)
    if (queryParams.search !== undefined && queryParams.search !== null) {
        if (typeof queryParams.search !== "string" || queryParams.search.trim().length === 0) {
            throw new ValidationError("Search parameter must be a non-empty string");
        }
    }

    return true;
};

module.exports = {
    validateCreateUser,
    validateUpdateUser,
    validateUpdateStatus,
    validateResetPassword,
    validateGetAllUsersQuery,
};

