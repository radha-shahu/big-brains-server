const { AppError } = require("../utils/errors");

// Handle Mongoose validation errors
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((val) => val.message);
    const message = `Invalid input data: ${errors.join(". ")}`;
    return {
        statusCode: 422,
        message,
    };
};

// Handle Mongoose duplicate key errors
const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    return {
        statusCode: 409,
        message,
    };
};

// Handle Mongoose cast errors (invalid ObjectId, etc.)
const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return {
        statusCode: 400,
        message,
    };
};

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    // Handle known errors
    if (err.name === "ValidationError") {
        const error = handleValidationError(err);
        err.statusCode = error.statusCode;
        err.message = error.message;
    }

    if (err.code === 11000) {
        const error = handleDuplicateKeyError(err);
        err.statusCode = error.statusCode;
        err.message = error.message;
    }

    if (err.name === "CastError") {
        const error = handleCastError(err);
        err.statusCode = error.statusCode;
        err.message = error.message;
    }

    // Send error response
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        });
    } else {
        // Programming or unknown errors: don't leak error details
        console.error("ERROR 💥:", err);
        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
            ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
        });
    }
};

// Async handler wrapper to catch errors in async routes
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// 404 handler for undefined routes
const notFoundHandler = (req, res, next) => {
    const err = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(err);
};

module.exports = {
    errorHandler,
    asyncHandler,
    notFoundHandler,
};

