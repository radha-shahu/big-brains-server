const { UnauthorizedError, ForbiddenError } = require("../utils/errors");
const { verifyToken } = require("../utils/jwt");
const User = require("../modules/users/user.model");
const { asyncHandler } = require("./error.middleware");
const { ROLES } = require("../constants/roles");

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

    // 3) Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user) {
        throw new UnauthorizedError("The user belonging to this token no longer exists.");
    }

    // 4) Check if user is active
    if (!user.isActive) {
        throw new UnauthorizedError("ACCOUNT_DISABLED");
    }

    // 5) Grant access to protected route
    req.user = user;
    next();
});

// Restrict to specific roles
const requireRole = (...allowedRoles) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.user) {
            throw new UnauthorizedError("Authentication required");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ForbiddenError("FORBIDDEN");
        }

        next();
    });
};

// Restrict to Admin only
const requireAdmin = requireRole(ROLES.ADMIN);

// Restrict to Admin or Manager
const requireAdminOrManager = requireRole(ROLES.ADMIN, ROLES.MANAGER);

module.exports = {
    protect,
    requireRole,
    requireAdmin,
    requireAdminOrManager,
};

