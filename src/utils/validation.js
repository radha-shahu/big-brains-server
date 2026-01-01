const mongoose = require("mongoose");
const { ValidationError } = require("./errors");

/**
 * Validate MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {boolean}
 */
const validateObjectId = (id, fieldName = "ID") => {
    if (!id || typeof id !== "string") {
        throw new ValidationError(`${fieldName} is required and must be a string`);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError(`Invalid ${fieldName}: "${id}". Must be a valid MongoDB ObjectId`);
    }

    return true;
};

/**
 * Validate that no query parameters are provided
 * @param {object} queryParams - Request query parameters
 * @param {string} endpointName - Name of endpoint for error message
 */
const validateNoQueryParams = (queryParams, endpointName = "This endpoint") => {
    const providedParams = Object.keys(queryParams);
    if (providedParams.length > 0) {
        throw new ValidationError(
            `${endpointName} does not accept query parameters. Received: ${providedParams.join(", ")}`
        );
    }
};

/**
 * Validate that request body doesn't contain unknown fields
 * @param {object} body - Request body
 * @param {string[]} allowedFields - Array of allowed field names
 * @param {string} endpointName - Name of endpoint for error message
 */
const validateNoUnknownFields = (body, allowedFields, endpointName = "This endpoint") => {
    const providedFields = Object.keys(body);
    const unknownFields = providedFields.filter((field) => !allowedFields.includes(field));

    if (unknownFields.length > 0) {
        throw new ValidationError(
            `${endpointName} does not accept the following field(s): ${unknownFields.join(", ")}. Allowed fields: ${allowedFields.join(", ")}`
        );
    }
};

module.exports = {
    validateObjectId,
    validateNoQueryParams,
    validateNoUnknownFields,
};

