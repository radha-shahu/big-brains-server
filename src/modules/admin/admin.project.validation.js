const { ValidationError } = require("../../utils/errors");

const PROJECT_STATUSES = ["ACTIVE", "INACTIVE", "COMPLETED", "ON_HOLD"];

// Validate create project data
const validateCreateProject = (data) => {
    const { name, status } = data;

    if (!name || name.trim().length === 0) {
        throw new ValidationError("Project name is required");
    }

    if (status && !PROJECT_STATUSES.includes(status)) {
        throw new ValidationError(
            `Status must be one of: ${PROJECT_STATUSES.join(", ")}`
        );
    }

    return true;
};

// Validate update project data
const validateUpdateProject = (data) => {
    const { status, name } = data;

    if (status && !PROJECT_STATUSES.includes(status)) {
        throw new ValidationError(
            `Status must be one of: ${PROJECT_STATUSES.join(", ")}`
        );
    }

    if (name && name.trim().length === 0) {
        throw new ValidationError("Project name cannot be empty");
    }

    return true;
};

// Validate query parameters for get all projects
const validateGetAllProjectsQuery = (queryParams) => {
    const allowedParams = ["status", "search"];
    const providedParams = Object.keys(queryParams);

    // Check for unknown parameters
    const unknownParams = providedParams.filter((param) => !allowedParams.includes(param));
    if (unknownParams.length > 0) {
        throw new ValidationError(
            `Invalid query parameter(s): ${unknownParams.join(", ")}. Allowed parameters are: ${allowedParams.join(", ")}`
        );
    }

    // Validate status if provided
    if (queryParams.status !== undefined && queryParams.status !== null && queryParams.status !== "") {
        if (!PROJECT_STATUSES.includes(queryParams.status)) {
            throw new ValidationError(
                `Invalid status value: "${queryParams.status}". Status must be one of: ${PROJECT_STATUSES.join(", ")}`
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
    validateCreateProject,
    validateUpdateProject,
    validateGetAllProjectsQuery,
};

