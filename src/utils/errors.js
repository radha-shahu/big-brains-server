// Custom Error Classes
class AppError extends Error {
    constructor(message, statusCode, errorCode = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.errorCode = errorCode || this.getDefaultErrorCode(statusCode);
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    getDefaultErrorCode(statusCode) {
        const codeMap = {
            400: 'BAD_REQUEST',
            401: 'UNAUTHORIZED',
            403: 'FORBIDDEN',
            404: 'RESOURCE_NOT_FOUND',
            409: 'CONFLICT',
            422: 'VALIDATION_ERROR',
            500: 'INTERNAL_SERVER_ERROR',
        };
        return codeMap[statusCode] || 'UNKNOWN_ERROR';
    }
}

class BadRequestError extends AppError {
    constructor(message = 'Bad Request', errorCode = 'BAD_REQUEST') {
        super(message, 400, errorCode);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found', errorCode = 'RESOURCE_NOT_FOUND') {
        super(message, 404, errorCode);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation failed', errorCode = 'VALIDATION_ERROR') {
        super(message, 422, errorCode);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Resource already exists', errorCode = 'CONFLICT') {
        super(message, 409, errorCode);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized', errorCode = 'UNAUTHORIZED') {
        super(message, 401, errorCode);
    }
}

class ForbiddenError extends AppError {
    constructor(message = 'Forbidden', errorCode = 'FORBIDDEN') {
        super(message, 403, errorCode);
    }
}

class InternalServerError extends AppError {
    constructor(message = 'Internal server error', errorCode = 'INTERNAL_SERVER_ERROR') {
        super(message, 500, errorCode);
    }
}

// Standardized error codes
const ERROR_CODES = {
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',
    FORBIDDEN: 'FORBIDDEN',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
    BAD_REQUEST: 'BAD_REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    CONFLICT: 'CONFLICT',
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
};

module.exports = {
    AppError,
    BadRequestError,
    NotFoundError,
    ValidationError,
    ConflictError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
    ERROR_CODES,
};

