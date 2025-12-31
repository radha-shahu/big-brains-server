const jwt = require("jsonwebtoken");
const config = require("../config/env");

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
    });
};

// Verify JWT token
const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwtSecret);
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};

module.exports = {
    generateToken,
    verifyToken,
};

