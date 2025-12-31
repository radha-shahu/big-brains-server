const { BadRequestError } = require("../../utils/errors");

// Validate user creation data
const validateCreateUser = (data) => {
    const { name, email } = data;

    if (!name || !email) {
        throw new BadRequestError("Name and email are required");
    }

    // Email format validation (basic)
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        throw new BadRequestError("Please provide a valid email");
    }

    return true;
};

// Validate user update data
const validateUpdateUser = (data) => {
    // Allow partial updates, but validate what's provided
    if (data.email) {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(data.email)) {
            throw new BadRequestError("Please provide a valid email");
        }
    }

    return true;
};

module.exports = {
    validateCreateUser,
    validateUpdateUser,
};

