const { BadRequestError } = require("../../utils/errors");

// Validate registration data
const validateRegister = (data) => {
    const { name, email, password } = data;

    if (!name || !email || !password) {
        throw new BadRequestError("Name, email, and password are required");
    }

    if (password.length < 6) {
        throw new BadRequestError("Password must be at least 6 characters");
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        throw new BadRequestError("Please provide a valid email");
    }

    return true;
};

// Validate login data
const validateLogin = (data) => {
    const { email, password } = data;

    if (!email || !password) {
        throw new BadRequestError("Email and password are required");
    }

    return true;
};

module.exports = {
    validateRegister,
    validateLogin,
};

