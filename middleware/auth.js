const { UnauthorizedError } = require("../utils/errors");
const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
const { asyncHandler } = require("./errorHandler");

// Protect routes - verify JWT token and attach user to request
const protect = asyncHandler(async (req, res, next) => {
    // 1) Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new UnauthorizedError("You are not logged in! Please log in to get access.");
    }

    // 2) Verify token
    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (error) {
        throw new UnauthorizedError("Invalid or expired token. Please log in again.");
    }

    // 3) Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
        throw new UnauthorizedError("The user belonging to this token no longer exists.");
    }

    // 4) Grant access to protected route
    req.user = user;
    next();
});

module.exports = {
    protect,
};

