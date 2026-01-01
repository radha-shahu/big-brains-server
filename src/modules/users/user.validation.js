const { ValidationError } = require("../../utils/errors");

// Validate update my profile data (restricted fields)
const validateUpdateMyProfile = (data) => {
    const { email, phone, skills } = data;

    // Email format validation if provided
    if (email) {
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            throw new ValidationError("Please provide a valid email");
        }
    }

    // Validate phone format if provided
    if (phone && phone.trim().length > 0) {
        const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(phone)) {
            throw new ValidationError("Please provide a valid phone number");
        }
    }

    // Validate skills if provided (should be an array of strings)
    if (skills !== undefined) {
        if (!Array.isArray(skills)) {
            throw new ValidationError("Skills must be an array");
        }
        if (skills.some((skill) => typeof skill !== "string" || skill.trim().length === 0)) {
            throw new ValidationError("All skills must be non-empty strings");
        }
    }

    return true;
};

module.exports = {
    validateUpdateMyProfile,
};
